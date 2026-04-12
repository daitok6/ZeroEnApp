# WebMori → ZeroEn Coconala Account Migration Checklist

**Execution:** Manual, operator-driven. This is ops, not automation.
**Goal:** Rebrand the existing `webmori` Coconala account to `ZeroEn / 大都`, pause the ¥10,000 site audit listing, and publish the new ¥500 LP intake listing — while preserving WebMori as a separate sister brand off-Coconala.

---

## Pre-flight (before touching the account)

- [ ] Screenshot current `webmori` profile page (bio, avatar, cover, active listings) — save to `HQ/marketing/campaigns/2026-04-first-5/assets/webmori-before/`
- [ ] Screenshot the ¥10,000 audit listing page (all fields, FAQ, reviews if any)
- [ ] Export any existing reviews / testimonials (Coconala → プロフィール → 評価一覧). Save as `.md` for portfolio reuse later.
- [ ] Confirm with operator: WebMori brand keeps its own website / domain / socials. Only the Coconala account is being repurposed.

## Step 1 — Pause the audit listing

- [ ] Coconala dashboard → 出品管理 → select the ¥10,000 audit listing
- [ ] Change status to **非公開（Pause）**, NOT delete. Preserves URL + any review history.
- [ ] If there are active in-progress orders, complete them first. Do not pause mid-delivery.
- [ ] Add an internal note: "Paused 2026-04-12 for ZeroEn rebrand. Audit services migrated to WebMori direct channels."

## Step 2 — Rename the account

- [ ] Coconala → アカウント設定 → 表示名 → change from `webmori` to `ZeroEn / 大都`
- [ ] If Coconala requires legal name separately, ensure 大都's real name is registered in 本人情報 but only display name is public-facing
- [ ] Save changes. Note Coconala may require re-verification for display name changes.

## Step 3 — Update profile assets

Spec is in `coconala-profile.ja.md`. Apply:

- [ ] **Avatar:** Replace with Electric Green icon mark rendered from `docs/logo-icon.svg` (500×500px PNG, white padding around the icon since Coconala crops to circle)
- [ ] **Cover:** 1600×400px. Background `#0D0D0D`. Tagline 「アイデアを、形にする。」 in Murecho, color `#F4F4F2`. Small "ZeroEn" wordmark (DM Sans) bottom-right in `#00E87A`. Operator to render.
- [ ] **Bio:** Paste copy from `coconala-profile.ja.md` (~500 chars, opens with 元日立・元楽天 credentials, includes portfolio link to zeroen.dev)
- [ ] **Skills / tags:** Update to Next.js, React, TypeScript, Vercel, ランディングページ制作, Web制作
- [ ] **External links:** Add https://zeroen.dev and (after Day 1) the note article URL

## Step 4 — Publish the new listing

- [ ] Create new listing using copy from `coconala-listing.ja.md`
- [ ] Title: 先着5名｜元日立・元楽天エンジニアがLPを無料制作
- [ ] Category: IT・プログラミング > ホームページ作成
- [ ] Price: ¥500
- [ ] Delivery: 3 days
- [ ] Revisions: 1
- [ ] Fill in 購入にあたっての注意事項 verbatim from the draft — **the 6-month ¥5,000 commitment must be visible pre-purchase**
- [ ] FAQ section: copy all Q/A pairs from the draft
- [ ] Pre-launch check: read the listing top-to-bottom as a prospective buyer. Anything surprising? Any hidden info? Fix before publishing.
- [ ] Publish.

## Step 5 — Verification after publish

- [ ] Open listing in incognito / logged-out browser. Confirm visible.
- [ ] Verify 注意事項 is fully visible before the 購入 button
- [ ] Verify no direct Stripe link in the listing body (ToS safety)
- [ ] Verify portfolio link resolves to https://zeroen.dev
- [ ] Verify display name shows `ZeroEn / 大都` on listing card
- [ ] Check mobile layout (most Coconala traffic is mobile)
- [ ] Send listing URL to operator's personal phone — does it feel trustworthy on first read?

## Step 6 — WebMori brand preservation (off-Coconala)

- [ ] Confirm WebMori's own channels (website if any, social accounts) still exist and remain under WebMori brand
- [ ] Do NOT announce the Coconala rename on WebMori channels — the two brands stay independent per PRD
- [ ] If any past WebMori customers inquire about the Coconala audit listing, respond privately: "The audit service has moved. DM me for current options." Do not publicly link the two.

## Rollback plan

If the rebrand causes issues (verification lock, account suspension, etc.):

- [ ] Revert display name to `webmori`
- [ ] Re-publish the paused audit listing
- [ ] Contact Coconala support
- [ ] Escalate to operator — the ZeroEn launch can proceed on Lancers / CrowdWorks / MENTA in the meantime

---

## Sign-off

- [ ] Operator confirms all steps above complete
- [ ] Screenshots of NEW profile + NEW listing saved to `HQ/marketing/campaigns/2026-04-first-5/assets/coconala-after/`
- [ ] Note in operator log: "Coconala rebrand executed YYYY-MM-DD HH:MM."
