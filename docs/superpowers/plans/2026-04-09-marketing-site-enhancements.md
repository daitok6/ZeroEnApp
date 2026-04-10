# Marketing Site Enhancements — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add four new homepage sections (Why ZeroEn, Tech Stack Terminal, Case Studies Preview, Newsletter), a /terms page, and blog enhancements (category field, RSS feed, newsletter CTA on blog pages).

**Architecture:** All new marketing components are server components except where animation is required (`tech-stack-terminal.tsx` is client-only). Translation keys are added to `messages/en.json` and `messages/ja.json` first, then components consume them via `getTranslations`. Homepage sections are inserted inline into `page.tsx` — no new route files needed except `/terms`.

**Tech Stack:** Next.js 15 App Router · next-intl · Framer Motion · Tailwind CSS · gray-matter (MDX frontmatter) · IBM Plex Mono (brand font)

> ⚠️ **Before writing any code:** Read `HQ/platform/AGENTS.md`. This Next.js version has breaking API changes. Check `node_modules/next/dist/docs/` if uncertain about any Next.js API.

---

## File Map

**New files:**
- `src/components/marketing/why-zeroen.tsx` — "Build for free. Pay us when you win." section
- `src/components/marketing/tech-stack-terminal.tsx` — Animated CLI terminal + tool cards (client)
- `src/components/marketing/case-studies-preview.tsx` — 3 placeholder case study cards
- `src/components/marketing/newsletter-section.tsx` — Full-width newsletter CTA block
- `src/components/marketing/terms-accordion.tsx` — Expandable full legal text (client)
- `src/app/[locale]/terms/page.tsx` — /terms page (summary card + accordion)
- `src/app/feed.xml/route.ts` — RSS feed for EN posts

**Modified files:**
- `messages/en.json` — Add keys: `whyZeroEn.*`, `techStack.*`, `caseStudies.*`, `newsletterSection.*`, `terms.*`, `blog.categories.*`
- `messages/ja.json` — Same keys in Japanese
- `src/app/[locale]/page.tsx` — Insert 4 new sections between existing ones
- `src/lib/mdx/utils.ts` — Add `category` field to `PostMeta` + `getAllPostsByCategory()`
- `src/components/blog/post-card.tsx` — Show category badge
- `src/app/[locale]/blog/page.tsx` — Category filter tabs + newsletter section
- `src/app/[locale]/blog/[slug]/page.tsx` — Newsletter section before footer CTA
- `src/app/sitemap.ts` — Add `/terms` to `MARKETING_PAGES`

---

## Task 1: Add Translation Keys

**Files:**
- Modify: `messages/en.json`
- Modify: `messages/ja.json`

- [ ] **Step 1: Add EN translation keys**

Open `messages/en.json`. Add these top-level keys alongside the existing ones (`nav`, `home`, `apply`, etc.):

```json
{
  "nav": { ... },
  "home": {
    "hero": { ... },
    "howItWorks": { ... },
    "pricing": { ... },
    "applySection": { ... },
    "whyZeroEn": {
      "eyebrow": "Why ZeroEn",
      "title": "Build for free.\nPay us when you win.",
      "subtitle": "We take 10% equity. You pay $50/mo after launch. That's the entire deal.",
      "pillars": [
        {
          "title": "Zero upfront cost",
          "desc": "We build your full-stack MVP — Next.js, Supabase, Vercel — for $0. No retainers, no hourly billing."
        },
        {
          "title": "Real equity partnership",
          "desc": "We take 10% via SAFE note. We only win when you win. Aligned incentives from day one."
        },
        {
          "title": "Selective by design",
          "desc": "We accept fewer than 20% of applications. Apply now while slots are open."
        }
      ],
      "urgency": "Currently reviewing applications. Spots are limited."
    },
    "techStack": {
      "eyebrow": "What You Get",
      "title": "Production-grade stack.\nOut of the box.",
      "subtitle": "The same infrastructure used by YC-backed startups — included in every build.",
      "terminalTitle": "zeroen — init",
      "lines": [
        "$ zeroen --init your-startup",
        "> installing next@15 (App Router)...",
        "> linking supabase (auth + db + storage)...",
        "> configuring vercel (global deploy)...",
        "> wiring stripe (payments + billing)...",
        "✓ MVP ready. Est. 4 weeks."
      ],
      "tools": [
        {
          "name": "Next.js 15",
          "tag": "Frontend",
          "desc": "App Router, Server Components, streaming — the fastest React framework in production."
        },
        {
          "name": "Supabase",
          "tag": "Backend",
          "desc": "Postgres database, Auth, realtime, and file storage. Free tier per client."
        },
        {
          "name": "Vercel",
          "tag": "Hosting",
          "desc": "Global edge deployment, preview URLs, analytics. Zero DevOps."
        },
        {
          "name": "Stripe",
          "tag": "Payments",
          "desc": "Subscriptions, invoicing, and webhooks. Revenue from day one."
        }
      ]
    },
    "caseStudies": {
      "eyebrow": "Portfolio",
      "title": "What we've built.",
      "subtitle": "Real MVPs. Real founders. Real equity.",
      "comingSoon": "Coming soon",
      "placeholders": [
        {
          "name": "Client #1",
          "desc": "First build in progress",
          "stack": ["Next.js", "Supabase", "Stripe"]
        },
        {
          "name": "Client #2",
          "desc": "Accepting applications",
          "stack": ["Next.js", "Supabase", "Vercel"]
        },
        {
          "name": "Client #3",
          "desc": "Accepting applications",
          "stack": ["Next.js", "Supabase", "Stripe"]
        }
      ]
    },
    "newsletterSection": {
      "eyebrow": "Newsletter",
      "title": "Get weekly build updates.",
      "subtitle": "Real numbers, real clients, no fluff. Every Monday.",
      "placeholder": "your@email.com",
      "cta": "Subscribe",
      "note": "No spam. Unsubscribe anytime."
    }
  },
  "terms": {
    "eyebrow": "Terms",
    "title": "The deal,\nin plain English.",
    "subtitle": "Standard terms for every ZeroEn client. No surprises.",
    "summary": {
      "heading": "TL;DR",
      "items": [
        { "label": "Equity", "value": "10% via SAFE note. Converts when you incorporate." },
        { "label": "Revenue share", "value": "~10% of app revenue, negotiated per deal." },
        { "label": "Platform fee", "value": "$50/mo after your MVP launches. Covers hosting + 1 fix/mo." },
        { "label": "Scope freeze", "value": "MVP scope locked at kickoff. New features = per-request charge." },
        { "label": "Kill switch", "value": "90 days unpaid → agreement terminates. We keep the code." },
        { "label": "Portfolio rights", "value": "We always retain the right to showcase this work." }
      ]
    },
    "full": {
      "heading": "Full Terms",
      "sections": [
        {
          "title": "1. Equity Agreement",
          "body": "ZeroEn receives 10% equity via a Simple Agreement for Future Equity (SAFE note). The SAFE converts to equity shares upon the client's incorporation or qualifying financing event. If the client never incorporates, a profit-sharing arrangement of approximately 10% of net revenue applies instead. ZeroEn retains an anti-dilution floor: a minimum equity percentage is maintained if the client raises external funding."
        },
        {
          "title": "2. Revenue Share",
          "body": "A revenue share of approximately 10% of the client's app revenue is negotiated at kickoff and documented in the individual agreement. Revenue share activates once the client's application generates revenue. The exact percentage is flexible per deal and is fixed in writing before the build begins."
        },
        {
          "title": "3. Platform Fee",
          "body": "After the MVP launches, a platform fee of USD $50 per month applies. This covers: hosting on ZeroEn's Vercel Pro account, one small fix or minor change per month (at ZeroEn's discretion), and a monthly analytics PDF report. The platform fee begins 30 days after launch. Payment is via Stripe subscription. The client's application remains live only while the platform fee is paid."
        },
        {
          "title": "4. Scope Freeze",
          "body": "The MVP scope is agreed and locked at the kickoff call. This scope is documented and signed by both parties. Any features, changes, or additions beyond the agreed scope are treated as per-request charges. ZeroEn is not obligated to build out-of-scope work. Per-request charges are quoted upfront and must be paid before work begins."
        },
        {
          "title": "5. Per-Request Charges",
          "body": "Work beyond the locked MVP scope is available as per-request charges: Small changes (1–4 hours) USD $50–100; Medium features (1–3 days) USD $200–500; Large builds (1–2 weeks) USD $500–2,000. All quotes are provided upfront. Work begins only after payment is received."
        },
        {
          "title": "6. Kill Switch",
          "body": "If the platform fee remains unpaid for 90 consecutive days, the agreement terminates automatically. Upon termination: the client's hosted application is taken offline, ZeroEn retains full rights to the codebase, and all equity and revenue share arrangements are voided. ZeroEn will make reasonable efforts to notify the client before reaching the 90-day threshold."
        },
        {
          "title": "7. Reversion Clause",
          "body": "If the client does not launch their application within 6 months of the agreed build completion date, full code rights revert to ZeroEn. The client may request an extension in writing. Extensions are granted at ZeroEn's discretion."
        },
        {
          "title": "8. IP Ownership",
          "body": "Intellectual property is shared proportionally to equity stake. ZeroEn holds 10% IP rights corresponding to its equity. The client holds the remaining rights. ZeroEn always retains the right to use the work in its portfolio and marketing materials, including screenshots, case studies, and build logs."
        },
        {
          "title": "9. Founder Vesting",
          "body": "The client's equity interest vests over time. If the client abandons the project (defined as no communication or active use for 6+ months), their equity stake reduces proportionally. This clause protects ZeroEn from building for founders who disengage."
        },
        {
          "title": "10. Governing Law",
          "body": "These terms are governed by the laws of Canada (Ontario). Any disputes are resolved first through good-faith negotiation, then through binding arbitration if necessary. ZeroEn and the client agree to resolve disputes without litigation where possible."
        }
      ]
    }
  },
  "blog": {
    "categories": {
      "all": "All",
      "build-update": "Build Update",
      "case-study": "Case Study",
      "operator-log": "Operator Log",
      "tutorial": "Tutorial"
    }
  }
}
```

