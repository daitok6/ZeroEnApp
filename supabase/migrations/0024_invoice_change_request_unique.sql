-- Ensure each change request can only have one invoice
ALTER TABLE public.invoices
  ADD CONSTRAINT invoices_change_request_id_unique
  UNIQUE (change_request_id);
