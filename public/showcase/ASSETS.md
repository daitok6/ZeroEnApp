# Showcase Assets

Drop these files here before deploying:

| File | Size | Notes |
|------|------|-------|
| `dashboard-demo.mp4` | < 2 MB | H.264, 1280×800, ~15–25s loop |
| `dashboard-demo.webm` | < 2 MB | VP9, same dimensions |
| `dashboard-demo-poster.png` | < 200 KB | First frame at 1280×800 |
| `dashboard-analytics.png` | < 300 KB | Analytics view screenshot |
| `dashboard-requests.png` | < 300 KB | Change Requests view screenshot |
| `dashboard-invoices.png` | < 300 KB | Invoices view screenshot |
| `dashboard-messages.png` | < 300 KB | Messages view screenshot |

## Recording instructions

1. Open the local dashboard with seeded demo data (`npm run dev` → `localhost:3000/en/dashboard`)
2. Use QuickTime / Loom / OBS at 1440×900 → export 1280×800
3. Walkthrough order: Analytics → Change Requests → Invoices → Messages
4. Export MP4 (H.264) + WebM (VP9) — both < 2 MB
5. Screenshot each view at full width for the dashboard-preview page
6. Drop files here, commit, redeploy

The `<video>` element and `<img>` tags will silently fall back to placeholder UI until these files are present.
