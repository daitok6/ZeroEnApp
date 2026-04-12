import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { CoconalaOnboardingWizard } from '@/components/coconala-onboarding/wizard';

export const metadata: Metadata = {
  title: 'Get Started — ZeroEn',
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function CoconalaOnboardingPage({ params }: Props) {
  const { locale } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('managed, onboarding_status')
    .eq('id', user.id)
    .single();

  if (!profile?.managed || profile?.onboarding_status === 'complete') {
    redirect(`/${locale}/dashboard`);
  }

  const { data: intake } = await supabase
    .from('managed_client_intake')
    .select('scope_md, plan_tier, scope_ack, commitment_ack_at, brand_kit, assets, domain')
    .eq('profile_id', user.id)
    .single();

  return (
    <CoconalaOnboardingWizard
      locale={locale}
      profileId={user.id}
      scopeMd={intake?.scope_md ?? ''}
      initialIntake={
        intake
          ? {
              scope_ack: intake.scope_ack ?? false,
              commitment_ack_at: intake.commitment_ack_at ?? null,
              brand_kit: intake.brand_kit ?? null,
              assets: intake.assets ?? null,
              domain: intake.domain ?? null,
              plan_tier: intake.plan_tier ?? null,
            }
          : null
      }
    />
  );
}
