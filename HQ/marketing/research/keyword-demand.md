# ZeroEn JP Keyword & SEO Demand Research

> **⚠️ legacy_icp — 2026-04-23.** Research conducted under the old ¥5k/¥10k subscription model targeting coaches/therapists/Peraichi users. Retained for historical reference. Do not use as keyword targets — see `HQ/agents/mktg-seo.md` for current keyword strategy.

**Compiled:** 2026-04-14
**Target:** ¥300k/mo MRR by 2026-07-14
**Scope:** Japan-focused LP / HP services, ¥5-10k/mo Stripe subscriptions
**Method:** Google keyword-relative inference + Coconala listing volume + note/Lancers signals. Volumes are estimates synthesized from public ranking context (Web幹事, ferret-one, Lancers volume pages, Google Trends proxy).

---

## 1. Cluster Map

### Commercial intent (buyer-ready)

| Cluster | Est. monthly vol. | Difficulty | CPC (¥) | Intent | ZeroEn priority (1-5) |
|---|---:|:---:|---:|:---:|:---:|
| `LP制作 + 依頼 / 代行` | 18,000 – 22,000 | H | 800–1,500 | Commercial | **5** |
| `LP制作 + 格安 / 安い` | 4,400 – 6,000 | M | 500–900 | Commercial | **5** |
| `LP制作 + 個人 / 副業` | 1,900 – 2,700 | L-M | 300–600 | Commercial | **4** |
| `ランディングページ 制作 / 作成` | 22,000 – 30,000 | H | 900–1,800 | Commercial | 4 |
| `ランディングページ テンプレート` | 6,600 – 8,100 | M | 200–500 | Info/commercial | 3 |
| `ホームページ作成 + 個人 / 起業` | 9,900 – 14,800 | M | 400–900 | Commercial | **5** |
| `ホームページ作成 + 格安 / 月額` | 3,600 – 5,400 | M | 500–1,000 | Commercial | **5** |
| `個人事業主 ホームページ / サイト制作` | 8,100 – 12,100 | M | 600–1,100 | Commercial | **5** |
| `月額制 ホームページ / LP` | 1,600 – 2,400 | L-M | 600–1,200 | Commercial | **5** |
| `共同創業者 技術 募集 / CTO募集` | 390 – 720 | L | 200–600 | Commercial (equity) | 3 |
| `AI 技術顧問 / AI CTO` | 720 – 1,200 | L | 400–1,200 | Commercial | 3 |

### Informational intent (top-of-funnel)

| Cluster | Est. monthly vol. | Difficulty | CPC (¥) | Intent | Priority |
|---|---:|:---:|---:|:---:|:---:|
| `LP とは / ランディングページ 意味` | 6,600 – 9,900 | H | 80–200 | Info | 2 |
| `ホームページ 必要か 個人事業主` | 880 – 1,600 | L | 150–400 | Info (nurture) | **4** |
| `LP 作成 自分で` | 1,900 – 3,600 | M | 200–400 | Info (DIY) | 3 |
| `ペライチ vs STUDIO` | 1,300 – 2,400 | L | 200–500 | Comparison | **4** |

### Comparison / shopping

| Cluster | Est. monthly vol. | Difficulty | CPC (¥) | Intent | Priority |
|---|---:|:---:|---:|:---:|:---:|
| `ペライチ 料金` | 5,400 – 8,100 | M | 300–700 | Shopping | **5** |
| `STUDIO 料金` | 3,600 – 5,400 | M | 300–800 | Shopping | **5** |
| `ランディングページ 業者 比較` | 2,400 – 3,600 | M | 700–1,400 | Shopping | **4** |
| `LP制作 相場 2026` | 5,400 – 7,400 | M | 500–1,000 | Info/shopping | **4** |

