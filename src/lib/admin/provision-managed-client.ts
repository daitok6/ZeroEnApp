'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { sendEmail } from '@/lib/email/send';
import { inviteEmail } from '@/lib/email/templates';

export async function provisionManagedClient(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const email = formData.get('email') as string | null;
  const fullName = formData.get('fullName') as string | null;
  const locale = formData.get('locale') as 'en' | 'ja' | null;
  const source = formData.get('source') as 'coconala' | 'direct' | null;
  const scopeMd = formData.get('scopeMd') as string | null;
  const orderRef = formData.get('orderRef') as string | null;
  const planTier = formData.get('planTier') as 'basic' | 'premium' | null;

  // Verify caller is an admin
  const userClient = await import('@/lib/supabase/server').then(m => m.createClient());
  const { data: { user: callerUser } } = await userClient.auth.getUser();
  if (!callerUser) {
    return { success: false, error: 'Unauthorized.' };
  }
  const { data: callerProfile } = await userClient
    .from('profiles')
    .select('role')
    .eq('id', callerUser.id)
    .single();
  if (callerProfile?.role !== 'admin') {
    return { success: false, error: 'Unauthorized.' };
  }

  if (!email) return { success: false, error: 'email is required' };
  if (!fullName) return { success: false, error: 'fullName is required' };
  if (!locale) return { success: false, error: 'locale is required' };
  if (!source) return { success: false, error: 'source is required' };
  if (!scopeMd) return { success: false, error: 'scopeMd is required' };

  const adminClient = createAdminClient();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const redirectTo = `${siteUrl}/${locale}/login`;

  // Generate the invite link without sending Supabase's default (English-only) email,
  // so we can send a locale-aware branded email via Resend below.
  const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
    type: 'invite',
    email,
    options: {
      data: { full_name: fullName, locale },
      redirectTo,
    },
  });

  if (linkError || !linkData.user) {
    console.error('[provisionManagedClient] generateLink error:', linkError?.message);
    return { success: false, error: `Invite failed: ${linkError?.message ?? 'unknown'}` };
  }

  const userId = linkData.user.id;
  const confirmationUrl = linkData.properties?.action_link ?? '';

  const { subject, html } = inviteEmail({
    clientName: fullName,
    locale,
    confirmationUrl,
  });

  const emailResult = await sendEmail({ to: email, subject, html });

  if (!emailResult.ok) {
    if (emailResult.reason === 'not-configured') {
      // Fallback: let Supabase send its default template so the invite isn't lost.
      console.warn('[provisionManagedClient] Resend not configured — falling back to Supabase default invite email');
      const { error: fallbackError } = await adminClient.auth.admin.inviteUserByEmail(email, {
        data: { full_name: fullName, locale },
        redirectTo,
      });
      if (fallbackError) {
        console.error('[provisionManagedClient] fallback invite error:', fallbackError.message);
        // Don't rollback the user — they exist via generateLink. Return error so operator knows.
        return { success: false, error: `Invite email failed: ${fallbackError.message}` };
      }
    } else {
      console.error('[provisionManagedClient] invite email send failed:', emailResult.error);
      return { success: false, error: `Invite email failed: ${emailResult.error ?? 'unknown'}` };
    }
  }

  const { error: rpcError } = await adminClient.rpc('provision_managed_client', {
    p_user_id: userId,
    p_email: email,
    p_full_name: fullName,
    p_locale: locale,
    p_source: source,
    p_scope_md: scopeMd,
    p_order_ref: orderRef,
    p_plan_tier: planTier ?? null,
  });

  if (rpcError) {
    console.error('[provisionManagedClient] rpc error:', rpcError.message);
    // Rollback: delete the auth user since the profile/intake setup failed
    try {
      await adminClient.auth.admin.deleteUser(userId);
    } catch (rollbackErr) {
      console.error('[provisionManagedClient] rollback failed:', rollbackErr);
    }
    return { success: false, error: 'Failed to provision client record. Please try again.' };
  }

  return { success: true };
}
