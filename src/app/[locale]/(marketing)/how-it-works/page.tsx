import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Phone, FileText, Zap, Code2, Rocket } from 'lucide-react';
import { ScrollReveal } from '@/components/marketing/scroll-reveal';
import { GreenGlowLine } from '@/components/marketing/green-glow-line';
import { buildMetadata } from '@/lib/seo/metadata';
import type { LucideIcon } from 'lucide-react';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale === 'ja') {
    return buildMetadata({
      title: 'サービスの流れ — ZeroEn',
      description: '初回スコーピングコールからリリースまで、5つのステップ。固定価格、明確なマイルストーン支払い。',
      path: '/how-it-works',
      locale,
      ogTitle: 'サービスの流れ',
      ogSubtitle: '5ステップで初回コールからリリースまで',
    });
  }
  return buildMetadata({
    title: 'How ZeroEn Works — Scoping Call to Launch',
    description: 'Five steps from first call to live bilingual product. Fixed price, clear milestone payments, no surprises.',
    path: '/how-it-works',
    locale,
    ogTitle: 'How ZeroEn Works',
    ogSubtitle: '5 steps from scoping call to launch',
  });
}

export default async function HowItWorksPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('howItWorks');

  const steps = t.raw('steps') as { number: string; name: string; desc: string }[];
  const scopingCallHref = locale === 'ja' ? '/ja/scoping-call' : '/scoping-call';
  const stepIcons: LucideIcon[] = [Phone, FileText, Zap, Code2, Rocket];

  return (
    <div className="bg-[#0D0D0D] text-[#F4F4F2] min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-16 px-4 text-center">
        <ScrollReveal direction="up">
          <p className="text-[#00E87A] font-mono text-xs uppercase tracking-[0.2em] mb-4">
            {t('eyebrow')}
          </p>
          <h1 className="text-4xl sm:text-6xl font-heading font-bold text-[#F4F4F2] mb-6">
            {t('title')}
          </h1>
          <p className="text-[#6B7280] font-mono text-sm max-w-xl mx-auto">
            {t('subtitle')}
          </p>
        </ScrollReveal>
        <GreenGlowLine className="mt-16" />
      </section>

      {/* Vertical timeline */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <div
              className="absolute left-[2.75rem] top-0 bottom-0 w-px"
              style={{
                background:
                  'repeating-linear-gradient(to bottom, #00E87A 0px, #00E87A 8px, transparent 8px, transparent 16px)',
                opacity: 0.35,
              }}
            />
            <div className="space-y-0">
              {steps.map((step, index) => {
                const StepIcon = stepIcons[index];
                return (
                <ScrollReveal key={step.number} direction="up" delay={index * 0.07}>
                  <div className="relative flex gap-8 pb-14 last:pb-0">
                    <div className="relative z-10 flex-shrink-0 w-20 flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full border border-[#00E87A]/40 bg-[#0D0D0D] flex items-center justify-center shadow-[0_0_12px_rgba(0,232,122,0.3)]">
                        <span className="text-[#00E87A] font-mono text-xs font-bold">
                          {step.number}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 bg-[#111827] border border-[#1F2937] rounded-lg p-6 hover:border-[#00E87A]/30 hover:shadow-[0_0_20px_rgba(0,232,122,0.07)] transition-all duration-300">
                      <div className="flex items-center gap-1.5 mb-4">
                        <div className="w-2 h-2 rounded-full bg-[#374151]" />
                        <div className="w-2 h-2 rounded-full bg-[#374151]" />
                        <div className="w-2 h-2 rounded-full bg-[#374151]" />
                        <span className="ml-2 text-[#374151] font-mono text-xs">
                          step_{step.number}.sh
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-[#00E87A] font-mono text-xs font-bold tracking-widest">
                          ~/{step.number}
                        </span>
                        <StepIcon className="w-4 h-4 text-[#00E87A]/60" strokeWidth={1.5} />
                        <h2 className="text-[#F4F4F2] font-heading font-bold text-lg tracking-wider">
                          {step.name}
                        </h2>
                      </div>
                      <p className="text-[#9CA3AF] font-mono text-sm leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <GreenGlowLine className="mb-24" />
        <div className="max-w-2xl mx-auto text-center">
          <ScrollReveal direction="up">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#F4F4F2] mb-6">
              {t('cta.title')}
            </h2>
            <p className="text-[#6B7280] font-mono text-sm mb-10">
              {t('cta.subtitle')}
            </p>
            <a
              href={scopingCallHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#00E87A] text-[#0D0D0D] font-heading font-bold uppercase tracking-widest text-sm px-12 py-5 rounded hover:bg-[#00ff88] active:scale-95 transition-all duration-150 shadow-[0_0_32px_rgba(0,232,122,0.5)] hover:shadow-[0_0_48px_rgba(0,232,122,0.7)]"
            >
              {t('cta.button')}
            </a>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
