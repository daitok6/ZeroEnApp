# /cold-email — Generate Tailored Cold Email per Lead

**Usage:** `/cold-email <leadId> [--step N]`

- `leadId` — matches a row in `HQ/crm/leads.csv`
- `--step` — email step number (1–4, default: 1)

---

## What this command does

1. Reads the lead row from `HQ/crm/leads.csv` by `leadId`
2. If `current_lp_url` is present, uses Playwright to screenshot the LP (if step 1 or 2)
3. Generates a tailored Japanese cold email based on:
   - `signal_type` + `signal_detail` (the personalization hook)
   - `lp_problems` (the named issues)
   - The step template from `HQ/marketing/cold-email/templates/<step>-*.md`
   - ICP voice from `HQ/marketing/research/icp-profile.md` §9
   - Pricing language from `HQ/marketing/pricing-copy-premium-steer.ja.md`
   - Proof from `HQ/marketing/cold-email/proof/webmori.md` (when case is live)
4. Saves the draft to `HQ/marketing/cold-email/drafts/<leadId>-step<N>.md`
5. Presents the draft for operator review — **never sends without operator approval**

---

## Behavior rules

- **Always generate step 1 first** unless `--step N` is specified and a prior step draft exists.
- **Never reuse another lead's opening** — the observation must cite the specific `signal_detail`.
- **Pass the swap test:** if you remove the first line, the email should not still make sense without it.
- **Length:** step 1 ≤150 JP chars, step 2 ≤100, step 3 ≤120, step 4 ≤80.
- **Always include the opt-out footer:** 「今後不要であれば返信不要です。一度きりの個別連絡です。」
- **Flag** if `lp_problems` is empty — the email cannot be written without knowing what's wrong with their LP.
- **Flag** if `signal_detail` is generic — "coach" is not a signal, "ペライチスマホ崩れ2段落目が重なる" is.

---

## Draft file format

Saved at `HQ/marketing/cold-email/drafts/<leadId>-step<N>.md`:

```markdown
# Cold Email Draft — <leadId> Step <N>

**Date:** YYYY-MM-DD
**Lead:** [name], [role], [niche]
**Signal:** [signal_type] — [signal_detail]
**Status:** draft / approved / sent

---

## Subject

[subject line]

## Body

[email body in Japanese]

---

## Notes

[anything the operator should know before sending — e.g., "WebMori case not live yet, used industry data instead"]
```

---

## After operator sends

Operator should:
1. Mark `status` in `HQ/crm/leads.csv` as `email_<N>_sent`
2. Update `last_contact` to today's date
3. Apply Gmail label `ZeroEn/Cold/Sent`

On reply: update status to `replied`, apply `ZeroEn/Cold/Replied`, generate reply draft on request.
