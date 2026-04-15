-- supabase/migrations/0023_invoice_status_declined.sql

-- Drop and recreate the status check constraint to include 'declined'
ALTER TABLE public.invoices DROP CONSTRAINT invoices_status_check;

ALTER TABLE public.invoices
  ADD CONSTRAINT invoices_status_check
  CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled', 'declined'));
