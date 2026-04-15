-- Premium-only perk: 1 copy-refresh credit per calendar quarter.
-- A credit entitles the client to one headline/CTA rewrite from mktg-copy without
-- counting against their monthly change allowance. Credits reset quarterly (cron TBD).
--
-- Grant rules:
--   - New Premium checkout: credits_remaining = 1, cycle_start = now()
--   - Basic → Premium upgrade: credits_remaining = 1, cycle_start = now()
--   - Premium → Basic downgrade (takes effect at commitment end): credits_remaining = 0

alter table public.projects
  add column if not exists copy_refresh_credits_remaining int not null default 0,
  add column if not exists copy_refresh_cycle_start timestamptz;

comment on column public.projects.copy_refresh_credits_remaining is
  'Premium-only: headline/CTA copy refresh credits remaining in the current quarterly cycle. Basic plans stay at 0.';

comment on column public.projects.copy_refresh_cycle_start is
  'Timestamp when the current copy-refresh quarterly cycle began. Quarterly reset cron should set this and credits_remaining.';
