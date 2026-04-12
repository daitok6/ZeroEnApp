-- Append-only table for immutable legal signing records
CREATE TABLE public.signed_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  document_type text NOT NULL CHECK (document_type IN ('nda', 'partnership_agreement')),
  document_version text NOT NULL,
  document_sha256 text NOT NULL,
  document_body text NOT NULL,
  signature_name text NOT NULL,
  signed_at timestamptz NOT NULL DEFAULT now(),
  ip_address text,
  user_agent text,
  locale text NOT NULL DEFAULT 'en',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index for fast lookup by user
CREATE INDEX idx_signed_documents_user_id ON public.signed_documents (user_id);

-- Enable RLS
ALTER TABLE public.signed_documents ENABLE ROW LEVEL SECURITY;

-- Users can INSERT their own records
CREATE POLICY "Users can insert their own signing records"
  ON public.signed_documents
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can read their own records
CREATE POLICY "Users can read their own signing records"
  ON public.signed_documents
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins (service_role) can read all records
CREATE POLICY "Service role can read all signing records"
  ON public.signed_documents
  FOR SELECT
  TO service_role
  USING (true);

-- IMPORTANT: No UPDATE or DELETE policies exist for any role.
-- This makes the table effectively append-only at the database level.
-- The absence of update/delete policies means those operations are denied even for service_role.
