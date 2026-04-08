---
name: status
description: Show the current status of a client project — phase, last deploy, revenue, next report, health signals.
args: "<clientId>"
---

# /status <clientId>

## Validation

1. **clientId is required** — abort if not provided
2. **Verify client exists** in `HQ/crm/clients.json`

## Steps

### 1. Read Client Data
- `HQ/crm/clients/<clientId>/profile.md` — deal terms, phase, dates
- `HQ/crm/clients/<clientId>/revenue.md` — revenue history

### 2. Output Status

```markdown
# Status — <clientId>

## Project
- **Phase:** [Build / Launch / Operate]
- **App:** [name] — [description]
- **URL:** [Vercel URL or "not deployed"]
- **Repo:** [GitHub URL]

## Deal
- **Equity:** 10%
- **Rev share:** X%
- **Platform fee:** $50/mo — [active/pending]

## Timeline
- **Build started:** YYYY-MM-DD
- **Launched:** YYYY-MM-DD or "pending"
- **Last deploy:** YYYY-MM-DD
- **Last report:** YYYY-MM-DD
- **Next report due:** YYYY-MM-DD

## Revenue (Lifetime)
- **Platform fees:** $X
- **Per-request:** $X
- **Rev share:** $X
- **Total:** $X

## Health
- [Green/Yellow/Red] — [reason if yellow or red]
```
