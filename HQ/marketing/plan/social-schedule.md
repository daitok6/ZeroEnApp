# Social Schedule — ZeroEn X Posting Calendar

**Owner:** ops-scheduler · **Reviewed:** mktg-strategy + mktg-copy (Fri 14:00 JST batch) · **Horizon:** 8 weeks rolling · **Created:** 2026-04-15
**Source:** `social-cadence-research.md` · **Cadence:** 5 JP posts/wk + 3 EN posts/wk = 8/wk · **IG:** NO-GO until 10 clients

---

## Weekly Cadence Reference

| Day | Time JST | Platform | Format | Pillar |
|---|---|---|---|---|
| Monday | 12:30 | X JP | Single tweet | MRR update / hook observation |
| Tuesday | 21:00 | X JP | Thread (5–7) | Build-in-public / client milestone |
| Tuesday | 23:00 | X EN | Thread (5–7) | EN build-in-public / founder lesson |
| Wednesday | 21:00 | X JP | Single tweet | Insight / counterintuitive take |
| Wednesday | 23:00 | X EN | Thread (5–7) | Best EN thread of the week |
| Thursday | 21:00 | X JP | Thread (5–7) | **TOP SLOT** — empathy-led / client story |
| Thursday | 05:00 | X EN | Single tweet | Quick EN insight / update |
| Friday | 21:00 | X JP | Thread (5–7) | Week recap / transparency / shipped |
| Sunday | 14:00 | X JP | Single tweet | Reflection / poll / weekend engagement |

**Operating rules:**
1. Be online for all JP posts. Reply to every reply within 60 minutes (algorithm 30-min window).
2. Schedule EN posts via Buffer/Hypefury. Reply-boost at 08:00 JST the next morning.
3. Minimum 3h gap between posts on the same account.
4. If a post gets <5 engagements in 30 min: reply to it yourself or quote-repost to restart the window.
5. Rescale to 7 JP + 4 EN/wk at 500 followers.

---

## Handoff Workflow

When a calendar event fires, paste the title to Claude Code: `[X-JP] Topic title #N`

Claude Code will:
1. Look up this row for pillar, format, CTA, and voice notes
2. Draft copy via `mktg-copy` agent (voice check)
3. Generate image via `nano-banana` MCP or brand-kit CSS card
4. Save to `HQ/marketing/posts/<date>-<platform>-<slug>.md`

You review → post manually. Total turnaround ≤30 min.

---

## 8-Week Topic Bank

> **Status key:** `draft` = topic set, not yet written · `ready` = copy drafted, awaiting review · `posted` = live

### Week 1 — Apr 14–20 — Research + Infrastructure

*(Mon Apr 14 passed — schedule begins Wed Apr 15)*

| # | Date | Time JST | Platform | Format | Topic Title | Pillar | CTA | Notes | Status |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Apr 15 (Wed) | 21:00 | X JP | Single | 「コーチ・セラピストの方に聞きたい。自分のLP、今どうしてますか？」 | Poll / ICP pain | Reply with situation | Poll format; 4 options | posted |
| 2 | Apr 16 (Thu) | 05:00 | X EN | Single | "Quick poll: when did you last look at your own landing page as a first-time visitor?" | Poll / awareness | Reply | Use poll feature | draft |
| 3 | Apr 16 (Thu) | 21:00 | X JP | Thread | なぜエンジニアがコーチのLPを月¥5,000で作るのか — ZeroEn始動の話 | Brand intro / offer explainer | zeroen.devへ | 5 tweets. First thread on this account. | draft |
| 4 | Apr 17 (Fri) | 21:00 | X JP | Thread | ZeroEnを始めた週1。今週やったこと全部話します。 | Build-in-public / week recap | フォローして続報を | Metrics: 0 clients, ¥0 MRR, channels researched | draft |
| 5 | Apr 19 (Sun) | 14:00 | X JP | Single | 今週の学び：個人起業家の集客の悩みはLPの前にある。 | Insight | — | Soft reflection tone | draft |

### Week 2 — Apr 21–27 — Listings Live + Google Ads Launch

