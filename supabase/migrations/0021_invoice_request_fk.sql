-- supabase/migrations/0021_invoice_request_fk.sql

-- Link invoices to the change request they were created for
ALTER TABLE public.invoices
  ADD COLUMN change_request_id UUID REFERENCES public.change_requests(id) ON DELETE SET NULL;

-- Admin RLS: change_requests
CREATE POLICY "Admins can view all change requests"
  ON public.change_requests FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update change requests"
  ON public.change_requests FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admin RLS: invoices (insert + select all)
CREATE POLICY "Admins can view all invoices"
  ON public.invoices FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can insert invoices"
  ON public.invoices FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
