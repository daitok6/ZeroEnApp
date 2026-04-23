# ZeroEn Positioning — Bilingual Product Studio (2026-Q2)

**Owner:** mktg-gtm · **Reviewed by:** mktg-strategy · **Date:** 2026-04-23 · **Replaces:** SaaS-Primary Q2 positioning (old ICP — coaches/therapists/Peraichi)

---

## The single offer

**We build production-grade bilingual Next.js + Supabase + Stripe products for funded founders and serious businesses in Tokyo. Fixed price. No equity. Shipped in weeks.**

This is the ONLY story across zeroen.dev, all marketing pages, X (EN), note (JP), cold email, and any channel active during the Phase 1 rebuild.

---

## Primary ICP

**Foreign founder in Tokyo who just closed a seed or pre-seed round.** English-first, bilingual need, urgent timeline, cash on hand. Has already learned that Japanese agencies quote ¥8M and 4 months. Understands the value of a fast, bilingual, production-quality build.

**Secondary ICPs (in priority order):**
1. Foreign companies entering Japan market — bilingual site/product for Japan launch
2. Bilingual recruiting and staffing agencies — candidate acquisition through web presence
3. Foreign-owned SMBs in Tokyo — Western revenue model, online presence drives sales
4. Funded Japanese startups — needing English-facing product for global fundraising

**Explicit skips:** Flower shops, cafes, restaurants (unless foreign-owned chain), solo coaches, therapists, independent consultants, idea-stage bootstrapped founders, any Japanese SMB where website doesn't drive sales.

Full ICP details: `PRD.md` → Ideal Customer Profile section.

---

## Hero copy

### EN (primary — zeroen.dev default, /en route)

> **Bilingual SaaS, shipped.**
> We build production-grade bilingual web products for funded founders and serious businesses in Tokyo. Fixed price. No equity. Shipped in weeks.

CTA button 1: **Book a scoping call** → `/scoping-call`
CTA button 2: **See the pricing** → `/pricing`

### JP (/ja route)

> 「バイリンガルSaaS、確実に出荷。」
> 資金調達済みのスタートアップと東京で真剣にビジネスを営む企業向けに、プロダクショングレードのバイリンガルWebプロダクトを制作。固定価格、エクイティ不要、数週間で納品。

CTA: **スコーピングコール を予約** → `/ja/scoping-call`

---

## Nav structure (zeroen.dev)

1. **Home** (`/`) — new hero, ICP pillars, deliverable pillars, "Built by ZeroEn" proof
2. **How It Works** (`/how-it-works`) — 5-step process, plain text, no stock art
3. **Pricing** (`/pricing`) — 3 tier cards, Growth emphasized, comparison table, FAQ
4. **Case Studies** (`/cases`) — ZeroEn self + WebMori (technical write-ups), placeholder for first paying client
5. **Startups** (`/startups`) — funded-founder-specific LP
6. **Book a call** (`/book-a-call` or direct `/scoping-call`) — minimal intake + calendar

No more `/apply` as the primary conversion path. `/scoping-call` is the CTA everywhere.

---

## Pricing page structure

| | Starter | Growth ★ | MVP / SaaS Build |
|---|---|---|---|
| One-time | ¥380,000 | ¥880,000 | ¥1,500,000–¥2,500,000 |
| Monthly retainer | ¥15,000/mo | ¥35,000/mo | ¥80,000–¥150,000/mo |
| Timeline | 14 business days | 21-28 business days | 6-8 weeks |
| Payment | 50/50 | 40/30/30 | 30/30/30/10 |

**Growth tier is visually emphasized.** All prices in JPY with small USD parenthetical at current FX.

**Anchor copy:** Compare ¥880k to a Japanese agency quote (typically ¥5-10M for equivalent scope) or hiring a bilingual full-stack engineer for 3 months (¥2-3M all-in).

Full pricing details: `HQ/docs/revenue-model.md`.

---

## Competitive positioning

| Competitor | Their weakness | ZeroEn angle |
|---|---|---|
| Japanese web agency | ¥8M+ quotes, 4-6 month timelines, no bilingual UX expertise | Same output, 4-6x faster, 5-10x cheaper, EN/JA from day one |
| Offshore dev shops | Don't understand bilingual UX or Japanese legal requirements (tokushoho, etc.) | Tokyo-based, bilingual native, Japan-specific compliance built in |
| Freelancer + PM combo | Can't architect auth-and-billing SaaS, coordination overhead, no single owner | One senior operator, full-stack, bilingual, end-to-end accountability |
| No-code builders | No real scalability, platform lock-in, can't handle JP-style billing/auth flows | Production-grade code, no lock-in, Supabase + Stripe native |

---

## Do's & Don'ts

| DO | DON'T |
|---|---|
| Lead with "Bilingual SaaS, shipped." | Lead with "free", "¥0 upfront", or equity language |
| Name specific stack (Next.js + Supabase + Stripe) | Say "modern tech stack" |
| Quote specific timelines and prices | Hide pricing behind "contact us" |
| Use ZeroEn + WebMori as first-party proof | Claim multiple clients before they exist |
| Show bilingual capability in every headline | Treat bilingual as a feature, not the core differentiator |
| Write in terse, confident voice | Hedge or use corporate softening language |
| Link to `/scoping-call` for every CTA | Use "get in touch" or "apply" as the CTA |

---

## Content themes (Phase 1 — what to publish)

Priority posts for the next 3 weeks of content:
1. "Why we stopped taking equity" — transparent pivot post, valuable for search and sales calls
2. "The real cost of a bilingual SaaS MVP in 2026" — ZeroEn vs. agency vs. offshore vs. freelancer
3. "The Next.js + Supabase + Stripe architecture we use for every build" — technical credibility
4. "Tokushoho for bilingual e-commerce: what foreign founders get wrong" — niche, specific, ICP-targeted
5. "Inside ZeroEn: how we built our own platform in 8 weeks solo" — case study + credibility

Platform: note (JP), X threads (EN), Qiita/Zenn (technical JP). Stagger over 2-3 weeks.

---

## Booking funnel

```
All CTAs → /scoping-call (zeroen.dev/scoping-call)
             ↓
        cal.com/zeroen/scoping-call (EN)
        cal.com/zeroen/scoping-call-ja (JP)
             ↓
        30-min scoping call
             ↓
        Fixed-price proposal within 48 hours
```

No form-submit-and-wait. Every flow ends at a calendar booking.

---

## Related

- ICP detail: `PRD.md` → Ideal Customer Profile
- Revenue model: `HQ/docs/revenue-model.md`
- Client lifecycle: `HQ/docs/client-lifecycle.md`
- Phase 1 review queue (borderline content decisions): `HQ/docs/phase1-review-queue.md`