| # | Date | Time JST | Platform | Format | Topic Title | Pillar | CTA | Notes | Status |
|---|---|---|---|---|---|---|---|---|---|
| 6 | Apr 21 (Mon) | 12:30 | X JP | Single | ZeroEn MRR Week 1: ¥0 → 目標¥300k。公開スタート。 | MRR transparency | — | First MRR post; set baseline | draft |
| 7 | Apr 22 (Tue) | 21:00 | X JP | Thread | ペライチで詰まった3つの罠 — コーチ・セラピストが見落としていること | ICP pain / comparison | Note記事へ | Ties to note-a02 article (already drafted) | draft |
| 8 | Apr 22 (Tue) | 23:00 | X EN | Thread | I give away landing pages for free and charge ¥5,000/mo. Here's the full economics. | Offer explainer / launch | zeroen.dev/apply | Already drafted: x-twitter-thread.en.md | ready |
| 9 | Apr 23 (Wed) | 21:00 | X JP | Single | 「前金0円でLPを作る」が成立する理由を2行で。 | Offer explainer | — | Hook for curious non-followers | draft |
| 10 | Apr 23 (Wed) | 23:00 | X EN | Thread | 81.7% of Japanese sole proprietors have no website. This is the market I'm building for. | Market insight / credibility | zeroen.dev | Content-calendar.md W5 thread pulled to W2 | draft |
| 11 | Apr 24 (Thu) | 05:00 | X EN | Single | Google Ads day 1. Budget: ¥5,000/mo. Targeting JP search intent for 'LP制作'. | Build-in-public / paid | — | Be specific with exact keywords | draft |
| 12 | Apr 24 (Thu) | 21:00 | X JP | Thread | ZeroEnのLP制作が3日で終わる理由 — 技術とテンプレートの話 | Behind-the-scenes / credibility | 制作フロー見る | Tech thread: Next.js, template, brand kit | draft |
| 13 | Apr 25 (Fri) | 21:00 | X JP | Thread | Week 2 recap: Google広告スタート、Note記事公開。数字と所感。 | Week recap / transparency | — | Include: ads impressions, Note views, apply form visits | draft |
| 14 | Apr 27 (Sun) | 14:00 | X JP | Single | 気づいたこと：コーチの悩みは技術じゃなくコピーにある。 | Insight | — | Weekend reflection tone | draft |

### Week 3 — Apr 28–May 4 — zeroen.dev v2 + Outbound Pilot

| # | Date | Time JST | Platform | Format | Topic Title | Pillar | CTA | Notes | Status |
|---|---|---|---|---|---|---|---|---|---|
| 15 | Apr 28 (Mon) | 12:30 | X JP | Single | MRR Week 3: ¥XX。申込フォームからの問い合わせ1件目が来た話。 | MRR / milestone | — | Update ¥XX with real number day-of | draft |
| 16 | Apr 29 (Tue) | 21:00 | X JP | Thread | 前金0円LP制作、申し込みから公開まで何が起きるか。ステップ全公開。 | Behind-the-scenes / process | apply form | Onboarding flow walkthrough | draft |
| 17 | Apr 29 (Tue) | 23:00 | X EN | Thread | Why I'm not killing the equity pitch — just moving it to /startups | Positioning / strategy | zeroen.dev/startups | Content-calendar W3 thread | draft |
| 18 | Apr 30 (Wed) | 21:00 | X JP | Single | コールドメール25通送った結果。返信率と学び。 | Build-in-public / honest metric | — | Be specific: exact return rate | draft |
| 19 | Apr 30 (Wed) | 23:00 | X EN | Thread | JP cold email at scale: 25 sent, here's the exact opener and what happened. | Outbound transparency | — | Include JP copy snippet in EN thread | draft |
| 20 | May 1 (Thu) | 05:00 | X EN | Single | zeroen.dev v2 shipped. Apply form live. Intake funnel done in 2 weeks. | Milestone | zeroen.dev | Quick update | draft |
| 21 | May 1 (Thu) | 21:00 | X JP | Thread | zeroen.devをリニューアルした話。何を変えて、なぜ変えたか。 | Behind-the-scenes / design | zeroen.dev | Screenshot-heavy thread | draft |
| 22 | May 2 (Fri) | 21:00 | X JP | Thread | Week 3 recap: サイトリニューアル、コールドメール開始。正直な数字。 | Week recap / transparency | — | 3-week MRR trend line | draft |
| 23 | May 3 (Sun) | 14:00 | X JP | Single | コーチ向けLPで最も重要な要素は何か？（アンケート） | Poll | — | Poll: コピー / デザイン / モバイル対応 / 実績 | draft |

