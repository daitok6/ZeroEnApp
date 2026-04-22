# Post Draft — X JP #6

**Date:** 2026-04-21 (Mon) — posting window: 12:30 JST
**Platform:** X (JP account)
**Format:** Single tweet
**Pillar:** MRR transparency / build-in-public (Week 1 — baseline)
**Status:** draft — mktg-copy (v2) + mktg-strategy (PASS on re-review). Awaiting operator review.
**Schedule ref:** social-schedule.md row #6 (2026-04-21 Mon 12:30 JST — first of weekly MRR cadence)

---

## Tweet — Primary

```
MRR Week 1: ¥0。

今週、LPの掲載を開始。Google広告も走り出す。コールドメールも今週から。有料クライアントはまだゼロ、MRRもゼロ。ここが本当のスタートライン。

目標は¥300k MRR。今月ではなく、このキャンペーン期間で到達したい数字。毎週月曜、ここで数字を出していきます。
```

**JP char count:** 154 (within 140–180 target).

---

## Tweet — Alternative

```
MRR Week 1: ¥0 / 有料クライアント 0社。

LP掲載・Google広告・コールドメールが今週から動き出す、その初日の数字。

キャンペーン期間を通しての目標は¥300k MRR。派手な宣言ではなく、毎週月曜ここで実数を出す前提で書いておく。Week 2で動いていなければ、それもそのまま出す。
```

**JP char count:** 162. More explicit about the "if it doesn't move, that too will be posted" honesty beat — slightly heavier but reinforces the no-spin stance.

---

## Voice notes

- Opens with the number, not the excuse: 「MRR Week 1: ¥0。」 — Show-don't-tell. The zero does the work.
- Middle beat reframes ¥0 as a starting line, not a confession: 「ここが本当のスタートライン。」 Positions transparency as a choice, not a shortfall.
- ¥300k framed explicitly as campaign-horizon, not monthly — 「今月ではなく、このキャンペーン期間で到達したい数字」 — kills the hype read.
- Cadence signal embedded: 「毎週月曜、ここで数字を出していきます。」 — gives a reason to come back next Monday without a CTA.
- No emoji, no hashtags in body, no URL, no hype words. Declarative. Matches x-jp-05 register.

---

## Companion card

- Filename target: `HQ/marketing/posts/images/x-jp-06/card.html` + `card.png` (1200×675)
- Layout: stat card, editorial — left side big number `¥0`, right side target `¥300k` with a thin horizontal arrow between (not a chart — a linear progress line with a single dot at the far left to signal Week 1)
- Eyebrow (top-left, Plex Mono, small): `MRR / WEEK 1`
- Footer (bottom-left, Plex Mono, small): `毎週月曜更新`
- Bottom-right: small ZeroEn wordmark
- Typography: Syne 700 for `¥0` and `¥300k`, IBM Plex Mono for eyebrow/footer/labels, Murecho for any JP supporting line
- Accent `#00E87A` used only on: the arrow line, the Week-1 dot, and a 2px underline beneath `¥0` (<8% surface). Background `#0D0D0D`, text `#F4F4F2`.
- No emoji, no decoration. Same editorial restraint as the x-jp-05 card.
- Web-designer follow-up pass to render HTML → PNG (Playwright screenshot pipeline).

---

## Review log

- **mktg-copy (v1):** drafted a single version leading with 「正直に書きます。MRRは¥0です。」 — apologetic register. 148 chars. Included ¥300k as a flat "目標" without horizon framing.
- **mktg-strategy (REVISE):** flagged three issues. (1) Opening reads like an apology — undermines the "transparency-as-position" frame. Lead with the number, not the confession. (2) ¥300k without horizon reads like hype or, worse, like a this-month claim that will look ridiculous by Week 4 — must specify campaign-horizon. (3) No cadence signal — reader has no reason to return next Monday. Asked for: number-first open, explicit horizon on ¥300k, 「毎週月曜」 anchor.
- **mktg-copy (v2, revised):** rewrote opener to 「MRR Week 1: ¥0。」 Added 「ここが本当のスタートライン。」 to reframe. Added horizon clause on ¥300k. Added 「毎週月曜、ここで数字を出していきます。」 cadence signal. 154 chars.
- **mktg-strategy (re-review, PASS):** revisions satisfy all three flags. One residual note: the Alternative's 「Week 2で動いていなければ、それもそのまま出す」 is stronger trust-bait but also slightly more dramatic — Primary is the safer Week-1 opener (sets baseline cleanly), Alternative is the stronger standalone post if this were mid-series. Recommend Primary for Week 1, keep Alternative pattern in reserve for a Week 3–4 post if numbers stall.

---

## Posting checklist

- [ ] Operator review + approval of Primary vs Alternative
- [ ] Web-designer pass: render `card.html` → `card.png`
- [ ] Attach `card.png` when posting
- [ ] Post at 12:30 JST Mon 2026-04-21
- [ ] Stay online 12:30–13:30 JST — reply to every reply within 60 min
- [ ] If <5 engagements at 13:00: self-reply with hashtags below to restart the algorithm window
- [ ] Minimum 3h gap from any other X JP post (x-jp-05 is Tue 21:00 — clears)
- [ ] Add to tracker: record Week 1 = ¥0 baseline for Week 2 delta reference

---

## Hashtags (self-reply)

```
#ビルドインパブリック #MRR #個人開発 #スタートアップ #SaaS
```

Adjusted from x-jp-05: swapped `#コーチング #セラピスト #LP制作 #個人起業家` (customer-persona tags, better for the insight post) for `#MRR #個人開発 #スタートアップ #SaaS` (builder-audience tags) since the MRR transparency cadence pulls a builder/indie-hacker crowd, not the customer crowd. Kept `#ビルドインパブリック` as the connective tag across both pillars.

---

## CTA

None — intentional.

This is the baseline post of a weekly MRR series. The strategic job is trust + cadence: prove we'll show real numbers every Monday, so the offer posts (row #9 Wed explainer, and later conversion-pillar posts) land on an audience that already trusts the operator's honesty. A CTA here would contaminate the transparency signal — reader's brain would reclassify the ¥0 disclosure as a sales device ("he's only telling me this to sell me something"), destroying the whole point of the pillar. The post's only job is: lead with the number, set the cadence, earn the Week-2 return visit.
