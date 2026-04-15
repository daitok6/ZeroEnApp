-- Projects table
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references public.profiles(id) on delete cascade not null,
  application_id uuid references public.applications(id),
  name text not null,
  description text,
  status text default 'onboarding' check (
    status in ('onboarding', 'building', 'launched', 'operating', 'paused', 'terminated')
  ),
  github_repo text,
  vercel_project text,
  supabase_project text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.projects enable row level security;

-- Clients can only see their own projects
create policy "Clients can view own projects"
  on public.projects for select
  using (auth.uid() = client_id);

-- Only admin (service role) can insert/update/delete
-- (Admin uses service role client which bypasses RLS)

-- Updated_at trigger
create trigger projects_updated_at
  before update on public.projects
  for each row execute procedure public.update_updated_at();
