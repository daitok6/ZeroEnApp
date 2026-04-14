-- 0045_drop_applications.sql
-- Drop the applications table and related functions.
-- Tighten the profiles.status CHECK constraint: replace 'approved' with 'client'.
-- Drop the profiles.managed column (no longer needed).

-- 1. Drop functions that reference the applications table
drop function if exists public.approve_application(uuid);
drop function if exists public.complete_onboarding(uuid, text, text, jsonb);

-- 2. Drop the applications table (cascade clears any FKs pointing to it)
drop table if exists public.applications cascade;

-- 3. Drop the old CHECK constraint first so backfill and existing 'client' rows don't violate it
alter table public.profiles drop constraint if exists profiles_status_check;

-- 4. Backfill: map old status values to the new simplified set.
--    'approved' → 'client'  (fully onboarded, paying client)
--    'onboarding' stays as 'onboarding' — client is mid-wizard
--    'pending' stays as 'pending' — new signup, not yet in wizard
update public.profiles
  set status = 'client'
  where status = 'approved';

-- Backfill: existing clients should not be sent to the new design wizard
update public.profiles
  set onboarding_status = 'complete'
  where status = 'client';

-- 5. Re-add the constraint with the new allowed values.
alter table public.profiles add constraint profiles_status_check
  check (status in ('pending', 'onboarding', 'client'));

-- 5. Drop the managed column (managed-client flow replaced by design wizard)
alter table public.profiles drop column if exists managed;
