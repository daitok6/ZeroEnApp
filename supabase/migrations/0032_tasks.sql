-- ============================================================
-- 0032_tasks.sql
-- Unified task management: tasks + generation log
-- ============================================================

-- Tasks table
create table if not exists public.tasks (
  id              uuid        primary key default gen_random_uuid(),
  title           text        not null,
  description     text,
  kind            text        not null check (kind in ('manual', 'cadence', 'state_change')),
  rule_key        text,
  client_id       uuid        references public.profiles(id) on delete set null,
  related_table   text,
  related_id      uuid,
  due_date        date        not null,
  due_time        time,
  urgency         text        not null default 'normal'
                    check (urgency in ('low', 'normal', 'high', 'critical')),
  category        text        not null default 'admin'
                    check (category in ('client_ops', 'billing', 'marketing', 'content', 'admin', 'personal')),
  status          text        not null default 'open'
                    check (status in ('open', 'done', 'dismissed')),
  completed_at    timestamptz,
  dedupe_key      text        unique,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create index if not exists tasks_status_due_date_idx on public.tasks (status, due_date);
create index if not exists tasks_client_id_status_idx on public.tasks (client_id, status);

alter table public.tasks enable row level security;

create policy "Admins have full access to tasks"
  on public.tasks for all
  using (public.is_admin())
  with check (public.is_admin());

create trigger tasks_updated_at
  before update on public.tasks
  for each row execute procedure public.update_updated_at();


-- Task generation log: one row per (date, scope) to guard idempotency
create table if not exists public.task_generation_log (
  id          uuid  primary key default gen_random_uuid(),
  log_date    date  not null,
  scope       text  not null check (scope in ('daily_cadence', 'state_backfill')),
  created_at  timestamptz default now(),
  unique (log_date, scope)
);

alter table public.task_generation_log enable row level security;

create policy "Admins have full access to task_generation_log"
  on public.task_generation_log for all
  using (public.is_admin())
  with check (public.is_admin());


-- Soft-dismiss open tasks when a client profile is deleted
create or replace function public.soft_dismiss_client_tasks()
returns trigger language plpgsql security definer as $$
begin
  update public.tasks
    set status = 'dismissed', updated_at = now()
  where client_id = old.id and status = 'open';
  return old;
end;
$$;

drop trigger if exists soft_dismiss_client_tasks_on_profile_delete on public.profiles;
create trigger soft_dismiss_client_tasks_on_profile_delete
  before delete on public.profiles
  for each row execute procedure public.soft_dismiss_client_tasks();
