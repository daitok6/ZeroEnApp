-- Prevent changing `tier` once a change_request has moved past `submitted`.
-- The client's size selection is binding; admin can only approve or reject.

create or replace function public.prevent_tier_change_after_submit()
returns trigger
language plpgsql
as $$
begin
  if OLD.status <> 'submitted' and NEW.tier is distinct from OLD.tier then
    raise exception 'Cannot change tier after a change request has left submitted status';
  end if;
  return NEW;
end;
$$;

create trigger change_requests_lock_tier
  before update on public.change_requests
  for each row execute procedure public.prevent_tier_change_after_submit();
