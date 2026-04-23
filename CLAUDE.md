# CLAUDE.md — ZeroEn
**The ONE TRUTH for Claude Code in this repo.** Last updated: 2026-04-23

ZeroEn = bilingual product studio. Fixed-price Next.js + Supabase + Stripe SaaS for funded founders and serious businesses in Tokyo. Three tiers: ¥380k Starter / ¥880k Growth / ¥1.5-2.5M MVP Build. No equity, no revenue share. HQ lives here; client projects live under `Clients/` (gitignored, each client = own public repo). Domain: `zeroen.dev`. Full plan: `PRD.md`.

---

## Core Rules

1. Every command requires a `clientId`. No exceptions.
2. Client code lives in `Clients/<clientId>/`. HQ code lives in `HQ/`. Never mix.
3. **Three tiers:** Starter (¥380k+¥15k/mo) · Growth (¥880k+¥35k/mo) · MVP Build (¥1.5-2.5M+¥80-150k/mo). Fixed price, milestone payments. No equity, no revenue share.
4. All sites deploy on the operator's Vercel account.
5. Scope locked at kickoff. Anything beyond = ¥15,000/hr per-request (`HQ/crm/change-catalogue.md`).
6. Never expose secrets. Redact keys/tokens/credentials in all outputs.
7. Operator reviews everything before client delivery. Never auto-send.
8. All social posts: reviewed by `mktg-copy` + `mktg-strategy` before operator sees them.
9. Quality gates must pass before production deploy (`HQ/docs/quality-gates.md`).
10. ZeroEn retains code ownership. Client licenses the live site via active retainer. On cancel: 30-day notice, site archived, code stays with ZeroEn.
11. All intake via zeroen.dev/scoping-call. Billing via Stripe invoices.
12. **ICP gate:** minimum ¥380k engagement. Idea-stage / pre-revenue-bootstrapped prospects get a polite redirect, not an intake.

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
│   ├── crm/                ← clients.json, change-catalogue.md, coconala-playbook.md
│   ├── docs/               ← On-demand reference docs (read when relevant)
│   └── scripts/            ← clone-all.sh
└── Clients/                ← Gitignored, each clientId = own public repo
```

---

## Tech Stack

Next.js (App Router) · React · Tailwind · shadcn/ui · Supabase · Stripe · Vercel (operator's Pro) · GitHub auto-deploy · Resend · next-intl (EN/JA) · Lucide icons.

Phase 2 details: `HQ/docs/phase-2-stack.md` (do not use until 15-client gate).

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

- No command without `clientId` · No client code in ZeroEn repo · No deploy without gates · No auto-send to clients · No scope change without pricing update · No secrets in client repos · No equity/rev-share offers · No "¥0 upfront" or "free" language on public surfaces (except "free 30-min scoping call") · No client onboarded without signed fixed-price proposal · No change quote without referencing `HQ/crm/change-catalogue.md` · No out-of-scope work at a rate other than ¥15,000/hr

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
| Phase 2 tech stack | `HQ/docs/phase-2-stack.md` |
| Coconala post-mortem (channel abandoned) | `HQ/crm/coconala-playbook.md` |
| Client registry (infra) | `HQ/crm/clients.json` |
| Client data (platform, paying) | Supabase via `HQ/platform/` |
| Full business plan | `PRD.md` |

**Efficiency:** For research >20 lines of output, prefer `mcp__plugin_context-mode_context-mode__ctx_batch_execute` over raw Bash/Read.
