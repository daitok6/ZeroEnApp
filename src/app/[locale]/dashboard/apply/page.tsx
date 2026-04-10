import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ApplyWizard } from '@/components/apply/wizard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Apply — ZeroEn',
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ locale: string }> };

export default async function DashboardApplyPage({ params }: Props) {
  const { locale } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  // If there's an active (pending/reviewing) application, send to status page
  // Accepted/rejected users may reapply with a new idea
  const { data: activeApplication } = await supabase
    .from('applications')
    .select('id, status')
    .eq('user_id', user.id)
    .in('status', ['pending', 'reviewing'])
    .limit(1)
    .single();

  if (activeApplication) {
    redirect(`/${locale}/dashboard/application-status`);
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold font-heading text-[#F4F4F2]">
          {locale === 'ja' ? '応募する' : 'Apply'}
        </h1>
        <p className="text-[#6B7280] text-sm font-mono mt-1">
          {locale === 'ja'
            ? 'あなたのアイデアを教えてください'
            : 'Tell us about your idea'}
        </p>
      </div>
      <ApplyWizard locale={locale} />
    </div>
  );
}
