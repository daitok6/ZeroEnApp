# Umami Analytics — Setup Manual

**What:** ZeroEn self-hosts Umami at `https://umami.zeroen.dev` and tracks every client site from that single instance. One Umami "website" record per client. No Google Analytics, no GA4, no GTM.

**Why Umami?** Cookieless, GDPR/PIPA-friendly (no consent banner needed), lightweight (~2KB script), and we own the data — clients on the Premium tier get a monthly analytics PDF generated from this data.

---

## How it's wired

```
Client site (Next.js)
  └── <Script src="https://umami.zeroen.dev/script.js"
             data-website-id="<UUID>"
             strategy="afterInteractive" />
        [rendered in src/app/layout.tsx only when NEXT_PUBLIC_UMAMI_WEBSITE_ID is set]

umami.zeroen.dev (self-hosted)
  └── Stores hits per website UUID

HQ/platform cron (1st of month, 03:00 JST)
  └── Pulls prior month data via Umami API
  └── Writes to Supabase `analytics_snapshots`
  └── /report command generates PDF
```

Template source: `HQ/templates/nextjs-supabase/src/app/layout.tsx` lines 19–25.

---

## Per-client setup (new-client step)

### 1. Create the website record in Umami

1. Log in to `https://umami.zeroen.dev` with the admin account
2. **Settings → Websites → Add website**
3. Fill in:
   - **Name:** `<clientId>` (lowercase, matches folder name)
   - **Domain:** production domain (e.g., `example.com`, no protocol, no trailing slash)
4. Click **Save**
5. Copy the **Website ID** (UUID, shown after save)

### 2. Propagate the UUID in three places

1. **Vercel** → client project → Settings → Environment Variables → Production:
   ```
   NEXT_PUBLIC_UMAMI_WEBSITE_ID=<uuid>
   NEXT_PUBLIC_UMAMI_URL=https://umami.zeroen.dev
   ```
   Redeploy to apply.

2. **Supabase** → `projects` table → the client's row → set `umami_website_id = '<uuid>'`

3. **CRM** → `HQ/crm/clients/<clientId>/profile.md` → add under a `Umami` section:
   ```
   - Umami website ID: <uuid>
   - Umami dashboard: https://umami.zeroen.dev/websites/<uuid>
   ```

### 3. Verify

- [ ] Visit the production site in an incognito window
- [ ] Open `https://umami.zeroen.dev/websites/<uuid>` and go to **Realtime**
- [ ] A hit should appear within ~30 seconds
- [ ] If nothing appears: see **Troubleshooting** below

---

## Server-side env vars (HQ platform only — not client sites)

The monthly snapshot cron needs these on the **ZeroEn platform** Vercel project (not the client site):

```
UMAMI_API_URL=https://umami.zeroen.dev/api
UMAMI_API_TOKEN=<operator-api-token>
```

Generate the API token from `umami.zeroen.dev` → profile → API keys. This token is shared across all clients — it's the operator's master read key.

Details: `HQ/commands/report.md`.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| No hits in Umami Realtime after visiting site | `NEXT_PUBLIC_UMAMI_WEBSITE_ID` not set in Vercel Production env | Add it, redeploy |
| Hits appear in Realtime but no data in dashboard charts | Umami aggregates on a delay (~5–10 min for first hits of the day) | Wait, refresh |
| Script blocked by ad blocker | Expected — Umami is on a non-default subdomain but still gets caught by uBlock filters for some users | Can't fully fix; acknowledge it undercounts by 5–15% |
| `script.js` 404 in browser console | `NEXT_PUBLIC_UMAMI_URL` misconfigured (wrong subdomain) | Should be `https://umami.zeroen.dev`, no trailing slash |
| Wrong domain recorded on hits | Domain field in Umami website record doesn't match actual production domain | Edit the website in Umami settings |
| Multiple clients' hits mixed together | Same `NEXT_PUBLIC_UMAMI_WEBSITE_ID` reused across projects | Each client needs their own UUID — never share |

---

## Custom events (optional, per-client)

For tracking specific interactions (CTA clicks, form submits):

```tsx
// Any client component
declare global {
  interface Window { umami?: { track: (name: string, data?: Record<string, unknown>) => void } }
}

<button onClick={() => window.umami?.track('cta-hero-click')}>Get started</button>
```

Event names are visible in Umami dashboard → **Events** tab. No schema — name them descriptively (`form-contact-submit`, `pricing-basic-click`).

---

## Monthly report pipeline

The `/report <clientId>` command reads snapshots from Supabase (populated by the cron) and generates a branded PDF. Clients on **Premium tier** get this emailed each month. **Basic tier** clients see the prior month's snapshot on their dashboard.

- Cron schedule: 1st of each month at 03:00 JST
- Handler: `HQ/platform/src/app/api/cron/analytics/route.ts`
- Destination: Supabase `analytics_snapshots` table

If the cron fails for a client, re-run manually per `HQ/commands/report.md`.

---

## Offboarding a client

When a client cancels:

1. Stop charging (Stripe subscription cancelled)
2. Archive the Vercel project (stops hosting)
3. In Umami: **Settings → Websites → <clientId> → Delete** (after exporting historical data if needed)
4. Remove the website ID from Supabase `projects.umami_website_id` (optional — row usually stays for historical records)

Never delete the Umami data if the client might reactivate within 90 days (per reactivation window in CLAUDE.md).
