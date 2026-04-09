import { getTranslations } from 'next-intl/server';
import { ApplyWizard } from '@/components/apply/wizard';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ja' ? 'ZeroEnに申し込む' : 'Apply to ZeroEn — Free MVP Build',
    description: locale === 'ja'
      ? '無料でMVPを構築します。アイデアを教えてください。'
      : 'Apply to have your startup MVP built for free in exchange for equity.',
  };
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
          <h1 className="text-4xl md:text-5xl font-bold font-mono text-[#F4F4F2] mb-4">
            {t('title')}
          </h1>
          <p className="text-[#9CA3AF] font-mono text-lg">
            {t('subtitle')}
          </p>
        </div>

        <ApplyWizard locale={locale} />
      </div>
    </div>
  );
}
