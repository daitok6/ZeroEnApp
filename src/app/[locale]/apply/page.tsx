import { getTranslations } from 'next-intl/server';
import { ApplyWizard } from '@/components/apply/wizard';
import Link from 'next/link';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (locale === 'ja') {
    return buildMetadata({
      title: 'ZeroEnに応募する — 無料MVPを始める',
      description:
        'スタートアップのアイデアをご応募ください。全ての応募を確認し、48時間以内にご連絡します。',
      path: '/apply',
      locale,
      ogTitle: 'ZeroEnに応募する',
      ogSubtitle: '無料MVPを始める',
    });
  }
  return buildMetadata({
    title: 'Apply to ZeroEn — Start Your Free MVP',
    description:
      'Submit your startup idea. We review every application and respond within 48 hours.',
    path: '/apply',
    locale,
    ogTitle: 'Apply to ZeroEn',
    ogSubtitle: 'Start Your Free MVP',
  });
}

type Props = { params: Promise<{ locale: string }> };

export default async function ApplyPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('apply');

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F4F4F2] pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-heading text-[#F4F4F2] mb-4">
            {t('title')}
          </h1>
          <p className="text-[#9CA3AF] font-mono text-lg">
            {t('subtitle')}
          </p>
        </div>

        {/* Login banner for users who already have an account */}
        <p className="text-center text-[#6B7280] font-mono text-sm mb-8">
          {locale === 'ja' ? 'すでにアカウントをお持ちですか？' : 'Already have an account?'}{' '}
          <Link href={`/${locale}/login`} className="text-[#00E87A] hover:underline">
            {locale === 'ja' ? 'ログインして応募状況を確認' : 'Log in to track your application status'}
          </Link>
        </p>

        <ApplyWizard locale={locale} />
      </div>
    </div>
  );
}
