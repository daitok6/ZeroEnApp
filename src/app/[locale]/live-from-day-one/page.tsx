import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo/metadata';
import { ScrollReveal } from '@/components/marketing/scroll-reveal';
import { StaggerChildren, StaggerItem } from '@/components/marketing/stagger-children';
import { GreenGlowLine } from '@/components/marketing/green-glow-line';
import { ScreenshotImage } from '@/components/marketing/screenshot-image';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale === 'ja') {
    return buildMetadata({
      title: '開始日からすぐ使える — ZeroEn',
      description: '契約後に使えるクライアントポータル。アナリティクス・変更依頼・請求書・メッセージをひとつの場所で管理。',
      path: '/live-from-day-one',
      locale,
      ogTitle: '開始日からすぐ使える',
      ogSubtitle: '運用もぜんぶ、見える。',
    });
  }
  return buildMetadata({
    title: 'Live from Day One — ZeroEn Client Portal',
    description: 'Your operations HQ. Analytics, change requests, invoices, and messages — all in one place.',
    path: '/live-from-day-one',
    locale,
    ogTitle: 'Live from Day One',
    ogSubtitle: 'Everything visible, always.',
  });
}

const VIEW_SCREENSHOTS: Record<number, string> = {
  0: '/showcase/dashboard-analytics.png',
  1: '/showcase/dashboard-requests.png',
  2: '/showcase/dashboard-invoices.png',
  3: '/showcase/dashboard-messages.png',
};

export default async function LiveFromDayOnePage({ params }: Props) {
  await params;
  const t = await getTranslations('dashboardPreview');
  const views = [0, 1, 2, 3].map((i) => ({
    label: t(`views.${i}.label`),
    caption: t(`views.${i}.caption`),
    screenshot: VIEW_SCREENSHOTS[i],
  }));

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F4F4F2]">

      {/* Header */}
      <section className="pt-32 pb-16 px-4 text-center">
        <ScrollReveal direction="up">
          <p className="text-[#00E87A] font-mono text-xs uppercase tracking-[0.2em] mb-4">
            {t('eyebrow')}
          </p>
          <h1 className="text-4xl sm:text-5xl font-heading font-bold text-[#F4F4F2] mb-6">
            {t('heading')}
          </h1>
          <p className="text-[#6B7280] font-mono text-sm max-w-lg mx-auto">
            {t('subheading')}
          </p>
        </ScrollReveal>
        <GreenGlowLine className="mt-16" />
      </section>

      {/* Views */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <StaggerChildren className="space-y-16" staggerDelay={0.1}>
            {views.map((view, i) => (
              <StaggerItem key={view.label}>
                <div className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}>
                  {/* Screenshot placeholder / actual image */}
                  <div className="w-full md:w-3/5 flex-shrink-0">
                    <div className="relative rounded-lg overflow-hidden border border-[#1F2937] bg-[#111827] shadow-[0_0_32px_rgba(0,232,122,0.06)]">
                      {/* Browser chrome */}
                      <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0D0D0D] border-b border-[#1F2937]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#28CA41]" />
                        <span className="ml-3 text-[#4B5563] font-mono text-[10px]">
                          app.zeroen.dev/dashboard/{view.label.toLowerCase()}
                        </span>
                      </div>
                      {/* Image — shows placeholder text if screenshot not yet added */}
                      <div className="relative w-full aspect-video bg-[#0D0D0D] flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <p className="text-[#374151] font-mono text-xs">
                            {view.label} — screenshot coming soon
                          </p>
                        </div>
                        <ScreenshotImage src={view.screenshot} alt={view.label} />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00E87A]/30 to-transparent" />
                    </div>
                  </div>
                  {/* Caption */}
                  <div className="w-full md:w-2/5">
                    <p className="text-[#00E87A] font-mono text-xs uppercase tracking-widest mb-2">
                      {String(i + 1).padStart(2, '0')}
                    </p>
                    <h2 className="text-xl font-heading font-bold text-[#F4F4F2] mb-3">
                      {view.label}
                    </h2>
                    <p className="text-[#6B7280] font-mono text-sm leading-relaxed">
                      {view.caption}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 text-center">
        <GreenGlowLine className="mb-24" />
        <ScrollReveal direction="up">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#F4F4F2] mb-6">
            {t('preCtaHeading')}
          </h2>
          <Link
            href={t('ctaHref')}
            className="inline-block bg-[#00E87A] text-[#0D0D0D] font-heading font-bold uppercase tracking-widest text-sm px-8 py-4 rounded hover:bg-[#00ff88] active:scale-95 transition-all duration-150 shadow-[0_0_32px_rgba(0,232,122,0.5)]"
          >
            {t('ctaLabel')}
          </Link>
        </ScrollReveal>
      </section>

    </div>
  );
}
