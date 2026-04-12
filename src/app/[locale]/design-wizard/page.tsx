import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { DesignWizard } from '@/components/design-wizard/wizard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Design Brief — ZeroEn',
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function DesignWizardPage({ params }: Props) {
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

  // Non-managed clients or already-complete clients go to dashboard
  if (!profile?.managed || profile?.onboarding_status === 'complete') {
    redirect(`/${locale}/dashboard`);
  }

  const { data: intake } = await supabase
    .from('managed_client_intake')
    .select('brand_kit, assets, domain, coconala_order_ref')
    .eq('profile_id', user.id)
    .single();

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <DesignWizard
        locale={locale}
        profileId={user.id}
        initialIntake={
          intake
            ? {
                brand_kit: intake.brand_kit ?? null,
                assets: intake.assets ?? null,
                domain: intake.domain ?? null,
                coconala_order_ref: intake.coconala_order_ref ?? null,
              }
            : null
        }
      />
    </div>
  );
}
