import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { DesignWizard } from '@/components/design-wizard/wizard';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function DesignWizardPage({ params }: Props) {
  const { locale } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_status, onboarding_progress')
    .eq('id', user.id)
    .maybeSingle();

  if (profile?.onboarding_status === 'complete') {
    redirect(`/${locale}/dashboard`);
  }

  const progress = (profile?.onboarding_progress ?? {}) as Record<string, unknown>;
  const initialStep =
    typeof progress.current_step === 'number' && progress.current_step >= 1 && progress.current_step <= 4
      ? progress.current_step
      : 1;

  return (
    <DesignWizard
      initialStep={initialStep}
      initialData={progress}
      locale={locale}
      userId={user.id}
    />
  );
}
