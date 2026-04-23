<!--
  ZeroEn Security Audit Report Template
  Fill all {{placeholders}} before exporting to PDF.
  Brand: HQ/brand/brand-kit.md | Tokens: HQ/brand/tokens.css
  Save completed report to: HQ/crm/clients/<clientId>/audits/YYYY-Q#-security.md
-->

# セキュリティ監査レポート / Security Audit Report

---

## 1. Summary

| Field | Value |
|---|---|
| Client | {{clientId}} — {{clientBusinessName}} |
| Site | {{clientDomain}} |
| Audit Date | {{YYYY-MM-DD}} |
| Quarter | {{YYYY}}-Q{{#}} |
| Tier | {{Premium / Basic (a-la-carte)}} |
| Overall Risk Rating | {{Low / Medium / High / Critical}} |
| Auditor | ZeroEn on behalf of WebMori |

**Risk Rating Guide**
- **Low** — No critical/high findings. Minor improvements only.
- **Medium** — At least one high finding, now fixed. No critical findings.
- **High** — Critical finding found and fixed. Follow-ups recommended.
- **Critical** — Active exploit risk found. Immediate action taken.

---

## 2. Findings

| Area | Severity | Detail | Status |
|---|---|---|---|
| Dependency: {{package}} | {{Critical/High/Medium/Low}} | {{CVE-ID or description}} | {{Fixed / Flagged / N/A}} |
| HTTP Header: {{header name}} | {{severity}} | {{what was missing or wrong}} | {{Fixed / Flagged / N/A}} |
| SSL/TLS | {{severity}} | {{grade before → after, or issue}} | {{Fixed / Flagged / N/A}} |
| Auth Flow | — | {{N/A — no auth (Phase 1) / findings}} | {{N/A / Fixed / Flagged}} |

_Add or remove rows as needed. Delete unused rows before delivery._

---

## 3. Changes Made

List every change applied to the client's codebase during this audit.

| # | What Changed | File(s) | Commit |
|---|---|---|---|
| 1 | {{e.g. Added missing security headers}} | `next.config.js` | `sec-audit: add security headers` |
| 2 | {{e.g. Bumped lodash 4.17.20 → 4.17.21 (CVE-2021-23337)}} | `package.json`, `package-lock.json` | `sec-audit: patch lodash CVE-2021-23337` |

_If no changes were made (all findings flagged or N/A), write: "No code changes were required this quarter."_

---

## 4. Business Impact

Write in plain language — no jargon. Explain what the risk was and why it matters to **this client's business**.

**Dependency vulnerabilities**
> {{e.g. "An outdated package could have allowed an attacker to run unexpected code on your site. This has been patched."}}

**Security headers**
> {{e.g. "Missing headers made it possible for your site to be embedded inside another site (clickjacking). This is now blocked. It also improves trust signals with Google."}}

**SSL/TLS**
> {{e.g. "Your site's encryption was already strong (Grade A). No changes needed."}}

**Overall**
> {{1–2 sentences on the net result — e.g. "Your site is now significantly more resistant to common web attacks. No customer data was at risk during the period."}}

---

## 5. Recommendations

Items identified during the audit that are **outside the quarterly scope** or require a client decision.

| Priority | Recommendation | Suggested Action |
|---|---|---|
| {{High/Medium/Low}} | {{e.g. Implement a Content Security Policy}} | {{e.g. Include in next quarter's audit / out-of-scope work at ¥15,000/hr}} |
| {{priority}} | {{recommendation}} | {{action}} |

_If no recommendations, write: "No additional recommendations at this time."_

---

## 6. Next Steps

- Next quarterly audit: **{{YYYY-MM-DD}}** ({{YYYY}}-Q{{#}})
- Any flagged items above should be resolved before then, or carried into next quarter's scope.
- Questions? Reply to this report or contact ZeroEn via your usual channel.

---

_Audit performed by ZeroEn on behalf of WebMori — {{YYYY-MM-DD}}_
