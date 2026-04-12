-- 0034_invoice_draft_overage.sql
-- Support for overage invoices that are auto-drafted and require admin approval before sending.

-- Add overage draft fields to invoices
ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS draft_status text
    CHECK (draft_status IN ('pending_admin_approval', 'approved', 'rejected')),
  ADD COLUMN IF NOT EXISTS overage_cycle_start date,
  ADD COLUMN IF NOT EXISTS overage_cycle_end date,
  ADD COLUMN IF NOT EXISTS overage_change_request_id uuid
    REFERENCES public.change_requests(id) ON DELETE SET NULL;

-- Extend status check constraint to include 'draft'
ALTER TABLE public.invoices DROP CONSTRAINT invoices_status_check;
ALTER TABLE public.invoices
  ADD CONSTRAINT invoices_status_check
  CHECK (status IN ('draft', 'pending', 'paid', 'overdue', 'cancelled', 'declined'));

-- Index for admin querying pending overage approvals
CREATE INDEX idx_invoices_draft_status
  ON public.invoices (draft_status)
  WHERE draft_status = 'pending_admin_approval';