### Week 4 — May 5–11 — Expand Tier-B Channels

| # | Date | Time JST | Platform | Format | Topic Title | Pillar | CTA | Notes | Status |
|---|---|---|---|---|---|---|---|---|---|
| 24 | May 5 (Mon) | 12:30 | X JP | Single | MRR Week 4: ¥XX。コールドメール50通/週に増量。 | MRR / milestone | — | — | draft |
| 25 | May 6 (Tue) | 21:00 | X JP | Thread | タイムチケット・クラウドワークスに出品してみた。市場調査として。 | Channel research / transparency | — | Frame as experiment, not desperation | draft |
| 26 | May 6 (Tue) | 23:00 | X EN | Thread | Listing on JP freelance platforms as market research, not revenue. Here's what I found. | Market insight | — | Data-driven; include price comparisons | draft |
| 27 | May 7 (Wed) | 21:00 | X JP | Single | ZeroEnはなぜスポット依頼を断るのか。月額にこだわる理由。 | Positioning / offer | — | Counterintuitive take | draft |
| 28 | May 7 (Wed) | 23:00 | X EN | Thread | Subscription > one-time. Here's the exact LTV math for selling landing pages. | Business model / transparency | — | Show numbers: ¥5k × 12mo × 15 clients | draft |
| 29 | May 8 (Thu) | 05:00 | X EN | Single | CrowdWorks has 5M users. Only ~3% are paying for LP creation. The rest are price-shopping. | Market insight | — | Quick stat post | draft |
| 30 | May 8 (Thu) | 21:00 | X JP | Thread | コーチ/セラピストが月¥5,000を払い続ける理由 — 月次改善の価値を正直に話す | Value explainer / retention | apply form | Empathy-led; address "why keep paying?" | draft |
| 31 | May 9 (Fri) | 21:00 | X JP | Thread | Week 4 recap: 新チャネル2つ追加。冷えた問い合わせと熱い問い合わせの違い。 | Week recap | — | Quality > volume signal | draft |
| 32 | May 11 (Sun) | 14:00 | X JP | Single | 今週の観察：価格勝負の戦場には入らないこと。ZeroEnが選ばない市場の話。 | Positioning | — | — | draft |

### Week 5 — May 12–18 — WebMori Case Study

| # | Date | Time JST | Platform | Format | Topic Title | Pillar | CTA | Notes | Status |
|---|---|---|---|---|---|---|---|---|---|
| 33 | May 12 (Mon) | 12:30 | X JP | Single | MRR Week 5: ¥XX。今週、初のケーススタディを公開します。 | MRR / teaser | — | Build anticipation | draft |
| 34 | May 13 (Tue) | 21:00 | X JP | Thread | WebMoriさんのLP、Before/After。制作3日、公開後に何が変わったか。 | Case study / client win | Note記事へ | Requires client permission. Screenshot-heavy. | draft |
| 35 | May 13 (Tue) | 23:00 | X EN | Thread | Case study: Japanese wellness coach → mobile-first LP in 3 days → ¥5k/mo. Full breakdown. | Case study / credibility | zeroen.dev | Mention JP market context | draft |
| 36 | May 14 (Wed) | 21:00 | X JP | Single | ケーススタディで一番反響があった部分はモバイル対応でした。（予想外） | Insight / honest metric | — | Reaction post post-publish | draft |
| 37 | May 14 (Wed) | 23:00 | X EN | Thread | The #1 thing that surprised readers in our first case study: mobile optimization, not design. | Insight | zeroen.dev | Leverage JP post data | draft |
| 38 | May 15 (Thu) | 05:00 | X EN | Single | Case study live: JP coach, 3-day build, mobile-first. zeroen.dev/case-studies | Milestone | zeroen.dev | Quick link post | draft |
| 39 | May 15 (Thu) | 21:00 | X JP | Thread | 「3日で公開できるの？」→ できます。WebMoriさんの場合のタイムライン全公開。 | Behind-the-scenes / speed proof | apply form | TOP SLOT. Empathy hook + proof. | draft |
| 40 | May 16 (Fri) | 21:00 | X JP | Thread | Week 5 recap: ケーススタディ反響。問い合わせ増加。数字。 | Week recap | — | Include: referral traffic spike | draft |
| 41 | May 18 (Sun) | 14:00 | X JP | Single | ケーススタディ投稿後に気づいたこと：実績は語る前に見せるべき。 | Insight / reflection | — | — | draft |

