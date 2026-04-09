import { getAllPosts } from '@/lib/mdx/utils';
import { PostCard } from '@/components/blog/post-card';
import { GreenGlowLine } from '@/components/marketing/green-glow-line';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ja' ? 'ブログ — ZeroEn' : 'Blog — ZeroEn',
    description: locale === 'ja'
      ? 'ビルドログ、ケーススタディ、創業者向けコンテンツ'
      : 'Build logs, case studies, and founder content from ZeroEn.',
  };
}

type Props = { params: Promise<{ locale: string }> };

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  const posts = getAllPosts(locale);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F4F4F2] pt-20 md:pt-24 pb-16">
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

        {posts.length === 0 ? (
          <div className="border border-[#374151] rounded-lg p-8 bg-[#111827] text-center">
            <p className="text-[#6B7280] font-mono text-sm">$ ls ./posts</p>
            <p className="text-[#374151] font-mono text-sm mt-2">
              {locale === 'ja' ? '// まもなく投稿予定...' : '// posts coming soon...'}
            </p>
          </div>
        ) : (
          /* Mobile: 1-col, md+: 2-col grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
