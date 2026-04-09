import Link from 'next/link';
import type { PostMeta } from '@/lib/mdx/utils';

const CATEGORY_LABELS: Record<string, { en: string; ja: string }> = {
  'build-update': { en: 'Build Update', ja: 'ビルド更新' },
  'case-study': { en: 'Case Study', ja: 'ケーススタディ' },
  'operator-log': { en: 'Operator Log', ja: 'オペレーターログ' },
  'tutorial': { en: 'Tutorial', ja: 'チュートリアル' },
};

interface PostCardProps {
  post: PostMeta;
  locale: string;
}

export function PostCard({ post, locale }: PostCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString(
    locale === 'ja' ? 'ja-JP' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' },
  );

  const categoryLabel = post.category
    ? (CATEGORY_LABELS[post.category]?.[locale as 'en' | 'ja'] ?? post.category)
    : null;

  return (
    <Link
      href={`/${locale}/blog/${post.slug}`}
      className="group block border border-[#374151] rounded-lg p-5 md:p-6 bg-[#111827] hover:border-[#00E87A]/50 transition-all"
    >
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="text-[#00E87A] text-xs font-mono">→</span>
        <time className="text-[#6B7280] text-xs font-mono">{formattedDate}</time>
        {categoryLabel && (
          <>
            <span className="text-[#374151]">·</span>
            <span className="text-[#00E87A] text-[10px] font-mono border border-[#00E87A]/30 bg-[#00E87A]/5 px-1.5 py-0.5 rounded uppercase tracking-wider">
              {categoryLabel}
            </span>
          </>
        )}
      </div>
      <h2 className="text-[#F4F4F2] font-mono font-bold text-base md:text-lg mb-2 group-hover:text-[#00E87A] transition-colors leading-snug">
        {post.title}
      </h2>
      <p className="text-[#9CA3AF] font-mono text-sm leading-relaxed line-clamp-3">
        {post.excerpt}
      </p>
      <p className="text-[#00E87A] text-xs font-mono mt-4">
        {locale === 'ja' ? '続きを読む →' : 'Read more →'}
      </p>
    </Link>
  );
}
