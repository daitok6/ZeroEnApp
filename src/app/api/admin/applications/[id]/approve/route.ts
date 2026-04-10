import { createClient } from '@/lib/supabase/server';
import { NextResponse, type NextRequest } from 'next/server';
import { sendEmail } from '@/lib/email/send';
import { applicationStatusEmail } from '@/lib/email/templates';

type Params = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Fetch full application before approving so we can send evaluation email
  const { data: application } = await supabase
    .from('applications')
    .select('founder_name, founder_email, idea_name, locale, score_viability, score_commitment, score_feasibility, score_market, score_rationale')
    .eq('id', id)
    .single();

  const { error } = await supabase.rpc('approve_application', { app_id: id });

  if (error) {
    console.error('approve_application error:', error);
    return NextResponse.json({ error: 'Failed to approve application' }, { status: 500 });
  }

  // Send evaluation feedback email to founder
  if (application?.founder_email) {
    const locale = (application.locale === 'ja' ? 'ja' : 'en') as 'en' | 'ja';
    const emailData = applicationStatusEmail({
      founderName: application.founder_name,
      ideaName: application.idea_name,
      status: 'accepted',
      locale,
      dashboardUrl: `https://zeroen.dev/${locale}/dashboard`,
      evaluation: {
        score_viability: application.score_viability,
        score_commitment: application.score_commitment,
        score_feasibility: application.score_feasibility,
        score_market: application.score_market,
        rationale: application.score_rationale as {
          viability?: string; commitment?: string; feasibility?: string; market?: string;
          recommendation?: string; summary?: string;
        } | null,
      },
    });
    await sendEmail({ to: application.founder_email, ...emailData });
  }

  return NextResponse.json({ success: true });
}