Sources cross-checked: [Web幹事 LP price](https://web-kanji.com/posts/landing-page-price), [Lancers Pricing Guide](https://www.lancers.jp/c/website/website-cost/1834/), [Tools-Online peraichi](https://tools-online-system.com/peraichi-price/), [Coconala LP503 listing count "4,680 件"](https://coconala.com/categories/503), [Coconala HP500 listing count "12,115 件"](https://coconala.com/categories/500).

---

## 2. Visual — Relative Volume of Top 15 Target Keywords

Scale: ▓ = ~1,000 searches/mo (upper bound shown).

```
ランディングページ 制作/作成    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  30k
LP制作 依頼/代行                 ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓          22k
ホームページ作成 個人/起業      ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓                 15k
個人事業主 ホームページ          ▓▓▓▓▓▓▓▓▓▓▓▓                    12k
ホームページ作成 格安/月額      ▓▓▓▓▓▓                            5k
LP とは                         ▓▓▓▓▓▓▓▓▓▓                       10k
ペライチ 料金                    ▓▓▓▓▓▓▓▓                         8k
ランディングページ テンプレート ▓▓▓▓▓▓▓▓                         8k
LP制作 相場 2026                 ▓▓▓▓▓▓▓                          7k
LP制作 格安                     ▓▓▓▓▓▓                            6k
STUDIO 料金                     ▓▓▓▓▓                             5k
LP 作成 自分で                   ▓▓▓▓                              4k
ランディングページ 業者 比較    ▓▓▓                               3.5k
月額制 ホームページ              ▓▓                                2.4k
LP制作 個人/副業                ▓▓                                2.7k
```

---

## 3. Programmatic SEO — 5 Templatable Page Ideas for zeroen.dev

All pages render from one `[slug].tsx` driven by a JSON/Markdown corpus. Each is a CTA magnet because the intent is mid-funnel and existing SERPs are dominated by generic blog listicles that don't allow direct purchase.

### 3.1 `/ja/templates/[industry]-landing-page` (industry templates)
- Slugs: `salon`, `clinic`, `tax-accountant`, `coach`, `cafe`, `gym`, `real-estate`, `law-firm`, `dentist` (~40 industries)
- Why rank: `[industry] ランディングページ テンプレート` has low-competition tail. Ferret-one and Web幹事 own the generics; nobody owns the industry long-tail with an actual live demo. Estimated 40 pages × 200/mo = 8k sessions/mo ceiling.

### 3.2 `/ja/lp-price-compare` (price comparison)
- Comparison table: ペライチ / STUDIO / Wix / ZeroEn / Coconala freelancer avg.
- Why rank: `ペライチ 料金 比較` and `LP制作 相場` converge here. Adds unique data: our own Coconala scraped median price (¥95k flat, confirmed via `coconala-lp-503` — top 10 average price range ¥25k-¥270k with median ≈ ¥95k).

### 3.3 `/ja/vs/peraichi` and `/ja/vs/studio` (comparison pages)
- One `/vs/[competitor].tsx` route → 8–12 pages (peraichi, studio, wix, jimdo, goope, bindup, amebaownd, pera1, crayon, wordpress-com).
- Why rank: `ペライチ vs STUDIO` gets 1.3k–2.4k/mo and the buyer is mid-funnel. Existing results are SEO blogs with no "switch to us" CTA.

### 3.4 `/ja/lp/[city]-[industry]` (geo × industry)
- e.g. `/ja/lp/tokyo-salon`, `/ja/lp/osaka-clinic`. 8 cities × 20 industries = 160 pages.
- Why rank: Local-intent queries (`大阪 LP制作 格安`) are under-served. Competitors have Tokyo+Osaka only; we can blanket Fukuoka, Nagoya, Sapporo, Sendai, Hiroshima with identical quality.

### 3.5 `/ja/calculator/lp-cost` (interactive cost calculator)
- Inputs: industry, pages, need writing, need video. Outputs: ¥X at制作会社 vs ¥5k/mo ZeroEn.
- Why rank: Calculators earn backlinks (note/x/Qiita), rank well for `LP制作 費用 計算` + `相場`. Seeds link equity across the pSEO cluster.

---

## 4. Top-15 Keywords to Target — Phase 2 (May-July 2026)

Ranked by **(priority × volume) / difficulty**. Focus on commercial + comparison, deprioritize pure informational.

| # | Keyword | Vol/mo | Difficulty | Reason |
|---|---|---:|:---:|---|
| 1 | `ホームページ作成 個人事業主` | 12,100 | M | Core buyer. Matches ZeroEn's ICP exactly. Blog SERPs are weak. |
| 2 | `月額制 ホームページ` | 2,400 | L-M | Perfect product-market fit — we ARE the answer. Almost no ranked pages. |
| 3 | `LP制作 格安 個人` | 6,000 | M | Coconala people search this. Easiest high-intent win. |
| 4 | `ホームページ作成 格安` | 5,400 | M | High commercial. ペライチ and クラウド制作 dominate — beatable with aggregation play. |
| 5 | `LP制作 依頼` | 22,000 | H | Hero term. Requires link-building, 6-month play. |
| 6 | `ペライチ 料金` | 8,100 | M | Comparison intent = switcher pool. Build `/vs/peraichi`. |
| 7 | `個人事業主 サイト制作` | 8,100 | M | Twin of #1. Same page, different H1 variant. |
| 8 | `LP制作 相場 2026` | 7,400 | M | Every buyer Googles this first. Own it via calculator (pSEO 3.5). |
| 9 | `ランディングページ テンプレート [industry]` | 8,100 (agg.) | L-M | Programmatic 3.1 route. Low difficulty per slug. |
| 10 | `STUDIO 料金` | 5,400 | M | Same playbook as #6. Target comparison switchers. |
| 11 | `ホームページ 必要か 個人事業主` | 1,600 | L | Nurture funnel. Cheap to rank, high intent-to-convert via CTA. |
| 12 | `ペライチ vs STUDIO` | 2,400 | L | Add ZeroEn as 3rd option in every vs article. |
| 13 | `LP制作 副業 個人` | 2,700 | L-M | Reverse intent — capture buyers who think LP is the solution. |
| 14 | `AI 技術顧問` | 1,200 | L | Niche for /startups equity pitch. Low volume but premium CPL. |
| 15 | `共同創業者 技術 募集` | 720 | L | Same. Community + note content feeder. |

---

## 5. Recommended Execution (phase-ordered)

1. **Week 1-2 (April)**: Build `/ja/pricing`, `/ja/vs/peraichi`, `/ja/vs/studio`, `/ja/ホームページ作成-個人事業主`. 4 pages covering keywords #1, #2, #6, #10, #12.
2. **Week 3-4**: Ship pSEO corpus for 3.1 (40 industry templates, single route).
3. **May**: Ship 3.3 remaining vs pages + 3.5 cost calculator. Submit calculator to note via `mktg-copy`.
4. **June**: Geo × industry (pSEO 3.4). Target keyword #9.

Total estimated addressable search volume captured: **~95k sessions/mo at steady state**. At a 1.5% visit→¥1k intake conversion = ~1,425 intakes/mo theoretical; realistic first-year capture ≈ 5–8% of that = **70-115 intake leads/mo** (sufficient to hit ¥300k MRR by clearing first 5 + upsell).

---

## Sources

- [Web幹事 — LP price guide](https://web-kanji.com/posts/landing-page-price)
- [Lancers — LP cost](https://www.lancers.jp/c/website/website-cost/1834/)
- [Tools-Online — Peraichi 2026 pricing](https://tools-online-system.com/peraichi-price/)
- [Coconala LP category 503 (4,680 listings)](https://coconala.com/categories/503)
- [Coconala HP category 500 (12,115 listings)](https://coconala.com/categories/500)
- [Stock-Sun — LP freelance pricing](https://stock-sun.com/column/lp-production-freelance/)
- [note — LP制作 hashtag](https://note.com/hashtag/LP制作) (5,331 tagged posts)
- [ネトデジ — ペライチ vs STUDIO](https://ec.minikuru.co.jp/post-151728/)
- Google Trends (trend direction, not absolute volume): [trends.google.co.jp](https://trends.google.co.jp/)
