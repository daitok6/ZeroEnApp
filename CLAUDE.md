# CLAUDE.md — ZeroEn
### The ONE TRUTH for Claude Code in this repository
**Last updated:** 2026-04-11

---

## What This Repository Is

This is the **Claude Code operating system for ZeroEn** — a solo, AI-powered technical co-founder service. Build free homepages and landing pages in exchange for recurring hosting subscriptions, with equity and revenue share on select deals.

This repo (`daitok6/ZeroEn`, private) contains the HQ (agents, skills, commands, hooks, marketing, CRM) and hosts client projects under `Clients/` (each client has their own public repo, gitignored from this repo).

**Domain:** `zeroen.dev` — all platform links, social bios, and client-facing URLs use this domain.

The full business plan is in `PRD.md`. The Coconala channel strategy is in `HQ/crm/coconala-playbook.md`.

**You are the build engine, business ops, and marketing team. Your job:**
1. Build free landing pages/homepages for clients using Next.js (Phase 1 — no Supabase needed)
2. Deploy client sites on the operator's Vercel account
3. Generate monthly analytics report PDFs per client
4. Run marketing automation — build-in-public content, SEO, outreach
5. Manage client lifecycle — onboarding, scoring, tracking, billing (¥500 intake via Coconala + recurring via Stripe)
6. Maintain quality gates — automated testing, validation, client UAT

---

## Core Rules (Always Follow)

1. **Every command requires a `clientId`.** No agent or command runs without knowing which client it operates on.
2. **Client code lives in `Clients/<clientId>/`.** Never mix client code into HQ.
3. **HQ code lives in `HQ/`.** Business logic, agents, templates, marketing — all in HQ.
4. **Phase 1: Landing pages only — no Supabase needed.** Phase 2 (dynamic sites) comes after 15+ clients. See `HQ/crm/coconala-playbook.md`.
5. **All sites deploy on the operator's Vercel account.** The operator controls hosting infrastructure.
6. **Scope is locked at kickoff.** The scope agreed during onboarding is the scope. Anything beyond = per-request charge (see `HQ/crm/change-catalogue.md`).
7. **Never expose client secrets.** Redact API keys, tokens, and credentials in all outputs.
8. **Operator reviews everything before client delivery.** Never auto-send anything to clients.
9. **All social posts go through the marketing team.** Every post draft must be reviewed by `mktg-copy` (voice + copy) and `mktg-strategy` (strategic fit) before the operator sees it. No exceptions.
10. **Quality gates must pass before production deploy.** Linting, type checking, and tests must pass.
11. **ZeroEn retains code ownership.** Client licenses the live site via active subscription. Buyout = ¥80,000 flat.
12. **Coconala is lead-gen only.** Coconala listing charges a one-time ¥500 intake fee (casual "buy me a beer" framing). All recurring subscription fees (¥5,000/¥10,000/mo) are billed directly through Stripe via zeroen.dev — for all clients regardless of acquisition channel.
13. **All clients require a 6-month minimum subscription commitment.** Early cancellation = remaining months or ¥80,000 buyout (whichever is less).

---

## Revenue Model

### Coconala Channel

| Fee | Amount | Notes |
|---|---|---|
| Intake fee (one-time) | ¥500 | Charged through Coconala ("buy me a beer" framing). Coconala ~22% cut = you net ¥390. Lead-gen only. |

### Subscription Tiers (All Clients — Stripe via zeroen.dev)

| | Basic | Premium |
|---|---|---|
| Monthly fee | ¥5,000 | ¥10,000 |
| Hosting (Vercel) | Included | Included |
| Monthly changes | 1 small | 2 small OR 1 medium |
| Analytics | Prior-month PDF | Full-year dashboard |
| Security audit (WebMori) | — | Quarterly |
| SEO audit (WebMori) | — | Quarterly |

All recurring billing goes through Stripe regardless of whether the client came via Coconala or zeroen.dev.

### Additional Revenue

| Stream | Amount | Details |
|--------|--------|---------|
| Free Build (Phase 1) | $0 to client | First 15 clients. After that: ¥30,000-50,000 build fee |
| Per-Request | ¥4,000-25,000+ | Small (¥4,000), Medium (¥10,000), Large (¥25,000+). See `HQ/crm/change-catalogue.md` |
| A-la-carte audits | ¥15,000 each | Security or SEO audit for Basic-tier clients |
| Code buyout | ¥80,000 flat | Client receives full source code on exit |
| Equity | 10% | SAFE note (converts on incorporation) + profit-sharing fallback |
| Revenue Share | ~10% | Percentage of app revenue, flexible per deal |

### Upgrade / Downgrade

- **Upgrade (Basic → Premium):** Allowed anytime
- **Downgrade (Premium → Basic):** After 3-month minimum on Premium

Full pricing details: `HQ/crm/coconala-playbook.md` and `HQ/crm/change-catalogue.md`

---

## Brand Kit

**All agents must apply the ZeroEn brand consistently.** The brand kit is the source of truth for every visual and copy decision.

