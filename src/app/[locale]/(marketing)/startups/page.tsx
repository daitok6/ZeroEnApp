import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { GreenGlowLine } from '@/components/marketing/green-glow-line';
import { ScrollReveal } from '@/components/marketing/scroll-reveal';
import { StaggerChildren, StaggerItem } from '@/components/marketing/stagger-children';
import { buildMetadata } from '@/lib/seo/metadata';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'startups.meta' });
  return buildMetadata({
    title: t('title'),
    description: t('description'),
    path: '/startups',
    locale,
    ogTitle: 'ZeroEn',
    ogSubtitle: locale === 'ja' ? '資金調達済みファウンダー向け' : 'For funded founders in Tokyo',
  });
}

export default async function StartupsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'startups' });

  const painItems = t.raw('painPoints.items') as string[];
  const whyItems = t.raw('why.items') as string[];
  const comparisonRows = t.raw('comparison.rows') as string[][];
  const comparisonColumns = t.raw('comparison.columns') as string[];

  const scopingCallHref = locale === 'ja' ? '/ja/scoping-call' : '/scoping-call';

  return (
    <div className="bg-[#0D0D0D] text-[#F4F4F2] min-h-screen pt-24">
      {/* Hero */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal direction="up">
            <p className="text-[#00E87A] font-mono text-xs uppercase tracking-[0.2em] mb-6">
              {t('eyebrow')}
            </p>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-[#F4F4F2] mb-6 whitespace-pre-line">
              {t('title')}
            </h1>
            <p className="text-[#6B7280] font-mono text-sm max-w-xl mx-auto leading-relaxed mb-10">
              {t('subtitle')}
            </p>
            <a
              href={scopingCallHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#00E87A] text-[#0D0D0D] font-heading font-bold uppercase tracking-widest text-sm px-8 py-4 rounded hover:bg-[#00ff88] active:scale-95 transition-all duration-150 shadow-[0_0_32px_rgba(0,232,122,0.5)]"
            >
              {t('cta.button')}
            </a>
          </ScrollReveal>
        </div>
      </section>

      {/* Pain points + Why ZeroEn */}
      <section className="pb-24 px-4 bg-[#080808]">
        <div className="max-w-4xl mx-auto">
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-6" staggerDelay={0.1}>
            {/* Pain points */}
            <StaggerItem>
              <div className="bg-[#111827] border border-[#374151] rounded-lg p-8 h-full">
                <p className="text-[#6B7280] font-mono text-xs uppercase tracking-widest mb-5">
                  {t('painPoints.heading')}
                </p>
                <ul className="space-y-4">
                  {painItems.map((item) => (
                    <li key={item} className="flex items-start gap-3 font-mono text-sm text-[#9CA3AF]">
                      <span className="text-[#374151] flex-shrink-0 mt-0.5">✕</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>

            {/* Why ZeroEn */}
            <StaggerItem>
              <div className="bg-[#111827] border border-[#00E87A]/40 rounded-lg p-8 h-full shadow-[0_0_24px_rgba(0,232,122,0.08)]">
                <p className="text-[#00E87A] font-mono text-xs uppercase tracking-widest mb-5">
                  {t('why.heading')}
                </p>
                <ul className="space-y-4">
                  {whyItems.map((item) => (
                    <li key={item} className="flex items-start gap-3 font-mono text-sm text-[#9CA3AF]">
                      <span className="text-[#00E87A] flex-shrink-0 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          </StaggerChildren>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal direction="up">
            <h2 className="text-2xl font-heading font-bold text-[#F4F4F2] mb-8 text-center">
              {t('comparison.heading')}
            </h2>
          </ScrollReveal>
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-sm">
              <thead>
                <tr className="border-b border-[#374151]">
                  {comparisonColumns.map((col) => (
                    <th key={col} className="text-left text-[#6B7280] text-xs uppercase tracking-widest pb-3 pr-6 first:pr-8">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr
                    key={row[0]}
                    className={`border-b border-[#1F2937] ${i === comparisonRows.length - 1 ? 'text-[#F4F4F2]' : 'text-[#6B7280]'}`}
                  >
                    {row.map((cell, j) => (
                      <td key={j} className={`py-3 pr-6 first:pr-8 ${j > 0 && i === comparisonRows.length - 1 ? 'text-[#00E87A] font-bold' : ''}`}>
                        {j === 0 && i === comparisonRows.length - 1 && (
                          <span className="text-[#00E87A] mr-2">→</span>
                        )}
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <GreenGlowLine />

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <ScrollReveal direction="up">
            <h2 className="text-2xl font-heading font-bold text-[#F4F4F2] mb-3">
              {t('cta.title')}
            </h2>
            <p className="text-[#6B7280] font-mono text-sm mb-8">
              {t('cta.subtitle')}
            </p>
            <a
              href={scopingCallHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#00E87A] text-[#0D0D0D] font-heading font-bold text-sm px-10 py-4 rounded tracking-widest uppercase hover:bg-[#00ff88] active:scale-95 transition-all duration-150 shadow-[0_0_32px_rgba(0,232,122,0.5)]"
            >
              {t('cta.button')}
            </a>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
