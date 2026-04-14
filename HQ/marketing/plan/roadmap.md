# 90-Day Roadmap — Consolidated Timeline

**Window:** 2026-04-14 → 2026-07-14 (13 weeks) · **Target:** ¥300k MRR · **Base case:** ¥200k · **Owner:** operator · **Updated:** 2026-04-14

Single-page gantt view of every major deliverable on one timeline. Built from `golden-puzzling-bubble.md` + `content-calendar.md` + `weekly-rituals.md`. If those disagree with this, this is downstream — fix the source and regenerate.

---

## Phase arc + MRR curve

```mermaid
gantt
    title 90-Day Phase Arc (Apr 14 → Jul 14)
    dateFormat  YYYY-MM-DD
    axisFormat  %b %d

    section Phases
    P0 Reconcile + Research    :p0, 2026-04-14, 7d
    P1 Foundation Launch       :p1, after p0, 14d
    P2 Cadence + Expansion     :p2, after p1, 28d
    P3 Growth Loops + CRO      :p3, after p2, 28d
    P4 Conversion Push         :p4, after p3, 14d

    section MRR gates
    ¥0 target (P0 exit)        :milestone, 2026-04-20, 0d
    ¥10-15k (P1 exit)          :milestone, 2026-05-04, 0d
    ¥75k (P2 exit)             :milestone, 2026-06-01, 0d
    ¥180k (P3 exit)            :milestone, 2026-06-29, 0d
    ¥300k (P4 exit / gate)     :crit, milestone, 2026-07-14, 0d
```

---

## Full-deliverable gantt

```mermaid
gantt
    title All Deliverables — 2026-Q2
    dateFormat  YYYY-MM-DD
    axisFormat  %b %d
    excludes    weekends

    section Gates
    W1 exit gate            :milestone, g1, 2026-04-20, 0d
    W3 P1 exit gate         :milestone, g2, 2026-05-04, 0d
    W7 P2 exit gate         :milestone, g3, 2026-06-01, 0d
    W11 P3 exit gate        :milestone, g4, 2026-06-29, 0d
    W13 FINAL gate          :crit, milestone, g5, 2026-07-14, 0d

    section Positioning + Site
    Positioning.md signoff  :crit, pos, 2026-04-14, 2d
    zeroen.dev v2 copy      :zd2, 2026-04-15, 6d
    /startups route build   :zd3, 2026-04-16, 5d
    GA4 + UTM instrument    :crit, ga, 2026-04-18, 3d
    CRO A/B hero            :cro1, 2026-06-02, 7d
    CRO A/B pricing         :cro2, 2026-06-09, 7d
    CRO A/B apply form      :cro3, 2026-06-16, 7d
    CRO A/B mobile CTA      :cro4, 2026-06-23, 7d
    Intake fee A/B          :cro5, 2026-06-30, 14d

    section Listings (Tier S+A)
    Coconala rebrand        :crit, cc1, 2026-04-14, 3d
    Coconala listing live   :cc2, after cc1, 1d
    Lancers listing         :lan, 2026-04-24, 2d
    zeroen.dev v2 deploy    :zd4, 2026-04-27, 2d

    section Listings (Tier B)
    MENTA listing           :men, 2026-04-25, 2d
    CrowdWorks listing      :cw, 2026-05-05, 2d
    TimeTicket listing      :tt, 2026-05-07, 2d

    section Content - Note JP (weekly Tue)
    N1 Credibility anchor   :n1, 2026-04-21, 1d
    N2 WebMori case study   :crit, n2, 2026-05-12, 1d
    N3 ペライチ詰まり罠      :n3, 2026-05-19, 1d
    N4 月¥5k運用の中身       :n4, 2026-05-26, 1d
    N5 ¥0+¥5k offer deep    :n5, 2026-06-02, 1d
    N6 ペライチ vs STUDIO    :n6, 2026-06-09, 1d
    N7 90日収支公開         :n7, 2026-06-16, 1d
    N8 2例目ケース           :n8, 2026-06-23, 1d
    N9 共同創業者パートナー    :n9, 2026-06-30, 1d
    N10 90日振り返り         :n10, 2026-07-07, 1d

    section Content - X Threads
    X EN T1 Launch          :xe1, 2026-04-23, 1d
    X EN T2 /startups pivot :xe2, 2026-04-30, 1d
    X JP Thread (weekly Thu):active, xj, 2026-04-23, 84d
    X JP daily build        :active, xjd, 2026-04-21, 84d

    section Outbound
    Cold email COACH-01 W3  :em1, 2026-04-30, 1d
    Cold email 50/wk W4-7   :em2, 2026-05-07, 28d
    Cold email 100/wk W8-13 :em3, 2026-06-04, 42d

    section Case studies
    WebMori baseline        :crit, cs0, 2026-04-14, 7d
    WebMori site deploy     :crit, cs1, 2026-05-05, 7d
    WebMori case published  :crit, cs2, 2026-05-12, 3d
    Client 2 case draft     :cs3, 2026-05-26, 7d
    Client 2 case published :cs4, 2026-06-23, 3d

    section Growth loops (P3)
    Referral program spec   :ref1, 2026-06-02, 3d
    Referral launch + banner:ref2, 2026-06-05, 3d
    OSS LP kit repo         :oss1, 2026-06-09, 5d
    OSS LP kit launch       :oss2, 2026-06-12, 2d
    Product Hunt prep       :ph1, 2026-06-12, 8d
    Product Hunt launch     :crit, ph2, 2026-06-20, 2d

    section Analytics + Ops
    Funnel dashboard v1     :fd1, 2026-04-27, 5d
    Risk check Mondays      :active, rc, 2026-04-27, 77d
    MRR forecast overlay    :mrr, 2026-05-04, 70d
    Monthly client report   :rpt1, 2026-05-01, 1d
    Monthly client report   :rpt2, 2026-06-01, 1d
    Monthly client report   :rpt3, 2026-07-01, 1d

    section Phase 4 push
    Premium upsell email    :pu1, 2026-06-30, 3d
    Testimonial weekly post :active, ts, 2026-06-30, 14d
    Outbound 2x surge       :os, 2026-06-30, 14d
    Final retro + Q3 plan   :ret, 2026-07-13, 2d
```

