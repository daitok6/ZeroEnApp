import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { OnboardingWizard } from '@/components/onboarding/wizard';

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
    .select('status')
    .eq('id', user.id)
    .single();

  // Only 'onboarding' users belong here; redirect everyone else
  if (profile?.status !== 'onboarding') {
    redirect(`/${locale}/dashboard`);
  }

  // Fetch the accepted application to get the application_id for project creation
  const { data: application } = await supabase
    .from('applications')
    .select('id')
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
      />
    </div>
  );
}
