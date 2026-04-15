-- 0051_admin_client_brand_rls.sql
-- Let admins read every client's design-wizard submission.
-- Uses the existing public.is_admin() SECURITY DEFINER helper (0011_admin_rls_policies.sql).

create policy "Admins can view all brand submissions"
  on public.client_brand for select
  using (public.is_admin());
