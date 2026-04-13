---
name: report
description: Manually trigger an analytics snapshot for a client. Calls the snapshot worker which pulls the prior calendar month from Umami and upserts into analytics_snapshots.
args: "<clientId>"
---

# /report <clientId>

## Validation

1. **clientId is required** — abort if not provided
2. **Verify client exists** in `HQ/crm/clients.json`
3. **Verify client status is "operate"** — no reports for clients still in build phase
4. **Verify `umami_website_id` is set** — check the `projects` row in Supabase; abort with instructions if missing

## Steps

### 1. Get Project UUID

Look up the client's Supabase `projects.id` (UUID). Two ways:
- Check `HQ/crm/clients/<clientId>/profile.md` for a stored `Project UUID` field
- Or look it up in the Supabase dashboard → Table Editor → `projects` → filter by the client's user email

### 2. Trigger Snapshot Worker

```bash
curl -s -X GET \
  "https://zeroen.dev/api/cron/analytics?projectId=<PROJECT_UUID>" \
  -H "Authorization: Bearer $CRON_SECRET" | jq .
```

Expected response:
```json
{
  "results": [{ "projectId": "<uuid>", "ok": true }],
  "count": 1
}
```

If `ok` is `false`, check the `error` field — common causes:
- `UMAMI_API_URL` or `UMAMI_API_TOKEN` env vars not set in Vercel
- `umami_website_id` on the project row is wrong — verify in Umami dashboard
- Client site has no traffic yet for the prior month (snapshot will still write with zeros)

### 3. Review in Dashboard

Navigate to the client's dashboard in operator preview mode to confirm the snapshot renders correctly:

```
https://zeroen.dev/<locale>/dashboard/analytics
```

The new snapshot appears immediately — no cache to clear.

### 4. Update CRM (if first report)

Update `HQ/crm/clients/<clientId>/profile.md`:
- Set `Last report` to today's date
- Set `Next report` to first of next month (automated via cron going forward)

## Notes

- The cron runs automatically on the **1st of every month at 03:00 JST** for all `operating` projects with a `umami_website_id`.
- This command is only needed to regenerate a report mid-month, backfill after a new client launches, or re-pull if the cron failed.
- Snapshots use `upsert` — re-running overwrites the existing row for that month. Safe to run multiple times.
- Basic tier clients see only the latest snapshot. Premium tier clients see the last 12 months.
