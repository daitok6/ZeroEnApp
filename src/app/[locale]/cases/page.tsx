import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { CaseStudiesPreview } from '@/components/marketing/case-studies-preview';
import { GreenGlowLine } from '@/components/marketing/green-glow-line';
import { ScrollReveal } from '@/components/marketing/scroll-reveal';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale === 'ja') {
    return buildMetadata({
      title: '制作実績 — ZeroEn',
      description: 'ZeroEnが制作したランディングページの一覧。コーチ・コンサルタント・セラピスト向けLP。前金0円、月¥5,000から。',
      path: '/cases',
      locale,
      ogTitle: 'ZeroEn 制作実績',
      ogSubtitle: '前金0円。月¥5,000から。',
    });
  }
  return buildMetadata({
    title: 'Case Studies — ZeroEn',
    description: 'Landing pages built by ZeroEn for coaches, consultants, and therapists. No upfront cost, ¥5,000/month.',
    path: '/cases',
    locale,
    ogTitle: 'ZeroEn Case Studies',
    ogSubtitle: 'Free LP. ¥5,000/month.',
  });
}

export default async function CasesPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home.caseStudies' });

  const placeholders = t.raw('placeholders') as {
    name: string;
    desc: string;
    meta: string[];
    url: string;
    screenshot: string;
    label: string;
  }[];

  return (
    <div className="bg-[#0D0D0D] text-[#F4F4F2] min-h-screen pt-24">
      <CaseStudiesPreview
        eyebrow={t('eyebrow')}
        title={t('title')}
        subtitle={t('subtitle')}
        comingSoon={t('comingSoon')}
        live={t('live')}
        placeholders={placeholders}
      />

      <GreenGlowLine />

      {/* CTA */}
      <section className="py-24 px-4 text-center">
        <ScrollReveal direction="up">
          <p className="text-[#6B7280] font-mono text-sm mb-8">
            {locale === 'ja'
              ? 'あなたのビジネスも、ここに載りませんか。'
              : 'Want your business featured here?'}
          </p>
          <Link
            href={`/${locale}/apply`}
            className="inline-block bg-[#00E87A] text-[#0D0D0D] font-heading font-bold uppercase tracking-widest text-sm px-10 py-4 rounded hover:bg-[#00ff88] active:scale-95 transition-all duration-150 shadow-[0_0_32px_rgba(0,232,122,0.5)]"
          >
            {locale === 'ja' ? '無料で申し込む' : 'Apply for free'}
          </Link>
        </ScrollReveal>
      </section>
    </div>
  );
}
