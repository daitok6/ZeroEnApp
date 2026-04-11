import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Hero } from '@/components/marketing/hero';
import { WhyZeroEn } from '@/components/marketing/why-zeroen';
import { TrustSection } from '@/components/marketing/trust-section';
import { TechStackTerminal } from '@/components/marketing/tech-stack-terminal';
import { CaseStudiesPreview } from '@/components/marketing/case-studies-preview';
import { NewsletterSection } from '@/components/marketing/newsletter-section';
import { ScrollReveal } from '@/components/marketing/scroll-reveal';
import { StaggerChildren, StaggerItem } from '@/components/marketing/stagger-children';
import { GreenGlowLine } from '@/components/marketing/green-glow-line';
import { buildMetadata } from '@/lib/seo/metadata';

export const revalidate = 3600;

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale === 'ja') {
    return buildMetadata({
      title: 'ZeroEn — 無料MVP・10%エクイティ。AIテクニカル共同創業者。',
      description:
        'スタートアップのMVPをエクイティと引き換えに無料で構築。AIを活用したフルスタックのテクニカル共同創業者を提供します。',
      path: '',
      locale,
      ogTitle: 'ZeroEn',
      ogSubtitle: '無料MVP・10%エクイティ。AIテクニカル共同創業者。',
    });
  }
  return buildMetadata({
    title: 'ZeroEn — Free MVP, 10% Equity. Your AI Technical Co-Founder.',
    description:
      "We build your startup's MVP for free in exchange for equity. Get a full-stack technical co-founder powered by AI.",
    path: '',
    locale,
    ogTitle: 'ZeroEn',
    ogSubtitle: 'Free MVP. 10% Equity. Your AI Technical Co-Founder.',
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
  sameAs: ['https://twitter.com/zeroen_dev', 'https://instagram.com/zeroen_dev'],
};

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'ZeroEn Technical Co-Founder Service',
  provider: { '@type': 'Organization', name: 'ZeroEn', url: 'https://zeroen.dev' },
  description:
    'We build free MVPs for startups in exchange for equity. AI-powered full-stack technical co-founder service using Next.js and Supabase.',
  areaServed: 'Worldwide',
  serviceType: 'Software Development',
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

      {/* ── Section 3: Trust ─────────────────────────────────── */}
      <TrustSection
        eyebrow={t('trustSection.eyebrow')}
        title={t('trustSection.title')}
        points={trustPoints}
      />

      {/* ── Section 4: Tech Stack Terminal ───────────────────── */}
      <TechStackTerminal
        eyebrow={t('techStack.eyebrow')}
        title={t('techStack.title')}
        subtitle={t('techStack.subtitle')}
        terminalTitle={t('techStack.terminalTitle')}
        lines={techLines}
        tools={techTools}
      />

      {/* ── Section 5: How It Works ──────────────────────────── */}
      <section className="py-24 px-4 bg-[#080808]">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal direction="up">
            <div className="mb-16 text-center">
              <p className="text-[#00E87A] font-mono text-xs uppercase tracking-[0.2em] mb-3">
                Process
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

      {/* ── Section 6: Case Studies Preview ──────────────────── */}
      <CaseStudiesPreview
        eyebrow={t('caseStudies.eyebrow')}
        title={t('caseStudies.title')}
        subtitle={t('caseStudies.subtitle')}
        comingSoon={t('caseStudies.comingSoon')}
        live={t('caseStudies.live')}
        placeholders={caseStudyPlaceholders}
      />

      {/* ── Section 7: Value Proposition ─────────────────────── */}
      <section className="py-24 px-4 bg-[#080808]">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal direction="up">
            <div className="mb-16 text-center">
              <p className="text-[#00E87A] font-mono text-xs uppercase tracking-[0.2em] mb-3">
                {t('valueProp.eyebrow')}
              </p>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#F4F4F2] mb-4 whitespace-pre-line">
                {t('valueProp.title')}
              </h2>
              <p className="text-[#6B7280] font-mono text-sm">
                {t('valueProp.subtitle')}
              </p>
            </div>
          </ScrollReveal>
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-6" staggerDelay={0.12}>
            {/* What you get */}
            <StaggerItem>
              <div className="relative flex flex-col bg-[#111827] rounded-lg border-2 border-[#00E87A] p-6 md:p-8 shadow-[0_0_32px_rgba(0,232,122,0.15)] hover:shadow-[0_0_48px_rgba(0,232,122,0.25)] transition-all duration-300 h-full">
                <p className="text-[#00E87A] font-mono text-xs uppercase tracking-widest mb-5">
                  {t('valueProp.youGetTitle')}
                </p>
                <ul className="space-y-3 flex-1">
                  {(t.raw('valueProp.youGet') as string[]).map((f) => (
                    <li key={f} className="flex items-start gap-2 font-mono text-sm text-[#9CA3AF]">
                      <span className="text-[#00E87A] flex-shrink-0 mt-0.5">✓</span>{f}
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
            {/* What we ask */}
            <StaggerItem>
              <div className="relative flex flex-col bg-[#111827] rounded-lg border border-[#374151] p-6 md:p-8 hover:shadow-[0_0_24px_rgba(0,232,122,0.08)] transition-all duration-300 h-full">
                <p className="text-[#6B7280] font-mono text-xs uppercase tracking-widest mb-5">
                  {t('valueProp.weAskTitle')}
                </p>
                <ul className="space-y-3 flex-1">
                  {(t.raw('valueProp.weAsk') as string[]).map((f) => (
                    <li key={f} className="flex items-start gap-2 font-mono text-sm text-[#9CA3AF]">
                      <span className="text-[#6B7280] flex-shrink-0 mt-0.5">→</span>{f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/${locale}/login?intent=apply`}
                  className="mt-8 block text-center bg-[#00E87A] text-[#0D0D0D] font-heading font-bold text-sm uppercase tracking-widest py-3 px-6 rounded hover:bg-[#00ff88] transition-all duration-200 shadow-[0_0_16px_rgba(0,232,122,0.4)]"
                >
                  {t('valueProp.cta')}
                </Link>
              </div>
            </StaggerItem>
          </StaggerChildren>
        </div>
      </section>

      {/* ── Section 8: Apply CTA ─────────────────────────────── */}
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
              href={`/${locale}/login?intent=apply`}
              className="inline-block bg-[#00E87A] text-[#0D0D0D] font-heading font-bold uppercase tracking-widest text-sm px-8 py-4 md:px-12 md:py-5 rounded hover:bg-[#00ff88] active:scale-95 transition-all duration-150 shadow-[0_0_32px_rgba(0,232,122,0.5)] hover:shadow-[0_0_48px_rgba(0,232,122,0.7)] mb-6"
            >
              {t('applySection.cta')}
            </Link>
            <p className="text-[#374151] font-mono text-xs">
              No equity payment until your app launches.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Section 9: Newsletter ─────────────────────────────── */}
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
