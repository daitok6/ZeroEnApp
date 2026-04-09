import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ScrollReveal } from '@/components/marketing/scroll-reveal';
import { StaggerChildren, StaggerItem } from '@/components/marketing/stagger-children';
import { GreenGlowLine } from '@/components/marketing/green-glow-line';
import { PricingFaq } from '@/components/marketing/pricing-faq';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'ja' ? '料金 — ZeroEn' : 'Pricing — ZeroEn';
  return { title };
}

export default async function PricingPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('pricing');

  const mvpFeatures: string[] = [
    t('tiers.mvp.features.f1'),
    t('tiers.mvp.features.f2'),
    t('tiers.mvp.features.f3'),
    t('tiers.mvp.features.f4'),
    t('tiers.mvp.features.f5'),
    t('tiers.mvp.features.f6'),
    t('tiers.mvp.features.f7'),
  ];

  const mvpGives: string[] = [
    t('tiers.mvp.gives.g1'),
    t('tiers.mvp.gives.g2'),
    t('tiers.mvp.gives.g3'),
  ];

  const platformFeatures: string[] = [
    t('tiers.platform.features.f1'),
    t('tiers.platform.features.f2'),
    t('tiers.platform.features.f3'),
    t('tiers.platform.features.f4'),
    t('tiers.platform.features.f5'),
  ];

  const perRequestFeatures: string[] = [
    t('tiers.perRequest.features.f1'),
    t('tiers.perRequest.features.f2'),
    t('tiers.perRequest.features.f3'),
    t('tiers.perRequest.features.f4'),
    t('tiers.perRequest.features.f5'),
  ];

  const faqItems = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') },
    { q: t('faq.q4'), a: t('faq.a4') },
    { q: t('faq.q5'), a: t('faq.a5') },
    { q: t('faq.q6'), a: t('faq.a6') },
  ];

  const tableFeatures = [
    {
      label: t('table.features.mvpDev'),
      mvp: true,
      platform: true,
      perRequest: false,
    },
    {
      label: t('table.features.hosting'),
      mvp: false,
      platform: true,
      perRequest: false,
    },
    {
      label: t('table.features.monthlyFix'),
      mvp: false,
      platform: true,
      perRequest: false,
    },
    {
      label: t('table.features.analyticsPdf'),
      mvp: false,
      platform: true,
      perRequest: false,
    },
    {
      label: t('table.features.extraFeatures'),
      mvp: false,
      platform: false,
      perRequest: true,
    },
  ];

  return (
    <div className="bg-[#0D0D0D] text-[#F4F4F2] min-h-screen">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="pt-32 pb-16 px-4 text-center">
        <ScrollReveal direction="up">
          <p className="text-[#00E87A] font-mono text-xs uppercase tracking-[0.2em] mb-4">
            {t('eyebrow')}
          </p>
          <h1 className="text-4xl sm:text-6xl font-mono font-bold text-[#F4F4F2] mb-6">
            {t('title')}
          </h1>
          <p className="text-[#6B7280] font-mono text-sm max-w-xl mx-auto">
            {t('subtitle')}
          </p>
        </ScrollReveal>
        <GreenGlowLine className="mt-16" />
      </section>

      {/* ── Three Tiers ───────────────────────────────────────── */}
      <section className="py-16 px-4 bg-[#080808]">
        <div className="max-w-6xl mx-auto">
          <StaggerChildren
            className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start"
            staggerDelay={0.12}
          >
            {/* Card 1: MVP Build */}
            <StaggerItem>
              <div className="
                relative flex flex-col
                bg-[#111827] rounded-lg
                border border-[#374151]
                p-8
                hover:shadow-[0_0_24px_rgba(0,232,122,0.1)]
                transition-all duration-300
                h-full
              ">
                {/* Terminal dots */}
                <div className="flex items-center gap-1.5 mb-6">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#374151]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#374151]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#374151]" />
                  <span className="ml-2 text-[#374151] font-mono text-xs">mvp-build.sh</span>
                </div>

                <div className="mb-6">
                  <p className="text-[#6B7280] font-mono text-xs uppercase tracking-widest mb-2">
                    {t('tiers.mvp.label')}
                  </p>
                  <div className="text-5xl font-mono font-bold text-[#F4F4F2] mb-1">
                    $0
                  </div>
                  <p className="text-[#6B7280] font-mono text-xs">
                    {t('tiers.mvp.tagline')}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-[#00E87A] font-mono text-xs uppercase tracking-widest mb-3">
                    {t('tiers.mvp.youGet')}
                  </p>
                  <ul className="space-y-2.5">
                    {mvpFeatures.map((f) => (
                      <li key={f} className="flex items-start gap-2 font-mono text-sm text-[#9CA3AF]">
                        <span className="text-[#00E87A] flex-shrink-0 mt-0.5">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-8 flex-1">
                  <p className="text-[#EF4444] font-mono text-xs uppercase tracking-widest mb-3 mt-6">
                    {t('tiers.mvp.youGive')}
                  </p>
                  <ul className="space-y-2.5">
                    {mvpGives.map((g) => (
                      <li key={g} className="flex items-start gap-2 font-mono text-sm text-[#9CA3AF]">
                        <span className="text-[#EF4444] flex-shrink-0 mt-0.5">→</span>
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={`/${locale}/apply`}
                  className="
                    block text-center
                    border border-[#374151]
                    text-[#F4F4F2] font-mono text-sm
                    uppercase tracking-widest
                    py-3 px-6 rounded
                    hover:border-[#00E87A] hover:text-[#00E87A]
                    transition-all duration-200
                  "
                >
                  {t('tiers.mvp.cta')}
                </Link>
              </div>
            </StaggerItem>

            {/* Card 2: Platform — highlighted */}
            <StaggerItem>
              <div className="
                relative flex flex-col
                bg-[#111827] rounded-lg
                border-2 border-[#00E87A]
                p-8
                shadow-[0_0_32px_rgba(0,232,122,0.2)]
                hover:shadow-[0_0_48px_rgba(0,232,122,0.3)]
                scale-[1.02]
                transition-all duration-300
                h-full
              ">
                {/* Badge */}
                <div className="
                  absolute -top-3 left-1/2 -translate-x-1/2
                  bg-[#00E87A] text-[#0D0D0D]
                  font-mono text-xs font-bold
                  uppercase tracking-widest
                  px-4 py-1 rounded-full
                  whitespace-nowrap
                ">
                  {t('tiers.platform.badge')}
                </div>

                {/* Terminal dots */}
                <div className="flex items-center gap-1.5 mb-6">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#374151]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#374151]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#374151]" />
                  <span className="ml-2 text-[#374151] font-mono text-xs">platform.sh</span>
                </div>

                <div className="mb-6">
                  <p className="text-[#00E87A] font-mono text-xs uppercase tracking-widest mb-2">
                    {t('tiers.platform.label')}
                  </p>
                  <div className="text-5xl font-mono font-bold text-[#F4F4F2] mb-1">
                    $50<span className="text-2xl text-[#6B7280]">/mo</span>
                  </div>
                  <p className="text-[#6B7280] font-mono text-xs">
                    {t('tiers.platform.tagline')}
                  </p>
                </div>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {platformFeatures.map((f) => (
                    <li key={f} className="flex items-start gap-2 font-mono text-sm text-[#9CA3AF]">
                      <span className="text-[#00E87A] flex-shrink-0 mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/${locale}/apply`}
                  className="
                    block text-center
                    bg-[#00E87A] text-[#0D0D0D]
                    font-mono font-bold text-sm
                    uppercase tracking-widest
                    py-3 px-6 rounded
                    hover:bg-[#00ff88]
                    transition-all duration-200
                    shadow-[0_0_16px_rgba(0,232,122,0.4)]
                  "
                >
                  {t('tiers.platform.cta')}
                </Link>
              </div>
            </StaggerItem>

            {/* Card 3: Per-Request */}
            <StaggerItem>
              <div className="
                relative flex flex-col
                bg-[#111827] rounded-lg
                border border-[#374151]
                p-8
                hover:shadow-[0_0_24px_rgba(0,232,122,0.1)]
                transition-all duration-300
                h-full
              ">
                {/* Terminal dots */}
                <div className="flex items-center gap-1.5 mb-6">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#374151]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#374151]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#374151]" />
                  <span className="ml-2 text-[#374151] font-mono text-xs">per-request.sh</span>
                </div>

                <div className="mb-6">
                  <p className="text-[#6B7280] font-mono text-xs uppercase tracking-widest mb-2">
                    {t('tiers.perRequest.label')}
                  </p>
                  <div className="text-5xl font-mono font-bold text-[#F4F4F2] mb-1">
                    $50<span className="text-2xl text-[#6B7280]">+</span>
                  </div>
                  <p className="text-[#6B7280] font-mono text-xs">
                    {t('tiers.perRequest.tagline')}
                  </p>
                </div>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {perRequestFeatures.map((f) => (
                    <li key={f} className="flex items-start gap-2 font-mono text-sm text-[#9CA3AF]">
                      <span className="text-[#00E87A] flex-shrink-0 mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/${locale}/apply`}
                  className="
                    block text-center
                    border border-[#374151]
                    text-[#F4F4F2] font-mono text-sm
                    uppercase tracking-widest
                    py-3 px-6 rounded
                    hover:border-[#00E87A] hover:text-[#00E87A]
                    transition-all duration-200
                  "
                >
                  {t('tiers.perRequest.cta')}
                </Link>
              </div>
            </StaggerItem>
          </StaggerChildren>
        </div>
      </section>

      {/* ── Comparison Table ──────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal direction="up">
            <h2 className="text-2xl sm:text-3xl font-mono font-bold text-[#F4F4F2] mb-10 text-center">
              {t('table.title')}
            </h2>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.1}>
            <div className="overflow-x-auto">
              <table className="w-full font-mono text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[#1F2937]">
                    <th className="text-left py-4 px-4 text-[#6B7280] font-normal uppercase tracking-widest text-xs">
                      {t('table.featureCol')}
                    </th>
                    <th className="text-center py-4 px-4 text-[#F4F4F2] font-bold uppercase tracking-widest text-xs">
                      {t('tiers.mvp.label')}
                    </th>
                    <th className="text-center py-4 px-4 text-[#00E87A] font-bold uppercase tracking-widest text-xs">
                      {t('tiers.platform.label')}
                    </th>
                    <th className="text-center py-4 px-4 text-[#F4F4F2] font-bold uppercase tracking-widest text-xs">
                      {t('tiers.perRequest.label')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableFeatures.map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-[#111827] hover:bg-[#0F172A] transition-colors duration-150"
                    >
                      <td className="py-4 px-4 text-[#9CA3AF]">{row.label}</td>
                      <td className="py-4 px-4 text-center">
                        {row.mvp ? (
                          <span className="text-[#00E87A] text-base">✓</span>
                        ) : (
                          <span className="text-[#374151]">—</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center bg-[#00E87A]/[0.03]">
                        {row.platform ? (
                          <span className="text-[#00E87A] text-base">✓</span>
                        ) : (
                          <span className="text-[#374151]">—</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {row.perRequest ? (
                          <span className="text-[#00E87A] text-base">✓</span>
                        ) : (
                          <span className="text-[#374151]">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {/* Upfront cost row */}
                  <tr className="border-b border-[#1F2937]">
                    <td className="py-4 px-4 text-[#9CA3AF]">
                      {t('table.features.upfrontCost')}
                    </td>
                    <td className="py-4 px-4 text-center text-[#F4F4F2] font-bold">$0</td>
                    <td className="py-4 px-4 text-center text-[#00E87A] font-bold bg-[#00E87A]/[0.03]">
                      $50/mo
                    </td>
                    <td className="py-4 px-4 text-center text-[#F4F4F2] font-bold">
                      $50–2,000
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-[#080808]">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal direction="up">
            <PricingFaq items={faqItems} title={t('faq.title')} />
          </ScrollReveal>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <GreenGlowLine className="mb-24" />
        <div className="max-w-2xl mx-auto text-center">
          <ScrollReveal direction="up">
            <h2 className="text-3xl sm:text-4xl font-mono font-bold text-[#F4F4F2] mb-6">
              {t('cta.title')}
            </h2>
            <p className="text-[#6B7280] font-mono text-sm mb-10">
              {t('cta.subtitle')}
            </p>
            <Link
              href={`/${locale}/apply`}
              className="
                inline-block
                bg-[#00E87A] text-[#0D0D0D]
                font-mono font-bold
                uppercase tracking-widest
                text-sm
                px-12 py-5
                rounded
                hover:bg-[#00ff88]
                active:scale-95
                transition-all duration-150
                shadow-[0_0_32px_rgba(0,232,122,0.5)]
                hover:shadow-[0_0_48px_rgba(0,232,122,0.7)]
              "
            >
              {t('cta.button')}
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
