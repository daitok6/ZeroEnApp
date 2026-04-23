import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Rocket, Building2, Globe2, Languages, Layers, ShieldCheck } from 'lucide-react';
import { ScrollReveal } from '@/components/marketing/scroll-reveal';
import { StaggerChildren, StaggerItem } from '@/components/marketing/stagger-children';
import { GreenGlowLine } from '@/components/marketing/green-glow-line';
import { CardIcon } from '@/components/marketing/card-icon';
import { buildMetadata } from '@/lib/seo/metadata';
import { Hero3DScene } from '@/components/marketing/hero-3d-scene';
import { CtaPulse } from '@/components/marketing/cta-pulse';
import { ScreenshotImage } from '@/components/marketing/screenshot-image';

export const revalidate = 3600;

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale === 'ja') {
    return buildMetadata({
      title: 'ZeroEn — バイリンガルSaaS、確実に納品。',
      description:
        '資金調達済みのスタートアップと東京で真剣にビジネスを営む企業向けに、プロダクショングレードのバイリンガルWebプロダクトを制作。固定価格・エクイティ不要・数週間で納品。',
      path: '',
      locale,
      ogTitle: 'ZeroEn',
      ogSubtitle: 'バイリンガルSaaS、確実に納品。',
    });
  }
  return buildMetadata({
    title: 'ZeroEn — Bilingual SaaS, shipped.',
    description:
      'We build production-grade bilingual web products for funded founders and serious businesses in Tokyo. Fixed price. No equity. Shipped in weeks.',
    path: '',
    locale,
    ogTitle: 'ZeroEn',
    ogSubtitle: 'Bilingual SaaS, shipped.',
  });
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ZeroEn',
  url: 'https://zeroen.dev',
  logo: 'https://zeroen.dev/logo-dark.svg',
  sameAs: ['https://x.com/ZeroEnBuilds'],
};

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'ZeroEn Bilingual SaaS Build',
  provider: { '@type': 'Organization', name: 'ZeroEn', url: 'https://zeroen.dev' },
  description:
    'Production-grade bilingual Next.js + Supabase + Stripe products for funded founders and serious businesses in Tokyo. Fixed price, no equity, shipped in weeks.',
  areaServed: 'JP',
  serviceType: 'Web Development',
  offers: [
    { '@type': 'Offer', name: 'Starter', price: '380000', priceCurrency: 'JPY' },
    { '@type': 'Offer', name: 'Growth', price: '880000', priceCurrency: 'JPY' },
    { '@type': 'Offer', name: 'MVP Build', price: '1500000', priceCurrency: 'JPY' },
  ],
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('home');

  const icpPillars = t.raw('icpPillars.pillars') as { title: string; desc: string }[];
  const deliverablePillars = t.raw('deliverablePillars.pillars') as { title: string; desc: string }[];
  const caseItems = t.raw('caseStudies.items') as {
    name: string; desc: string; meta: string[]; url?: string; label: string;
  }[];

  const icpIcons = [Rocket, Building2, Globe2];
  const deliverableIcons = [Languages, Layers, ShieldCheck];
  const caseThumb: Record<string, string> = {
    ZeroEn: '/images/cases/zeroen-home.webp',
    WebMori: '/images/cases/webmori-home.webp',
  };

  const scopingCallHref = locale === 'ja' ? '/ja/scoping-call' : '/scoping-call';

  return (
    <div className="bg-[#0D0D0D] text-[#F4F4F2]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="min-h-[90vh] flex flex-col justify-center px-4 py-32">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* Text content */}
            <div className="flex-1 min-w-0">
              <ScrollReveal direction="up">
                <p className="text-[#00E87A] font-mono text-xs uppercase tracking-[0.2em] mb-6">
                  {t('hero.eyebrow')}
                </p>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-[#F4F4F2] mb-6 leading-tight whitespace-nowrap">
                  {t('hero.headline')}
                </h1>
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <CtaPulse>
                    <a
                      href={scopingCallHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-[#00E87A] text-[#0D0D0D] font-heading font-bold uppercase tracking-widest text-sm px-8 py-4 rounded hover:bg-[#00ff88] hover:scale-[1.02] active:scale-95 transition-all duration-150 text-center"
                    >
                      {t('hero.cta')}
                    </a>
                  </CtaPulse>
                  <Link
                    href={`/${locale}/pricing`}
                    className="inline-block border border-[#374151] text-[#9CA3AF] font-heading font-bold uppercase tracking-widest text-sm px-8 py-4 rounded hover:border-[#6B7280] hover:text-[#F4F4F2] transition-all duration-200 text-center"
                  >
                    {t('hero.ctaSecondary')}
                  </Link>
                </div>
                <p className="text-[#6B7280] font-mono text-xs mt-3">
                  {t('hero.ctaNote')}
                </p>
                <p className="text-[#374151] font-mono text-xs mt-4">
                  {t('hero.urgencyNote')}
                </p>
                <p className="text-[#6B7280] font-mono text-xs mt-2">
                  {t('hero.credential')}
                </p>
              </ScrollReveal>
            </div>

            {/* 3D scene — desktop only */}
            <div className="hidden lg:block flex-shrink-0 w-[400px] h-[400px]">
              <Hero3DScene />
            </div>

          </div>
        </div>
      </section>

      <GreenGlowLine />

      {/* ── ICP Pillars ──────────────────────────────────────── */}
      <section className="py-24 px-4 bg-[#080808]">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal direction="up">
            <div className="mb-14 text-center">
              <p className="text-[#00E87A] font-mono text-xs uppercase tracking-[0.2em] mb-3">
                {t('icpPillars.eyebrow')}
              </p>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#F4F4F2]">
                {t('icpPillars.title')}
              </h2>
            </div>
          </ScrollReveal>
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6" staggerDelay={0.1}>
            {icpPillars.map((pillar, i) => (
              <StaggerItem key={pillar.title}>
                <div className="bg-[#111827] rounded-lg border border-[#374151] p-7 hover:border-[#00E87A]/40 transition-all duration-300">
                  <CardIcon Icon={icpIcons[i]} />
                  <h3 className="text-[#F4F4F2] font-heading font-bold text-base mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-[#6B7280] font-mono text-sm leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ── Deliverable Pillars ───────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal direction="up">
            <div className="mb-14 text-center">
              <p className="text-[#00E87A] font-mono text-xs uppercase tracking-[0.2em] mb-3">
                {t('deliverablePillars.eyebrow')}
              </p>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#F4F4F2]">
                {t('deliverablePillars.title')}
              </h2>
            </div>
          </ScrollReveal>
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6" staggerDelay={0.1}>
            {deliverablePillars.map((pillar, i) => (
              <StaggerItem key={pillar.title}>
                <div className="p-7">
                  <CardIcon Icon={deliverableIcons[i]} />
                  <h3 className="text-[#F4F4F2] font-heading font-bold text-base mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-[#6B7280] font-mono text-sm leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ── Built by ZeroEn ──────────────────────────────────── */}
      <section className="py-24 px-4 bg-[#080808]">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal direction="up">
            <div className="mb-14 text-center">
              <p className="text-[#00E87A] font-mono text-xs uppercase tracking-[0.2em] mb-3">
                {t('caseStudies.eyebrow')}
              </p>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#F4F4F2] mb-3">
                {t('caseStudies.title')}
              </h2>
              <p className="text-[#6B7280] font-mono text-sm">
                {t('caseStudies.subtitle')}
              </p>
            </div>
          </ScrollReveal>
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-6" staggerDelay={0.12}>
            {caseItems.map((item) => (
              <StaggerItem key={item.name}>
                <div className="bg-[#111827] rounded-lg border border-[#374151] hover:border-[#00E87A]/40 transition-all duration-300 flex flex-col overflow-hidden">
                  {caseThumb[item.name] && (
                    <div className="w-full aspect-video overflow-hidden">
                      <ScreenshotImage src={caseThumb[item.name]} alt={`${item.name} homepage`} />
                    </div>
                  )}
                  <div className="p-7 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-[#F4F4F2] font-heading font-bold text-lg">{item.name}</span>
                      <span className="text-[#0D0D0D] bg-[#00E87A] font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">
                        {t('caseStudies.live')}
                      </span>
                    </div>
                    <p className="text-[#6B7280] font-mono text-sm leading-relaxed mb-4 flex-1">
                      {item.desc}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {item.meta.map((tag) => (
                        <span key={tag} className="border border-[#374151] text-[#6B7280] font-mono text-[10px] px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    {item.url && (
                      <Link
                        href={`/${locale}/cases`}
                        className="text-[#00E87A] font-mono text-xs hover:underline"
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                </div>
              </StaggerItem>
            ))}
            {/* First client placeholder */}
            <StaggerItem>
              <div className="bg-[#0D0D0D] rounded-lg border border-dashed border-[#374151] p-7 flex flex-col items-center justify-center text-center min-h-[200px]">
                <p className="text-[#374151] font-mono text-xs uppercase tracking-widest mb-2">
                  {t('caseStudies.comingSoon')}
                </p>
                <p className="text-[#374151] font-mono text-xs">
                  {locale === 'ja' ? '現在受注中' : 'Slot open'}
                </p>
              </div>
            </StaggerItem>
          </StaggerChildren>
        </div>
      </section>

      {/* ── Footer CTA ───────────────────────────────────────── */}
      <section className="py-32 px-4">
        <GreenGlowLine className="mb-24" />
        <div className="max-w-2xl mx-auto text-center">
          <ScrollReveal direction="up">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-[#F4F4F2] mb-6">
              {t('footerCta.title')}
            </h2>
            <p className="text-[#6B7280] font-mono text-sm mb-10">
              {t('footerCta.subtitle')}
            </p>
            <a
              href={scopingCallHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#00E87A] text-[#0D0D0D] font-heading font-bold uppercase tracking-widest text-sm px-10 py-4 md:px-14 md:py-5 rounded hover:bg-[#00ff88] active:scale-95 transition-all duration-150 shadow-[0_0_32px_rgba(0,232,122,0.5)] hover:shadow-[0_0_48px_rgba(0,232,122,0.7)] mb-6"
            >
              {t('footerCta.cta')}
            </a>
            <p className="text-[#374151] font-mono text-xs">
              {t('footerCta.note')}
            </p>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