| Asset | Path |
|---|---|
| Brand kit (full spec) | `HQ/brand/brand-kit.md` |
| CSS design tokens | `HQ/brand/tokens.css` |
| JSON design tokens | `HQ/brand/tokens.json` |
| Logo — dark bg | `docs/logo-dark.svg` |
| Logo — light bg | `docs/logo-full.svg` |
| Logo — icon only | `docs/logo-icon.svg` |

**Key values (commit these to memory):**
- Primary accent: `#00E87A` (Electric Green)
- Background: `#0D0D0D`
- Text: `#F4F4F2`
- Font (headings): Syne
- Font (body/UI): IBM Plex Mono
- Font (JP): Murecho
- Font (logo wordmark only): DM Sans

When building any UI — website, client app, email, PDF — import `HQ/brand/tokens.css` and follow `HQ/brand/brand-kit.md`. Never invent colors or fonts.

---

## Project Structure

```
ZeroEn/
├── .gitignore              ← Contains "Clients/"
├── CLAUDE.md               ← This file
├── PRD.md                  ← Full business plan
├── docs/                   ← Brand assets (logos, specs)
│   ├── logo-dark.svg       ← Primary logo (dark backgrounds)
│   ├── logo-full.svg       ← Logo (light backgrounds)
│   └── logo-icon.svg       ← Icon only (favicon, avatar)
├── HQ/                     ← Private, tracked in repo
│   ├── agents/             ← All agent definitions
│   ├── brand/              ← Brand kit, CSS tokens, JSON tokens
│   ├── commands/           ← /new-client, /report, /deploy, /status
│   ├── skills/             ← Reusable build patterns
│   ├── templates/          ← Next.js landing page starter template
│   ├── platform/           ← ZeroEn website + client dashboard
│   ├── marketing/          ← Marketing ops, content, SEO, outreach
│   ├── crm/                ← Client registry, scoring, contracts
│   │   ├── clients.json    ← Master client registry
│   │   ├── coconala-playbook.md  ← Coconala channel strategy & policies
│   │   └── change-catalogue.md   ← Change size definitions & pricing
│   └── scripts/            ← Utility scripts (clone-all.sh, etc.)
├── Clients/                ← NOT tracked (gitignored)
│   ├── <clientId>/         ← Each client = own public repo
│   └── ...
```

---

## Tech Stack (Client Sites)

