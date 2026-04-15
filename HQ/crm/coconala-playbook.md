# Coconala Channel — Post-Mortem

**Status: CHANNEL ABANDONED — 2026-04-14**

This document records why ZeroEn abandoned the Coconala channel. Do not re-open without a new strategy session that resolves the structural incompatibility documented below.

---

## Timeline

| Date | Event |
|------|-------|
| 2026-04-XX | Listing published: `先着5名！LP無料制作のご相談・要件定義ます` (service 4169857) |
| 2026-04-14 | Coconala ops took down the listing, citing four ToS violations |
| 2026-04-14 | Decision made to abandon the channel |

---

## Takedown Notice — Four Violations

Coconala cited the following (verbatim):

**1. External URLs**
> 直接やり取り可能なサイトの情報を掲載しているサービス
> （該当箇所：https://www.webmori.jp/ja , https://zeroen.dev）

**2. Off-platform recurring contract + trust room limit**
> 直接契約を結ぶ恐れのあるサービス / トークルームの提供期限（120日）を超える恐れのあるサービス
> （該当箇所：月額¥5,000のホスティング契約（6ヶ月〜））

**3. Unverifiable price comparison (景品表示法)**
> 運営にて事実確認ができない販売価格との比較をしているサービス
> （該当箇所：業界相場（初期20〜50万＋月1〜3万））

**4. Refund guarantee**
> 返金保証を行うと判断されるサービス
> （該当箇所：スコープ不一致の場合¥1,000返金。）

---

## Why the Model Is Structurally Incompatible

All four violations trace to the same root: **ZeroEn's model is subscription-based; Coconala's ToS is designed to keep all commerce on-platform within a 120-day trust room.**

Any compliant Coconala listing must either:
- (A) Drop the recurring subscription tail → becomes a one-shot commodity service, no recurring revenue
- (B) Keep the subscription but strip all mentions → invisible to buyers; still detectable by reviewers; and arguably deceptive

Neither option works for ZeroEn. Even a fully compliant rewrite would face re-review risk because the economics of "free LP for ¥1,000" invite scrutiny. The recurring subscription is the business model; removing it from Coconala removes the channel's value.

**Net per-buyer yield analysis:**
- Best-case compliant listing: ¥20k LP build in ホームページ作成 category
- Net after 22% commission: ~¥15,600
- Organic tail to zeroen.dev subscription: <20% (search-based, not engineer-able; cannot be mentioned in listing or trust room)
- Hours to rewrite listing + regenerate 8 images + survive reviewer re-review: 4-8 hours
- Verdict: poor yield for a leaky funnel

---

## Decision

**Coconala abandoned 2026-04-14.** The listing was taken down by Coconala ops and will not be resubmitted.

Acquisition moves entirely to:
- **zeroen.dev** — primary intake (application form + Stripe)
- **Cold email** — PRIMARY engine (税理士/社労士 offices → referral bounty; 個人事業主 with weak web presence direct)
- **X (Twitter)** — build-in-public distribution
- **note** — SEO-driven long-form content (a01–a04 shipped 2026-04-14)
- **Google Ads** — ¥5k/mo test to build battle-tested ad, ready to scale when budget unlocks

**Channels evaluated and dropped (same structural risk or wrong audience):**
- **MENTA** — wrong audience (engineer/career mentees, not SMB owners); pitch contortion required; same ToS risk if reviewers catch off-platform subscription; opportunity cost = 200+ cold emails. Dropped 2026-04-14.
- **Lancers / CrowdWorks** — same off-platform recurring ToS risk as Coconala. Not listed.
- **TimeTicket / ストアカ** — one-shot formats, no recurring fit.
- **Meta / FB / IG Ads** — low purchase intent; only viable at ¥50k+/mo budget.

---

## Archived Assets

Coconala listing and image files are archived (not deleted) for reference:
- `HQ/marketing/campaigns/2026-04-first-5/coconala-listing.ja.archived.md`
- `HQ/marketing/campaigns/2026-04-first-5/coconala-profile.ja.archived.md`
- `HQ/marketing/campaigns/2026-04-first-5/assets/coconala-archived/` (9 HTML files)

---

## Rule

Do not re-open the Coconala channel without:
1. A specific plan for how to offer a self-contained deliverable entirely within the Coconala trust room (no recurring tail, no external URLs)
2. A separate business model review that does not rely on the subscription funnel from Coconala
3. Explicit operator sign-off after reviewing this post-mortem

---

## References

- Change catalogue: `HQ/crm/change-catalogue.md`
- Client profiles: `HQ/crm/clients/<clientId>/profile.md`
- Campaign archive: `HQ/marketing/campaigns/2026-04-first-5/`
- PRD: `PRD.md`
