# Campaign: First 5 Priority Slots (2026-04)

Lead-gen launch for ZeroEn's free-build program. Rebrands the existing `webmori` Coconala account to `ZeroEn / 大都`, replaces the ¥10,000 audit listing with a ¥500 "buy me a beer" intake listing, and seeds cross-platform distribution.

## Framing (non-negotiable)

- **Scarcity, not deadline:** 先着5名. Never "4月限定" / "April only" — free builds continue past April and time-boxed framing would be misleading.
- **Credential-first trust:** 元日立・元楽天エンジニア + 大都 up front. Not vague experience claims.
- **Scope honesty:** ¥500 = intake + scoping call. Free build = 1 page, 3 sections, 1–3 day delivery, Vercel hosting. Recurring ¥5,000/月 (6-month minimum) stated in 注意事項 before purchase.

## Success metrics (60-day horizon)

- 5 paid intakes (¥500 × 5)
- 3 Coconala reviews rated ≥ 4.5★
- ≥1 conversion to Stripe recurring (¥5,000/mo on zeroen.dev)

## Timeline

| Day | Action | File |
|-----|--------|------|
| 0 | Rebrand Coconala account, pause WebMori audit listing, publish new listing | `webmori-takedown-checklist.md`, `coconala-profile.ja.md`, `coconala-listing.ja.md` |
| 1 | Publish credibility anchor on Note | `note-article.ja.md` |
| 2 | Launch X threads (JP + EN) linking to Note + Coconala | `x-twitter-thread.ja.md`, `x-twitter-thread.en.md` |
| 3–5 | Mirror listings on Lancers, CrowdWorks, MENTA, TimeTicket | `lancers-crowdworks-listing.ja.md`, `menta-timeticket-listing.ja.md` |
| 7+ | Daily build-in-public tweet cadence (separate track) | — |

## Dependency flow

```
        note-article.ja.md
               │
               ▼
   x-twitter-thread.*.md ──────┐
               │               │
               ▼               ▼
   coconala-listing.ja.md   lancers / crowdworks
               ▲                     │
               │                     ▼
         MENTA / TimeTicket (free consult → Coconala intake)
```

All outbound links from X / Note / Lancers / MENTA ultimately route qualified leads to the Coconala ¥500 intake (ToS-safe entry point).

## Workflow (per CLAUDE.md rule #9)

Each file is a **draft**. Every post must clear `mktg-copy` (voice + copy) and `mktg-strategy` (strategic fit) review, then operator approval, before publishing. Nothing in this directory auto-posts.

## Out of scope

- zeroen.dev Stripe checkout build (separate track)
- Paid ads (`mktg-paid` dormant)
- Video content
- Reddit r/japanlife (add later if JP platforms underperform)
