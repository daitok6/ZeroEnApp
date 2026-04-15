-- Quarterly audits (security + SEO) delivered as PDFs to Premium clients.
-- Uploaded by the operator via /admin/audits; listed and downloaded by clients in /dashboard/audits.
-- Storage: private bucket "audits"; storage_path convention: <client_id>/<period>-<kind>.pdf (e.g. "abc-123/2026-Q2-security.pdf").

CREATE TABLE public.audits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('security', 'seo')),
  period text NOT NULL, -- format: YYYY-Q# (e.g. "2026-Q2")
  storage_path text NOT NULL, -- path within the "audits" storage bucket
  file_name text NOT NULL,
  file_size bigint NOT NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  delivered_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (project_id, kind, period)
);

CREATE INDEX idx_audits_project_id ON public.audits (project_id);
CREATE INDEX idx_audits_created_at ON public.audits (created_at DESC);

ALTER TABLE public.audits ENABLE ROW LEVEL SECURITY;

-- Clients can read audits for their own project, only if they are on the Premium tier.
CREATE POLICY "Premium clients can read their own audits"
  ON public.audits
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = audits.project_id
        AND projects.client_id = auth.uid()
        AND projects.plan_tier = 'premium'
    )
  );

-- Service role can read everything (admin operations).
CREATE POLICY "Service role can read all audits"
  ON public.audits
  FOR SELECT
  TO service_role
  USING (true);

-- Only service_role can INSERT / UPDATE / DELETE — the operator uploads via /admin/audits,
-- which uses the admin supabase client. No client-side policies for writes.
CREATE POLICY "Service role can insert audits"
  ON public.audits
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update audits"
  ON public.audits
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete audits"
  ON public.audits
  FOR DELETE
  TO service_role
  USING (true);

-- Storage bucket for the PDF files themselves. Private — access only via signed URLs
-- minted by the /api/audits/[id]/download route after verifying RLS-equivalent access.
INSERT INTO storage.buckets (id, name, public)
VALUES ('audits', 'audits', false)
ON CONFLICT (id) DO NOTHING;

-- Note: no storage RLS policies needed — bucket is private, and all access is via
-- service_role-minted signed URLs from the download route.
