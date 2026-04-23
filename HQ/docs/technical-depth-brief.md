# ZeroEn — Technical Depth Brief
*Use this to explain what you built and how. Written for interviews, portfolio contexts, and investor conversations.*

---

## What Is ZeroEn?

ZeroEn is a **bilingual product studio** — a bootstrapped SaaS platform I designed and built from scratch to run a productized service business. The core idea: I build production-grade bilingual Next.js + Supabase + Stripe products for funded founders and serious businesses in Tokyo, at fixed price (¥380k / ¥880k / ¥1.5–2.5M), with optional monthly retainers. The platform manages the entire client lifecycle — from scoping call and proposal through build, launch, and ongoing operations — with one operator (me) and no team.

The business goal: reach ¥300,000+/mo net MRR by August 2026.

---

## Architecture Overview

ZeroEn is a **multi-tenant SaaS platform** with two distinct surfaces:

1. **zeroen.dev** — The public-facing product: marketing site, application funnel, client dashboard, and admin panel. This is the platform clients log into and where billing, requests, and communications happen.
2. **Clients/** — Each client gets their own Next.js site in its own GitHub repo, deployed to my Vercel account, with its own Supabase project. These are fully isolated.

The ZeroEn platform itself is the **operations layer** — it manages clients, not the client sites directly.

---

## Tech Stack (and why)

| Layer | Choice | Rationale |
|---|---|---|
| Framework | **Next.js 16 (App Router)** | Full-stack in one repo: server components, API routes, and SSG for marketing pages. No separate backend. |
| Language | **TypeScript 5** | Type safety across the full stack, especially important for the Supabase schema and API contracts. |
| Styling | **Tailwind 4 + shadcn/ui** | Design system with composable primitives; shadcn gives full ownership of component code — no black boxes. |
| Database | **Supabase** | Postgres with SSR-compatible auth, row-level security, and a generous free tier. Each client gets its own isolated Supabase project. |
| Payments | **Stripe** | Subscription lifecycle (create, change plan, cancel, webhooks), plus invoice generation for per-request charges. |
| Email | **Resend** | Transactional email for client notifications, digests, and admin alerts. |
| Hosting | **Vercel Pro** | Auto-deploy from GitHub, cron jobs via vercel.json, preview deployments for client UAT. |
| AI | **Anthropic SDK** | Claude integrated into internal workflows — copy refresh, content generation, digest automation. |
| Animations | **Framer Motion** | UI polish on the marketing site and design wizard. |
| Charts | **Recharts** | Client analytics dashboards (monthly reports). |
| i18n | **next-intl** | Locale-based routing (`/en/` vs `/ja/`) — Japanese market is primary. |

---

## What I Actually Built

### 1. Multi-Locale Marketing Site
Full marketing funnel at `/[locale]/(marketing)/`: home, pricing, how-it-works, client case studies, blog, a startup-specific landing page, and a legal page (特商法 / tokushoho) required for Japanese commerce law compliance. All routes are SSG where possible, switching to SSR only where personalization or auth state is needed.

### 2. Application + Onboarding Funnel
A multi-step **Design Wizard** (`/design-wizard/`) collects business information, brand references, goals, and assets from accepted applicants. Progress is tracked server-side via API route (`/api/design-wizard/`) and stored in Supabase. This feeds directly into the build kickoff, replacing a fragmented email + form process.

### 3. Client Dashboard
Protected routes under `/(app)/dashboard/` give each client visibility into:
- **Messages** — threaded communication channel
- **Invoices** — approve/reject per-request charges before payment
- **Requests** — submit and track new feature requests
- **Audits** — monthly site audit reports
- **Analytics** — Vercel analytics piped into a Recharts dashboard
- **Billing** — Stripe subscription management (plan tier, cancel, upgrade)
- **Documents** — contract and agreement access
- **Notifications** — system-generated alerts

### 4. Admin Panel
Operator-facing routes under `/(app)/admin/`:
- **Client list + detail views** — full client registry with status, plan, and billing state
- **Task management** — calendar and list views for delivery tracking
- **Audit upload** — push monthly audit reports directly to client dashboards
- **Invoice approval workflow** — generate and send per-request invoices
- **Request queue** — triage incoming client change requests

### 5. API Layer (30+ routes)
Key API surface:
- **Stripe webhooks** — handle subscription created/updated/cancelled, invoice paid/failed; sync state to Supabase
- **Cron jobs** (via Vercel): message digest every 30 min, morning digest nightly, daily content generation, monthly analytics report, copy refresh reset
- **Admin CRUD** — clients, invoices, requests, audits, documents
- **Public** — LP inquiry form, newsletter subscribe

### 6. CRM + Client Registry
`HQ/crm/clients.json` is a structured registry tracking every client's: clientId, status, GitHub repo, Vercel URL, Supabase project, plan tier, and notes. Each client also gets a `profile.md` and `revenue.md` under `HQ/crm/clients/[clientId]/`. A `clone-all.sh` script restores all client repos on any new machine.

### 7. Cold Email + Content Pipeline
`HQ/marketing/` houses: ICP research, competitor matrix, demand signals, pricing benchmarks, and a full cold email campaign system with per-lead step sequences (lead-001 through lead-070+) and archiving by ICP segment. Content for Note and Zenn platforms is managed here too, with articles targeting pain points, comparisons, and migration guides.

### 8. Brand System
Design tokens in `HQ/brand/tokens.css` and `HQ/brand/tokens.json` define the full brand: Electric Green `#00E87A` primary, `#0D0D0D` background, Syne headings, IBM Plex Mono body, Murecho for Japanese text. All UI imports from these tokens — no color or font is invented in component code.

---

## Key Technical Decisions

**Why one Supabase project per client instead of multi-tenant?**
Isolation by default. Row-level security on a shared schema adds complexity and a misconfiguration risk that could leak client data. Free tier per project makes this economically viable at current scale. When Phase 2 opens (15+ clients), this gets revisited.

**Why no backend server / separate API?**
Next.js API routes handle all server logic. At this stage, keeping the stack in one repo eliminates operational overhead — no separate service to deploy, monitor, or version. The trade-off is that compute lives on Vercel Functions, which is perfectly suited to this request pattern.

**Why Stripe for invoicing instead of a dedicated billing tool?**
Stripe handles both subscription lifecycle and one-off invoice generation. Per-request charges (¥4,000–¥25,000+) are issued as Stripe invoices, keeping billing in one system and eliminating reconciliation complexity.

**Why shadcn/ui over a headless or fully managed component library?**
Ownership. shadcn copies components into your codebase — no upstream version lock-in, no surprise API changes, full control over behavior and styling. This matters when client sites need brand-specific customization.

**Why Claude in the stack?**
Automated content operations: daily copy generation, monthly content refresh resets, and morning digests for operator awareness. The Anthropic SDK is wired into cron jobs that run without operator intervention.

---

## Scale Context

- **Clients tracked**: CRM active, cold email pipeline seeded (70+ leads)
- **API routes**: 30+
- **Cron jobs**: 5 scheduled automations running in production
- **Locales**: 2 (en, ja) with full route coverage
- **Content assets**: 9+ platform articles (Note + Zenn) per campaign, multiple campaign batches

---

## What Makes This Technically Interesting

1. **It's a real business**, not a demo — production Stripe webhooks, real client data, real billing.
2. **Solo-operated at scale** — the entire platform is designed so one person can manage 30 clients without a team. Automation (cron jobs, Claude, structured CRM) replaces headcount.
3. **Multi-tenant isolation without a shared schema** — each client is a genuine isolated deployment.
4. **Full-stack TypeScript throughout** — from DB types (`database.ts`) through API contracts to UI components.
5. **Japanese market compliance built in** — tokushoho legal page, JP locale routing, Murecho font, Japanese-language content pipeline.
