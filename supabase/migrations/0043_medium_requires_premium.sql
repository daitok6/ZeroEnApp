-- Enforce at the database level: Basic-tier clients cannot submit medium change requests.
-- Medium changes are a Premium-only feature. Basic clients who need a medium change must
-- upgrade to Premium (which triggers a fresh 6-month commitment) or split the work into
-- multiple small changes. This mirrors the application-level gate in the dashboard UI and
-- the overage computation.

create or replace function public.enforce_medium_requires_premium()
returns trigger
language plpgsql
as $$
declare
  project_plan_tier text;
begin
  if NEW.tier = 'medium' then
    select plan_tier into project_plan_tier
    from public.projects
    where id = NEW.project_id;

    if project_plan_tier is distinct from 'premium' then
      raise exception 'Medium change requests require a Premium plan. Upgrade to Premium or submit smaller changes.';
    end if;
  end if;
  return NEW;
end;
$$;

create trigger change_requests_enforce_medium_tier
  before insert or update of tier on public.change_requests
  for each row execute procedure public.enforce_medium_requires_premium();
