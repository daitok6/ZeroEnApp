import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ScrollReveal } from '@/components/marketing/scroll-reveal';
import { StaggerChildren, StaggerItem } from '@/components/marketing/stagger-children';
import { GreenGlowLine } from '@/components/marketing/green-glow-line';
import { buildMetadata } from '@/lib/seo/metadata';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pricing.meta' });
  return buildMetadata({
    title: t('title'),
    description: t('description'),
    path: '/pricing',
    locale,
    ogTitle: 'ZeroEn',
    ogSubtitle: locale === 'ja' ? '固定価格。エクイティ不要。' : 'Fixed price. No equity.',
  });
}

export default async function PricingPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pricing' });

  const starterItems = t.raw('starter.items') as string[];
  const growthItems = t.raw('growth.items') as string[];
  const mvpItems = t.raw('mvp.items') as string[];
  const anchorRows = t.raw('anchor.rows') as { label: string; value: string; timeline: string }[];
  const anchorColumns = t.raw('anchor.columns') as string[];
  const faqs = t.raw('faqs') as { q: string; a: string }[];

  const scopingCallHref = locale === 'ja' ? '/ja/scoping-call' : '/scoping-call';

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };

  return (
    <div className="bg-[#0D0D0D] text-[#F4F4F2] pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Header */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal direction="up">
            <p className="text-[#00E87A] font-mono text-xs uppercase tracking-[0.2em] mb-4">
              {t('eyebrow')}
            </p>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-[#F4F4F2] mb-6 whitespace-pre-line">
              {t('title')}
            </h1>
            <p className="text-[#6B7280] font-mono text-sm max-w-2xl mx-auto leading-relaxed">
              {t('subtitle')}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Pre-anchor callout */}
      <section className="pb-4 px-4">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal direction="up">
            <div className="bg-[#111827] border border-[#374151] rounded-lg px-6 py-4 text-center mb-8">
              <p className="text-[#9CA3AF] font-mono text-sm">
                {locale === 'ja'
                  ? '日本の制作会社は同等のスコープで¥500万〜¥1,000万。ZeroEn Growthは¥88万、3〜4週間で納品。'
                  : 'Japanese agencies quote ¥5–10M for equivalent scope. ZeroEn Growth is ¥880k, delivered in 3–4 weeks.'}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Tier cards */}
      <section className="pb-24 px-4">
        <div className="max-w-5xl mx-auto">
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6" staggerDelay={0.1}>
            {/* Starter */}
            <StaggerItem>
              <div className="flex flex-col bg-[#111827] rounded-lg border border-[#374151] p-8 h-full hover:shadow-[0_0_24px_rgba(0,232,122,0.08)] transition-all duration-300">
                <p className="text-[#6B7280] font-mono text-xs uppercase tracking-widest mb-3">
                  {t('starter.name')}
                </p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-[#F4F4F2] font-heading font-bold text-4xl">{t('starter.price')}</span>
                </div>
                <p className="text-[#6B7280] font-mono text-xs mb-1">{t('starter.period')}</p>
                <p className="text-[#00E87A] font-mono text-xs mb-1">{t('starter.retainer')}</p>
                <p className="text-[#6B7280] font-mono text-xs mb-6">{t('starter.timeline')}</p>
                <ul className="space-y-3 flex-1 mb-8">
                  {starterItems.map((item) => (
                    <li key={item} className="flex items-start gap-2 font-mono text-sm text-[#9CA3AF]">
                      <span className="text-[#00E87A] flex-shrink-0 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href={scopingCallHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center border border-[#00E87A] text-[#00E87A] font-heading font-bold text-sm uppercase tracking-widest py-3 px-6 rounded hover:bg-[#00E87A]/10 transition-all duration-200"
                >
                  {t('starter.cta')}
                </a>
              </div>
            </StaggerItem>

            {/* Growth — emphasized */}
            <StaggerItem>
              <div className="flex flex-col bg-[#111827] rounded-lg border-2 border-[#00E87A] p-8 h-full shadow-[0_0_32px_rgba(0,232,122,0.15)] hover:shadow-[0_0_48px_rgba(0,232,122,0.25)] transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[#00E87A] font-mono text-xs uppercase tracking-widest">
                    {t('growth.name')}
                  </p>
                  <span className="text-[#0D0D0D] bg-[#00E87A] font-mono text-xs font-bold px-2 py-0.5 rounded">
                    {t('growth.badge')}
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-[#F4F4F2] font-heading font-bold text-4xl">{t('growth.price')}</span>
                </div>
                <p className="text-[#6B7280] font-mono text-xs mb-1">{t('growth.period')}</p>
                <p className="text-[#00E87A] font-mono text-xs mb-1">{t('growth.retainer')}</p>
                <p className="text-[#6B7280] font-mono text-xs mb-6">{t('growth.timeline')}</p>
                <ul className="space-y-3 flex-1 mb-8">
                  {growthItems.map((item) => (
                    <li key={item} className="flex items-start gap-2 font-mono text-sm text-[#9CA3AF]">
                      <span className="text-[#00E87A] flex-shrink-0 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href={scopingCallHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center bg-[#00E87A] text-[#0D0D0D] font-heading font-bold text-sm uppercase tracking-widest py-3 px-6 rounded hover:bg-[#00ff88] transition-all duration-200 shadow-[0_0_16px_rgba(0,232,122,0.4)]"
                >
                  {t('growth.cta')}
                </a>
              </div>
            </StaggerItem>

            {/* MVP Build */}
            <StaggerItem>
              <div className="flex flex-col bg-[#111827] rounded-lg border border-[#374151] p-8 h-full hover:shadow-[0_0_24px_rgba(0,232,122,0.08)] transition-all duration-300">
                <p className="text-[#6B7280] font-mono text-xs uppercase tracking-widest mb-3">
                  {t('mvp.name')}
                </p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-[#F4F4F2] font-heading font-bold text-4xl">{t('mvp.price')}</span>
                </div>
                <p className="text-[#6B7280] font-mono text-xs mb-1">{t('mvp.period')}</p>
                <p className="text-[#00E87A] font-mono text-xs mb-1">{t('mvp.retainer')}</p>
                <p className="text-[#6B7280] font-mono text-xs mb-6">{t('mvp.timeline')}</p>
                <ul className="space-y-3 flex-1 mb-8">
                  {mvpItems.map((item) => (
                    <li key={item} className="flex items-start gap-2 font-mono text-sm text-[#9CA3AF]">
                      <span className="text-[#00E87A] flex-shrink-0 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href={scopingCallHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center border border-[#00E87A] text-[#00E87A] font-heading font-bold text-sm uppercase tracking-widest py-3 px-6 rounded hover:bg-[#00E87A]/10 transition-all duration-200"
                >
                  {t('mvp.cta')}
                </a>
              </div>
            </StaggerItem>
          </StaggerChildren>

          {/* Payment & retainer notes */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <p className="text-[#374151] font-mono text-xs">{t('starter.payment')}</p>
            <p className="text-[#374151] font-mono text-xs">{t('growth.payment')}</p>
            <p className="text-[#374151] font-mono text-xs">{t('mvp.payment')}</p>
          </div>
        </div>
      </section>

      {/* Comparison anchor */}
      <section className="pb-24 px-4 bg-[#080808]">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal direction="up">
            <h2 className="text-2xl font-heading font-bold text-[#F4F4F2] mb-8 text-center">
              {t('anchor.heading')}
            </h2>
          </ScrollReveal>
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-sm">
              <thead>
                <tr className="border-b border-[#374151]">
                  <th className="text-left text-[#6B7280] text-xs uppercase tracking-widest pb-3 pr-6">
                    {anchorColumns[0]}
                  </th>
                  <th className="text-right text-[#6B7280] text-xs uppercase tracking-widest pb-3 pr-6">
                    {anchorColumns[1]}
                  </th>
                  <th className="text-right text-[#6B7280] text-xs uppercase tracking-widest pb-3">
                    {anchorColumns[2]}
                  </th>
                </tr>
              </thead>
              <tbody>
                {anchorRows.map((row, i) => (
                  <tr
                    key={row.label}
                    className={`border-b border-[#1F2937] ${i >= anchorRows.length - 2 ? 'text-[#F4F4F2]' : 'text-[#6B7280]'}`}
                  >
                    <td className="py-3 pr-6">
                      {i >= anchorRows.length - 2 && (
                        <span className="text-[#00E87A] mr-2">→</span>
                      )}
                      {row.label}
                    </td>
                    <td className={`py-3 pr-6 text-right ${i >= anchorRows.length - 2 ? 'text-[#00E87A] font-bold' : ''}`}>
                      {row.value}
                    </td>
                    <td className="py-3 text-right">{row.timeline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Out-of-scope rate */}
      <section className="pb-24 px-4">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal direction="up">
            <div className="border-l-2 border-[#374151] pl-6 py-2">
              <p className="text-[#6B7280] font-mono text-xs uppercase tracking-widest mb-2">
                {t('outOfScope.title')}
              </p>
              <p className="text-[#00E87A] font-heading font-bold text-2xl mb-2">
                {t('outOfScope.rate')}
              </p>
              <p className="text-[#6B7280] font-mono text-sm">
                {t('outOfScope.note')}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <GreenGlowLine />

      {/* FAQ */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto">
          <ScrollReveal direction="up">
            <h2 className="text-2xl font-heading font-bold text-[#F4F4F2] mb-10 text-center">
              {t('faqTitle')}
            </h2>
          </ScrollReveal>
          <StaggerChildren className="space-y-6" staggerDelay={0.06}>
            {faqs.map((faq) => (
              <StaggerItem key={faq.q}>
                <div className="border-b border-[#374151] pb-6">
                  <p className="text-[#F4F4F2] font-mono text-sm font-bold mb-2">{faq.q}</p>
                  <p className="text-[#6B7280] font-mono text-sm leading-relaxed">{faq.a}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-32 px-4 text-center">
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
            className="inline-block bg-[#00E87A] text-[#0D0D0D] font-heading font-bold uppercase tracking-widest text-sm px-10 py-4 rounded hover:bg-[#00ff88] active:scale-95 transition-all duration-150 shadow-[0_0_32px_rgba(0,232,122,0.5)]"
          >
            {t('cta.button')}
          </a>
        </ScrollReveal>
      </section>
    </div>
  );
}
