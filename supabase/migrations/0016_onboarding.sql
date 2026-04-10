-- Add 'onboarding' as a valid profile status (between 'pending' and 'approved')
-- When admin approves an application, profile status becomes 'onboarding' instead of 'approved'.
-- After the client completes the onboarding wizard, status becomes 'approved'.

-- 1. Expand the profile status CHECK constraint to allow 'onboarding'
alter table public.profiles drop constraint profiles_status_check;
alter table public.profiles add constraint profiles_status_check
  check (status in ('pending', 'onboarding', 'approved'));

-- 2. Add onboarding_data column to projects for storing wizard responses
alter table public.projects add column onboarding_data jsonb;

-- 3. Replace approve_application() to set status = 'onboarding' instead of 'approved'
create or replace function public.approve_application(app_id uuid)
returns void language plpgsql security definer as $$
declare
  linked_user_id uuid;
begin
  if not public.is_admin() then
    raise exception 'Unauthorized';
  end if;

  update public.applications
  set status = 'accepted'
  where id = app_id
  returning user_id into linked_user_id;

  if linked_user_id is not null then
    update public.profiles
    set status = 'onboarding'
    where id = linked_user_id;
  end if;
end;
$$;

-- 4. Create complete_onboarding() RPC — called by the client after finishing the wizard.
--    Atomically creates a project and sets profile status to 'approved'.
create or replace function public.complete_onboarding(
  p_application_id uuid,
  p_name text,
  p_description text,
  p_onboarding_data jsonb
) returns uuid language plpgsql security definer as $$
declare
  caller_status text;
  new_project_id uuid;
begin
  select status into caller_status
  from public.profiles
  where id = auth.uid();

  if caller_status != 'onboarding' then
    raise exception 'Not in onboarding status';
  end if;

  insert into public.projects (client_id, application_id, name, description, status, onboarding_data)
  values (auth.uid(), p_application_id, p_name, p_description, 'onboarding', p_onboarding_data)
  returning id into new_project_id;

  update public.profiles
  set status = 'approved'
  where id = auth.uid();

  return new_project_id;
end;
$$;

grant execute on function public.complete_onboarding(uuid, text, text, jsonb) to authenticated;