### Week 6 — May 19–25 — Cadence Lock + Analytics Review

| # | Date | Time JST | Platform | Format | Topic Title | Pillar | CTA | Notes | Status |
|---|---|---|---|---|---|---|---|---|---|
| 42 | May 19 (Mon) | 12:30 | X JP | Single | MRR Week 6: ¥XX。W6チェックポイント。正直な振り返りを金曜に投稿します。 | MRR / preview | — | Tease Friday post | draft |
| 43 | May 20 (Tue) | 21:00 | X JP | Thread | 月¥5,000のLP運用に何が含まれるか、正直に全部話します。 | Transparency / value explainer | apply form | Ties to note-a03 article | draft |
| 44 | May 20 (Tue) | 23:00 | X EN | Thread | 6 weeks in: what ¥5,000/mo actually includes (and what it doesn't). Honest breakdown. | Transparency | zeroen.dev | EN audience wants business model clarity | draft |
| 45 | May 21 (Wed) | 21:00 | X JP | Single | どの投稿がzeroen.devへの流入を生んだか分析した結果。（意外な1位） | Analytics / transparency | — | Use GA4 / UTM data | draft |
| 46 | May 21 (Wed) | 23:00 | X EN | Thread | Analytics deep-dive: which content types actually drove apply-form clicks. The result surprised me. | Analytics / transparency | — | Show UTM breakdown | draft |
| 47 | May 22 (Thu) | 05:00 | X EN | Single | The funnel drop: X thread → zeroen.dev → apply form → 6-month commit. Where people leave. | Funnel transparency | — | Quick stat | draft |
| 48 | May 22 (Thu) | 21:00 | X JP | Thread | 申し込みページのCVR改善。何を変えて、どう変わったか。 | CRO / behind-the-scenes | apply form | TOP SLOT | draft |
| 49 | May 23 (Fri) | 21:00 | X JP | Thread | Week 6 recap: ファネル分析、CVR改善、MRRチェック。6週間の正直な数字。 | Week recap / transparency | — | 6-week MRR trend | draft |
| 50 | May 25 (Sun) | 14:00 | X JP | Single | 今週の一番の学び：コーチ向けコピーは共感から始まる。 | Insight / reflection | — | — | draft |

### Week 7 — May 26–Jun 1 — Second Case Study Prep

| # | Date | Time JST | Platform | Format | Topic Title | Pillar | CTA | Notes | Status |
|---|---|---|---|---|---|---|---|---|---|
| 51 | May 26 (Mon) | 12:30 | X JP | Single | MRR Week 7: ¥XX → ¥75k目標に対して。 | MRR / milestone check | — | MRR gate week | draft |
| 52 | May 27 (Tue) | 21:00 | X JP | Thread | 2例目ケーススタディ準備中。今度は別ジャンルのコーチ。予告と選んだ理由。 | Case study / teaser | — | Different niche = audience expansion | draft |
| 53 | May 27 (Tue) | 23:00 | X EN | Thread | Preparing case study #2: different coach niche. Here's what I look for before saying yes. | Client scoring / process | zeroen.dev | Walk through scoring rubric | draft |
| 54 | May 28 (Wed) | 21:00 | X JP | Single | クライアントを選ぶ基準、正直に書きます。スコア制にしてみた。 | Process transparency | — | Counterintuitive: we reject leads | draft |
| 55 | May 28 (Wed) | 23:00 | X EN | Thread | I score every lead before accepting. Here's the rubric: viability + commitment + feasibility + market. | Process / positioning | zeroen.dev/apply | Show real scoring spreadsheet | draft |
| 56 | May 29 (Thu) | 05:00 | X EN | Single | ¥75k MRR target check: [on track / behind / ahead] — full update Friday. | MRR transparency | — | Update day-of | draft |
| 57 | May 29 (Thu) | 21:00 | X JP | Thread | なぜエクイティをオプションとして残しているのか。スタートアップ向けZeroEn戦略。 | Positioning / equity | zeroen.dev/startups | TOP SLOT — differentiation narrative | draft |
| 58 | May 30 (Fri) | 21:00 | X JP | Thread | Week 7 recap: MRR¥XX。2例目ケーススタディ制作中。正直な7週間。 | Week recap | — | 7-week trend | draft |
| 59 | Jun 1 (Sun) | 14:00 | X JP | Single | 週末の思考：ZeroEnは最終的に何を作っているのか？ | Reflection / vision | — | Philosophical, warm tone | draft |

### Week 8 — Jun 2–8 — Referral Program Launch

| # | Date | Time JST | Platform | Format | Topic Title | Pillar | CTA | Notes | Status |
|---|---|---|---|---|---|---|---|---|---|
| 60 | Jun 2 (Mon) | 12:30 | X JP | Single | MRR Week 8: ¥XX。今週、ZeroEn紹介プログラムを正式ローンチします。 | MRR / launch preview | — | Tease referral launch | draft |
| 61 | Jun 3 (Tue) | 21:00 | X JP | Thread | ZeroEn紹介プログラム正式スタート。仕組みと報酬を全部話します。 | Referral launch / offer | zeroen.dev/referral | Detailed program breakdown | draft |
| 62 | Jun 3 (Tue) | 23:00 | X EN | Thread | Referral program launched. Here's the structure — and why it took 8 weeks to design. | Referral / transparency | zeroen.dev/referral | Include incentive math | draft |
| 63 | Jun 4 (Wed) | 21:00 | X JP | Single | 紹介で来るクライアントはなぜ質が高いのか。データで見るとこうなった。 | Insight / referral | — | Conversion rate comparison | draft |
| 64 | Jun 4 (Wed) | 23:00 | X EN | Thread | The math behind referral programs for solo service businesses. The results don't go where you'd expect. | Business model | — | Data-backed | draft |
| 65 | Jun 5 (Thu) | 05:00 | X EN | Single | Day 3 of referral launch: first referral lead came in. Quick update. | Real-time milestone | — | Update day-of | draft |
| 66 | Jun 5 (Thu) | 21:00 | X JP | Thread | 紹介プログラムを設計する際に参考にした5つの研究と事例。 | Education / credibility | — | TOP SLOT — research-backed authority post | draft |
| 67 | Jun 6 (Fri) | 21:00 | X JP | Thread | Week 8 recap: 紹介プログラム反響、MRR¥XX。8週間の振り返り。 | Week recap | — | 8-week MRR milestone | draft |
| 68 | Jun 8 (Sun) | 14:00 | X JP | Single | 3ヶ月を振り返る前に。今何を感じているか正直に。 | Reflection | — | Emotional, authentic tone | draft |

---

## Refresh Schedule

- **Rolling refill:** Every 4 weeks, `mktg-strategy` + `mktg-copy` add the next 4-week block.
- **Friday 14:00 JST retro:** Review prior week's content-log.md entries; adjust next week's topics if a theme underperformed.
- **Milestone triggers** (add posts ad-hoc): new client launch, MRR gate hit, case study published, product Hunt launch (W10).

---

## Related Files

- Research: `HQ/marketing/plan/social-cadence-research.md`
- Existing calendar: `HQ/marketing/plan/content-calendar.md` (Note + cold email rows still apply)
- Post drafts: `HQ/marketing/posts/<date>-<platform>-<slug>.md`
- Content log: `HQ/marketing/content-log.md`
- Already-drafted EN thread W2: `HQ/marketing/campaigns/2026-04-first-5/x-twitter-thread.en.md`