---

## Week-by-week summary table

| Week | Dates | Phase | Theme | Critical path item | MRR target |
|---|---|---|---|---|---|
| W1 | Apr 14-20 | 0 | Research + reconcile | Positioning signoff + Coconala rebrand + GA4 | ¥0 |
| W2 | Apr 21-27 | 1 | Listings go live | Coconala live Mon + Note article Tue + X threads Wed | ¥0-5k |
| W3 | Apr 28-May 4 | 1 | zeroen.dev v2 + outbound pilot | Site deploy Mon + 25 cold emails + 2 signed Basic | ¥10-15k |
| W4 | May 5-11 | 2 | Tier-B listings | CrowdWorks + TimeTicket + WebMori site deploy | ¥20-30k |
| W5 | May 12-18 | 2 | **WebMori case study** | Case on Note + zeroen.dev + X JP/EN | ¥35-50k |
| W6 | May 19-25 | 2 | Cadence lock + first risk read | Funnel dashboard live + W6 MRR check | ¥50-65k |
| W7 | May 26-Jun 1 | 2 | Second case prep + MRR gate | P2 exit gate ≥¥75k | ¥75k |
| W8 | Jun 2-8 | 3 | Referral program | Announce + email blast + hero A/B test | ¥100k |
| W9 | Jun 9-15 | 3 | OSS LP kit | github.com/zeroen-dev/lp-kit public + pricing A/B | ¥120k |
| W10 | Jun 16-22 | 3 | Product Hunt launch | PH JP + EN + apply form A/B | ¥145k |
| W11 | Jun 23-29 | 3 | CRO + 2nd case study | Mobile CTA A/B + 2nd case published | ¥180k |
| W12 | Jun 30-Jul 6 | 4 | Premium upsell | Email Basics + intake fee A/B | ¥230k |
| W13 | Jul 7-13 | 4 | Final push | Testimonial flywheel + outbound 2× | **¥300k** |

---

## Critical-path dependencies

These items block something downstream. Slip them and the whole plan shifts.

```mermaid
flowchart LR
    P[Positioning signoff<br/>Apr 15]
    R[Coconala rebrand<br/>Apr 16]
    G[GA4 + UTM live<br/>Apr 20]
    C[Coconala live<br/>Apr 21]
    Z[zeroen.dev v2 deploy<br/>Apr 28]
    W[WebMori site deploy<br/>May 11]
    CS[WebMori case study<br/>May 18]
    M7[¥75k gate<br/>Jun 1]
    M13[¥300k gate<br/>Jul 14]

    P --> R --> C
    P --> Z
    G --> Z
    W --> CS
    CS --> M7 --> M13

    classDef crit fill:#ff6b6b,stroke:#c92a2a,color:#fff
    class P,R,CS,M7,M13 crit
```

**The 5 critical-path items:**
1. Positioning signoff (Apr 15) — blocks every copy decision
2. Coconala rebrand (Apr 16) — blocks W2 launch
3. WebMori case study (May 18) — blocks credibility; affects every channel conversion
4. ¥75k at W7 (Jun 1) — trigger threshold for Risk R3 "drop Basic from outreach"
5. ¥300k at W13 (Jul 14) — the final gate feeding Oct 15 Malaysia GO/NO-GO decision

