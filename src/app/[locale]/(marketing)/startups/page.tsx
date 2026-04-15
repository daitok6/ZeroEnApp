import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import type { Metadata } from 'next';
import { GreenGlowLine } from '@/components/marketing/green-glow-line';
import { ScrollReveal } from '@/components/marketing/scroll-reveal';
import { StaggerChildren, StaggerItem } from '@/components/marketing/stagger-children';

type Props = { params: Promise<{ locale: string }> };

// noindex — equity pitch is gated, not for search engines
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title =
    locale === 'ja'
      ? 'スタートアップ向け — ZeroEn'
      : 'For Startups — ZeroEn';
  return {
    title,
    robots: { index: false, follow: false },
  };
}

export default async function StartupsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'startups' });

  const whatItems = t.raw('what.items') as string[];
  const askItems = t.raw('ask.items') as string[];

  return (
    <div className="bg-[#0D0D0D] text-[#F4F4F2] min-h-screen pt-24">

      {/* Hero */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal direction="up">
            <div className="flex items-center justify-center gap-3 mb-6">
              <p className="text-[#00E87A] font-mono text-xs uppercase tracking-[0.2em]">
                {t('eyebrow')}
              </p>
              <span className="text-[#0D0D0D] bg-[#00E87A] font-mono text-xs font-bold px-2 py-0.5 rounded">
                {t('badge')}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-[#F4F4F2] mb-6 whitespace-pre-line">
              {t('title')}
            </h1>
            <p className="text-[#6B7280] font-mono text-sm max-w-xl mx-auto leading-relaxed">
              {t('subtitle')}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* What / Ask */}
      <section className="pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-6" staggerDelay={0.1}>
            {/* What we build */}
            <StaggerItem>
              <div className="bg-[#111827] border border-[#374151] rounded-lg p-8 h-full">
                <p className="text-[#00E87A] font-mono text-xs uppercase tracking-widest mb-4">
                  {t('what.heading')}
                </p>
                <ul className="space-y-3">
                  {whatItems.map((item) => (
                    <li key={item} className="flex items-start gap-2 font-mono text-sm text-[#9CA3AF]">
                      <span className="text-[#00E87A] flex-shrink-0 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>

            {/* What we ask */}
            <StaggerItem>
              <div className="bg-[#111827] border border-[#374151] rounded-lg p-8 h-full">
                <p className="text-[#6B7280] font-mono text-xs uppercase tracking-widest mb-4">
                  {t('ask.heading')}
                </p>
                <ul className="space-y-3">
                  {askItems.map((item) => (
                    <li key={item} className="flex items-start gap-2 font-mono text-sm text-[#9CA3AF]">
                      <span className="text-[#374151] flex-shrink-0 mt-0.5">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          </StaggerChildren>

          {/* LP plan nudge */}
          <p className="text-center text-[#374151] font-mono text-xs mt-8">
            {t('note')}{' '}
            <Link href={`/${locale}/pricing`} className="text-[#00E87A] hover:underline">
              {t('lpCta')}
            </Link>
          </p>
        </div>
      </section>

      <GreenGlowLine />

      {/* Get started CTA */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <ScrollReveal direction="up">
            <h2 className="text-2xl font-heading font-bold text-[#F4F4F2] mb-6">
              {t('applyHeading')}
            </h2>
            <Link
              href={`/${locale}/login`}
              className="inline-block bg-[#00E87A] text-[#0D0D0D] font-heading font-bold text-sm px-8 py-3 rounded tracking-widest uppercase hover:bg-[#00E87A]/90 transition-colors"
            >
              {locale === 'ja' ? 'はじめる →' : 'Get Started →'}
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
