-- 0049_profiles_insert_policy_and_backfill.sql
-- Fix: design-wizard submit failing with FK violation on client_brand.profile_id
-- because some auth.users have no matching public.profiles row (trigger missed)
-- and the route's upsert-on-profiles is silently blocked by missing INSERT RLS.

-- 1) Allow authenticated users to insert their own profile row
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- 2) Backfill missing profile rows from auth.users
insert into public.profiles (id, email, full_name, avatar_url)
select
  u.id,
  coalesce(u.email, ''),
  u.raw_user_meta_data->>'full_name',
  u.raw_user_meta_data->>'avatar_url'
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;
