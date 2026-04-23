# CLAUDE.md — ZeroEn Platform
**The ONE TRUTH for Claude Code in this repo.** Last updated: 2026-04-23

ZeroEn = bilingual product studio. Production-grade bilingual Next.js + Supabase + Stripe products for funded founders and serious businesses in Tokyo. Fixed price. No equity. Shipped in weeks. Domain: `zeroen.dev`. Full plan: `PRD.md`.

---

## Core Rules

1. Every command requires a `clientId`. No exceptions.
2. Client code lives in `Clients/<clientId>/`. HQ code lives in `HQ/`. Never mix.
3. **Three tiers:** Starter (¥380k) / Growth (¥880k) / MVP Build (¥1.5–2.5M). Fixed price, no equity, no rev share.
4. All sites deploy on the operator's Vercel account.
5. Scope locked at kickoff. Anything beyond = ¥15,000/hr per-request charge (`HQ/crm/change-catalogue.md`).
6. Never expose secrets. Redact keys/tokens/credentials in all outputs.
7. Operator reviews everything before client delivery. Never auto-send.
8. All social posts: reviewed by `mktg-copy` + `mktg-strategy` before operator sees them.
9. Quality gates must pass before production deploy (`HQ/docs/quality-gates.md`).
10. Code ownership transfers to client on final payment. Retainer is optional (30-day notice to cancel).
11. All intake via zeroen.dev/scoping-call. Milestone billing via Stripe.
12. ICP gate: minimum ¥380k engagement. No free builds, no equity arrangements, no ¥0-upfront offers.

---

## Brand Kit (always apply)

- Primary accent: `#00E87A` (Electric Green) · Background: `#0D0D0D` · Text: `#F4F4F2`
- Fonts: Syne (headings) · IBM Plex Mono (body/UI) · Murecho (JP) · DM Sans (logo wordmark only)
- Tokens: `HQ/brand/tokens.css` · `HQ/brand/tokens.json` · Full spec: `HQ/brand/brand-kit.md`
- Logos: `docs/logo-dark.svg`, `docs/logo-full.svg`, `docs/logo-icon.svg`

Never invent colors or fonts. Import `HQ/brand/tokens.css` for any UI.

---

## Project Structure

```
ZeroEn/
├── CLAUDE.md, PRD.md
├── docs/                   ← Brand assets (logos)
├── HQ/                     ← Tracked
│   ├── agents/ brand/ commands/ skills/ templates/ platform/ marketing/
│   ├── crm/                ← clients.json, change-catalogue.md
│   ├── docs/               ← On-demand reference docs (read when relevant)
│   └── scripts/            ← clone-all.sh
└── Clients/                ← Gitignored, each clientId = own public repo
```

---

## Tech Stack

Next.js (App Router) · React · Tailwind · shadcn/ui · Supabase (auth + DB + RLS) · Stripe (billing) · Resend (email) · next-intl (EN/JA routing) · Vercel hosting (operator's Pro) · GitHub auto-deploy · Lucide icons.

---

## Commands (all require `clientId`)

| Command | Purpose |
|---|---|
| `/new-client <clientId>` | Clone template, set up CLAUDE.md, register in CRM |
| `/report <clientId>` | Scrape Vercel analytics → branded PDF |
| `/deploy <clientId>` | Quality gates → production |
| `/status <clientId>` | Status, last deploy, next report, plan tier, billing |

---

## Anti-Patterns

- No command without `clientId` · No client code in ZeroEn repo · No deploy without gates · No auto-send to clients · No scope change without pricing update · No secrets in client repos · No change quote without referencing `HQ/crm/change-catalogue.md` · No equity, rev share, or free builds · No ¥0-upfront language anywhere · ¥15k/hr only for out-of-scope work

---

## On-Demand References (read when relevant)

| Topic | File |
|---|---|
| Pricing, tiers, upgrades, revenue streams | `HQ/docs/revenue-model.md` |
| Change pricing & sizing | `HQ/crm/change-catalogue.md` |
| Client lifecycle (5-step flow) | `HQ/docs/client-lifecycle.md` |
| Agents catalogue (business, mktg, dev) | `HQ/docs/agents-catalogue.md` |
| Quality gates pipeline | `HQ/docs/quality-gates.md` |
| Monthly report pipeline | `HQ/docs/report-pipeline.md` |
| Contract terms (standard clauses) | `HQ/docs/contract-terms.md` |
| Git strategy (platform remote, clone-all) | `HQ/docs/git-strategy.md` |
| Client registry (infra) | `HQ/crm/clients.json` |
| Client data (platform, paying) | Supabase via `HQ/platform/` |
| Full business plan | `PRD.md` |

**Efficiency:** For research >20 lines of output, prefer `mcp__plugin_context-mode_context-mode__ctx_batch_execute` over raw Bash/Read.
