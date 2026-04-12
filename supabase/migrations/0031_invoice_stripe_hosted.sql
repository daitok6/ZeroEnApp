-- 0031_invoice_stripe_hosted.sql
-- Add Stripe Invoice hosted URL, PDF URL, and invoice number to invoices table.
-- These are populated when the admin sends an invoice via Stripe Invoices API.

ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS stripe_hosted_invoice_url text,
  ADD COLUMN IF NOT EXISTS stripe_invoice_pdf_url text,
  ADD COLUMN IF NOT EXISTS stripe_invoice_number text;
