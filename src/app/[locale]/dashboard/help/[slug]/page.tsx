import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, MessageSquare } from 'lucide-react';
import { getArticle, helpArticles } from '@/content/help/articles';
import type { Metadata } from 'next';

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const locales = ['en', 'ja'];
  return locales.flatMap((locale) =>
    helpArticles.map((article) => ({ locale, slug: article.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: `${locale === 'ja' ? article.titleJa : article.titleEn} — ZeroEn Help`,
    robots: { index: false, follow: false },
  };
}

/** Render a body string: paragraphs split by \n\n, lines starting with "- " become list items. */
function RenderBody({ text }: { text: string }) {
  const paragraphs = text.split('\n\n');

  return (
    <div className="space-y-3">
      {paragraphs.map((para, i) => {
        const lines = para.split('\n');
        const isList = lines.every((l) => l.startsWith('- ') || l === '');

        if (isList) {
          return (
            <ul key={i} className="space-y-1.5 pl-0">
              {lines
                .filter((l) => l.startsWith('- '))
                .map((line, j) => (
                  <li key={j} className="flex items-start gap-2 text-[#9CA3AF] font-mono text-sm leading-relaxed">
                    <span className="text-[#00E87A] mt-0.5 shrink-0 select-none">—</span>
                    <span>{line.slice(2)}</span>
                  </li>
                ))}
            </ul>
          );
        }

        // Numbered list (lines starting with digits like "1. " "2. ")
        const isNumbered = lines.every((l) => /^\d+\.\s/.test(l) || l === '');
        if (isNumbered) {
          return (
            <ol key={i} className="space-y-1.5 pl-0">
              {lines
                .filter((l) => /^\d+\.\s/.test(l))
                .map((line, j) => {
                  const match = line.match(/^(\d+)\.\s(.+)/);
                  if (!match) return null;
                  return (
                    <li key={j} className="flex items-start gap-2 text-[#9CA3AF] font-mono text-sm leading-relaxed">
                      <span className="text-[#00E87A] shrink-0 font-bold select-none w-4">{match[1]}.</span>
                      <span>{match[2]}</span>
                    </li>
                  );
                })}
            </ol>
          );
        }

        return (
          <p key={i} className="text-[#9CA3AF] font-mono text-sm leading-relaxed">
            {para}
          </p>
        );
      })}
    </div>
  );
}

export default async function HelpArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  const article = getArticle(slug);

  if (!article) notFound();

  const isJa = locale === 'ja';

  return (
    <div className="max-w-2xl space-y-8">
      {/* Breadcrumb */}
      <Link
        href={`/${locale}/dashboard/help`}
        className="inline-flex items-center gap-1.5 text-xs font-mono text-[#6B7280] hover:text-[#9CA3AF] transition-colors"
      >
        <ChevronLeft size={13} />
        {isJa ? 'ヘルプセンター' : 'Help Center'}
      </Link>

      {/* Article header */}
      <div>
        <h1 className="text-xl font-bold font-heading text-[#F4F4F2] mb-2">
          {isJa ? article.titleJa : article.titleEn}
        </h1>
        <p className="text-[#6B7280] text-xs font-mono leading-relaxed">
          {isJa ? article.descJa : article.descEn}
        </p>
      </div>

      {/* Article sections */}
      <div className="space-y-8">
        {article.sections.map((section, i) => (
          <div key={i}>
            <h2 className="text-sm font-bold font-heading text-[#F4F4F2] mb-3 pb-2 border-b border-[#374151]">
              {isJa ? section.headingJa : section.headingEn}
            </h2>
            <RenderBody text={isJa ? section.bodyJa : section.bodyEn} />
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="border-t border-[#374151] pt-6">
        <p className="text-[#6B7280] font-mono text-xs mb-3">
          {isJa
            ? 'まだ疑問がありますか？チームにメッセージを送ってください。'
            : 'Still have questions? Send us a message.'}
        </p>
        <Link
          href={`/${locale}/dashboard/messages`}
          className="inline-flex items-center gap-2 text-xs font-mono text-[#00E87A] border border-[#00E87A]/30 hover:border-[#00E87A]/60 hover:bg-[#00E87A]/5 px-4 py-2 rounded transition-all"
        >
          <MessageSquare size={13} />
          {isJa ? 'メッセージを送る' : 'Send a message'}
        </Link>
      </div>
    </div>
  );
}
