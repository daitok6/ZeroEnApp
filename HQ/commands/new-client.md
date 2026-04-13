---
name: new-client
description: Initialize a new client project. Creates project structure, CLAUDE.md, registers in CRM, and sets up the public GitHub repo.
args: "<clientId>"
---

# /new-client <clientId>

## Validation

1. **clientId is required** — abort if not provided
2. **Check `HQ/crm/clients.json`** — abort if clientId already exists
3. **clientId must be lowercase, alphanumeric + hyphens** — e.g., `my-app`, `saas-tool`

## Steps

### 1. Create Client Directory
```
mkdir -p Clients/<clientId>
```

### 2. Clone Template
Copy the starter template from `HQ/templates/` into `Clients/<clientId>/`:
```bash
cp -r HQ/templates/nextjs-supabase/* Clients/<clientId>/
```

### 3. Initialize Git
```bash
cd Clients/<clientId>
git init
git branch -m main
```

### 4. Create Client CLAUDE.md
Write `Clients/<clientId>/CLAUDE.md` with:
```markdown
# CLAUDE.md — <clientId>
### ZeroEn Client Project

## Client
- **Client ID:** <clientId>
- **App name:** [TBD — fill during onboarding]
- **Description:** [TBD]

## Tech Stack
- Next.js (App Router)
- Supabase (Auth, Database, Storage)
- Tailwind CSS + shadcn/ui
- Deployed on Vercel (operator account)

## Scope
[To be filled during kickoff — this is the locked MVP scope]

## Rules
1. All code stays in this directory
2. Never expose secrets — use .env.local
3. Use Supabase RLS on all tables
4. Quality gates must pass before deploy: lint + build + test
```

### 5. Register in CRM
Add entry to `HQ/crm/clients.json`:
```json
{
  "clientId": "<clientId>",
  "status": "onboarding",
  "created": "YYYY-MM-DD",
  "repo": "",
  "vercel": "",
  "supabase": ""
}
```

### 6. Create Client CRM Directory
```bash
mkdir -p HQ/crm/clients/<clientId>
```
Create `HQ/crm/clients/<clientId>/profile.md` with the template from `client-manager` agent.
Include a `Project UUID` field (fill in after step 7 creates the Supabase `projects` row).
Create `HQ/crm/clients/<clientId>/revenue.md` with empty revenue log.

### 7. Set Up Umami Analytics

1. Log in to `https://umami.zeroen.dev` (admin account)
2. Go to **Settings → Websites → Add website**
   - Name: `<clientId>`
   - Domain: the client's production domain (e.g., `example.com`)
3. Copy the generated **Website ID** (UUID)
4. Set env var on the client's Vercel project:
   ```
   NEXT_PUBLIC_UMAMI_WEBSITE_ID=<website-id-uuid>
   NEXT_PUBLIC_UMAMI_URL=https://umami.zeroen.dev
   ```
5. Update the `projects` row in Supabase: set `umami_website_id` to the Website ID UUID
6. Store the `projects.id` UUID in `HQ/crm/clients/<clientId>/profile.md` under `Project UUID`

### 8. Report
Output summary:
```
✓ Client <clientId> initialized
  Directory: Clients/<clientId>/
  CRM: HQ/crm/clients/<clientId>/
  Umami: website created — ID stored in profile.md and projects row
  Next: Complete onboarding questionnaire and kickoff call
```
