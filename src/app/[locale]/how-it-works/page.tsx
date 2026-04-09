import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ScrollReveal } from '@/components/marketing/scroll-reveal';
import { GreenGlowLine } from '@/components/marketing/green-glow-line';
import { buildMetadata } from '@/lib/seo/metadata';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale === 'ja') {
    return buildMetadata({
      title: 'ZeroEnの仕組み — アイデアから立ち上げまで',
      description:
        'アイデアの発掘からエクイティ契約、開発、継続的な成長までの9ステップの旅をご覧ください。',
      path: '/how-it-works',
      locale,
      ogTitle: 'ZeroEnの仕組み',
      ogSubtitle: 'アイデアから立ち上げまでの9ステップ',
    });
  }
  return buildMetadata({
    title: 'How ZeroEn Works — From Idea to Launch',
    description:
      'See the 9-step journey from initial discovery to equity agreement, development, and ongoing growth.',
    path: '/how-it-works',
    locale,
    ogTitle: 'How ZeroEn Works',
    ogSubtitle: 'From Idea to Launch in 9 Steps',
  });
}

const STEP_KEYS = [
  'discover',
  'apply',
  'score',
  'onboard',
  'build',
  'launch',
  'operate',
  'grow',
  'upsell',
] as const;

export default async function HowItWorksPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('howItWorks');

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

      {/* ── Vertical Timeline ─────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Vertical dashed green line */}
            <div
              className="absolute left-[2.75rem] top-0 bottom-0 w-px"
              style={{
                background:
                  'repeating-linear-gradient(to bottom, #00E87A 0px, #00E87A 8px, transparent 8px, transparent 16px)',
                opacity: 0.35,
              }}
            />

            <div className="space-y-0">
              {STEP_KEYS.map((key, index) => {
                const num = String(index + 1).padStart(2, '0');
                return (
                  <ScrollReveal
                    key={key}
                    direction="up"
                    delay={index * 0.07}
                  >
                    <div className="relative flex gap-8 pb-14 last:pb-0">
                      {/* Step number */}
                      <div className="relative z-10 flex-shrink-0 w-22 flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full border border-[#00E87A]/40 bg-[#0D0D0D] flex items-center justify-center shadow-[0_0_12px_rgba(0,232,122,0.3)]">
                          <span className="text-[#00E87A] font-mono text-xs font-bold">
                            {num}
                          </span>
                        </div>
                      </div>

                      {/* Card */}
                      <div className="flex-1 min-w-0 bg-[#111827] border border-[#1F2937] rounded-lg p-6 hover:border-[#00E87A]/30 hover:shadow-[0_0_20px_rgba(0,232,122,0.07)] transition-all duration-300">
                        {/* Terminal-style header bar */}
                        <div className="flex items-center gap-1.5 mb-4">
                          <div className="w-2 h-2 rounded-full bg-[#374151]" />
                          <div className="w-2 h-2 rounded-full bg-[#374151]" />
                          <div className="w-2 h-2 rounded-full bg-[#374151]" />
                          <span className="ml-2 text-[#374151] font-mono text-xs">
                            step_{num}.sh
                          </span>
                        </div>

                        <div className="flex items-baseline gap-3 mb-3">
                          <span className="text-[#00E87A] font-mono text-xs font-bold tracking-widest">
                            ~/{num}
                          </span>
                          <h2 className="text-[#F4F4F2] font-mono font-bold text-lg tracking-wider">
                            {t(`steps.${key}.name`)}
                          </h2>
                        </div>
                        <p className="text-[#9CA3AF] font-mono text-sm leading-relaxed">
                          {t(`steps.${key}.desc`)}
                        </p>
                        {key === 'apply' && (
                          <span className="inline-block mt-3 text-[#00E87A] font-mono text-xs border border-[#00E87A]/30 rounded px-2 py-1">
                            {t('steps.apply.badge')}
                          </span>
                        )}
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
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
