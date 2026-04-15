-- Drop milestones feature (Phase 1 scope cut).
-- Lifecycle status lives solely on projects.status.
drop table if exists public.milestones cascade;
