import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { GreenGlowLine } from '@/components/marketing/green-glow-line';

type Props = { params: Promise<{ locale: string; slug: string }> };

// Static case study data — replace with MDX or DB fetch when content is ready
interface CaseStudy {
  slug: string;
  title: { ja: string; en: string };
  excerpt: { ja: string; en: string };
  client: string;
  plan: string;
  launchTime: { ja: string; en: string };
  url?: string;
  tags: string[];
  published: boolean; // false = noindex placeholder
  sections: {
    heading: { ja: string; en: string };
    body: { ja: string; en: string };
  }[];
}

const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'webmori',
    title: {
      ja: 'WebMori — セキュリティ・SEO監査サービスのLP制作事例',
      en: 'WebMori — LP for a Security & SEO Audit Service',
    },
    excerpt: {
      ja: '問題が起きる前に発見する。ZeroEnが3日で制作したWebMoriのランディングページ。',
      en: 'Find problems before they happen. The landing page ZeroEn built for WebMori in 3 days.',
    },
    client: 'WebMori',
    plan: 'Premium',
    launchTime: { ja: '3日', en: '3 days' },
    url: 'https://webmori.jp',
    tags: ['セキュリティ', 'SEO', 'Premium', '東京'],
    published: false, // flip to true on May 5 when case study ships
    sections: [
      {
        heading: { ja: '課題', en: 'The Challenge' },
        body: {
          ja: 'WebMoriはセキュリティ・SEO監査の専門サービスとして、明確なブランドと新規クライアントを獲得できるLPを必要としていました。既存のウェブプレゼンスは信頼性に欠け、問い合わせにつながっていませんでした。',
          en: 'WebMori needed a credible landing page to acquire new clients for their security and SEO audit services. Their existing web presence lacked trust signals and was not converting visitors to inquiries.',
        },
      },
      {
        heading: { ja: '制作プロセス', en: 'What We Built' },
        body: {
          ja: 'ZeroEnはWebMoriのブランドアイデンティティを確立し、サービス内容・実績・信頼性を伝えるランディングページを3日で制作・公開しました。Next.js + Tailwind CSSで構築し、Vercelでホスティング。毎月の改善も継続中です。',
          en: 'ZeroEn established WebMori\'s brand identity and built a landing page communicating their services, results, and credibility — shipped in 3 days. Built with Next.js + Tailwind CSS, hosted on Vercel, with monthly improvements ongoing.',
        },
      },
      {
        heading: { ja: '成果', en: 'Results' },
        body: {
          ja: '公開後、月次の問い合わせ数が増加。Premiumプランの月次監査により、サイトは継続的に改善されています。詳細な成果データは公開後に更新予定です。',
          en: 'Monthly inquiry volume increased after launch. Under the Premium plan monthly audit, the site continues to improve. Detailed outcome data will be published as part of the full case study.',
        },
      },
    ],
  },
];

function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}

export async function generateStaticParams() {
  return CASE_STUDIES.flatMap((c) =>
    ['en', 'ja'].map((locale) => ({ locale, slug: c.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) return { title: 'Case Study Not Found' };

  const meta = buildMetadata({
    title: locale === 'ja' ? cs.title.ja : cs.title.en,
    description: locale === 'ja' ? cs.excerpt.ja : cs.excerpt.en,
    path: `/cases/${slug}`,
    locale,
    ogTitle: cs.client,
    ogSubtitle: locale === 'ja' ? '制作事例 — ZeroEn' : 'Case Study — ZeroEn',
  });

  // noindex until content is fully published
  if (!cs.published) {
    return { ...meta, robots: { index: false, follow: false } };
  }
  return meta;
}

export default async function CaseStudyPage({ params }: Props) {
  const { locale, slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) notFound();

  const title = locale === 'ja' ? cs.title.ja : cs.title.en;
  const excerpt = locale === 'ja' ? cs.excerpt.ja : cs.excerpt.en;
  const launchTime = locale === 'ja' ? cs.launchTime.ja : cs.launchTime.en;
  const backLabel = locale === 'ja' ? '← 制作実績一覧' : '← Case Studies';
  const ctaLabel = locale === 'ja' ? 'ZeroEnに申し込む — 無料' : 'Apply to ZeroEn — Free';

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F4F4F2] pt-20 md:pt-24 pb-16">
      <article className="max-w-2xl mx-auto px-4 md:px-6">
        {/* Back */}
        <Link
          href={`/${locale}/cases`}
          className="inline-flex items-center gap-1 text-[#6B7280] hover:text-[#00E87A] text-xs font-mono transition-colors mb-8"
        >
          {backLabel}
        </Link>

        {/* Header */}
        <header className="mb-8 md:mb-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-[#6B7280] text-xs font-mono border border-[#374151] px-2 py-0.5 rounded">
              {cs.plan}
            </span>
            {cs.tags.map((tag) => (
              <span key={tag} className="text-[#6B7280] text-xs font-mono border border-[#374151] px-2 py-0.5 rounded">
                {tag}
              </span>
            ))}
            <span className="text-[#00E87A] text-xs font-mono ml-auto">
              {locale === 'ja' ? `公開まで ${launchTime}` : `Launched in ${launchTime}`}
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold font-heading text-[#F4F4F2] leading-tight mb-3">
            {title}
          </h1>
          <p className="text-[#9CA3AF] font-mono text-sm md:text-base">{excerpt}</p>
          {cs.url && (
            <a
              href={cs.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-3 text-[#00E87A] font-mono text-xs hover:underline"
            >
              {cs.url} ↗
            </a>
          )}
        </header>

        <hr className="border-[#374151] mb-8" />

        {/* Sections */}
        <div className="space-y-10">
          {cs.sections.map((section) => {
            const heading = locale === 'ja' ? section.heading.ja : section.heading.en;
            const body = locale === 'ja' ? section.body.ja : section.body.en;
            return (
              <section key={heading}>
                <h2 className="text-lg font-heading font-bold text-[#F4F4F2] mb-3">{heading}</h2>
                <p className="text-[#9CA3AF] font-mono text-sm leading-relaxed">{body}</p>
              </section>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="mt-12 pt-8 border-t border-[#374151]">
          <Link
            href={`/${locale}/apply`}
            className="block text-center bg-[#00E87A] text-[#0D0D0D] text-xs font-bold px-6 py-3 rounded tracking-widest uppercase hover:bg-[#00E87A]/90 transition-colors"
          >
            {ctaLabel}
          </Link>
        </div>
      </article>

      <GreenGlowLine />
    </div>
  );
}
