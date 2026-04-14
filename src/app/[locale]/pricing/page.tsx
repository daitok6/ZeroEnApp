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
    ogSubtitle: locale === 'ja' ? '前金0円。月¥5,000から。' : 'Free LP. ¥5,000/month.',
  });
}

export default async function PricingPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pricing' });

  const basicItems = t.raw('basic.items') as string[];
  const premiumItems = t.raw('premium.items') as string[];
  const changeItems = t.raw('changeItems') as { size: string; price: string; desc: string }[];
  const faqs = t.raw('faqs') as { q: string; a: string }[];

  return (
    <div className="bg-[#0D0D0D] text-[#F4F4F2] pt-24">

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

      {/* Pricing cards */}
      <section className="pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-6" staggerDelay={0.1}>
            {/* Basic */}
            <StaggerItem>
              <div className="flex flex-col bg-[#111827] rounded-lg border border-[#374151] p-8 h-full hover:shadow-[0_0_24px_rgba(0,232,122,0.08)] transition-all duration-300">
                <p className="text-[#6B7280] font-mono text-xs uppercase tracking-widest mb-2">
                  {t('basic.name')}
                </p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-[#F4F4F2] font-heading font-bold text-4xl">{t('basic.price')}</span>
                  <span className="text-[#6B7280] font-mono text-sm">{t('basic.period')}</span>
                </div>
                <p className="text-[#00E87A] font-mono text-xs mb-6">{t('basic.setup')}</p>
                <ul className="space-y-3 flex-1 mb-8">
                  {basicItems.map((item) => (
                    <li key={item} className="flex items-start gap-2 font-mono text-sm text-[#9CA3AF]">
                      <span className="text-[#00E87A] flex-shrink-0 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/${locale}/apply`}
                  className="block text-center border border-[#00E87A] text-[#00E87A] font-heading font-bold text-sm uppercase tracking-widest py-3 px-6 rounded hover:bg-[#00E87A]/10 transition-all duration-200"
                >
                  {t('basic.cta')}
                </Link>
              </div>
            </StaggerItem>

            {/* Premium */}
            <StaggerItem>
              <div className="flex flex-col bg-[#111827] rounded-lg border-2 border-[#00E87A] p-8 h-full shadow-[0_0_32px_rgba(0,232,122,0.15)] hover:shadow-[0_0_48px_rgba(0,232,122,0.25)] transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[#00E87A] font-mono text-xs uppercase tracking-widest">
                    {t('premium.name')}
                  </p>
                  <span className="text-[#0D0D0D] bg-[#00E87A] font-mono text-xs font-bold px-2 py-0.5 rounded">
                    {t('premium.badge')}
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-[#F4F4F2] font-heading font-bold text-4xl">{t('premium.price')}</span>
                  <span className="text-[#6B7280] font-mono text-sm">{t('premium.period')}</span>
                </div>
                <p className="text-[#00E87A] font-mono text-xs mb-6">{t('premium.setup')}</p>
                <ul className="space-y-3 flex-1 mb-8">
                  {premiumItems.map((item) => (
                    <li key={item} className="flex items-start gap-2 font-mono text-sm text-[#9CA3AF]">
                      <span className="text-[#00E87A] flex-shrink-0 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/${locale}/apply`}
                  className="block text-center bg-[#00E87A] text-[#0D0D0D] font-heading font-bold text-sm uppercase tracking-widest py-3 px-6 rounded hover:bg-[#00ff88] transition-all duration-200 shadow-[0_0_16px_rgba(0,232,122,0.4)]"
                >
                  {t('premium.cta')}
                </Link>
              </div>
            </StaggerItem>
          </StaggerChildren>

          <p className="text-center text-[#374151] font-mono text-xs mt-6">{t('minNote')}</p>
        </div>
      </section>

      {/* Per-request pricing */}
      <section className="pb-24 px-4 bg-[#080808]">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal direction="up">
            <h2 className="text-2xl font-heading font-bold text-[#F4F4F2] mb-8 text-center">
              {t('changeTitle')}
            </h2>
          </ScrollReveal>
          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-3 gap-4" staggerDelay={0.08}>
            {changeItems.map((item) => (
              <StaggerItem key={item.size}>
                <div className="bg-[#111827] rounded-lg border border-[#374151] p-6 text-center">
                  <p className="text-[#6B7280] font-mono text-xs uppercase tracking-widest mb-2">{item.size}</p>
                  <p className="text-[#00E87A] font-heading font-bold text-2xl mb-2">{item.price}</p>
                  <p className="text-[#9CA3AF] font-mono text-xs">{item.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      <GreenGlowLine />

      {/* FAQ */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto">
          <ScrollReveal direction="up">
            <h2 className="text-2xl font-heading font-bold text-[#F4F4F2] mb-12 text-center">
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
        <Link
          href={`/${locale}/apply`}
          className="inline-block bg-[#00E87A] text-[#0D0D0D] font-heading font-bold uppercase tracking-widest text-sm px-10 py-4 rounded hover:bg-[#00ff88] active:scale-95 transition-all duration-150 shadow-[0_0_32px_rgba(0,232,122,0.5)]"
        >
          {t('basic.cta')}
        </Link>
      </section>
    </div>
  );
}
