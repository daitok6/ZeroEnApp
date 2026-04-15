'use client';

import { BookOpenIcon } from 'lucide-react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

interface ChangeCatalogueSheetProps {
  locale: string;
  planTier: string | null;
}

const SIZES = [
  {
    key: 'small',
    en: 'Small',
    ja: 'スモール',
    time: { en: '~30 min', ja: '約30分' },
    price: '¥4,000',
    included: { en: 'Basic: 1/mo · Premium: 2/mo', ja: 'ベーシック: 1回/月 · プレミアム: 2回/月' },
  },
  {
    key: 'medium',
    en: 'Medium',
    ja: 'ミディアム',
    time: { en: '1–3 hours', ja: '1〜3時間' },
    price: '¥10,000',
    included: { en: 'Premium: 1/mo (replaces 2 small)', ja: 'プレミアム: 1回/月（スモール2回の代替）' },
    premiumOnly: true,
  },
  {
    key: 'large',
    en: 'Large',
    ja: 'ラージ',
    time: { en: 'Half day+', ja: '半日以上' },
    price: '¥25,000+',
    included: { en: 'Always billed separately', ja: '常に別途請求' },
  },
];

const CATEGORIES = [
  {
    key: 'content',
    en: 'Content',
    ja: 'コンテンツ',
    examples: {
      small: {
        en: 'Update text/copy, swap an image, update business hours, change phone number or address, update a menu item',
        ja: 'テキスト・コピーの更新、画像の差し替え、営業時間の変更、電話番号や住所の変更、メニュー項目の更新',
      },
      medium: {
        en: 'Write and add a new content section, add a testimonials block, create an FAQ section, add a team member bio page',
        ja: '新しいコンテンツセクションの追加、お客様の声ブロックの追加、FAQセクションの作成、チームメンバーのプロフィールページ追加',
      },
      large: {
        en: 'Full page content rewrite, create a blog with multiple posts, write and publish a case study page',
        ja: 'ページ全体のコンテンツ書き直し、複数記事のブログ作成、事例ページの執筆・公開',
      },
    },
  },
  {
    key: 'design',
    en: 'Design',
    ja: 'デザイン',
    examples: {
      small: {
        en: 'Change button color or style, adjust font size, update brand color, change spacing on a section',
        ja: 'ボタンの色やスタイルの変更、フォントサイズの調整、ブランドカラーの更新、セクションの余白調整',
      },
      medium: {
        en: 'Restructure page layout, add a new UI component (card, accordion, tabs), redesign the hero section, add animations',
        ja: 'ページレイアウトの再構成、新しいUIコンポーネント追加（カード、アコーディオン、タブ）、ヒーローセクションのリデザイン、アニメーションの追加',
      },
      large: {
        en: 'Full site redesign, new visual theme, complete mobile layout overhaul, add dark mode',
        ja: 'サイト全体のリデザイン、新しいビジュアルテーマ、モバイルレイアウトの全面改修、ダークモードの追加',
      },
    },
  },
  {
    key: 'functionality',
    en: 'Functionality',
    ja: '機能',
    examples: {
      small: {
        en: 'Fix a broken link, update form field label, change redirect destination, update an embed URL',
        ja: 'リンク切れの修正、フォームフィールドのラベル更新、リダイレクト先の変更、埋め込みURLの更新',
      },
      medium: {
        en: 'Add a new contact form, embed Google Maps, add a newsletter signup, add a social media feed widget',
        ja: 'お問い合わせフォームの追加、Google Mapsの埋め込み、メルマガ登録フォームの追加、SNSフィードウィジェットの追加',
      },
      large: {
        en: 'Add user authentication, build a booking/reservation system, add e-commerce functionality, build a custom dashboard',
        ja: 'ユーザー認証の追加、予約システムの構築、ECサイト機能の追加、カスタムダッシュボードの構築',
      },
    },
  },
  {
    key: 'seo',
    en: 'SEO',
    ja: 'SEO',
    examples: {
      small: {
        en: 'Update meta title/description, add alt text to images, fix a broken canonical URL, update Open Graph tags',
        ja: 'メタタイトル・ディスクリプションの更新、画像のalt属性追加、正規URLの修正、OGタグの更新',
      },
      medium: {
        en: 'Optimize a landing page (headings, internal links), add structured data (JSON-LD), create and submit sitemap',
        ja: 'ランディングページの最適化（見出し・内部リンク）、構造化データ（JSON-LD）の追加、サイトマップの作成・送信',
      },
      large: {
        en: 'Full site SEO overhaul, implement programmatic SEO for multiple pages, complete technical SEO audit + fixes',
        ja: 'サイト全体のSEO見直し、複数ページへのプログラマティックSEO実装、技術的SEO監査と修正',
      },
    },
  },
  {
    key: 'security',
    en: 'Security',
    ja: 'セキュリティ',
    examples: {
      small: {
        en: 'Update a dependency with known vulnerability, check SSL certificate status, review Content Security Policy headers',
        ja: '既知の脆弱性がある依存パッケージの更新、SSL証明書の確認、コンテンツセキュリティポリシーヘッダーの確認',
      },
      medium: {
        en: 'Security audit — WebMori scan + fix flagged issues (included quarterly on Premium)',
        ja: 'セキュリティ監査 — WebMoriスキャン＋指摘事項の修正（プレミアムは四半期ごとに含む）',
      },
      large: {
        en: 'Comprehensive penetration test + remediation, implement rate limiting + WAF, full auth system hardening',
        ja: '包括的なペネトレーションテストと修正、レート制限・WAFの実装、認証システムの強化',
      },
    },
  },
  {
    key: 'analytics',
    en: 'Analytics',
    ja: 'アナリティクス',
    examples: {
      small: {
        en: 'Add a tracking pixel (Meta, Google), update Google Analytics property ID, add UTM parameter tracking',
        ja: 'トラッキングピクセル（Meta・Google）の追加、Google AnalyticsプロパティIDの更新、UTMパラメータ追跡の追加',
      },
      medium: {
        en: 'Set up conversion tracking, add custom event tracking, configure Google Search Console',
        ja: 'コンバージョントラッキングの設定、カスタムイベントトラッキングの追加、Google Search Consoleの設定',
      },
      large: {
        en: 'Full analytics stack setup (GA4 + GTM + custom events), build a custom reporting dashboard',
        ja: '本格的なアナリティクス設定（GA4・GTM・カスタムイベント）、カスタムレポートダッシュボードの構築',
      },
    },
  },
];

