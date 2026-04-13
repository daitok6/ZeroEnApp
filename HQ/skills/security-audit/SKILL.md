# Security Audit Runbook — ZeroEn

**Trigger:** Quarterly (Jan 1, Apr 1, Jul 1, Oct 1) for Premium clients. A-la-carte (¥15,000) for Basic clients when approved.

**Delivered as:** PDF report saved to `HQ/crm/clients/<clientId>/audits/YYYY-Q#-security.pdf` and handed to client via email/messenger. Operator reviews before delivery (CLAUDE.md rule #8).

---

## Preflight

1. Read `HQ/crm/clients/<clientId>/profile.md` — confirm tier is Premium, or that a-la-carte audit is approved for Basic.
2. Look up the client's Vercel project and live domain in `HQ/crm/clients.json`.
3. Confirm the client repo is cloned at `Clients/<clientId>/`. If not, run `HQ/scripts/clone-all.sh`.
4. Note the current quarter: Q1=Jan–Mar, Q2=Apr–Jun, Q3=Jul–Sep, Q4=Oct–Dec.
5. Create the audit output directory if it doesn't exist: `HQ/crm/clients/<clientId>/audits/`.

---

## Scope Checklist

Work through each area. Record findings in a copy of `HQ/templates/audit-report/security-audit.md`.

### 1. Dependency Vulnerability Scan

```bash
cd Clients/<clientId>
npm audit --json > /tmp/npm-audit.json
npx osv-scanner --format json . > /tmp/osv-scan.json
```

- Flag any **critical** or **high** severity findings.
- Note the package name, installed version, patched version, and CVE ID.
- Fix what you can: `npm audit fix` for safe auto-fixes. Manual pin for breaking changes.

### 2. HTTP Security Headers

Fetch the live URL and inspect response headers:

```bash
curl -sI https://<clientDomain> | grep -iE "content-security-policy|strict-transport-security|x-frame-options|x-content-type-options|referrer-policy|permissions-policy"
```

Expected headers and acceptable values:

| Header | Expected |
|---|---|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` |
| `X-Frame-Options` | `DENY` or `SAMEORIGIN` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` or stricter |
| `Permissions-Policy` | Present and scoped appropriately |
| `Content-Security-Policy` | Present — even a basic policy is better than none |

For Next.js sites, add missing headers in `next.config.js` under `headers()`. Use the `sec-audit: add security headers` commit prefix.

### 3. SSL/TLS Review

Check the live domain via SSL Labs API (no browser required):

```bash
curl -s "https://api.ssllabs.com/api/v3/analyze?host=<clientDomain>&startNew=on&all=done" | jq '.endpoints[0].grade'
```

Poll until `status` = `READY` (may take ~60s). Target grade: **A** or **A+**.

Flag any: TLS 1.0/1.1 support, weak cipher suites, certificate expiry within 30 days, mixed content warnings.

### 4. Auth Flow Review

**Phase 1 (landing pages):** No auth present → mark all auth items as **N/A**.

If the client has added a form or lightweight auth:
- Confirm no credentials are logged or exposed in client-side JS.
- Confirm form endpoints use HTTPS.
- Check for exposed API keys in the public bundle: `grep -r "sk_\|API_KEY\|SECRET" Clients/<clientId>/.next/`

---

## Remediation

For each finding with status **Fixed**:

1. Apply the fix in `Clients/<clientId>/`.
2. Commit with prefix: `sec-audit: <short description>` (e.g. `sec-audit: add missing security headers`).
3. Run quality gates: `npm run lint && npm run build`.
4. Deploy via `/deploy <clientId>`.

For findings with status **Flagged** (outside scope or needs client decision): document clearly in the report's Recommendations section.

---

## Report Generation

1. Copy `HQ/templates/audit-report/security-audit.md` → `HQ/crm/clients/<clientId>/audits/YYYY-Q#-security.md`.
2. Fill in all sections: summary, findings table, changes made, business impact, recommendations.
3. Export to PDF using the same Playwright pipeline as monthly analytics reports.
4. Save final PDF as `HQ/crm/clients/<clientId>/audits/YYYY-Q#-security.pdf`.
5. Operator reviews the PDF before delivery.

---

## Delivery

Hand the PDF to the client via email or your preferred channel. Do **not** auto-send.

Suggested message framing (Japanese clients):
> 今期のセキュリティ監査レポートをお送りします。発見された問題はすでに修正済みです。詳細はレポートをご確認ください。

---

## A-La-Carte (Basic Clients)

Same process as above. Before starting:
- Confirm payment of ¥15,000 via Stripe invoice.
- Note invoice ID in `HQ/crm/clients/<clientId>/revenue.md`.
