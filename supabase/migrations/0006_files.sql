-- Files metadata table
create table public.files (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  uploaded_by uuid references public.profiles(id) not null,
  file_name text not null,
  file_size bigint not null,
  mime_type text not null,
  storage_path text not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.files enable row level security;

-- Project participants can view files
create policy "Project participants can view files"
  on public.files for select
  using (
    exists (
      select 1 from public.projects
      where projects.id = files.project_id
        and projects.client_id = auth.uid()
    )
  );
