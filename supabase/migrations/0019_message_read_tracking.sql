-- Track last-read timestamp per user per project for unread counts and seen indicators
create table public.message_read_status (
  user_id uuid references public.profiles(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  last_read_at timestamptz not null default now(),
  primary key (user_id, project_id)
);

alter table public.message_read_status enable row level security;

create policy "Users can view own read status"
  on public.message_read_status for select
  using (auth.uid() = user_id);

create policy "Users can upsert own read status"
  on public.message_read_status for insert
  with check (auth.uid() = user_id);

create policy "Users can update own read status"
  on public.message_read_status for update
  using (auth.uid() = user_id);

create policy "Admins can view all read status"
  on public.message_read_status for select
  using (public.is_admin());

-- Log sent notification emails to enforce cooldown periods
create table public.message_notification_log (
  id uuid default gen_random_uuid() primary key,
  recipient_id uuid references public.profiles(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete cascade not null,
  sent_at timestamptz default now() not null,
  type text not null check (type in ('client_instant', 'admin_digest'))
);

alter table public.message_notification_log enable row level security;
-- Only service role (cron/server) writes to this; no client RLS policies needed
