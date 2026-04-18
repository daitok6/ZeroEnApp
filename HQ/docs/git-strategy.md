# Git Strategy

**Read this when:** Pushing to platform (`src/`), cloning all clients on a new machine, or reasoning about where data lives.

## Structure

- **ZeroEn repo** (private) — HQ, agents, commands, skills, templates, marketing, CRM
- **Clients/** — gitignored. Each `<clientId>/` is its own standalone public repo

## Client Registry (two sources, different roles)

- `HQ/crm/clients.json` — HQ-side infra registry (clientId, repo URL, vercel project, supabase URL). Consumed by shell scripts (`clone-all.sh`) and agents for file/repo operations.
- `HQ/platform/` Supabase — platform-side truth for paying client data (subscriptions, invoices, change requests, dashboard state).

## Restore Script

`HQ/scripts/clone-all.sh` re-clones all client repos on new machine (reads `clients.json`).

## Platform Remote

Any commit that includes changes under `src/` (the ZeroEn platform app) must also be pushed to the `zeroenapp` remote (`https://github.com/daitok6/ZeroEnApp`). Always run `git push zeroenapp <branch>` in addition to `git push origin <branch>` when platform code is involved.
