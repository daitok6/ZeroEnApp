-- Add subscription/plan columns to projects
ALTER TABLE public.projects
  ADD COLUMN plan_tier text CHECK (plan_tier IN ('basic', 'premium')),
  ADD COLUMN commitment_starts_at timestamptz,
  ADD COLUMN client_visible boolean DEFAULT false NOT NULL,
  ADD COLUMN stripe_subscription_id text;

-- Index for quick lookup by stripe subscription ID (webhook handler)
CREATE INDEX idx_projects_stripe_subscription_id
  ON public.projects (stripe_subscription_id)
  WHERE stripe_subscription_id IS NOT NULL;