function getPlanAllowanceMessage(planTier: string | null, isJa: boolean): string | null {
  if (!planTier) return null;
  if (planTier === 'basic') {
    return isJa
      ? 'ベーシックプランには毎月スモール変更が1回含まれています。ミディアム変更はプレミアム限定です。'
      : 'Your Basic plan includes 1 small change per month. Medium changes require upgrading to Premium.';
  }
  if (planTier === 'premium') {
    return isJa
      ? 'プレミアムプランには毎月スモール変更が2回、またはミディアム変更が1回含まれています。'
      : 'Your Premium plan includes 2 small changes per month, or 1 medium change.';
  }
  return null;
}

export function ChangeCatalogueSheet({ locale, planTier }: ChangeCatalogueSheetProps) {
  const isJa = locale === 'ja';
  const allowanceMsg = getPlanAllowanceMessage(planTier, isJa);

  return (
    <Sheet>
      <SheetTrigger
        className="inline-flex items-center gap-1.5 text-xs font-mono text-[#9CA3AF] hover:text-[#00E87A] transition-colors cursor-pointer"
      >
        <BookOpenIcon className="size-3.5" />
        {isJa ? '変更カタログを見る' : 'View Change Catalogue'}
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-[#0D0D0D] border-[#374151] overflow-y-auto"
      >
        <SheetHeader className="pb-2">
          <SheetTitle className="text-[#F4F4F2] font-heading">
            {isJa ? '変更カタログ' : 'Change Catalogue'}
          </SheetTitle>
          <SheetDescription className="text-[#6B7280] font-mono text-xs">
            {isJa
              ? '各変更の規模と料金の基準です。参考にしてリクエストを送ってください。'
              : 'Reference for change sizes and pricing. Use this to guide your requests.'}
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-8 space-y-6">
          {/* Plan allowance highlight */}
          {allowanceMsg && (
            <div className="border border-[#00E87A]/30 bg-[#00E87A]/5 rounded-lg px-3.5 py-3">
              <p className="text-[#00E87A] text-xs font-mono">{allowanceMsg}</p>
              <p className="text-[#6B7280] text-xs font-mono mt-1">
                {isJa
                  ? '毎月の変更枠は翌月に繰り越せません。'
                  : 'Unused monthly changes do not roll over.'}
              </p>
            </div>
          )}

          {/* Size definitions */}
          <div>
            <p className="text-[#9CA3AF] text-xs font-mono uppercase tracking-widest mb-3">
              {isJa ? '規模の定義' : 'Size Definitions'}
            </p>
            <div className="space-y-2">
              {SIZES.map((size) => (
                <div
                  key={size.key}
                  className="border border-[#374151] rounded-lg px-3.5 py-3 bg-[#111827]"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[#F4F4F2] text-sm font-mono font-bold">
                        {isJa ? size.ja : size.en}
                      </span>
                      {size.premiumOnly && (
                        <Badge
                          variant="outline"
                          className="border-[#00E87A]/40 text-[#00E87A] font-mono text-[10px]"
                        >
                          {isJa ? 'プレミアム限定' : 'Premium only'}
                        </Badge>
                      )}
                    </div>
                    <Badge
                      variant="outline"
                      className="border-[#374151] text-[#9CA3AF] font-mono"
                    >
                      {size.price}
                    </Badge>
                  </div>
                  <p className="text-[#6B7280] text-xs font-mono">
                    {isJa ? size.time.ja : size.time.en}
                  </p>
                  <p className="text-[#6B7280] text-xs font-mono mt-0.5">
                    {isJa ? size.included.ja : size.included.en}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Category examples */}
          <div>
            <p className="text-[#9CA3AF] text-xs font-mono uppercase tracking-widest mb-3">
              {isJa ? 'カテゴリ別の例' : 'Examples by Category'}
            </p>
            <Accordion className="space-y-2">
              {CATEGORIES.map((cat) => (
                <AccordionItem
                  key={cat.key}
                  value={cat.key}
                  className="border border-[#374151] rounded-lg bg-[#111827] not-last:border-b px-3.5"
                >
                  <AccordionTrigger className="text-[#F4F4F2] text-sm font-mono py-3 hover:no-underline">
                    {isJa ? cat.ja : cat.en}
                  </AccordionTrigger>
                  <AccordionContent className="pb-3">
                    <div className="space-y-2.5 pt-1">
                      {(['small', 'medium', 'large'] as const).map((size) => (
                        <div key={size}>
                          <span className="text-[#6B7280] text-xs font-mono uppercase tracking-widest">
                            {size === 'small'
                              ? (isJa ? 'スモール' : 'Small')
                              : size === 'medium'
                              ? (isJa ? 'ミディアム' : 'Medium')
                              : (isJa ? 'ラージ' : 'Large')}
                          </span>
                          <p className="text-[#9CA3AF] text-xs font-mono mt-0.5 leading-relaxed">
                            {isJa ? cat.examples[size].ja : cat.examples[size].en}
                          </p>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* A-la-carte note */}
          <div className="border border-[#374151] rounded-lg px-3.5 py-3 bg-[#111827]">
            <p className="text-[#9CA3AF] text-xs font-mono uppercase tracking-widest mb-2">
              {isJa ? '追加料金' : 'A-La-Carte Pricing'}
            </p>
            <div className="space-y-1">
              {[
                { label: { en: 'Small change', ja: 'スモール変更' }, price: '¥4,000' },
                {
                  label: { en: 'Medium change', ja: 'ミディアム変更' },
                  price: isJa ? 'プレミアム限定' : 'Premium only',
                },
                { label: { en: 'Large change', ja: 'ラージ変更' }, price: '¥25,000+' },
                { label: { en: 'Security audit', ja: 'セキュリティ監査' }, price: '¥15,000' },
                { label: { en: 'SEO audit', ja: 'SEO監査' }, price: '¥15,000' },
              ].map((item) => (
                <div key={item.price + item.label.en} className="flex justify-between">
                  <span className="text-[#6B7280] text-xs font-mono">
                    {isJa ? item.label.ja : item.label.en}
                  </span>
                  <span className="text-[#9CA3AF] text-xs font-mono">{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
