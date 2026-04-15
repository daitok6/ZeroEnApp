-- 0050_complete_design_wizard_fn.sql
-- SECURITY DEFINER RPC so a user can finalize their own onboarding on wizard
-- submit without needing a loosened UPDATE RLS policy on profiles.status.

create or replace function public.complete_design_wizard()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  update public.profiles
     set status              = 'client',
         onboarding_status   = 'complete',
         onboarding_progress = null
   where id = auth.uid();
end;
$$;

revoke all on function public.complete_design_wizard() from public;
grant execute on function public.complete_design_wizard() to authenticated;
