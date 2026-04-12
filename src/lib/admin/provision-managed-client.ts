'use server';

import { createAdminClient } from '@/lib/supabase/admin';

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
  if (!planTier) return { success: false, error: 'planTier is required' };

  const adminClient = createAdminClient();

  const { data: inviteData, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(
    email,
    { data: { full_name: fullName } }
  );

  if (inviteError) {
    console.error('[provisionManagedClient] invite error:', inviteError.message);
    return { success: false, error: 'Failed to create user account. Please try again.' };
  }

  const userId = inviteData.user.id;

  const { error: rpcError } = await adminClient.rpc('provision_managed_client', {
    p_user_id: userId,
    p_email: email,
    p_full_name: fullName,
    p_locale: locale,
    p_source: source,
    p_scope_md: scopeMd,
    p_order_ref: orderRef,
    p_plan_tier: planTier,
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
