import Link from 'next/link';
import { ChevronRight, BookOpen, MessageSquare, PlusCircle, Receipt, FileText, BarChart2, HelpCircle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help — ZeroEn',
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ locale: string }> };

const ARTICLES = [
  {
    slug: 'getting-started',
    icon: BookOpen,
    titleEn: 'Getting Started',
    titleJa: 'はじめに',
    descEn: 'What to expect after subscribing — build, preview, launch, and monthly operations.',
    descJa: 'ご契約後の流れ — 制作・プレビュー・公開・毎月の運用まで。',
  },
  {
    slug: 'dashboard-overview',
    icon: BarChart2,
    titleEn: 'Dashboard Overview',
    titleJa: 'ダッシュボードの使い方',
    descEn: 'A guide to every section — Messages, Documents, Invoices, Requests, and more.',
    descJa: '各セクションの説明 — メッセージ・書類・請求書・リクエストなど。',
  },
  {
    slug: 'requesting-changes',
    icon: PlusCircle,
    titleEn: 'Requesting Changes',
    titleJa: '変更リクエストの送り方',
    descEn: 'How to submit a request, change-size definitions, and your monthly allowance.',
    descJa: 'リクエストの送り方・変更サイズの定義・毎月の無料枠について。',
  },
  {
    slug: 'invoices-and-billing',
    icon: Receipt,
    titleEn: 'Invoices & Billing',
    titleJa: '請求・支払いについて',
    descEn: 'Monthly billing, upgrade/downgrade rules, and the 6-month minimum commitment.',
    descJa: '月次請求・プラン変更のルール・6ヶ月最低利用期間について。',
  },
  {
    slug: 'messages-and-documents',
    icon: MessageSquare,
    titleEn: 'Messages & Documents',
    titleJa: 'メッセージと書類',
    descEn: 'Communicating with the team and where your signed contracts are stored.',
    descJa: 'チームとのやり取りと署名済み契約書の保管場所について。',
  },
  {
    slug: 'analytics-reports',
    icon: BarChart2,
    titleEn: 'Analytics Reports',
    titleJa: 'アナリティクスレポート',
    descEn: "What's in your monthly PDF, when it arrives, and Basic vs Premium differences.",
    descJa: '月次PDFの内容・配信タイミング・BasicとPremiumの違い。',
  },
  {
    slug: 'faq',
    icon: HelpCircle,
    titleEn: 'FAQ',
    titleJa: 'よくある質問',
    descEn: 'Common questions about cancellation, code ownership, domain, billing, and more.',
    descJa: '解約・コード所有権・ドメイン・請求などのよくある質問。',
  },
] as const;

export default async function HelpPage({ params }: Props) {
  const { locale } = await params;
  const isJa = locale === 'ja';

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <HelpCircle size={18} className="text-[#00E87A]" />
          <h1 className="text-xl font-bold font-heading text-[#F4F4F2]">
            {isJa ? 'ヘルプセンター' : 'Help Center'}
          </h1>
        </div>
        <p className="text-[#6B7280] text-xs font-mono">
          {isJa
            ? 'ダッシュボードの使い方・請求・変更リクエストなど'
            : 'Guides for using your dashboard, billing, requests, and more'}
        </p>
      </div>

      {/* Article list */}
      <div className="space-y-2">
        {ARTICLES.map((article) => {
          const Icon = article.icon;
          return (
            <Link
              key={article.slug}
              href={`/${locale}/dashboard/help/${article.slug}`}
              className="flex items-center gap-4 p-4 border border-[#374151] rounded-lg bg-[#111827] hover:border-[#00E87A]/40 hover:bg-[#111827]/80 transition-all group"
            >
              <div className="shrink-0 w-9 h-9 rounded bg-[#00E87A]/10 flex items-center justify-center">
                <Icon size={16} className="text-[#00E87A]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#F4F4F2] text-sm font-mono font-bold">
                  {isJa ? article.titleJa : article.titleEn}
                </p>
                <p className="text-[#6B7280] text-xs font-mono mt-0.5 leading-relaxed">
                  {isJa ? article.descJa : article.descEn}
                </p>
              </div>
              <ChevronRight size={16} className="text-[#374151] group-hover:text-[#6B7280] shrink-0 transition-colors" />
            </Link>
          );
        })}
      </div>

      {/* Contact fallback */}
      <div className="border border-[#374151] rounded-lg p-5 bg-[#0D0D0D]">
        <p className="text-[#9CA3AF] font-mono text-xs mb-2 font-bold">
          {isJa ? '答えが見つかりませんでしたか？' : "Can't find what you're looking for?"}
        </p>
        <p className="text-[#6B7280] font-mono text-xs mb-3">
          {isJa
            ? 'メッセージページからチームに直接お問い合わせください。1営業日以内に返信します。'
            : 'Contact us directly via the Messages page. We respond within 1 business day.'}
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
