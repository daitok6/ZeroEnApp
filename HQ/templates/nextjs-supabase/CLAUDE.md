# CLAUDE.md — <clientId>
### ZeroEn Client Project

## Client
- **Client ID:** <clientId>
- **App name:** [fill during onboarding]
- **Description:** [fill during onboarding]
- **GitHub repo:** [fill during setup]
- **Vercel project:** [fill during setup]
- **Supabase project:** [fill during setup]

## Scope (Locked at Kickoff)
[List the exact features agreed during the kickoff call. This is frozen — new features go through per-request pricing.]

- [ ] Feature 1
- [ ] Feature 2
- [ ] Feature 3

## Tech Stack
- Next.js 15 (App Router)
- Supabase (Auth, Database, Storage)
- Tailwind CSS + shadcn/ui
- Deployed on Vercel (ZeroEn operator account)

## Environment
Copy `.env.example` to `.env.local` and fill in:
- `NEXT_PUBLIC_SUPABASE_URL` — from Supabase project settings
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from Supabase project settings
- `NEXT_PUBLIC_APP_URL` — localhost:3000 for dev, production URL for prod
- `NEXT_PUBLIC_APP_NAME` — the app's name

## Rules
1. All code stays in this directory
2. Never commit `.env.local` — use `.env.example` for reference
3. Use Supabase RLS on all database tables
4. Quality gates must pass before deploy: `npm run lint && npm run build && npm test`
5. Per-request pricing applies to any work beyond the locked scope above

## Development
```bash
npm install
cp .env.example .env.local
# Fill in .env.local with Supabase credentials
npm run dev
```
