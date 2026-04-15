-- ============================================================
-- 0030_ownership_ack.sql
-- Add ownership_ack to managed_client_intake.
-- Records that the client acknowledged ZeroEn retains code
-- ownership (captured at plan selection, not at design wizard).
-- ============================================================

alter table public.managed_client_intake
  add column if not exists ownership_ack boolean default false;
