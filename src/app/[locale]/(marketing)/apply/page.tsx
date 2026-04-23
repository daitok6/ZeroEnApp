import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { GreenGlowLine } from '@/components/marketing/green-glow-line';
import { ScrollReveal } from '@/components/marketing/scroll-reveal';
import { ApplyForm } from './_form';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'lpApply' });
  return buildMetadata({
    title: t('meta.title'),
    description: t('meta.description'),
    path: '/apply',
    locale,
    ogTitle: t('title'),
    ogSubtitle: t('subtitle'),
  });
}

export default async function ApplyPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'lpApply' });

  // Pass serialisable message object to client component to avoid calling
  // getTranslations() in a Client Component (not allowed in Next.js 16).
  const messages = {
    form: {
      name: t('form.name'),
      namePlaceholder: t('form.namePlaceholder'),
      email: t('form.email'),
      emailPlaceholder: t('form.emailPlaceholder'),
      company: t('form.company'),
      companyPlaceholder: t('form.companyPlaceholder'),
      blurb: t('form.blurb'),
      blurbPlaceholder: t('form.blurbPlaceholder'),
      consent: t('form.consent'),
      submit: t('form.submit'),
      submitting: t('form.submitting'),
      fieldRequired: t('form.fieldRequired'),
      emailInvalid: t('form.emailInvalid'),
    },
  };

  return (
    <div className="bg-[#0D0D0D] text-[#F4F4F2] min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-12 px-4 text-center">
        <ScrollReveal direction="up">
          <p className="text-[#00E87A] font-mono text-xs uppercase tracking-[0.2em] mb-4">
            {t('eyebrow')}
          </p>
          <h1 className="text-3xl sm:text-5xl font-heading font-bold text-[#F4F4F2] mb-4">
            {t('title')}
          </h1>
          <p className={`text-[#6B7280] font-mono text-sm max-w-xl mx-auto leading-relaxed ${locale === 'ja' ? 'font-jp' : ''}`}>
            {t('subtitle')}
          </p>
        </ScrollReveal>
        <GreenGlowLine className="mt-12" />
      </section>

      {/* Form */}
      <section className="py-12 px-4">
        <div className="max-w-lg mx-auto">
          <ScrollReveal direction="up" delay={0.1}>
            <div className="bg-[#111827] border border-[#1F2937] rounded-lg p-6 sm:p-8">
              {/* Terminal header */}
              <div className="flex items-center gap-1.5 mb-6">
                <div className="w-2.5 h-2.5 rounded-full bg-[#374151]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#374151]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#374151]" />
                <span className="ml-2 text-[#4B5563] font-mono text-xs">apply.sh</span>
              </div>
              <ApplyForm locale={locale} messages={messages} />
            </div>
          </ScrollReveal>

          {/* Trust signal */}
          <p className="text-center text-[#4B5563] font-mono text-xs mt-6 leading-relaxed">
            {locale === 'ja'
              ? '48時間以内にご返信 · スコーピングコールから始めます'
              : 'Reply within 48h · Starts with a scoping call'}
          </p>
        </div>
      </section>
    </div>
  );
}
