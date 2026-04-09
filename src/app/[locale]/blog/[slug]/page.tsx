import { getPostBySlug, getAllPosts } from '@/lib/mdx/utils';
import { getMDXComponents } from '@/components/blog/mdx-components';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { NewsletterSection } from '@/components/marketing/newsletter-section';

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug, locale);
  if (!post) return { title: 'Post Not Found' };
  return buildMetadata({
    title: post.title,
    description: post.excerpt || `Read ${post.title} on the ZeroEn blog.`,
    path: `/blog/${slug}`,
    locale,
    ogTitle: post.title,
    ogSubtitle: post.excerpt || 'ZeroEn Blog',
  });
}

export async function generateStaticParams() {
  const locales = ['en', 'ja'];
  const params = [];
  for (const locale of locales) {
    const posts = getAllPosts(locale);
    for (const post of posts) {
      params.push({ locale, slug: post.slug });
    }
  }
  return params;
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug, locale);

  if (!post) notFound();

  const formattedDate = new Date(post.date).toLocaleDateString(
    locale === 'ja' ? 'ja-JP' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F4F4F2] pt-20 md:pt-24 pb-16">
      <article className="max-w-2xl mx-auto px-4 md:px-6">
        {/* Back */}
        <Link
          href={`/${locale}/blog`}
          className="inline-flex items-center gap-1 text-[#6B7280] hover:text-[#00E87A] text-xs font-mono transition-colors mb-8"
        >
          ← {locale === 'ja' ? '一覧に戻る' : 'Back to blog'}
        </Link>

        {/* Header */}
        <header className="mb-8 md:mb-10">
          <div className="flex items-center gap-2 mb-4">
            <time className="text-[#6B7280] text-xs font-mono">{formattedDate}</time>
            {post.tags && post.tags.map((tag) => (
              <span key={tag} className="text-[#6B7280] text-xs font-mono border border-[#374151] px-2 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-2xl md:text-4xl font-bold font-mono text-[#F4F4F2] leading-tight mb-3">
            {post.title}
          </h1>
          <p className="text-[#9CA3AF] font-mono text-sm md:text-base">
            {post.excerpt}
          </p>
        </header>

        <hr className="border-[#374151] mb-8" />

        {/* Content */}
        <div className="prose-zeroen">
          <MDXRemote source={post.content} components={getMDXComponents()} />
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-[#374151]">
          <Link
            href={`/${locale}/apply`}
            className="block text-center bg-[#00E87A] text-[#0D0D0D] text-xs font-bold px-6 py-3 rounded tracking-widest uppercase hover:bg-[#00E87A]/90 transition-colors"
          >
            {locale === 'ja' ? 'ZeroEnに申し込む — 無料' : 'Apply to ZeroEn — Free'}
          </Link>
        </div>
      </article>

      {/* Newsletter */}
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
