import { getTranslations } from 'next-intl/server';
import { buildMetadata } from '@/lib/seo/metadata';
import { GreenGlowLine } from '@/components/marketing/green-glow-line';
import type { Metadata } from 'next';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale === 'ja') {
    return buildMetadata({
      title: 'プライバシーポリシー — ZeroEn',
      description: 'ZeroEnのプライバシーポリシー。収集するデータ、使用方法、第三者サービスについて説明します。',
      path: '/privacy',
      locale,
      ogTitle: 'プライバシーポリシー',
      ogSubtitle: 'データの取り扱いについて',
    });
  }
  return buildMetadata({
    title: 'Privacy Policy — ZeroEn',
    description: "ZeroEn's privacy policy. What data we collect, how we use it, and your rights.",
    path: '/privacy',
    locale,
    ogTitle: 'Privacy Policy',
    ogSubtitle: 'How we handle your data',
  });
}

export default async function PrivacyPage({ params }: Props) {
  await params;
  const t = await getTranslations('privacy');
  const sections = t.raw('sections') as Array<{ title: string; body: string }>;

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F4F4F2]">
      {/* Hero */}
      <section className="pt-32 pb-16 px-4 text-center">
        <p className="text-[#00E87A] font-mono text-xs uppercase tracking-[0.2em] mb-4">
          {t('eyebrow')}
        </p>
        <h1 className="text-4xl sm:text-5xl font-heading font-bold text-[#F4F4F2] mb-6">
          {t('title')}
        </h1>
        <p className="text-[#6B7280] font-mono text-sm max-w-md mx-auto">
          {t('lastUpdated')}
        </p>
        <GreenGlowLine className="mt-16" />
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          {sections.map((section) => (
            <div
              key={section.title}
              className="bg-[#111827] border border-[#1F2937] rounded-lg p-6 md:p-8"
            >
              <h2 className="text-[#F4F4F2] font-heading font-bold text-lg mb-4">
                {section.title}
              </h2>
              <div className="text-[#9CA3AF] font-mono text-sm leading-relaxed whitespace-pre-line">
                {section.body.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
                  part.startsWith('**') && part.endsWith('**') ? (
                    <strong key={i} className="text-[#F4F4F2]">
                      {part.slice(2, -2)}
                    </strong>
                  ) : (
                    part
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
