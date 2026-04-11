import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { OnboardingWizard } from '@/components/onboarding/wizard';
import type { ApplicationData } from '@/components/onboarding/application-drawer';

export const metadata: Metadata = {
  title: 'Get Started — ZeroEn',
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function OnboardingPage({ params }: Props) {
  const { locale } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('status, full_name, onboarding_progress')
    .eq('id', user.id)
    .single();

  if (profile?.status !== 'onboarding') {
    redirect(`/${locale}/dashboard`);
  }

  const { data: application } = await supabase
    .from('applications')
    .select(`
      id,
      idea_name,
      idea_description,
      problem_solved,
      target_users,
      competitors,
      monetization_plan,
      founder_name,
      founder_background,
      founder_commitment,
      linkedin_url,
      score_viability,
      score_commitment,
      score_feasibility,
      score_market,
      score_rationale,
      created_at
    `)
    .eq('user_id', user.id)
    .eq('status', 'accepted')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  return (
    <div className="min-h-full">
      <OnboardingWizard
        locale={locale}
        applicationId={application?.id ?? null}
        application={(application as ApplicationData) ?? null}
        userEmail={user.email ?? ''}
        userName={profile?.full_name ?? ''}
        initialProgress={profile?.onboarding_progress ?? null}
      />
    </div>
  );
}