- [ ] **Step 2: Add JP translation keys**

Open `messages/ja.json`. Add the same structure with Japanese translations:

```json
{
  "home": {
    "whyZeroEn": {
      "eyebrow": "ZeroEnとは",
      "title": "無料で作る。\n勝ったときに払う。",
      "subtitle": "エクイティ10%をいただきます。立ち上げ後は月額$50。それだけです。",
      "pillars": [
        {
          "title": "初期費用ゼロ",
          "desc": "Next.js・Supabase・Vercelを使ったフルスタックMVPを$0で構築。前払い・時間単位の請求なし。"
        },
        {
          "title": "本物のエクイティパートナー",
          "desc": "SAFEノートで10%のエクイティをいただきます。あなたが勝ったときだけ、私たちも勝つ。"
        },
        {
          "title": "厳選された採用",
          "desc": "申し込みの20%未満しか受け付けていません。枠があるうちに今すぐ申し込んでください。"
        }
      ],
      "urgency": "現在、申請を審査中です。枠には限りがあります。"
    },
    "techStack": {
      "eyebrow": "提供内容",
      "title": "本番環境対応のスタック。\nすぐに使えます。",
      "subtitle": "YCバックのスタートアップが使う同じインフラ — 全ビルドに含まれています。",
      "terminalTitle": "zeroen — init",
      "lines": [
        "$ zeroen --init your-startup",
        "> next@15 をインストール中 (App Router)...",
        "> supabase を連携中 (認証 + DB + ストレージ)...",
        "> vercel を設定中 (グローバルデプロイ)...",
        "> stripe を接続中 (決済 + 請求)...",
        "✓ MVP 完成。目安: 4週間。"
      ],
      "tools": [
        {
          "name": "Next.js 15",
          "tag": "フロントエンド",
          "desc": "App Router・サーバーコンポーネント・ストリーミング — 最速のReactフレームワーク。"
        },
        {
          "name": "Supabase",
          "tag": "バックエンド",
          "desc": "Postgresデータベース・認証・リアルタイム・ファイルストレージ。クライアントごとに無料枠。"
        },
        {
          "name": "Vercel",
          "tag": "ホスティング",
          "desc": "グローバルエッジデプロイ・プレビューURL・アナリティクス。DevOps不要。"
        },
        {
          "name": "Stripe",
          "tag": "決済",
          "desc": "サブスクリプション・請求書・Webhook。初日から収益化。"
        }
      ]
    },
    "caseStudies": {
      "eyebrow": "ポートフォリオ",
      "title": "構築実績",
      "subtitle": "実際のMVP。実際のファウンダー。本物のエクイティ。",
      "comingSoon": "近日公開",
      "placeholders": [
        {
          "name": "クライアント #1",
          "desc": "初回ビルド進行中",
          "stack": ["Next.js", "Supabase", "Stripe"]
        },
        {
          "name": "クライアント #2",
          "desc": "申請受付中",
          "stack": ["Next.js", "Supabase", "Vercel"]
        },
        {
          "name": "クライアント #3",
          "desc": "申請受付中",
          "stack": ["Next.js", "Supabase", "Stripe"]
        }
      ]
    },
    "newsletterSection": {
      "eyebrow": "ニュースレター",
      "title": "週次ビルドアップデートを受け取る。",
      "subtitle": "リアルな数字、リアルなクライアント、無駄なし。毎週月曜日配信。",
      "placeholder": "your@email.com",
      "cta": "登録",
      "note": "スパムなし。いつでも解除可能。"
    }
  },
  "terms": {
    "eyebrow": "利用規約",
    "title": "わかりやすい\n契約内容。",
    "subtitle": "全ZeroEnクライアントへの標準条件。驚きなし。",
    "summary": {
      "heading": "要約",
      "items": [
        { "label": "エクイティ", "value": "SAFEノートで10%。法人化時に転換。" },
        { "label": "レベニューシェア", "value": "アプリ収益の約10%。案件ごとに交渉。" },
        { "label": "プラットフォーム費用", "value": "MVP立ち上げ後、月額$50。ホスティング + 月1回の修正含む。" },
        { "label": "スコープ凍結", "value": "MVPスコープはキックオフ時に確定。追加機能 = 都度課金。" },
        { "label": "強制終了条項", "value": "90日間未払い → 契約終了。コードはZeroEnが保持。" },
        { "label": "ポートフォリオ権利", "value": "ZeroEnは常にこの作業を紹介する権利を保持。" }
      ]
    },
    "full": {
      "heading": "完全な利用規約",
      "sections": [
        { "title": "1. エクイティ契約", "body": "ZeroEnはSAFE（将来株式取得契約）を通じて10%のエクイティを取得します。SAFEはクライアントの法人化または適格ファイナンシングイベント時に株式に転換されます。クライアントが法人化しない場合は、純収益の約10%のレベニューシェアが適用されます。" },
        { "title": "2. レベニューシェア", "body": "アプリ収益の約10%のレベニューシェアがキックオフ時に交渉され、個別契約に記載されます。クライアントのアプリが収益を生み始めた時点で発動します。" },
        { "title": "3. プラットフォーム費用", "body": "MVP立ち上げ後、月額USD $50のプラットフォーム費用が発生します。内容: ZeroEnのVercel Proアカウントでのホスティング、月1回の軽微な修正、月次アナリティクスPDFレポート。" },
        { "title": "4. スコープ凍結", "body": "MVPスコープはキックオフコールで合意・確定されます。合意されたスコープ以外の機能・変更・追加は都度課金として扱われます。" },
        { "title": "5. 都度課金", "body": "確定MVPスコープ外の作業: 小規模変更(1〜4時間) $50〜100; 中規模機能(1〜3日) $200〜500; 大規模ビルド(1〜2週間) $500〜2,000。全見積もりは事前提示。支払い後に作業開始。" },
        { "title": "6. 強制終了条項", "body": "プラットフォーム費用が90日連続して未払いの場合、契約は自動的に終了します。終了時: クライアントのアプリはオフライン、ZeroEnがコードの完全な権利を保持、エクイティ・レベニューシェア契約はすべて無効。" },
        { "title": "7. 返還条項", "body": "ビルド完了から6ヶ月以内にアプリが立ち上がらない場合、完全なコード権利はZeroEnに返還されます。" },
        { "title": "8. IP所有権", "body": "知的財産はエクイティ持分に比例して共有されます。ZeroEnはエクイティに対応する10%のIP権利を保持します。ZeroEnは常にポートフォリオおよびマーケティング資料での使用権を保持します。" },
        { "title": "9. ファウンダーベスティング", "body": "クライアントのエクイティは時間をかけてベストします。プロジェクト放棄(6ヶ月以上の連絡なし・使用なし)の場合、エクイティ持分は比例して減少します。" },
        { "title": "10. 準拠法", "body": "本規約はカナダ(オンタリオ州)の法律に準拠します。紛争は誠実な交渉により解決され、必要に応じて拘束力のある仲裁によります。" }
      ]
    }
  },
  "blog": {
    "categories": {
      "all": "すべて",
      "build-update": "ビルド更新",
      "case-study": "ケーススタディ",
      "operator-log": "オペレーターログ",
      "tutorial": "チュートリアル"
    }
  }
}
```

