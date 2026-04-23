# Client Lifecycle

**Read this when:** Onboarding a new client, understanding where a prospect sits in the funnel, or scheduling post-launch retainer work.

## 5-Step Client Journey

```
1. SCOPING CALL   → 30 min, free. Discuss product, timeline, and goals.
                    Booked via zeroen.dev/scoping-call (cal.com/zeroen/scoping-call).
                    Qualified leads: funded startups, established businesses, ¥380k+ budget.
                    Unqualified leads (idea-stage, no budget): polite redirect, no intake.

2. PROPOSAL       → Fixed-price proposal delivered within 48 hours of scoping call.
                    Specifies: tier, deliverables, timeline, milestone payment schedule.
                    Client signs or walks. No negotiating on equity or revenue share.

3. KICKOFF        → First milestone payment received.
                    /new-client <clientId> → repo created, Supabase project initialized.
                    First staging deploy within 48 hours of kickoff call.
                    Scope locked. Clock starts.

4. DELIVERY       → Weekly Loom demo video.
                    Staging environment always live.
                    Direct Slack or email access throughout.
                    Progress visible in real time. No "surprise reveals."

5. LAUNCH         → Final deploy to production.
                    Domain cutover, analytics verified, documentation delivered.
                    Final milestone payment received.
                    Retainer begins month after launch (if selected).
```

## Post-Launch (Retainer Active)

```
OPERATE  → Monthly retainer includes hosting, updates, analytics report (tier-dependent).
GROW     → Out-of-scope work at ¥15,000/hr via Stripe invoice.
UPSELL   → Analytics surface issues → natural pipeline to WebMori audit service.
```

## ICP Filter (Before Step 1)

Run the wizard or scoping-call intake. Route by stage:

| Stage | Action |
|-------|--------|
| Funded startup / established business | Book scoping call |
| Early revenue, ≥¥380k budget | Book scoping call |
| Pre-revenue, bootstrapped, no clear budget | Polite redirect — no intake |
| Idea stage | Polite redirect — no intake |

CRM segment taxonomy: `funded_founders_tokyo`, `japan_market_entry`, `bilingual_recruiting`, `foreign_owned_smb`, `japanese_startups_global`. Legacy clients tagged `legacy_icp`.
