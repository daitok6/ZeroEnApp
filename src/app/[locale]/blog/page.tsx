import { getAllPosts } from '@/lib/mdx/utils';
import type { BlogCategory } from '@/lib/mdx/utils';
import { PostCard } from '@/components/blog/post-card';
import { GreenGlowLine } from '@/components/marketing/green-glow-line';
import { NewsletterSection } from '@/components/marketing/newsletter-section';
import Link from 'next/link';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (locale === 'ja') {
    return buildMetadata({
      title: 'ブログ — ZeroEnのビルドインパブリック',
      description:
        'AIを活用したスタートアップを構築するZeroEnの旅を追う。テクニカルな深掘り、創業者ストーリー、ビルドインパブリックの更新。',
      path: '/blog',
      locale,
      ogTitle: 'ZeroEn Blog',
      ogSubtitle: 'ビルドインパブリック',
    });
  }
  return buildMetadata({
    title: 'Blog — ZeroEn Build in Public',
    description:
      "Follow ZeroEn's journey building AI-powered startups. Technical deep-dives, founder stories, and build-in-public updates.",
    path: '/blog',
    locale,
    ogTitle: 'ZeroEn Blog',
    ogSubtitle: 'Build in Public',
  });
}

const CATEGORIES: { value: BlogCategory | 'all'; en: string; ja: string }[] = [
  { value: 'all', en: 'All', ja: 'すべて' },
  { value: 'build-update', en: 'Build Update', ja: 'ビルド更新' },
  { value: 'case-study', en: 'Case Study', ja: 'ケーススタディ' },
  { value: 'operator-log', en: 'Operator Log', ja: 'オペレーターログ' },
  { value: 'tutorial', en: 'Tutorial', ja: 'チュートリアル' },
];

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
};

export default async function BlogPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { category } = await searchParams;

  const allPosts = getAllPosts(locale);
  const filteredPosts =
    category && category !== 'all'
      ? allPosts.filter((p) => p.category === category)
      : allPosts;

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F4F4F2]">
      <div className="pt-20 md:pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          {/* Hero */}
          <div className="text-center mb-10 md:mb-14">
            <p className="text-[#00E87A] text-xs font-mono uppercase tracking-widest mb-3">
              {locale === 'ja' ? 'ブログ' : 'Blog'}
            </p>
            <h1 className="text-3xl md:text-5xl font-bold font-mono text-[#F4F4F2] mb-4">
              {locale === 'ja' ? 'ビルドログ' : 'Build Log'}
            </h1>
            <p className="text-[#9CA3AF] font-mono text-base md:text-lg max-w-md mx-auto">
              {locale === 'ja'
                ? '構築の過程、学び、失敗を公開する'
                : 'Building in public — the wins, losses, and lessons'}
            </p>
          </div>

          <GreenGlowLine className="mb-10 md:mb-14" />

          {/* Category filter tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map((cat) => {
              const isActive = (category ?? 'all') === cat.value;
              return (
                <Link
                  key={cat.value}
                  href={
                    cat.value === 'all'
                      ? `/${locale}/blog`
                      : `/${locale}/blog?category=${cat.value}`
                  }
                  className={`
                    font-mono text-xs uppercase tracking-wider px-3 py-1.5 rounded border transition-all duration-150
                    ${isActive
                      ? 'border-[#00E87A] text-[#00E87A] bg-[#00E87A]/5'
                      : 'border-[#374151] text-[#6B7280] hover:border-[#00E87A]/40 hover:text-[#9CA3AF]'
                    }
                  `}
                >
                  {locale === 'ja' ? cat.ja : cat.en}
                </Link>
              );
            })}
          </div>

          {/* Posts grid */}
          {filteredPosts.length === 0 ? (
            <div className="border border-[#374151] rounded-lg p-8 bg-[#111827] text-center">
              <p className="text-[#6B7280] font-mono text-sm">$ ls ./posts</p>
              <p className="text-[#374151] font-mono text-sm mt-2">
                {locale === 'ja' ? '// まもなく投稿予定...' : '// posts coming soon...'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {filteredPosts.map((post) => (
                <PostCard key={post.slug} post={post} locale={locale} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Newsletter section */}
      <NewsletterSection
        eyebrow={locale === 'ja' ? 'ニュースレター' : 'Newsletter'}
        title={locale === 'ja' ? '週次ビルドアップデートを受け取る。' : 'Get weekly build updates.'}
        subtitle={
          locale === 'ja'
            ? 'リアルな数字、リアルなクライアント、無駄なし。毎週月曜日配信。'
            : 'Real numbers, real clients, no fluff. Every Monday.'
        }
        note={locale === 'ja' ? 'スパムなし。いつでも解除可能。' : 'No spam. Unsubscribe anytime.'}
        locale={locale}
      />
    </div>
  );
}
