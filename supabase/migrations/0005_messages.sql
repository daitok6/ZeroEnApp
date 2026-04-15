-- Messages table (in-app threaded messaging)
create table public.messages (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) not null,
  parent_id uuid references public.messages(id),
  content text not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.messages enable row level security;

-- Participants can view messages for their project
create policy "Project participants can view messages"
  on public.messages for select
  using (
    exists (
      select 1 from public.projects
      where projects.id = messages.project_id
        and projects.client_id = auth.uid()
    )
  );

-- Participants can send messages
create policy "Project participants can send messages"
  on public.messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.projects
      where projects.id = messages.project_id
        and projects.client_id = auth.uid()
    )
  );

-- Enable Realtime for live messaging
alter publication supabase_realtime add table public.messages;
