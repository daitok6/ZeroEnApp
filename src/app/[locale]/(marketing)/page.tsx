import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Hero } from '@/components/marketing/hero';
import { WhyZeroEn } from '@/components/marketing/why-zeroen';
import { TrustSection } from '@/components/marketing/trust-section';
import { DashboardShowcase } from '@/components/marketing/dashboard-showcase';
import { TechStackTerminal } from '@/components/marketing/tech-stack-terminal';
import { CaseStudiesPreview } from '@/components/marketing/case-studies-preview';
import { NewsletterSection } from '@/components/marketing/newsletter-section';
import { ScrollReveal } from '@/components/marketing/scroll-reveal';
import { StaggerChildren, StaggerItem } from '@/components/marketing/stagger-children';
import { GreenGlowLine } from '@/components/marketing/green-glow-line';
import { InlineCallout } from '@/components/marketing/inline-callout';
import { buildMetadata } from '@/lib/seo/metadata';

export const revalidate = 3600;

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale === 'ja') {
    return buildMetadata({
      title: 'ZeroEn — 前金0円。LP制作・運用・毎月の改善まで月¥10,000。',
      description:
        '元日立・元楽天エンジニアが、コーチ・コンサルタント・セラピストのLP（ランディングページ）を無料で制作。月¥10,000のサブスクリプションでホスティング・運用・毎月の改善まで提供します。',
      path: '',
      locale,
      ogTitle: 'ZeroEn',
      ogSubtitle: '前金0円。月¥10,000で、制作・運用・毎月の改善まで。',
    });
  }
  return buildMetadata({
    title: 'ZeroEn — Free Landing Page. ¥10,000/month Hosting + Updates.',
    description:
      'Ex-Hitachi, ex-Rakuten engineer builds your landing page for free. ¥10,000/month covers hosting, monthly updates, and improvements. Live in 3 days.',
    path: '',
    locale,
    ogTitle: 'ZeroEn',
    ogSubtitle: 'Free LP. ¥10,000/month. Live in 3 days.',
  });
}

