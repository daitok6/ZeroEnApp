-- Milestones table
create table public.milestones (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  title text not null,
  description text,
  status text default 'pending' check (
    status in ('pending', 'in_progress', 'completed')
  ),
  due_date date,
  completed_at timestamptz,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.milestones enable row level security;

-- Clients can view milestones for their own projects
create policy "Clients can view own project milestones"
  on public.milestones for select
  using (
    exists (
      select 1 from public.projects
      where projects.id = milestones.project_id
        and projects.client_id = auth.uid()
    )
  );
