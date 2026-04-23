import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { ScrollReveal } from '@/components/marketing/scroll-reveal';
import { GreenGlowLine } from '@/components/marketing/green-glow-line';
import { TermsAccordion } from '@/components/marketing/terms-accordion';
import { buildMetadata } from '@/lib/seo/metadata';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale === 'ja') {
    return buildMetadata({
      title: '利用規約 — ZeroEn',
      description: 'ZeroEnの標準契約条件。固定価格、マイルストーン請求、スコープ、コード所有権の詳細。',
      path: '/terms',
      locale,
      ogTitle: '利用規約',
      ogSubtitle: 'わかりやすい契約内容',
    });
  }
  return buildMetadata({
    title: 'Terms — ZeroEn',
    description: "ZeroEn's standard contract terms. Fixed price, milestone billing, scope freeze, code ownership — explained plainly.",
    path: '/terms',
    locale,
    ogTitle: 'Terms',
    ogSubtitle: 'The deal, in plain English',
  });
}

export default async function TermsPage({ params }: Props) {
  await params;
  const t = await getTranslations('terms');

  const summaryItems = [0, 1, 2, 3, 4, 5].map((i) => ({
    label: t(`summary.items.${i}.label`),
    value: t(`summary.items.${i}.value`),
  }));

  const accordionSections = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => ({
    title: t(`full.sections.${i}.title`),
    body: t(`full.sections.${i}.body`),
    id: i === 10 ? 'confidentiality' : undefined,
  }));

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F4F4F2]">
      {/* Hero */}
      <section className="pt-32 pb-16 px-4 text-center">
        <ScrollReveal direction="up">
          <p className="text-[#00E87A] font-mono text-xs uppercase tracking-[0.2em] mb-4">
            {t('eyebrow')}
          </p>
          <h1 className="text-4xl sm:text-5xl font-heading font-bold text-[#F4F4F2] mb-6 whitespace-pre-line">
            {t('title')}
          </h1>
          <p className="text-[#6B7280] font-mono text-sm max-w-md mx-auto">
            {t('subtitle')}
          </p>
        </ScrollReveal>
        <GreenGlowLine className="mt-16" />
      </section>

      {/* Summary card */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal direction="up">
            <div className="bg-[#111827] border border-[#1F2937] rounded-lg overflow-hidden mb-16">
              {/* Terminal header */}
              <div className="flex items-center gap-1.5 px-4 py-3 bg-[#0D0D0D] border-b border-[#1F2937]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#374151]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#374151]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#374151]" />
                <span className="ml-auto text-[#374151] font-mono text-xs">terms.sh</span>
              </div>

              <div className="p-6 md:p-8">
                <p className="text-[#00E87A] font-mono text-xs uppercase tracking-widest mb-6">
                  {t('summary.heading')}
                </p>
                <dl className="space-y-4">
                  {summaryItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex flex-col sm:flex-row sm:gap-6 py-3 border-b border-[#1F2937] last:border-0"
                    >
                      <dt className="text-[#6B7280] font-mono text-xs uppercase tracking-wider w-full sm:w-36 flex-shrink-0 mb-1 sm:mb-0">
                        {item.label}
                      </dt>
                      <dd className="text-[#F4F4F2] font-mono text-sm">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </ScrollReveal>

          {/* Full legal accordion */}
          <ScrollReveal direction="up" delay={0.1}>
            <TermsAccordion
              heading={t('full.heading')}
              sections={accordionSections}
            />
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
