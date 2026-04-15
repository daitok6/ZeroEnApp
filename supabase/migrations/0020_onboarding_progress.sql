-- Add onboarding_progress column to profiles for mid-wizard persistence.
-- NULL = first visit (no progress saved yet), non-null = has started the wizard.
-- Progress shape: { current_step: number, form_data: object, updated_at: string }

-- 1. Add column
alter table public.profiles add column onboarding_progress jsonb;

-- 2. RPC to save progress — SECURITY DEFINER so the user can write their own progress
--    without needing direct UPDATE access to profiles.
create or replace function public.save_onboarding_progress(p_data jsonb)
returns void language plpgsql security definer as $$
declare
  caller_status text;
begin
  select status into caller_status
  from public.profiles
  where id = auth.uid();

  if caller_status != 'onboarding' then
    raise exception 'Not in onboarding status';
  end if;

  update public.profiles
  set onboarding_progress = p_data
  where id = auth.uid();
end;
$$;

grant execute on function public.save_onboarding_progress(jsonb) to authenticated;

-- 3. Update complete_onboarding() to clear progress on completion
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
  set status = 'approved', onboarding_progress = null
  where id = auth.uid();

  return new_project_id;
end;
$$;