- [ ] **Step 3: Commit**

```bash
cd HQ/platform
git add messages/en.json messages/ja.json
git commit -m "feat: add translation keys for marketing enhancements and terms page"
```

---

## Task 2: Why ZeroEn Section Component

**Files:**
- Create: `src/components/marketing/why-zeroen.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/components/marketing/why-zeroen.tsx
import Link from 'next/link';
import { ScrollReveal } from './scroll-reveal';
import { StaggerChildren, StaggerItem } from './stagger-children';

interface Pillar {
  title: string;
  desc: string;
}

interface WhyZeroEnProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  pillars: Pillar[];
  urgency: string;
  locale: string;
  ctaText: string;
}

export function WhyZeroEn({
  eyebrow,
  title,
  subtitle,
  pillars,
  urgency,
  locale,
  ctaText,
}: WhyZeroEnProps) {
  return (
    <section className="py-24 px-4 bg-[#080808]">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal direction="up">
          <div className="mb-16 text-center">
            <p className="text-[#00E87A] font-mono text-xs uppercase tracking-[0.2em] mb-3">
              {eyebrow}
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-mono font-bold text-[#F4F4F2] mb-4 whitespace-pre-line">
              {title}
            </h2>
            <p className="text-[#6B7280] font-mono text-sm max-w-md mx-auto">
              {subtitle}
            </p>
          </div>
        </ScrollReveal>

        {/* Three pillars */}
        <StaggerChildren
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14"
          staggerDelay={0.1}
        >
          {pillars.map((pillar, i) => (
            <StaggerItem key={i}>
              <div className="
                bg-[#111827] border border-[#1F2937] rounded-lg p-6
                hover:border-[#00E87A]/20 hover:shadow-[0_0_20px_rgba(0,232,122,0.06)]
                transition-all duration-300
              ">
                {/* Index number */}
                <p className="text-[#00E87A] font-mono text-xs font-bold tracking-widest mb-3">
                  0{i + 1}
                </p>
                <h3 className="text-[#F4F4F2] font-mono font-bold text-base mb-3">
                  {pillar.title}
                </h3>
                <p className="text-[#9CA3AF] font-mono text-sm leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>

        {/* Urgency + CTA */}
        <ScrollReveal direction="up">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-[#6B7280] font-mono text-xs uppercase tracking-[0.15em]">
              <span className="inline-block w-2 h-2 rounded-full bg-[#00E87A] mr-2 animate-pulse" />
              {urgency}
            </p>
            <Link
              href={`/${locale}/apply`}
              className="
                inline-block
                border border-[#00E87A] text-[#00E87A]
                font-mono text-xs font-bold
                uppercase tracking-widest
                px-8 py-3 rounded
                hover:bg-[#00E87A] hover:text-[#0D0D0D]
                transition-all duration-200
              "
            >
              {ctaText}
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify no TypeScript errors**

```bash
cd HQ/platform
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors related to `why-zeroen.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/components/marketing/why-zeroen.tsx
git commit -m "feat: add WhyZeroEn section component"
```

---

## Task 3: Tech Stack Terminal Component

**Files:**
- Create: `src/components/marketing/tech-stack-terminal.tsx`

This is a **client component** because it uses Framer Motion animation.

- [ ] **Step 1: Create the component**

