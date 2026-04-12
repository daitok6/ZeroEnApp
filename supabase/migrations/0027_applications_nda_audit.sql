ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS nda_signature_name text,
  ADD COLUMN IF NOT EXISTS nda_accepted_at timestamptz,
  ADD COLUMN IF NOT EXISTS nda_ip text,
  ADD COLUMN IF NOT EXISTS nda_user_agent text,
  ADD COLUMN IF NOT EXISTS nda_version text;
