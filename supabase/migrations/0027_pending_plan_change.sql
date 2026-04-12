-- Add pending plan change columns to projects
-- Used when a downgrade is scheduled to take effect at the end of the 6-month commitment

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS pending_plan_tier text CHECK (pending_plan_tier IN ('basic', 'premium')),
  ADD COLUMN IF NOT EXISTS pending_plan_effective_at timestamptz,
  ADD COLUMN IF NOT EXISTS stripe_subscription_schedule_id text;
