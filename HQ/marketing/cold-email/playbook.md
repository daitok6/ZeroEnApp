# Cold Email Playbook — ZeroEn

**Owner:** operator · **Channel:** primary outbound (post-Coconala) · **Updated:** 2026-04-15

---

## The one rule

Every email must pass this test: if you remove the personalized first line, does the email still make sense? If yes, the personalization isn't working — rewrite it so the observation is structurally load-bearing.

---

## Daily rhythm (4h/day)

| Block | Time | Output |
|---|---|---|
| Lead sourcing + qualification | 90 min | 15–20 leads → `HQ/crm/leads.csv` |
| Tailored emails (Claude-assisted via `/cold-email`) | 90 min | 10–15 first-touch sends |
| Follow-ups + reply handling | 45 min | Sequence steps 2–4, reply notes |
| CRM hygiene | 15 min | Update `status` + `last_contact` in CSV |

Target: **60 first-touch sends/week, 240/month.** At 8% reply / 2% call / 30% close ≈ 1–2 clients/month.

---

## Lead source stack (Tier A first)

### Tier A — High-intent

| Source | How to find | Signal type |
|---|---|---|
| ペライチ sites (coaches) | Google: `site:hp.peraichi.com コーチ` or `セラピスト` | `peraichi_mobile_broken` |
| ストアカ instructors | [street-academy.com](https://www.street-academy.com/) by category | `storaca_instructor` |
| Note writers (last 30 days, no real LP) | Note search: コーチング / セラピスト / 起業 | `recent_note_post` |
| MOSH/Coachly active listers | Browse listings, check "outside platform" contact | `mosh_user` |

### Tier B — Mid-intent

| Source | Signal type |
|---|---|
| ICF Japan / 日本コーチ連盟 member directories | `credentialed_coach` |
| Instagram coach accounts (1k–10k, Linktree bio) | `instagram_no_lp` |
| Recently launched JP coaching podcasts | `podcast_trigger` |
| Facebook groups (DM from post, never post in group) | `fb_group_dm` |

### Tier C — Volume backfill

| Source | Signal type |
|---|---|
| Lancers/CrowdWorks HP制作 job posts | `marketplace_buyer` |
| Google Maps "カウンセリング"/"コーチング" no website | `gmaps_no_site` |

---

## `leads.csv` schema

```
leadId, name, role, niche, source, source_url, current_lp_url, lp_problems,
signal_type, signal_detail, captured_date, status, last_contact, notes
```

**Status values:** `new` → `email_1_sent` → `email_2_sent` → `email_3_sent` → `email_4_sent` → `replied` → `booked` → `closed_won` / `closed_lost` / `no_response`

---

## Email structure (Observation → Problem → Proof → Ask)

**Language:** Japanese, です/ます tone. Peer-level, not keigo overload. Read aloud — if it sounds like a pitch deck, rewrite.

**From:** operator real name + `daito.k631@gmail.com`  
**Signature:** `[name] / ZeroEn — zeroen.dev`  
**Opt-out footer (every email):** 「今後不要であれば返信不要です。一度きりの個別連絡です。」

### Subject lines

- 「[名前]さんのLPを見て」
- 「コーチ向けLPの件」
- 「ペライチ→Next.jsの件」
- **Avoid:** 【】brackets, 「無料」in subject, emojis, 「Re:」fake threading

### The magnet (not a meeting request)

Ask: 「もしご興味あれば、現状のLPに5分だけ目を通して気付きをお送りします（無料・営業なし）」

This is a **free LP teardown** offer. ~10 min to deliver. Sidesteps the 営業電話 reflex. Natural bridge to "want me to fix these? ¥5k/mo."

---

## 4-touch sequence (18 days)

| Step | Day | Angle | Target length |
|---|---|---|---|
| 1 | 0 | Observation → problem → proof link → teardown offer | ~150 JP chars |
| 2 | +4 | 1 specific insight from their LP (proof you looked deeper) | ~100 chars |
| 3 | +10 | Social proof — WebMori before/after or 1-line quote | ~120 chars |
| 4 | +18 | Breakup: close cleanly, leave door open | ~80 chars |

Each follow-up stands alone — prospect may not have read previous emails.

---

## Per-lead workflow

1. Add lead row to `HQ/crm/leads.csv`
2. Run `/cold-email <leadId>` → Claude generates tailored JP email
3. Operator reviews → approves or requests revision
4. Operator sends from Gmail
5. Apply Gmail label: `ZeroEn/Cold/{Sent,Replied,Booked,Closed,Lost}`
6. Draft saved at `HQ/marketing/cold-email/drafts/<leadId>-step1.md`
7. Repeat for steps 2–4 as days pass

---

## Key objections to handle in emails

| Objection | Answer |
|---|---|
| 「なぜ無料？」 | 制作は無料。月¥5,000の運用費で収益化。お互い健全な関係。 |
| 「解約は？」 | 6ヶ月コミット後はいつでも可。途中解約は残月分。 |
| 「コードの所有権は？」 | ZeroEnが保有。Shopifyと同構造。コンテンツはあなたのもの。 |
| 「3日で本当に？」 | Next.js+テンプレート+あなたのコピー=72時間。WebMoriさんも3日でした。 |
| 「以前ゴーストされた」 | Stripe請求・契約書・運営者実名。毎月レポートが届かなければ返金。 |

Full objection list: `HQ/marketing/research/icp-profile.md` §6.

---

## Do NOT do

- Open with 「お世話になっております」「〇〇と申します、突然のご連絡失礼します」
- Use 【】, 全角スペース, excessive keigo
- Ask for a 30-minute call in the first touch
- Send "Just checking in" follow-ups with no new value
- Scrape behind logins (Instagram DMs, gated FB groups)
- Re-add a lead to sequence within 6 months of step 4

---

## Compliance (特定電子メール法)

- Sender identity must be clear (real name + email)
- Opt-out instruction in every email (included in footer above)
- Public business contacts only — no scraping gated sources
- Real reply-to address (`daito.k631@gmail.com`)

If daily send volume exceeds 30/day for >2 weeks: set up `daito@zeroen.dev` with SPF/DKIM/DMARC + gradual warmup before switching.

---

## Quality check (before every send)

- [ ] Does it sound like a human wrote it? (read aloud)
- [ ] Would YOU reply to this if you received it?
- [ ] Is the observation connected to the problem (not just an attention hook)?
- [ ] One CTA, low friction?
- [ ] Opt-out footer included?
- [ ] `mktg-copy` review done for first 10 emails?
