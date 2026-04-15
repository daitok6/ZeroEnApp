<!-- ARCHIVED 2026-04-14 — Coconala channel dropped. See HQ/crm/coconala-playbook.md for the post-mortem. -->

# Coconala Profile — Account Rebrand Spec (Draft)

**Action:** Rebrand existing `webmori` account to `ZeroEn / 大都`. See `webmori-takedown-checklist.md` for execution steps.

---

## 表示名（Display Name）

```
ZeroEn / 大都
```

Rationale: Brand leads (ZeroEn is the durable asset), human name follows (JP platforms favor real-name trust signals). 大都 = operator.

## プロフィール画像（Avatar）

- File: `docs/logo-icon.svg`
- Rendering: Export to PNG at 500×500px, transparent background → white padding (Coconala crops to circle)
- The Electric Green (#00E87A) icon mark on a dark backdrop

## カバー画像（Cover）

Operator to render. Spec:

- Dimensions: 1600×400px (Coconala cover standard)
- Background: `#0D0D0D` (brand dark)
- Center: tagline 「アイデアを、形にする。」 in **Murecho** font, color `#F4F4F2`
- Bottom-right corner: small "ZeroEn" wordmark (DM Sans) in Electric Green
- No other elements. No stock photos. Terse.

## 自己紹介文（Bio, ~500 chars)

```
元日立製作所・元楽天のWebエンジニア、大都です。

ZeroEn（ゼロエン）では、個人事業主様・小規模事業者様のランディングページを制作・運用しています。初期費用ゼロ、月額ホスティング契約のみのシンプルなモデルです。

現在、先着5名様限定で無料制作枠を受付中です。レビュー・実績作りのため、ビール1杯分のお気持ちだけいただく価格設定にしています。

技術スタック：Next.js / React / TypeScript / Vercel
ポートフォリオ：https://zeroen.dev

ご相談・お見積もりはDMでお気軽にどうぞ。
```

## 対応可能時間

- 平日 9:00–20:00（JST）
- 週末は返信が遅れる場合あり

## 本人確認・ランク表示

- 本人確認バッジ：取得済み（要確認）
- 機密保持契約：締結可
- 電話・Zoom対応：可（ヒアリング時）

## 外部リンク

- 公式サイト：https://zeroen.dev
- Note：（ `note-article.ja.md` 公開後に追加）
- X：（operator's JP handle）

## 保有スキル・資格

- Next.js / React / TypeScript
- Vercel / Supabase / Stripe
- SEO・Core Web Vitals最適化
- モバイルファースト設計

---

## Change summary (vs current `webmori` account)

| Field | Before (webmori) | After (ZeroEn / 大都) |
|---|---|---|
| Display name | webmori | ZeroEn / 大都 |
| Avatar | (whatever current) | `docs/logo-icon.svg` Electric Green icon |
| Bio | audit-focused | build-focused, credential-led |
| Active listings | ¥10,000 site audit | ¥500 LP intake (new) |
| Brand association | WebMori (sister brand) | ZeroEn (primary brand) |

WebMori as a brand stays **off-Coconala**. Audit services move to WebMori's own channels per `PRD.md`.
