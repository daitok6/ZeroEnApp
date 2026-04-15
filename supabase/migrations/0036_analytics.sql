-- Add Umami website ID to projects
alter table public.projects add column umami_website_id text;

-- Monthly analytics snapshots
create table public.analytics_snapshots (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  period_start date not null,       -- first day of month (YYYY-MM-DD)
  period_end date not null,         -- last day of month (YYYY-MM-DD)
  visitors int not null default 0,
  pageviews int not null default 0,
  avg_session_seconds int,
  bounce_rate numeric(5,2),
  top_pages jsonb,                  -- [{path, views, pct}]
  performance jsonb,                -- {lcp, cls, inp, rating:{...}} — null until Speed Insights wired
  source text not null default 'cron' check (source in ('cron', 'manual')),
  created_at timestamptz default now(),
  unique (project_id, period_start)
);

alter table public.analytics_snapshots enable row level security;

-- Clients can only read their own project's snapshots
create policy "Clients view own snapshots"
  on public.analytics_snapshots for select
  using (exists (
    select 1 from public.projects p
    where p.id = analytics_snapshots.project_id
      and p.client_id = auth.uid()
  ));
-- Writes use service role (snapshot worker) — no insert/update policy needed
