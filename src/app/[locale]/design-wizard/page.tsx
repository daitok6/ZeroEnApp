import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { cookies, headers } from 'next/headers';
import { DesignWizard } from '@/components/design-wizard/wizard';

type Props = {
  params: Promise<{ locale: string }>;
};

/** Pick 'en' or 'ja' from an Accept-Language header string. */
function detectBrowserLocale(header: string | null): 'en' | 'ja' {
  if (!header) return 'ja';
  let bestEn = 0;
  let bestJa = 0;
  for (const part of header.split(',')) {
    const [tag, qStr] = part.trim().split(';q=');
    const q = qStr ? parseFloat(qStr) : 1;
    const lower = tag.toLowerCase();
    if (lower.startsWith('en')) bestEn = Math.max(bestEn, q);
    else if (lower.startsWith('ja')) bestJa = Math.max(bestJa, q);
  }
  if (bestEn === 0 && bestJa === 0) return 'ja';
  return bestEn > bestJa ? 'en' : 'ja';
}

export default async function DesignWizardPage({ params }: Props) {
  const { locale } = await params;

  // Default to browser language on first entry. Respect a persisted
  // NEXT_LOCALE cookie (written by the LocaleSwitcher) once the user
  // has made an explicit choice, so switching language inside the
  // wizard is not silently undone on the next navigation.
  const cookieStore = await cookies();
  const explicitLocale = cookieStore.get('NEXT_LOCALE')?.value;
  if (!explicitLocale) {
    const hdrs = await headers();
    const detected = detectBrowserLocale(hdrs.get('accept-language'));
    if (detected !== locale) {
      redirect(`/${detected}/design-wizard`);
    }
  }

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