```tsx
// src/components/marketing/tech-stack-terminal.tsx
'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { TerminalWindow } from './terminal-window';

interface Tool {
  name: string;
  tag: string;
  desc: string;
}

interface TechStackTerminalProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  terminalTitle: string;
  lines: string[];
  tools: Tool[];
}

// Line 0: the command prompt line
// Lines 1-4: the "installing..." lines — each highlights its tool name in green
// Line 5: the success line

const TOOL_KEYWORDS = ['next@15', 'supabase', 'vercel', 'stripe', 'next@15 を', 'supabase を', 'vercel を', 'stripe を'];

function HighlightedLine({ text }: { text: string }) {
  // Highlight tool name portion in green
  const lowerText = text.toLowerCase();
  const keyword = TOOL_KEYWORDS.find((k) => lowerText.includes(k));

  if (!keyword) {
    const isSuccess = text.startsWith('✓');
    return (
      <span className={isSuccess ? 'text-[#00E87A]' : 'text-[#9CA3AF]'}>
        {text}
      </span>
    );
  }

  const idx = lowerText.indexOf(keyword);
  return (
    <span className="text-[#9CA3AF]">
      {text.slice(0, idx)}
      <span className="text-[#00E87A] font-bold">{text.slice(idx, idx + keyword.length)}</span>
      {text.slice(idx + keyword.length)}
    </span>
  );
}

export function TechStackTerminal({
  eyebrow,
  title,
  subtitle,
  terminalTitle,
  lines,
  tools,
}: TechStackTerminalProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <motion.div
          className="mb-12 text-center"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[#00E87A] font-mono text-xs uppercase tracking-[0.2em] mb-3">
            {eyebrow}
          </p>
          <h2 className="text-3xl sm:text-4xl font-mono font-bold text-[#F4F4F2] mb-4 whitespace-pre-line">
            {title}
          </h2>
          <p className="text-[#6B7280] font-mono text-sm max-w-md mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* Animated terminal */}
        <motion.div
          className="mb-10"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <TerminalWindow title={terminalTitle} className="w-full">
            <div className="space-y-2 text-sm font-mono">
              {lines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={shouldReduceMotion ? false : { opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.45 }}
                >
                  {i === 0 ? (
                    <span>
                      <span className="text-[#00E87A]">$ </span>
                      <span className="text-[#F4F4F2]">{line.replace('$ ', '')}</span>
                    </span>
                  ) : (
                    <HighlightedLine text={line} />
                  )}
                </motion.div>
              ))}
            </div>
          </TerminalWindow>
        </motion.div>

        {/* Tool cards — 2x2 mobile, 4-col desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.name}
              className="
                bg-[#111827] border border-[#1F2937] rounded-lg p-4
                hover:border-[#00E87A]/30
                transition-colors duration-200
              "
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
            >
              <p className="text-[#00E87A] font-mono text-[10px] uppercase tracking-widest mb-1">
                {tool.tag}
              </p>
              <p className="text-[#F4F4F2] font-mono font-bold text-sm mb-2">
                {tool.name}
              </p>
              <p className="text-[#6B7280] font-mono text-xs leading-relaxed">
                {tool.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify no TypeScript errors**

```bash
cd HQ/platform
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/marketing/tech-stack-terminal.tsx
git commit -m "feat: add TechStackTerminal animated section component"
```

---

## Task 4: Case Studies Preview Component

**Files:**
- Create: `src/components/marketing/case-studies-preview.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/components/marketing/case-studies-preview.tsx
import { ScrollReveal } from './scroll-reveal';
import { StaggerChildren, StaggerItem } from './stagger-children';

interface CaseStudyPlaceholder {
  name: string;
  desc: string;
  stack: string[];
}

interface CaseStudiesPreviewProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  comingSoon: string;
  placeholders: CaseStudyPlaceholder[];
}

