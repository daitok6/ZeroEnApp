-- Admin policy: allow admins to update profiles (for setting status = 'approved')
create policy "Admins can update profiles"
  on public.profiles for update
  using (public.is_admin())
  with check (public.is_admin());

-- Admin policy: allow admins to update applications (for status, scores, notes)
create policy "Admins can update applications"
  on public.applications for update
  using (public.is_admin())
  with check (public.is_admin());

-- Atomic approval function: accepts an application and approves the linked user profile.
-- SECURITY DEFINER so it can bypass RLS for the combined update.
create or replace function public.approve_application(app_id uuid)
returns void language plpgsql security definer as $$
declare
  linked_user_id uuid;
begin
  -- Only admins may call this
  if not public.is_admin() then
    raise exception 'Unauthorized';
  end if;

  -- Mark application as accepted and retrieve linked user
  update public.applications
  set status = 'accepted'
  where id = app_id
  returning user_id into linked_user_id;

  -- If application was linked to a user account, approve them
  if linked_user_id is not null then
    update public.profiles
    set status = 'approved'
    where id = linked_user_id;
  end if;
end;
$$;

grant execute on function public.approve_application(uuid) to authenticated;

-- Rejection function for symmetry
create or replace function public.reject_application(app_id uuid)
returns void language plpgsql security definer as $$
begin
  if not public.is_admin() then
    raise exception 'Unauthorized';
  end if;

  update public.applications
  set status = 'rejected'
  where id = app_id;
end;
$$;

grant execute on function public.reject_application(uuid) to authenticated;
