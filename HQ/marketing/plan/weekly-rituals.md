# Weekly Operator Rituals — 90-Day MRR Push

**Purpose:** Fixed rhythm so execution doesn't drift. Designed for 15-25h/wk operator budget.
**Owner:** operator (executes) · ops-scheduler (reminds) · **Date:** 2026-04-14

---

## The weekly shape (at a glance)

```
Mon  ████████░░  measure + decide (2h)
Tue  ██████░░░░  publish long-form (1.5h)
Wed  ████████░░  sales rhythm (2h)
Thu  ████████████ outbound + threads (3h)
Fri  ████████░░  retro + prep (2h)
Sat  ██░░░░░░░░  light touch (0.5h)
Sun  ░░░░░░░░░░  rest (optional 1h ops prep)
───
Total ≈ 11-15h baseline; +4-8h for client build work = 15-23h total
```

---

## Monday — Measure & decide (~2h)

| Time | Ritual | With | Output |
|---|---|---|---|
| 09:00 | MRR + pipeline review | finance-tracker | Updated `HQ/marketing/metrics/funnel.md` |
| 09:30 | Risk register walk-through | finance-tracker | Any 🔴 triggers actions today |
| 10:00 | Publish week's content calendar | ops-scheduler | Scheduled tweets, queued Note draft |
| 10:30 | Client check-ins (each active client) | client-manager | Messages sent, issues logged |
| 11:00 | X JP daily tweet | mktg-copy (batched Fri) | Live |

---

## Tuesday — Publish long-form (~1.5h)

- 09:00 — Note article goes live (reviewed Fri prior)
- 10:00 — X JP tweet linking Note article
- 14:00 — Coconala / Lancers / MENTA DM triage (≤2h SLA from inbound)

---

## Wednesday — Sales rhythm (~2h)

- 09:00 — Pipeline review with client-scorer + sales-advisor: scored applicants, proposals in flight, follow-ups due
- 10:00 — Send sales-closer drafted proposals (operator approves + sends)
- 14:00 — X EN build-in-public tweet
- 16:00 — Cold email list cleanup (bounces, opt-outs, replies triage)

---

## Thursday — Outbound + threads (~3h)

- 09:00 — Cold email batch send (50/wk, from W2; 100/wk from W8 if capacity)
- 10:00 — X JP thread (long-form narrative)
- 14:00 — Coconala DM triage + proactive outreach to favoriters
- 16:00 — Respond to any podcast / guest-post pitches

---

## Friday — Retro & prep (~2h)

| Time | Ritual | With | Output |
|---|---|---|---|
| 10:00 | Content retro: what converted, what didn't | mktg-copy + mktg-strategy | `content-log.md` updated |
| 11:00 | Next-week content review (Rule #9 batch) | mktg-copy + mktg-strategy | Week N+1 calendar approved |
| 14:00 | X EN thread | — | Live |
| 16:00 | Finance close of week | finance-tracker | MRR, pipeline, cash snapshot |

---

## Saturday — Light touch (~30min)

- 1 share-style X JP post (RT with commentary on an industry post)
- Coconala DM triage only if inbound
- Optional: office hours for lead calls (batch 2-3 if requested)

---

## Sunday — Rest + ops prep (~1h, optional)

- Review next week's calendar (visual scan)
- Glance at dashboards
- No publishing. No reviews.

---

## Daily habits (~45min, any time)

1. **Coconala / Lancers / MENTA DM triage** — ≤2h reply SLA during JST working hours
2. **X JP short post** — 1 build-in-public tidbit (a number, a mini-story, a progress screenshot)
3. **Inbox zero for zeroen.dev apply submissions** — route to client-scorer within 24h

---

## Monthly (not weekly)

- **1st:** Monthly analytics PDF per active client (ops-scheduler + web-developer)
- **1st:** Invoice generation review (Stripe auto)
- **15th:** Client health check — each client profile reviewed by client-manager
- **15th:** MRR forecast update + risk register quarterly walk
- **Last Fri:** Brand audit — any drift from `positioning.md`? Fix or update the spec

---

## Tool stack (≤¥10k/mo target)

| Tool | Purpose | Cost |
|---|---|---|
| Coconala / Lancers / CrowdWorks / MENTA / TimeTicket | Inbound listings | free |
| Note | Long-form content | free |
| X (Twitter) | Daily short-form | free (X Premium optional ¥1k/mo) |
| Stripe | Subscription billing | 3.6% per charge |
| Vercel Pro | Hosting (shared across all clients) | ¥3k/mo |
| GA4 | Analytics | free |
| Ubersuggest free / Ahrefs Webmaster Tools free | Keyword research | free / ~¥3k/mo if upgrading |
| ConvertKit free / Buttondown | Email (cold outbound + newsletter) | free tier to 1k subs |
| Linear free | Pipeline tracking | free tier |
| Google Workspace | Email + Drive | ¥680/user/mo |
| NotebookLM | Research synthesis | free |
| Playwright (self-hosted) | Coconala/analytics scraping | free |

Remainder of ¥10-30k/mo budget is buffer for: unlocked paid ads post-W8, ad-hoc copy contractor for JP nuance review, premium keyword tool trial.

---

## Anti-patterns (don't do these)

- Don't publish outside the calendar without Rule #9 review
- Don't skip Monday review — compounding drift
- Don't reply to DMs with ChatGPT/generic text; this is the ICP's objection "I've been ghosted before"
- Don't commit to a client without client-scorer 15+/20
- Don't let Sat/Sun become work days — recovery is the deliverable

---

## When to call a reset

If 2 Monday reviews in a row show ≥2 🔴 triggered risks, escalate to a 30-min reset meeting:
- Review `risk-register.md`
- Amend `/Users/Daito/.claude/plans/golden-puzzling-bubble.md`
- Notify mktg-strategy + sales-advisor

---

## Related

- Content calendar: `HQ/marketing/plan/content-calendar.md`
- Risk register: `HQ/marketing/plan/risk-register.md`
- Positioning: `HQ/marketing/plan/positioning.md`
- Analytics: `HQ/marketing/plan/analytics-spec.md`
