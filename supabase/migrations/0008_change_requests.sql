-- Change requests table
create table public.change_requests (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  client_id uuid references public.profiles(id) not null,
  title text not null,
  description text not null,
  tier text check (tier in ('small', 'medium', 'large')),
  estimated_cost_cents int,
  status text default 'submitted' check (
    status in ('submitted', 'reviewing', 'quoted', 'approved', 'in_progress', 'completed', 'rejected')
  ),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.change_requests enable row level security;

-- Clients can view and create own change requests
create policy "Clients can view own change requests"
  on public.change_requests for select
  using (auth.uid() = client_id);

create policy "Clients can create change requests"
  on public.change_requests for insert
  with check (auth.uid() = client_id);

-- Updated_at trigger
create trigger change_requests_updated_at
  before update on public.change_requests
  for each row execute procedure public.update_updated_at();
