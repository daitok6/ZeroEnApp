-- Helper function: checks if the current user has role='admin' in profiles.
-- SECURITY DEFINER bypasses RLS on the profiles table, preventing recursive
-- policy evaluation when the admin policy for profiles references profiles itself.
create or replace function public.is_admin()
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- Grant execute to authenticated users
grant execute on function public.is_admin() to authenticated;

-- Admins can view all profiles
create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.is_admin());

-- Admins can view all projects
create policy "Admins can view all projects"
  on public.projects for select
  using (public.is_admin());

-- Admins can view all milestones
create policy "Admins can view all milestones"
  on public.milestones for select
  using (public.is_admin());

-- Admins can view all invoices
create policy "Admins can view all invoices"
  on public.invoices for select
  using (public.is_admin());

-- Admins can view all change requests
create policy "Admins can view all change requests"
  on public.change_requests for select
  using (public.is_admin());

-- Admins can view all applications
create policy "Admins can view all applications"
  on public.applications for select
  using (public.is_admin());