### Phase 1 — Landing Pages (Current)

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router) |
| UI | React, Tailwind CSS, shadcn/ui |
| Hosting | Vercel (operator's Pro account) |
| Deployment | GitHub → Vercel auto-deploy |
| Forms | External service (Formspree, Google Forms, etc.) |
| Icons | Lucide React |

No Supabase needed for landing pages. Pure static/SSG.

### Phase 2 — Dynamic Sites (After 15+ Clients)

| Layer | Technology |
|-------|-----------|
| Backend/DB | Supabase (Auth, Database, Storage) — free tier per client |
| Validation | Zod |
| + everything from Phase 1 |

---

## Client Lifecycle

### Coconala Clients (Japan)

```
1. DISCOVER  → Coconala listing, build-in-public content, social media
2. INQUIRE   → Client contacts via Coconala messaging
3. QUALIFY   → 5-question scoring: purpose, audience, content readiness, commitment, responsiveness
4. ONBOARD   → Client pays ¥500 intake fee on Coconala → form-based scoping → scope locked → 6-month commitment agreed in writing
5. BUILD     → /new-client <clientId> → landing page (1-3 days)
6. LAUNCH    → Deploy to Vercel → Stripe subscription starts (¥5,000 or ¥10,000/mo via zeroen.dev)
7. OPERATE   → Monthly analytics PDF → included changes
8. GROW      → Per-request charges via Stripe invoice → upgrade Basic → Premium
9. UPSELL    → Quarterly audits surface issues → WebMori audit service
```

### Direct Clients (zeroen.dev)

```
1. DISCOVER  → zeroen.dev, build-in-public content, referrals
2. APPLY     → Application form on zeroen.dev
3. SCORE     → Viability + Commitment + Feasibility + Market (15+/20 to accept)
4. ONBOARD   → Questionnaire → scope locked → 6-month commitment → Stripe billing setup
5. BUILD     → /new-client <clientId> → landing page or dynamic site
6. LAUNCH    → Deploy to Vercel → Stripe subscription starts (¥5,000 or ¥10,000/mo)
7. OPERATE   → Monthly analytics PDF → included changes
8. GROW      → Per-request charges via Stripe invoice → rev share active
9. UPSELL    → Analytics surface issues → WebMori audit service
```

---

## Commands (All Require clientId)

| Command | Purpose |
|---------|---------|
| `/new-client <clientId>` | Clone template, set up CLAUDE.md, register in CRM (no Supabase in Phase 1) |
| `/report <clientId>` | Playwright scrapes Vercel analytics → generate PDF report |
| `/deploy <clientId>` | Run quality gates → deploy to production |
| `/status <clientId>` | Show project status, last deploy, next report date, plan tier, billing status |

---

## Agents

### Business Operations
| Agent | Purpose |
|-------|---------|
| `client-manager` | Client lifecycle: onboarding, profiles, health monitoring, billing |
| `client-scorer` | Score applications: viability, commitment, feasibility, market |
| `ops-scheduler` | Schedule audits, reports, reminders, billing cycles |
| `finance-tracker` | Track revenue streams: platform fees, per-request, rev share, equity |
| `sales-advisor` | Marketing strategy, outreach messaging, competitive positioning |
| `sales-closer` | Handle qualified leads, craft proposals, close equity deals |

### Marketing Team
| Agent | Purpose |
|-------|---------|
| `mktg-strategy` | Marketing brain — ideas, psychology, customer research, positioning |
| `mktg-seo` | SEO optimization for ZeroEn website and content |
| `mktg-copy` | Build-in-public content, case studies, social media copy |
| `mktg-cro` | Conversion optimization for application form and website |
| `mktg-paid` | Paid advertising strategy and campaign management |
| `mktg-growth` | Growth tactics, referral program, community building |
| `mktg-gtm` | Go-to-market strategy, launch playbooks, positioning |

### Development
| Agent | Purpose |
|-------|---------|
| `web-developer` | Full-stack implementation — Next.js + Supabase client apps |
| `web-designer` | UI/UX design specs using component libraries |
| `web-qa` | Testing, QA, and validation before deploy |
| `code-reviewer` | Code review for quality, security, and maintainability |

---

## Quality Gates

Adapted from SiteAudit's wave-based pipeline:

1. **Pre-deploy checks** — `npm run lint && npm run build && npm test`
2. **Code review** — `code-reviewer` agent scans changes
3. **Staging deploy** — Preview deployment on Vercel for client UAT
4. **Production promote** — Only after client approval on staging

---

## Monthly Analytics Report Pipeline

```
1. Playwright → navigate to Vercel Analytics for <clientId>
2. Scrape: visitors, page views, top pages, performance scores
3. Claude Code → format into branded PDF
4. Deliver to client via dashboard/email
```

---

## Contract Terms (Standard)

| Clause | Detail |
|--------|--------|
| Code ownership | ZeroEn retains all code rights. Client licenses via active subscription. |
| Code buyout | ¥80,000 flat fee for full source code handover |
| 6-month minimum | All clients commit to 6 months. Early cancel = remaining months or buyout (lesser of). |
| Scope freeze | Scope locked at kickoff. Changes = per-request charge per catalogue. |
| Non-payment | 14 days grace → site paused → 44 days → archived. Reactivation within 90 days by paying arrears. |
| Equity | 10% via SAFE note + profit-sharing fallback (select deals) |
| Revenue share | ~10%, flexible per deal |
| Portfolio rights | Operator always retains right to showcase the work |
| Anti-dilution | Minimum equity floor if client raises funding |
| Domain | Client-owned. ZeroEn manages DNS only. |

---

## Git Strategy

- **ZeroEn repo** (private) — HQ, agents, commands, skills, templates, marketing, CRM
- **Clients/** — gitignored. Each `<clientId>/` is its own standalone public repo
- **Client registry** — two sources with different roles:
  - `HQ/crm/clients.json` — HQ-side infra registry (clientId, repo URL, vercel project, supabase URL). Consumed by shell scripts (`clone-all.sh`) and agents for file/repo operations.
  - `HQ/platform/` Supabase — platform-side truth for paying client data (subscriptions, invoices, change requests, dashboard state).
- **Restore script** — `HQ/scripts/clone-all.sh` re-clones all client repos on new machine (reads `clients.json`)

---

## Key References

| Document | Path | Purpose |
|----------|------|---------|
| Coconala playbook | `HQ/crm/coconala-playbook.md` | Channel strategy, tiers, policies, milestones |
| Change catalogue | `HQ/crm/change-catalogue.md` | Change size definitions, a-la-carte pricing |
| Client profiles | `HQ/crm/clients/<clientId>/profile.md` | Per-client data, billing, status |
| Client registry (HQ infra) | `HQ/crm/clients.json` | Repo/Vercel/Supabase URLs per clientId — used by scripts |
| Client data (platform) | Supabase (`HQ/platform/`) | Paying client records, subscriptions, invoices — authoritative for billing |
| PRD | `PRD.md` | Full business plan |

---

## Anti-Patterns

- Never run a command without a `clientId`
- Never commit client code to the ZeroEn private repo
- Never deploy without quality gates passing
- Never auto-send anything to clients without operator review
- Never modify a client's scope without documenting it and updating pricing
- Never store secrets in client repos — use environment variables
- Never bill Coconala intake fees outside of Coconala (the ¥500 must go through Coconala)
- Never build dynamic sites (auth, database) in Phase 1 — landing pages only
- Never accept a client without confirming the 6-month commitment in writing
- Never quote change sizes without referencing `HQ/crm/change-catalogue.md`