const STEP_KEYS = [
  'discover', 'apply', 'score', 'onboard',
  'build', 'launch', 'operate', 'grow', 'upsell',
] as const;

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ZeroEn',
  url: 'https://zeroen.dev',
  logo: 'https://zeroen.dev/logo-dark.svg',
  sameAs: ['https://x.com/ZeroEnBuilds', 'https://www.instagram.com/zeroenbuilds/'],
};

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'ZeroEn LP制作・運用サービス',
  provider: { '@type': 'Organization', name: 'ZeroEn', url: 'https://zeroen.dev' },
  description:
    '元日立・元楽天エンジニアによるLP（ランディングページ）制作・運用サービス。初期費用¥0、月¥10,000から。Next.js・Tailwind CSS・Vercelで3日公開。コーチ・コンサルタント・セラピスト向け。',
  areaServed: 'JP',
  serviceType: 'Web Design',
  offers: {
    '@type': 'Offer',
    price: '10000',
    priceCurrency: 'JPY',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: '10000',
      priceCurrency: 'JPY',
      unitCode: 'MON',
    },
  },
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('home');
  const tHiw = await getTranslations('howItWorks');

  const heroTexts = [t('hero.line1'), t('hero.line2'), t('hero.line3')];

  const steps = STEP_KEYS.map((key, index) => ({
    id: String(index + 1).padStart(2, '0'),
    name: tHiw(`steps.${key}.name`),
    desc: tHiw(`steps.${key}.desc`),
  }));

  const pillars = [0, 1, 2].map((i) => ({
    title: t(`whyZeroEn.pillars.${i}.title`),
    desc: t(`whyZeroEn.pillars.${i}.desc`),
  }));

  const techLines = [0, 1, 2, 3, 4, 5].map((i) => t(`techStack.lines.${i}`));
  const techTools = [0, 1, 2, 3].map((i) => ({
    name: t(`techStack.tools.${i}.name`),
    tag: t(`techStack.tools.${i}.tag`),
    desc: t(`techStack.tools.${i}.desc`),
  }));

  const trustPoints = [0, 1, 2].map((i) => ({
    title: t(`trustSection.points.${i}.title`),
    desc: t(`trustSection.points.${i}.desc`),
  }));

  const dashboardBullets = [0, 1, 2].map((i) => ({
    title: t(`dashboardShowcase.bullets.${i}.title`),
    body: t(`dashboardShowcase.bullets.${i}.body`),
  }));

  const caseStudyPlaceholders = [0, 1, 2].map((i) => {
    const url = t(`caseStudies.placeholders.${i}.url`);
    const screenshot = t(`caseStudies.placeholders.${i}.screenshot`);
    const label = t(`caseStudies.placeholders.${i}.label`);
    return {
      name: t(`caseStudies.placeholders.${i}.name`),
      desc: t(`caseStudies.placeholders.${i}.desc`),
      meta: [0, 1, 2].map((j) => t(`caseStudies.placeholders.${i}.meta.${j}`)),
      url: url || undefined,
      screenshot: screenshot || undefined,
      label: label || undefined,
    };
  });

  return (
    <div className="bg-[#0D0D0D] text-[#F4F4F2]">
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />

      {/* ── Section 1: Hero ─────────────────────────────────── */}
      <Hero
        texts={heroTexts}
        subtitle={t('hero.subtitle')}
        ctaText={t('hero.cta')}
        terminalCommand={t('hero.terminalCommand')}
        locale={locale}
      />

      {/* ── Section 2: Why ZeroEn ────────────────────────────── */}
      <WhyZeroEn
        eyebrow={t('whyZeroEn.eyebrow')}
        title={t('whyZeroEn.title')}
        subtitle={t('whyZeroEn.subtitle')}
        pillars={pillars}
        urgency={t('whyZeroEn.urgency')}
        locale={locale}
        ctaText={t('hero.cta')}
      />

      {/* ── WhyZeroEn blog link ─────────────────────────────── */}
      <div className="px-4 pb-10 bg-[#080808]">
        <div className="max-w-5xl mx-auto">
          <InlineCallout
            eyebrow={locale === 'ja' ? 'よく聞かれること' : 'Common concerns'}
            title={locale === 'ja' ? 'コーチ・セラピストのLP5つのお悩みとZeroEnの向き合い方を読む' : 'Read: 5 LP struggles coaches and therapists commonly face'}
            href={locale === 'ja' ? '/blog/lp-pain-points-coaches-therapists' : '/en/blog/lp-pain-points-coaches-therapists'}
          />
        </div>
      </div>

      {/* ── Section 3: Trust ─────────────────────────────────── */}
      <TrustSection
        eyebrow={t('trustSection.eyebrow')}
        title={t('trustSection.title')}
        points={trustPoints}
      />

      {/* ── Section 4: Dashboard Showcase ───────────────────── */}
      <DashboardShowcase
        eyebrow={t('dashboardShowcase.eyebrow')}
        heading={t('dashboardShowcase.heading')}
        subheading={t('dashboardShowcase.subheading')}
        bullets={dashboardBullets}
        ctaLabel={t('dashboardShowcase.ctaLabel')}
        ctaHref={t('dashboardShowcase.ctaHref')}
      />

      {/* ── Section 5: Tech Stack Terminal ───────────────────── */}
      <TechStackTerminal
        eyebrow={t('techStack.eyebrow')}
        title={t('techStack.title')}
        subtitle={t('techStack.subtitle')}
        terminalTitle={t('techStack.terminalTitle')}
        lines={techLines}
        tools={techTools}
      />

      {/* ── Section 6: How It Works ──────────────────────────── */}
      <section className="py-24 px-4 bg-[#080808]">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal direction="up">
            <div className="mb-16 text-center">
              <p className="text-[#00E87A] font-mono text-xs uppercase tracking-[0.2em] mb-3">
                {t('processEyebrow')}
              </p>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#F4F4F2] mb-4">
                {t('howItWorks.title')}
              </h2>
              <p className="text-[#6B7280] font-mono text-sm">
                {t('howItWorks.subtitle')}
              </p>
            </div>
          </ScrollReveal>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#00E87A]/80 via-[#00E87A]/30 to-transparent" />
            <StaggerChildren className="space-y-0" staggerDelay={0.08}>
              {steps.map((step) => (
                <StaggerItem key={step.id}>
                  <div className="relative flex gap-6 pb-10 last:pb-0">
                    <div className="relative z-10 flex-shrink-0 w-12 flex items-start justify-center pt-1">
                      <div className="w-3 h-3 rounded-full bg-[#00E87A] shadow-[0_0_8px_rgba(0,232,122,0.6)] mt-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-3 mb-1">
                        <span className="text-[#00E87A] font-mono text-xs font-bold tracking-widest">
                          {step.id}
                        </span>
                        <span className="text-[#F4F4F2] font-mono font-bold text-base">
                          {step.name}
                        </span>
                      </div>
                      <p className="text-[#6B7280] font-mono text-sm leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </div>
      </section>

      {/* ── Section 7: Case Studies Preview ──────────────────── */}
      <CaseStudiesPreview
        eyebrow={t('caseStudies.eyebrow')}
        title={t('caseStudies.title')}
        subtitle={t('caseStudies.subtitle')}
        comingSoon={t('caseStudies.comingSoon')}
        live={t('caseStudies.live')}
        placeholders={caseStudyPlaceholders}
      />

      {/* ── Section 8: Pricing Teaser ────────────────────────── */}
      <section className="py-24 px-4 bg-[#080808]">
        <div className="max-w-2xl mx-auto text-center">
          <ScrollReveal direction="up">
            <p className="text-[#00E87A] font-mono text-xs uppercase tracking-[0.2em] mb-3">
              {t('valueProp.eyebrow')}
            </p>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#F4F4F2] mb-4 whitespace-pre-line">
              {t('valueProp.title')}
            </h2>
            <p className="text-[#6B7280] font-mono text-sm max-w-xl mx-auto mb-10">
              {t('valueProp.subtitle')}
            </p>
            <Link
              href={`/${locale}/pricing`}
              className="inline-block border border-[#00E87A] text-[#00E87A] font-heading font-bold text-sm uppercase tracking-widest py-3 px-8 rounded hover:bg-[#00E87A]/10 transition-all duration-200"
            >
              {t('valueProp.seePricingCta')}
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Section 9: Apply CTA ─────────────────────────────── */}
      <section className="py-24 px-4">
        <GreenGlowLine className="mb-24" />
        <div className="max-w-2xl mx-auto text-center">
          <ScrollReveal direction="up">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-[#F4F4F2] mb-6">
              {t('applySection.title')}
            </h2>
            <p className="text-[#6B7280] font-mono text-sm mb-10">
              {t('applySection.subtitle')}
            </p>
            <Link
              href={`/${locale}/login`}
              className="inline-block bg-[#00E87A] text-[#0D0D0D] font-heading font-bold uppercase tracking-widest text-sm px-8 py-4 md:px-12 md:py-5 rounded hover:bg-[#00ff88] active:scale-95 transition-all duration-150 shadow-[0_0_32px_rgba(0,232,122,0.5)] hover:shadow-[0_0_48px_rgba(0,232,122,0.7)] mb-6"
            >
              {t('applySection.cta')}
            </Link>
            <p className="text-[#374151] font-mono text-xs">
              {t('valueProp.minNote')}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Section 10: Newsletter ─────────────────────────────── */}
      <NewsletterSection
        eyebrow={t('newsletterSection.eyebrow')}
        title={t('newsletterSection.title')}
        subtitle={t('newsletterSection.subtitle')}
        note={t('newsletterSection.note')}
        locale={locale}
      />
    </div>
  );
}
