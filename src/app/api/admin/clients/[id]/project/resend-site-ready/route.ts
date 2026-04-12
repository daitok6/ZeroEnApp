import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import { sendEmail } from '@/lib/email/send';
import { siteReadyEmail } from '@/lib/email/templates';

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: NextRequest, { params }: Params) {
  const { id } = await params;

  // Auth: admin only
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data: clientProfile } = await adminSupabase
    .from('profiles')
    .select('email, full_name, locale')
    .eq('id', id)
    .single();

  if (!clientProfile?.email) {
    return NextResponse.json({ error: 'Client has no email address' }, { status: 422 });
  }

  const locale = (clientProfile.locale === 'ja' ? 'ja' : 'en') as 'en' | 'ja';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zeroen.dev';
  const { subject, html } = siteReadyEmail({
    clientName: clientProfile.full_name ?? clientProfile.email,
    locale,
    loginUrl: `${siteUrl}/${locale}/login`,
  });

  const result = await sendEmail({ to: clientProfile.email, subject, html });

  if (!result.ok) {
    console.error('[admin/resend-site-ready] failed', { clientId: id, reason: result.reason, error: result.error });
    return NextResponse.json({ error: result.reason, detail: result.error }, { status: 502 });
  }

  console.log('[admin/resend-site-ready] sent', { clientId: id, emailId: result.id });
  return NextResponse.json({ sent: true, emailId: result.id });
}
