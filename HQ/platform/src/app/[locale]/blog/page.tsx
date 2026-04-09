import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ja' ? 'ブログ — ZeroEn' : 'Blog — ZeroEn',
    description: locale === 'ja'
      ? 'ZeroEnのビルドログ、ケーススタディ、創業者向けコンテンツ'
      : 'ZeroEn build logs, case studies, and founder content.',
  };
}

type Props = { params: Promise<{ locale: string }> };

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F4F4F2] pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <p className="text-[#00E87A] text-xs font-mono uppercase tracking-widest mb-4">
          {locale === 'ja' ? 'ブログ' : 'Blog'}
        </p>
        <h1 className="text-4xl md:text-5xl font-bold font-mono text-[#F4F4F2] mb-6">
          {locale === 'ja' ? 'ビルドログ' : 'Build Log'}
        </h1>
        <p className="text-[#9CA3AF] font-mono text-lg mb-12">
          {locale === 'ja'
            ? '構築中。まもなく公開。'
            : "Posts coming soon. We're building in public."}
        </p>
        <div className="border border-[#374151] rounded-lg p-8 bg-[#111827] text-left font-mono">
          <p className="text-[#6B7280] text-sm">$ ls ./posts</p>
          <p className="text-[#374151] text-sm mt-2">
            {locale === 'ja' ? '// まもなく投稿予定...' : '// posts coming soon...'}
          </p>
        </div>
      </div>
    </div>
  );
}
