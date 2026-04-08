---
name: deploy
description: Deploy a client app to production on Vercel. Runs quality gates first — lint, build, test, and code review must pass.
args: "<clientId>"
---

# /deploy <clientId>

## Validation

1. **clientId is required** — abort if not provided
2. **Verify client exists** in `HQ/crm/clients.json`
3. **Verify `Clients/<clientId>/` exists** with a valid project

## Steps

### 1. Quality Gates
Run in `Clients/<clientId>/`:

```bash
npm run lint
npm run build
npm test  # if tests exist
```

**All must pass.** If any fail, report errors and abort deploy.

### 2. Code Review
Invoke `code-reviewer` agent on `Clients/<clientId>/`.
- If verdict is **BLOCK** → abort deploy, report issues
- If verdict is **WARNING** → warn operator, proceed only with approval
- If verdict is **APPROVE** → proceed

### 3. Git Push
```bash
cd Clients/<clientId>
git add .
git commit -m "Deploy: [brief description of changes]"
git push origin main
```

Vercel auto-deploys from the `main` branch push.

### 4. Verify Deploy
- Check Vercel deployment status
- Verify the site is live and accessible
- Run a basic smoke test (homepage loads)

### 5. Report
```
✓ Client <clientId> deployed to production
  URL: [Vercel URL]
  Commit: [commit hash]
  Quality gate: PASSED
  Code review: [APPROVE/WARNING]
```
