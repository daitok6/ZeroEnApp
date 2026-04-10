-- Admin RLS policies for all client data tables
-- Allows admin users (role='admin' in profiles) to SELECT all rows across all tables
-- These policies are additive and evaluated alongside existing user policies (OR logic)

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

-- Admins can view all projects
CREATE POLICY "Admins can view all projects"
  ON public.projects FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

-- Admins can view all milestones
CREATE POLICY "Admins can view all milestones"
  ON public.milestones FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

-- Admins can view all invoices
CREATE POLICY "Admins can view all invoices"
  ON public.invoices FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

-- Admins can view all change requests
CREATE POLICY "Admins can view all change_requests"
  ON public.change_requests FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

-- Admins can view all applications
CREATE POLICY "Admins can view all applications"
  ON public.applications FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));