---

## Kill-switch decision points (embedded in timeline)

Monday reviews run the risk-register. These trigger dates are when specific kill-switches might fire:

| Date | Check | If triggered |
|---|---|---|
| May 11 (W4 Mon) | Coconala <5 inquiries/wk? | Shift weight to Lancers + outbound (R1) |
| May 11 (W4 Mon) | WebMori site not deployed? | Launch best-available, iterate post (R12) |
| May 18 (W5 Fri) | WebMori case not published? | Ship at quality-available; follow-up W7 (R7) |
| May 25 (W6 Mon) | apply_submit / visits <1%? | Pause SEO, full CRO sprint (R2) |
| Jun 1 (W7 Mon) | MRR <¥75k? | Drop Basic from outbound; Premium-only (R3) |
| Jun 22 (W10 Mon) | Net MRR <¥150k? | Hard-route to Stripe-direct, cap Coconala (R4) |
| Anytime | Positioning confusion resurfaces? | Freeze publishing, rerun positioning (R5) |
| 2 consecutive weeks | Operator <15h/wk capacity? | Drop Phase 3 growth loops (R6) |

Full risk register: `HQ/marketing/plan/risk-register.md`.

---

## Default weekly rhythm (all 13 weeks)

```mermaid
gantt
    title Default Week — Mon → Sun
    dateFormat  HH:mm
    axisFormat  %H:%M

    section Mon
    MRR + pipeline review   :09:00, 30m
    Risk register walk      :09:30, 30m
    Publish week calendar   :10:00, 30m
    Client check-ins        :10:30, 30m
    X JP daily post         :11:00, 15m

    section Tue
    Note article live       :09:00, 60m
    X JP link to Note       :10:00, 30m

    section Wed
    Pipeline review         :09:00, 60m
    Send proposals          :10:00, 60m
    X EN build-in-public    :14:00, 30m

    section Thu
    Cold email batch        :09:00, 60m
    X JP thread             :10:00, 60m
    Coconala outreach       :14:00, 60m

    section Fri
    Content retro           :10:00, 60m
    Next-week batch review  :11:00, 60m
    X EN thread             :14:00, 60m
    Finance close           :16:00, 30m

    section Sat
    Light X JP share        :10:00, 30m

    section Sun
    Rest / optional prep    :10:00, 60m
```

Source: `HQ/marketing/plan/weekly-rituals.md`.

---

## Deliverable ownership matrix

Every item on the gantt has exactly one owner (draft) + one reviewer.

| Deliverable class | Draft | Review | Approve/publish |
|---|---|---|---|
| Positioning | mktg-gtm | mktg-strategy | operator |
| Listings (Coconala/Lancers/etc.) | sales-advisor | mktg-copy | operator |
| Note articles | mktg-copy | mktg-strategy | operator |
| X threads (JP + EN) | mktg-copy | mktg-strategy (Fri batch) | operator |
| X daily builds | mktg-copy (7-batch) | mktg-strategy (batch approve) | operator |
| Cold email sequences | sales-advisor | mktg-strategy | operator |
| Case studies | mktg-copy + client-manager | mktg-strategy | operator |
| Website code | web-developer | code-reviewer | operator |
| CRO tests | mktg-cro | mktg-strategy | operator |
| Analytics dashboards | mktg-cro + finance-tracker | operator | operator |
| Referral program | mktg-growth | sales-advisor | operator |
| OSS LP kit | web-developer | code-reviewer + mktg-gtm | operator |
| Product Hunt launch | mktg-gtm | mktg-copy (EN voice) | operator |
| Monthly client reports | ops-scheduler + web-developer | client-manager | operator |
| Risk + MRR reports | finance-tracker | operator | operator |

---

## How to use this file

- **Monday mornings:** glance at the current week column in the weekly table. Confirm critical-path items are on track. Check kill-switch dates.
- **Friday retros:** mark any slippage. If an item moves, update `content-calendar.md` (the source) and re-run this file's gantt.
- **Quarterly reset:** after Jul 14, archive this roadmap; draft the Q3 roadmap using the same structure. Do not reuse dates — start fresh.

---

## Related

- 90-day plan: `/Users/Daito/.claude/plans/golden-puzzling-bubble.md`
- Content calendar (detail): `HQ/marketing/plan/content-calendar.md`
- Weekly rituals (hourly): `HQ/marketing/plan/weekly-rituals.md`
- Risk register: `HQ/marketing/plan/risk-register.md`
- Phase 0 summary: `HQ/marketing/plan/phase-0-summary.md`
- Positioning: `HQ/marketing/plan/positioning.md`
