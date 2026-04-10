-- Add status column to profiles: 'pending' = new signup, 'approved' = accepted client
alter table public.profiles
  add column status text not null default 'pending'
  check (status in ('pending', 'approved'));

-- Backfill: all existing users are already active
update public.profiles set status = 'approved';

-- Prevent clients from self-elevating their own status or role.
-- Drop and replace the existing self-update policy with a stricter check.
drop policy "Users can update own profile" on public.profiles;

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = (select role from public.profiles where id = auth.uid())
    and status = (select status from public.profiles where id = auth.uid())
  );
