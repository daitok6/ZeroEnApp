-- Link applications to user accounts.
-- Nullable: existing applications have no linked user; public apply page stays anonymous.
alter table public.applications
  add column user_id uuid references auth.users(id) on delete set null;

create index idx_applications_user_id on public.applications(user_id);

-- Authenticated users can read their own applications
create policy "Users can view own applications"
  on public.applications for select
  using (auth.uid() = user_id);