export function CaseStudiesPreview({
  eyebrow,
  title,
  subtitle,
  comingSoon,
  placeholders,
}: CaseStudiesPreviewProps) {
  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal direction="up">
          <div className="mb-16 text-center">
            <p className="text-[#00E87A] font-mono text-xs uppercase tracking-[0.2em] mb-3">
              {eyebrow}
            </p>
            <h2 className="text-3xl sm:text-4xl font-mono font-bold text-[#F4F4F2] mb-4">
              {title}
            </h2>
            <p className="text-[#6B7280] font-mono text-sm">{subtitle}</p>
          </div>
        </ScrollReveal>

        <StaggerChildren
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          staggerDelay={0.1}
        >
          {placeholders.map((item) => (
            <StaggerItem key={item.name}>
              <div className="
                bg-[#111827] border border-[#1F2937] rounded-lg overflow-hidden
                hover:border-[#00E87A]/20 hover:shadow-[0_0_20px_rgba(0,232,122,0.06)]
                transition-all duration-300
              ">
                {/* Screenshot placeholder */}
                <div className="relative w-full h-40 bg-[#0D0D0D] flex items-center justify-center border-b border-[#1F2937]">
                  {/* Faint grid pattern */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `
                        linear-gradient(rgba(0,232,122,0.04) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0,232,122,0.04) 1px, transparent 1px)
                      `,
                      backgroundSize: '24px 24px',
                    }}
                  />
                  <span className="relative text-[#374151] font-mono text-xs uppercase tracking-widest">
                    {comingSoon}
                  </span>
                </div>

                {/* Card content */}
                <div className="p-5">
                  <h3 className="text-[#F4F4F2] font-mono font-bold text-base mb-1">
                    {item.name}
                  </h3>
                  <p className="text-[#6B7280] font-mono text-xs mb-4">
                    {item.desc}
                  </p>
                  {/* Stack tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {item.stack.map((tag) => (
                      <span
                        key={tag}
                        className="
                          text-[#9CA3AF] font-mono text-[10px]
                          border border-[#374151] rounded
                          px-2 py-0.5 uppercase tracking-wider
                        "
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/marketing/case-studies-preview.tsx
git commit -m "feat: add CaseStudiesPreview section with placeholder cards"
```

---

## Task 5: Newsletter Section Component

**Files:**
- Create: `src/components/marketing/newsletter-section.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/components/marketing/newsletter-section.tsx
import { ScrollReveal } from './scroll-reveal';
import { NewsletterForm } from './newsletter-form';

interface NewsletterSectionProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  note: string;
  locale: string;
}

export function NewsletterSection({
  eyebrow,
  title,
  subtitle,
  note,
  locale,
}: NewsletterSectionProps) {
  return (
    <section className="py-20 px-4 bg-[#080808] border-t border-[#1F2937]">
      <div className="max-w-xl mx-auto text-center">
        <ScrollReveal direction="up">
          <p className="text-[#00E87A] font-mono text-xs uppercase tracking-[0.2em] mb-3">
            {eyebrow}
          </p>
          <h2 className="text-2xl sm:text-3xl font-mono font-bold text-[#F4F4F2] mb-3">
            {title}
          </h2>
          <p className="text-[#6B7280] font-mono text-sm mb-8">{subtitle}</p>

          <NewsletterForm locale={locale} />

          <p className="text-[#374151] font-mono text-xs mt-4">{note}</p>
        </ScrollReveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/marketing/newsletter-section.tsx
git commit -m "feat: add NewsletterSection component for homepage and blog"
```

---

## Task 6: Assemble Homepage with New Sections

**Files:**
- Modify: `src/app/[locale]/page.tsx`

The new section order is:
1. Hero (existing)
2. **Why ZeroEn** (new) — bg-[#080808]
3. **Tech Stack Terminal** (new) — bg-[#0D0D0D]
4. How It Works (existing) — bg-[#0D0D0D]
5. **Case Studies Preview** (new) — bg-[#080808]
6. Pricing (existing) — bg-[#080808]
7. Apply CTA (existing) — bg-[#0D0D0D]
8. **Newsletter** (new) — bg-[#080808]

- [ ] **Step 1: Update page.tsx imports and data**

Replace the entire file content:

```tsx
// src/app/[locale]/page.tsx
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Hero } from '@/components/marketing/hero';
import { WhyZeroEn } from '@/components/marketing/why-zeroen';
import { TechStackTerminal } from '@/components/marketing/tech-stack-terminal';
import { CaseStudiesPreview } from '@/components/marketing/case-studies-preview';
import { NewsletterSection } from '@/components/marketing/newsletter-section';
import { ScrollReveal } from '@/components/marketing/scroll-reveal';
import { StaggerChildren, StaggerItem } from '@/components/marketing/stagger-children';
import { GreenGlowLine } from '@/components/marketing/green-glow-line';
import { buildMetadata } from '@/lib/seo/metadata';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale === 'ja') {
    return buildMetadata({
      title: 'ZeroEn — 無料MVP・10%エクイティ。AIテクニカル共同創業者。',
      description:
        'スタートアップのMVPをエクイティと引き換えに無料で構築。AIを活用したフルスタックのテクニカル共同創業者を提供します。',
      path: '',
      locale,
      ogTitle: 'ZeroEn',
      ogSubtitle: '無料MVP・10%エクイティ。AIテクニカル共同創業者。',
    });
  }
  return buildMetadata({
    title: 'ZeroEn — Free MVP, 10% Equity. Your AI Technical Co-Founder.',
    description:
      "We build your startup's MVP for free in exchange for equity. Get a full-stack technical co-founder powered by AI.",
    path: '',
    locale,
    ogTitle: 'ZeroEn',
    ogSubtitle: 'Free MVP. 10% Equity. Your AI Technical Co-Founder.',
  });
}

const STEP_KEYS = [
  'discover', 'apply', 'score', 'onboard',
  'build', 'launch', 'operate', 'grow', 'upsell',
] as const;

const MVP_FEATURES = [
  'Full-stack MVP',
  'Supabase + Next.js',
  'Deploy to Vercel',
  '30 days support',
  '10% equity agreement',
];

const PLATFORM_FEATURES = [
  'Everything in MVP Build',
  'Hosting on our Vercel',
  '1 small fix/month',
  'Monthly analytics PDF',
  'Client dashboard access',
];

const PER_REQUEST_FEATURES = [
  'Small changes: $50–100',
  'Medium features: $200–500',
  'Large builds: $500–2,000',
  'Quoted upfront',
  'No surprises',
];

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ZeroEn',
  url: 'https://zeroen.dev',
  logo: 'https://zeroen.dev/logo-dark.svg',
  sameAs: ['https://twitter.com/zeroen_dev', 'https://instagram.com/zeroen_dev'],
};

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'ZeroEn Technical Co-Founder Service',
  provider: { '@type': 'Organization', name: 'ZeroEn', url: 'https://zeroen.dev' },
  description:
    'We build free MVPs for startups in exchange for equity. AI-powered full-stack technical co-founder service using Next.js and Supabase.',
  areaServed: 'Worldwide',
  serviceType: 'Software Development',
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('home');
  const tHiw = await getTranslations('howItWorks');

  const heroTexts = [t('hero.line1'), t('hero.line2'), t('hero.line3')];

  const steps = STEP_KEYS.map((key, index) => ({
    id: String(index + 1).padStart(2, '0'),
    name: tHiw(`steps.${key}.name`),
    desc: tHiw(`steps.${key}.desc`),
  }));

  // Why ZeroEn data
  const pillars = [0, 1, 2].map((i) => ({
    title: t(`whyZeroEn.pillars.${i}.title`),
    desc: t(`whyZeroEn.pillars.${i}.desc`),
  }));

  // Tech Stack data
  const techLines = [0, 1, 2, 3, 4, 5].map((i) => t(`techStack.lines.${i}`));
  const techTools = [0, 1, 2, 3].map((i) => ({
    name: t(`techStack.tools.${i}.name`),
    tag: t(`techStack.tools.${i}.tag`),
    desc: t(`techStack.tools.${i}.desc`),
  }));

  // Case studies data
  const caseStudyPlaceholders = [0, 1, 2].map((i) => ({
    name: t(`caseStudies.placeholders.${i}.name`),
    desc: t(`caseStudies.placeholders.${i}.desc`),
    stack: [0, 1, 2].map((j) => t(`caseStudies.placeholders.${i}.stack.${j}`)),
  }));

  return (
    <div className="bg-[#0D0D0D] text-[#F4F4F2]">
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />

      {/* ── Section 1: Hero ─────────────────────────────────── */}
      <Hero
        texts={heroTexts}
        subtitle={t('hero.subtitle')}
        ctaText={t('hero.cta')}
        locale={locale}
      />

      {/* ── Section 2: Why ZeroEn ────────────────────────────── */}
      <WhyZeroEn
        eyebrow={t('whyZeroEn.eyebrow')}
        title={t('whyZeroEn.title')}
        subtitle={t('whyZeroEn.subtitle')}
        pillars={pillars}
        urgency={t('whyZeroEn.urgency')}
        locale={locale}
        ctaText={t('hero.cta')}
      />

      {/* ── Section 3: Tech Stack Terminal ───────────────────── */}
      <TechStackTerminal
        eyebrow={t('techStack.eyebrow')}
        title={t('techStack.title')}
        subtitle={t('techStack.subtitle')}
        terminalTitle={t('techStack.terminalTitle')}
        lines={techLines}
        tools={techTools}
      />

      {/* ── Section 4: How It Works ──────────────────────────── */}
      <section className="py-24 px-4 bg-[#080808]">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal direction="up">
            <div className="mb-16 text-center">
              <p className="text-[#00E87A] font-mono text-xs uppercase tracking-[0.2em] mb-3">
                Process
              </p>
              <h2 className="text-3xl sm:text-4xl font-mono font-bold text-[#F4F4F2] mb-4">
                {t('howItWorks.title')}
              </h2>
              <p className="text-[#6B7280] font-mono text-sm">
                {t('howItWorks.subtitle')}
              </p>
            </div>
          </ScrollReveal>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#00E87A]/80 via-[#00E87A]/30 to-transparent" />
            <StaggerChildren className="space-y-0" staggerDelay={0.08}>
              {steps.map((step) => (
                <StaggerItem key={step.id}>
                  <div className="relative flex gap-6 pb-10 last:pb-0">
                    <div className="relative z-10 flex-shrink-0 w-12 flex items-start justify-center pt-1">
                      <div className="w-3 h-3 rounded-full bg-[#00E87A] shadow-[0_0_8px_rgba(0,232,122,0.6)] mt-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-3 mb-1">
                        <span className="text-[#00E87A] font-mono text-xs font-bold tracking-widest">
                          {step.id}
                        </span>
                        <span className="text-[#F4F4F2] font-mono font-bold text-base">
                          {step.name}
                        </span>
                      </div>
                      <p className="text-[#6B7280] font-mono text-sm leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </div>
      </section>

      {/* ── Section 5: Case Studies Preview ──────────────────── */}
      <CaseStudiesPreview
        eyebrow={t('caseStudies.eyebrow')}
        title={t('caseStudies.title')}
        subtitle={t('caseStudies.subtitle')}
        comingSoon={t('caseStudies.comingSoon')}
        placeholders={caseStudyPlaceholders}
      />

      {/* ── Section 6: Pricing ───────────────────────────────── */}
      <section className="py-24 px-4 bg-[#080808]">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal direction="up">
            <div className="mb-16 text-center">
              <p className="text-[#00E87A] font-mono text-xs uppercase tracking-[0.2em] mb-3">
                Pricing
              </p>
              <h2 className="text-3xl sm:text-4xl font-mono font-bold text-[#F4F4F2] mb-4">
                {t('pricing.title')}
              </h2>
              <p className="text-[#6B7280] font-mono text-sm">
                {t('pricing.subtitle')}
              </p>
            </div>
          </ScrollReveal>
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6" staggerDelay={0.12}>
            {/* MVP Build */}
            <StaggerItem>
              <div className="relative flex flex-col bg-[#111827] rounded-lg border border-[#374151] p-5 md:p-8 hover:shadow-[0_0_24px_rgba(0,232,122,0.1)] transition-all duration-300 h-full">
                <div className="mb-6">
                  <p className="text-[#6B7280] font-mono text-xs uppercase tracking-widest mb-2">MVP Build</p>
                  <div className="text-4xl font-mono font-bold text-[#F4F4F2] mb-1">$0</div>
                  <p className="text-[#6B7280] font-mono text-sm">Free for founders</p>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {MVP_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-2 font-mono text-sm text-[#9CA3AF]">
                      <span className="text-[#00E87A] flex-shrink-0 mt-0.5">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link href={`/${locale}/apply`} className="block text-center border border-[#374151] text-[#F4F4F2] font-mono text-sm uppercase tracking-widest py-3 px-6 rounded hover:border-[#00E87A] hover:text-[#00E87A] transition-all duration-200">
                  Apply Free
                </Link>
              </div>
            </StaggerItem>
            {/* Platform */}
            <StaggerItem>
              <div className="relative flex flex-col bg-[#111827] rounded-lg border-2 border-[#00E87A] p-5 md:p-8 shadow-[0_0_32px_rgba(0,232,122,0.2)] hover:shadow-[0_0_48px_rgba(0,232,122,0.3)] scale-[1.02] transition-all duration-300 h-full">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00E87A] text-[#0D0D0D] font-mono text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full">
                  Most Popular
                </div>
                <div className="mb-6">
                  <p className="text-[#00E87A] font-mono text-xs uppercase tracking-widest mb-2">Platform</p>
                  <div className="text-4xl font-mono font-bold text-[#F4F4F2] mb-1">$50<span className="text-xl text-[#6B7280]">/mo</span></div>
                  <p className="text-[#6B7280] font-mono text-sm">After your MVP launches</p>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {PLATFORM_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-2 font-mono text-sm text-[#9CA3AF]">
                      <span className="text-[#00E87A] flex-shrink-0 mt-0.5">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link href={`/${locale}/apply`} className="block text-center bg-[#00E87A] text-[#0D0D0D] font-mono font-bold text-sm uppercase tracking-widest py-3 px-6 rounded hover:bg-[#00ff88] transition-all duration-200 shadow-[0_0_16px_rgba(0,232,122,0.4)]">
                  Get Started
                </Link>
              </div>
            </StaggerItem>
            {/* Per-Request */}
            <StaggerItem>
              <div className="relative flex flex-col bg-[#111827] rounded-lg border border-[#374151] p-5 md:p-8 hover:shadow-[0_0_24px_rgba(0,232,122,0.1)] transition-all duration-300 h-full">
                <div className="mb-6">
                  <p className="text-[#6B7280] font-mono text-xs uppercase tracking-widest mb-2">Per-Request</p>
                  <div className="text-4xl font-mono font-bold text-[#F4F4F2] mb-1">From $50</div>
                  <p className="text-[#6B7280] font-mono text-sm">For extra work</p>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {PER_REQUEST_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-2 font-mono text-sm text-[#9CA3AF]">
                      <span className="text-[#00E87A] flex-shrink-0 mt-0.5">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link href={`/${locale}/pricing`} className="block text-center border border-[#374151] text-[#F4F4F2] font-mono text-sm uppercase tracking-widest py-3 px-6 rounded hover:border-[#00E87A] hover:text-[#00E87A] transition-all duration-200">
                  Learn More
                </Link>
              </div>
            </StaggerItem>
          </StaggerChildren>
        </div>
      </section>

      {/* ── Section 7: Apply CTA ─────────────────────────────── */}
      <section className="py-24 px-4">
        <GreenGlowLine className="mb-24" />
        <div className="max-w-2xl mx-auto text-center">
          <ScrollReveal direction="up">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-mono font-bold text-[#F4F4F2] mb-6">
              {t('applySection.title')}
            </h2>
            <p className="text-[#6B7280] font-mono text-sm mb-10">
              {t('applySection.subtitle')}
            </p>
            <Link
              href={`/${locale}/apply`}
              className="inline-block bg-[#00E87A] text-[#0D0D0D] font-mono font-bold uppercase tracking-widest text-sm px-8 py-4 md:px-12 md:py-5 rounded hover:bg-[#00ff88] active:scale-95 transition-all duration-150 shadow-[0_0_32px_rgba(0,232,122,0.5)] hover:shadow-[0_0_48px_rgba(0,232,122,0.7)] mb-6"
            >
              {t('applySection.cta')}
            </Link>
            <p className="text-[#374151] font-mono text-xs">
              No equity payment until your app launches.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Section 8: Newsletter ─────────────────────────────── */}
      <NewsletterSection
        eyebrow={t('newsletterSection.eyebrow')}
        title={t('newsletterSection.title')}
        subtitle={t('newsletterSection.subtitle')}
        note={t('newsletterSection.note')}
        locale={locale}
      />
    </div>
  );
}
```

- [ ] **Step 2: Run type check**

```bash
cd HQ/platform
npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors. Fix any type errors before continuing.

- [ ] **Step 3: Run dev server and visually verify**

```bash
cd HQ/platform
npm run dev
```

Open `http://localhost:3000/en` and verify:
- Hero renders correctly
- "Why ZeroEn" section appears below hero with 3 pillar cards and pulsing green dot
- Tech Stack Terminal section shows animated terminal lines and 4 tool cards
- How It Works section (unchanged)
- Case Studies Preview shows 3 placeholder cards with grid backgrounds
- Pricing section (unchanged)
- Apply CTA section (unchanged)
- Newsletter section appears at bottom

Also open `http://localhost:3000/ja` and verify Japanese text renders.

- [ ] **Step 4: Commit**

```bash
git add src/app/[locale]/page.tsx
git commit -m "feat: add WhyZeroEn, TechStackTerminal, CaseStudiesPreview, Newsletter to homepage"
```

---

## Task 7: Terms Page

**Files:**
- Create: `src/components/marketing/terms-accordion.tsx`
- Create: `src/app/[locale]/terms/page.tsx`

- [ ] **Step 1: Create the TermsAccordion client component**

The accordion uses `@base-ui/react/accordion` (already installed). Import from the existing `@/components/ui/accordion` wrapper.

```tsx
// src/components/marketing/terms-accordion.tsx
'use client';

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

interface AccordionSection {
  title: string;
  body: string;
}

interface TermsAccordionProps {
  heading: string;
  sections: AccordionSection[];
}

export function TermsAccordion({ heading, sections }: TermsAccordionProps) {
  return (
    <div>
      <h2 className="text-lg font-mono font-bold text-[#F4F4F2] mb-6 uppercase tracking-widest">
        {heading}
      </h2>
      <Accordion>
        {sections.map((section, i) => (
          <AccordionItem
            key={i}
            value={String(i)}
            className="border-b border-[#1F2937]"
          >
            <AccordionTrigger className="text-[#9CA3AF] hover:text-[#F4F4F2] font-mono text-sm py-4 transition-colors">
              {section.title}
            </AccordionTrigger>
            <AccordionContent className="text-[#6B7280] font-mono text-sm leading-relaxed pb-5">
              {section.body}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
```

- [ ] **Step 2: Create the terms page**

```tsx
// src/app/[locale]/terms/page.tsx
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { ScrollReveal } from '@/components/marketing/scroll-reveal';
import { GreenGlowLine } from '@/components/marketing/green-glow-line';
import { TermsAccordion } from '@/components/marketing/terms-accordion';
import { buildMetadata } from '@/lib/seo/metadata';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale === 'ja') {
    return buildMetadata({
      title: '利用規約 — ZeroEn',
      description: 'ZeroEnの標準契約条件。エクイティ、プラットフォーム費用、スコープ、強制終了条項の詳細。',
      path: '/terms',
      locale,
      ogTitle: '利用規約',
      ogSubtitle: 'わかりやすい契約内容',
    });
  }
  return buildMetadata({
    title: 'Terms — ZeroEn',
    description: "ZeroEn's standard contract terms. Equity, platform fee, scope freeze, kill switch — explained plainly.",
    path: '/terms',
    locale,
    ogTitle: 'Terms',
    ogSubtitle: 'The deal, in plain English',
  });
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('terms');

  const summaryItems = [0, 1, 2, 3, 4, 5].map((i) => ({
    label: t(`summary.items.${i}.label`),
    value: t(`summary.items.${i}.value`),
  }));

  const accordionSections = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => ({
    title: t(`full.sections.${i}.title`),
    body: t(`full.sections.${i}.body`),
  }));

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F4F4F2]">
      {/* Hero */}
      <section className="pt-32 pb-16 px-4 text-center">
        <ScrollReveal direction="up">
          <p className="text-[#00E87A] font-mono text-xs uppercase tracking-[0.2em] mb-4">
            {t('eyebrow')}
          </p>
          <h1 className="text-4xl sm:text-5xl font-mono font-bold text-[#F4F4F2] mb-6 whitespace-pre-line">
            {t('title')}
          </h1>
          <p className="text-[#6B7280] font-mono text-sm max-w-md mx-auto">
            {t('subtitle')}
          </p>
        </ScrollReveal>
        <GreenGlowLine className="mt-16" />
      </section>

      {/* Summary card */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal direction="up">
            <div className="bg-[#111827] border border-[#1F2937] rounded-lg overflow-hidden mb-16">
              {/* Terminal header */}
              <div className="flex items-center gap-1.5 px-4 py-3 bg-[#0D0D0D] border-b border-[#1F2937]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#374151]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#374151]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#374151]" />
                <span className="ml-auto text-[#374151] font-mono text-xs">terms.sh</span>
              </div>

              <div className="p-6 md:p-8">
                <p className="text-[#00E87A] font-mono text-xs uppercase tracking-widest mb-6">
                  {t('summary.heading')}
                </p>
                <dl className="space-y-4">
                  {summaryItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex flex-col sm:flex-row sm:gap-6 py-3 border-b border-[#1F2937] last:border-0"
                    >
                      <dt className="text-[#6B7280] font-mono text-xs uppercase tracking-wider w-full sm:w-36 flex-shrink-0 mb-1 sm:mb-0">
                        {item.label}
                      </dt>
                      <dd className="text-[#F4F4F2] font-mono text-sm">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </ScrollReveal>

          {/* Full legal accordion */}
          <ScrollReveal direction="up" delay={0.1}>
            <TermsAccordion
              heading={t('full.heading')}
              sections={accordionSections}
            />
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 3: Run type check**

```bash
cd HQ/platform
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 4: Verify in browser**

Open `http://localhost:3000/en/terms`. Verify:
- Hero section renders with "The deal, in plain English."
- Summary card shows 6 rows in terminal-style layout
- Accordion shows all 10 sections, each expandable
- Open `http://localhost:3000/ja/terms` — Japanese text renders

- [ ] **Step 5: Commit**

```bash
git add src/components/marketing/terms-accordion.tsx src/app/[locale]/terms/page.tsx
git commit -m "feat: add /terms page with plain English summary + full legal accordion"
```

---

## Task 8: Update Blog MDX Utils with Category Support

**Files:**
- Modify: `src/lib/mdx/utils.ts`
- Modify: `content/blog/en/why-zeroen-exists.mdx` (add category to frontmatter)
- Modify: `content/blog/ja/why-zeroen-exists.mdx` (add category to frontmatter)

- [ ] **Step 1: Update PostMeta interface and utils**

```ts
// src/lib/mdx/utils.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export type BlogCategory =
  | 'build-update'
  | 'case-study'
  | 'operator-log'
  | 'tutorial';

export interface PostMeta {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  locale: string;
  category?: BlogCategory;
  tags?: string[];
  author?: string;
}

export interface Post extends PostMeta {
  content: string;
}

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog');

export function getPostSlugs(locale: string): string[] {
  const dir = path.join(CONTENT_DIR, locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''));
}

export function getPostBySlug(slug: string, locale: string): Post | null {
  const filePath = path.join(CONTENT_DIR, locale, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    locale,
    title: data.title || slug,
    excerpt: data.excerpt || '',
    date: data.date || new Date().toISOString(),
    category: data.category,
    tags: data.tags || [],
    author: data.author,
    content,
  };
}

export function getAllPosts(locale: string): Post[] {
  const slugs = getPostSlugs(locale);
  return slugs
    .map((slug) => getPostBySlug(slug, locale))
    .filter((post): post is Post => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getAllPostsByCategory(
  locale: string,
  category: BlogCategory,
): Post[] {
  return getAllPosts(locale).filter((post) => post.category === category);
}
```

- [ ] **Step 2: Add category to existing blog post frontmatter**

Open `content/blog/en/why-zeroen-exists.mdx` and add `category: operator-log` to the frontmatter. The frontmatter should look like:

```mdx
---
title: Why ZeroEn Exists
excerpt: The story behind ZeroEn — why I'm building free MVPs for equity and what I'm betting on.
date: 2026-04-09
category: operator-log
tags: [origin-story, build-in-public]
author: ZeroEn
---
```

- [ ] **Step 3: Add category to JP frontmatter**

Open `content/blog/ja/why-zeroen-exists.mdx` and add `category: operator-log` similarly.

- [ ] **Step 4: Run type check**

```bash
cd HQ/platform
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/lib/mdx/utils.ts content/blog/en/why-zeroen-exists.mdx content/blog/ja/why-zeroen-exists.mdx
git commit -m "feat: add category field to blog PostMeta + update existing post frontmatter"
```

---

## Task 9: Update PostCard to Show Category Badge

**Files:**
- Modify: `src/components/blog/post-card.tsx`

- [ ] **Step 1: Update PostCard**

```tsx
// src/components/blog/post-card.tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/blog/post-card.tsx
git commit -m "feat: add category badge to PostCard"
```

---

## Task 10: Update Blog Listing with Category Filter + Newsletter

**Files:**
- Modify: `src/app/[locale]/blog/page.tsx`

The category filter uses `searchParams` so the page reads `?category=build-update` etc. from the URL. No client-side state needed.

- [ ] **Step 1: Update blog listing page**

```tsx
// src/app/[locale]/blog/page.tsx
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
```

- [ ] **Step 2: Run type check**

```bash
cd HQ/platform
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Verify in browser**

Open `http://localhost:3000/en/blog`. Verify:
- Category filter tabs appear above posts
- Clicking "Operator Log" filters to only operator-log posts
- Newsletter section appears at bottom of page

- [ ] **Step 4: Commit**

```bash
git add src/app/[locale]/blog/page.tsx
git commit -m "feat: add category filter tabs + newsletter section to blog listing"
```

---

## Task 11: Add Newsletter Section to Blog Post Page

**Files:**
- Modify: `src/app/[locale]/blog/[slug]/page.tsx`

- [ ] **Step 1: Add NewsletterSection import and render**

In `src/app/[locale]/blog/[slug]/page.tsx`, add the import at the top:

```tsx
import { NewsletterSection } from '@/components/marketing/newsletter-section';
```

Then insert the newsletter section between the article footer and the closing `</div>`:

Replace the existing footer section:

```tsx
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
    </div>
```

With:

```tsx
        {/* Footer CTA */}
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
```

- [ ] **Step 2: Commit**

```bash
git add src/app/[locale]/blog/[slug]/page.tsx
git commit -m "feat: add newsletter section to blog post page"
```

---

## Task 12: RSS Feed Route

**Files:**
- Create: `src/app/feed.xml/route.ts`

- [ ] **Step 1: Create the RSS route handler**

```ts
// src/app/feed.xml/route.ts
import { getAllPosts } from '@/lib/mdx/utils';

const BASE_URL = 'https://zeroen.dev';
const FEED_TITLE = 'ZeroEn — Build in Public';
const FEED_DESC = "Follow ZeroEn's journey building AI-powered startups.";
const FEED_LANG = 'en';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET(): Promise<Response> {
  const posts = getAllPosts('en');

  const items = posts
    .map(
      (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${BASE_URL}/en/blog/${post.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/en/blog/${post.slug}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      ${post.category ? `<category>${escapeXml(post.category)}</category>` : ''}
    </item>`,
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <link>${BASE_URL}/en/blog</link>
    <description>${escapeXml(FEED_DESC)}</description>
    <language>${FEED_LANG}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
```

- [ ] **Step 2: Verify RSS route in browser**

With dev server running, open `http://localhost:3000/feed.xml`.  
Expected: valid XML with a `<channel>` element containing `<item>` entries for each post.  
Copy the XML into an RSS validator (e.g. https://validator.w3.org/feed/) to confirm it's well-formed.

- [ ] **Step 3: Commit**

```bash
git add src/app/feed.xml/route.ts
git commit -m "feat: add RSS feed at /feed.xml"
```

---

## Task 13: Update Sitemap + Final Build Check

**Files:**
- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: Add /terms to MARKETING_PAGES**

In `src/app/sitemap.ts`, update the array:

```ts
const MARKETING_PAGES = [
  '',
  '/how-it-works',
  '/pricing',
  '/apply',
  '/blog',
  '/terms',
];
```

- [ ] **Step 2: Run a full production build**

```bash
cd HQ/platform
npm run build 2>&1 | tail -30
```

Expected: build completes with no errors. If there are errors, fix them before committing.

- [ ] **Step 3: Run lint**

```bash
cd HQ/platform
npm run lint 2>&1 | tail -20
```

Expected: no lint errors.

- [ ] **Step 4: Commit final changes**

```bash
git add src/app/sitemap.ts
git commit -m "feat: add /terms to sitemap"
```

- [ ] **Step 5: Final visual verification**

Open the dev server (`npm run dev`) and verify all pages:

| URL | Check |
|-----|-------|
| `/en` | All 8 sections render, animations work |
| `/ja` | All sections in Japanese |
| `/en/terms` | Summary card + accordion |
| `/ja/terms` | Japanese text |
| `/en/blog` | Category tabs, newsletter section |
| `/en/blog/why-zeroen-exists` | Category badge, newsletter section at bottom |
| `/feed.xml` | Valid RSS XML |

- [ ] **Step 6: Push branch**

```bash
git push origin HEAD
```

---

## Self-Review

**Spec coverage check:**

| PRD requirement | Covered by task |
|----------------|-----------------|
| "Why ZeroEn" section — "Build for free. Pay us when you win." | Task 2 + 6 |
| Interactive terminal tech stack showcase | Task 3 + 6 |
| Case studies preview — placeholder cards (app name, stack tags, screenshot) | Task 4 + 6 |
| Newsletter section — homepage + blog only | Task 5 + 6 + 10 + 11 |
| /terms page — two-version layout (summary + full legal) | Task 7 |
| Blog categories + tags | Task 8 + 9 + 10 |
| Blog: bilingual posts EN + JP | Existing — frontmatter updated in Task 8 |
| Blog: RSS feed | Task 12 |
| Blog: OG image per post | Existing `/api/og` route already handles this |
| Sitemap includes /terms | Task 13 |

**Placeholder scan:** No TBDs, no TODOs. All code is complete and specific.

**Type consistency:** `BlogCategory` defined in Task 8 and used in Tasks 9 + 10. `PostMeta.category` is `BlogCategory | undefined` throughout. `NewsletterSection` props consistent across Tasks 5, 6, 10, 11.
