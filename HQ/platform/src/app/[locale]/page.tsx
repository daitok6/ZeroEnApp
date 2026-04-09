import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Hero } from '@/components/marketing/hero';
import { ScrollReveal } from '@/components/marketing/scroll-reveal';
import { StaggerChildren, StaggerItem } from '@/components/marketing/stagger-children';
import { GreenGlowLine } from '@/components/marketing/green-glow-line';

type Props = {
  params: Promise<{ locale: string }>;
};

const STEPS = [
  {
    id: '01',
    name: 'DISCOVER',
    desc: 'Build-in-public content, social media, communities, outreach',
  },
  {
    id: '02',
    name: 'APPLY',
    desc: 'Detailed application on zeroen.dev',
  },
  {
    id: '03',
    name: 'SCORE',
    desc: 'Viability + Commitment + Feasibility + Market scoring',
  },
  {
    id: '04',
    name: 'ONBOARD',
    desc: 'Questionnaire → kickoff call → scope locked',
  },
  {
    id: '05',
    name: 'BUILD',
    desc: '/new-client → MVP development begins',
  },
  {
    id: '06',
    name: 'LAUNCH',
    desc: 'Deploy to Vercel → 30 days free support',
  },
  {
    id: '07',
    name: 'OPERATE',
    desc: '$50/mo begins → monthly analytics → 1 free fix/mo',
  },
  {
    id: '08',
    name: 'GROW',
    desc: 'Per-request charges for new features → rev share active',
  },
  {
    id: '09',
    name: 'UPSELL',
    desc: 'Analytics surface issues → premium services',
  },
];

const MVP_FEATURES = [
  'Full-stack MVP',
  'Supabase + Next.js',
  'Deploy to Vercel',
  '30 days support',
  '10% equity agreement',
];

const PLATFORM_FEATURES = [
  'Everything in MVP Build',
  'Hosting on our Vercel',
  '1 small fix/month',
  'Monthly analytics PDF',
  'Client dashboard access',
];

const PER_REQUEST_FEATURES = [
  'Small changes: $50–100',
  'Medium features: $200–500',
  'Large builds: $500–2,000',
  'Quoted upfront',
  'No surprises',
];

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('home');

  const heroTexts = [
    t('hero.line1'),
    t('hero.line2'),
    t('hero.line3'),
  ];

  return (
    <div className="bg-[#0D0D0D] text-[#F4F4F2]">
      {/* ── Section 1: Hero ─────────────────────────────────── */}
      <Hero
        texts={heroTexts}
        subtitle={t('hero.subtitle')}
        ctaText={t('hero.cta')}
        locale={locale}
      />

      {/* ── Section 2: How It Works ──────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal direction="up">
            <div className="mb-16 text-center">
              <p className="text-[#00E87A] font-mono text-xs uppercase tracking-[0.2em] mb-3">
                Process
              </p>
              <h2 className="text-3xl sm:text-4xl font-mono font-bold text-[#F4F4F2] mb-4">
                {t('howItWorks.title')}
              </h2>
              <p className="text-[#6B7280] font-mono text-sm">
                {t('howItWorks.subtitle')}
              </p>
            </div>
          </ScrollReveal>

          {/* Vertical timeline */}
          <div className="relative">
            {/* Left border line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#00E87A]/80 via-[#00E87A]/30 to-transparent" />

            <StaggerChildren className="space-y-0" staggerDelay={0.08}>
              {STEPS.map((step) => (
                <StaggerItem key={step.id}>
                  <div className="relative flex gap-6 pb-10 last:pb-0">
                    {/* Step number dot */}
                    <div className="relative z-10 flex-shrink-0 w-12 flex items-start justify-center pt-1">
                      <div className="w-3 h-3 rounded-full bg-[#00E87A] shadow-[0_0_8px_rgba(0,232,122,0.6)] mt-1" />
                    </div>

                    {/* Content */}
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

      {/* ── Section 3: Pricing ───────────────────────────────── */}
      <section className="py-24 px-4 bg-[#080808]">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal direction="up">
            <div className="mb-16 text-center">
              <p className="text-[#00E87A] font-mono text-xs uppercase tracking-[0.2em] mb-3">
                Pricing
              </p>
              <h2 className="text-3xl sm:text-4xl font-mono font-bold text-[#F4F4F2] mb-4">
                {t('pricing.title')}
              </h2>
              <p className="text-[#6B7280] font-mono text-sm">
                {t('pricing.subtitle')}
              </p>
            </div>
          </ScrollReveal>

          <StaggerChildren
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
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
                <div className="mb-6">
                  <p className="text-[#6B7280] font-mono text-xs uppercase tracking-widest mb-2">
                    MVP Build
                  </p>
                  <div className="text-4xl font-mono font-bold text-[#F4F4F2] mb-1">$0</div>
                  <p className="text-[#6B7280] font-mono text-sm">Free for founders</p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {MVP_FEATURES.map((f) => (
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
                  Apply Free
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
                ">
                  Most Popular
                </div>

                <div className="mb-6">
                  <p className="text-[#00E87A] font-mono text-xs uppercase tracking-widest mb-2">
                    Platform
                  </p>
                  <div className="text-4xl font-mono font-bold text-[#F4F4F2] mb-1">$50<span className="text-xl text-[#6B7280]">/mo</span></div>
                  <p className="text-[#6B7280] font-mono text-sm">After your MVP launches</p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {PLATFORM_FEATURES.map((f) => (
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
                  Get Started
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
                <div className="mb-6">
                  <p className="text-[#6B7280] font-mono text-xs uppercase tracking-widest mb-2">
                    Per-Request
                  </p>
                  <div className="text-4xl font-mono font-bold text-[#F4F4F2] mb-1">From $50</div>
                  <p className="text-[#6B7280] font-mono text-sm">For extra work</p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {PER_REQUEST_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-2 font-mono text-sm text-[#9CA3AF]">
                      <span className="text-[#00E87A] flex-shrink-0 mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/${locale}/pricing`}
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
                  Learn More
                </Link>
              </div>
            </StaggerItem>
          </StaggerChildren>
        </div>
      </section>

      {/* ── Section 4: Apply CTA ─────────────────────────────── */}
      <section className="py-24 px-4">
        <GreenGlowLine className="mb-24" />
        <div className="max-w-2xl mx-auto text-center">
          <ScrollReveal direction="up">
            <h2 className="text-4xl sm:text-5xl font-mono font-bold text-[#F4F4F2] mb-6">
              {t('applySection.title')}
            </h2>
            <p className="text-[#6B7280] font-mono text-sm mb-10">
              {t('applySection.subtitle')}
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
                mb-6
              "
            >
              {t('applySection.cta')}
            </Link>

            <p className="text-[#374151] font-mono text-xs">
              No equity payment until your app launches.
            </p>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
