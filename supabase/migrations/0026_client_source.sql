-- ============================================================
-- 0026_client_source.sql
-- Managed client (Coconala bypass) schema:
--   A. New columns on profiles
--   B. managed_client_intake table + RLS
--   C. Storage bucket + RLS for client-assets
--   D. provision_managed_client() RPC
-- ============================================================


-- ============================================================
-- A. Add columns to public.profiles
-- ============================================================

alter table public.profiles
  add column source text not null default 'webapp'
    check (source in ('webapp', 'coconala', 'direct'));

alter table public.profiles
  add column managed boolean not null default false;

-- nullable: null = not a managed client
alter table public.profiles
  add column onboarding_status text
    check (onboarding_status in ('pending', 'in_progress', 'complete'));


-- ============================================================
-- B. managed_client_intake table
-- ============================================================

create table public.managed_client_intake (
  id                  uuid        primary key default gen_random_uuid(),
  profile_id          uuid        not null unique references public.profiles(id) on delete cascade,
  scope_md            text,
  scope_ack           boolean     default false,
  commitment_ack_at   timestamptz,
  brand_kit           jsonb,        -- { tone, vibe_tags[], palette, font_pairing, sample_sites[] }
  assets              jsonb,        -- { logo_url, copy, images[] }
  domain              jsonb,        -- { type: 'own'|'help', value: text }
  coconala_order_ref  text,
  plan_tier           text        check (plan_tier in ('basic', 'premium')),
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

-- RLS
alter table public.managed_client_intake enable row level security;

-- Clients: SELECT + UPDATE their own row
create policy "Clients can view own intake"
  on public.managed_client_intake for select
  using (profile_id = auth.uid());

create policy "Clients can update own intake"
  on public.managed_client_intake for update
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

-- Admins: full access
create policy "Admins have full access to intake"
  on public.managed_client_intake for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- updated_at trigger (reuse existing function)
create trigger managed_client_intake_updated_at
  before update on public.managed_client_intake
  for each row execute procedure public.update_updated_at();


-- ============================================================
-- C. Storage bucket + RLS for client-assets
-- ============================================================

insert into storage.buckets (id, name, public)
  values ('client-assets', 'client-assets', false)
  on conflict do nothing;

-- Authenticated users can manage their own folder (first path segment = uid)
create policy "Authenticated users manage own assets"
  on storage.objects for all
  to authenticated
  using (
    bucket_id = 'client-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'client-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Admins can do everything in this bucket
create policy "Admins manage all client assets"
  on storage.objects for all
  to authenticated
  using (
    bucket_id = 'client-assets'
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  )
  with check (
    bucket_id = 'client-assets'
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );


-- ============================================================
-- D. provision_managed_client() RPC
-- Called from server action (service_role client) after the
-- auth user has already been created via Admin SDK.
-- ============================================================

create or replace function public.provision_managed_client(
  p_user_id    uuid,
  p_email      text,
  p_full_name  text,
  p_locale     text,
  p_source     text,
  p_scope_md   text,
  p_order_ref  text,
  p_plan_tier  text
) returns void language plpgsql security definer as $$
begin
  -- 1. Upsert profile — profile row may already exist from handle_new_user trigger
  insert into public.profiles (
    id,
    email,
    full_name,
    locale,
    status,
    managed,
    source,
    onboarding_status
  ) values (
    p_user_id,
    p_email,
    p_full_name,
    p_locale,
    'approved',
    true,
    p_source,
    'pending'
  )
  on conflict (id) do update set
    email              = excluded.email,
    full_name          = excluded.full_name,
    locale             = excluded.locale,
    status             = 'approved',
    managed            = true,
    source             = excluded.source,
    onboarding_status  = 'pending';

  -- 2. Upsert managed_client_intake row
  insert into public.managed_client_intake (
    profile_id,
    scope_md,
    plan_tier,
    coconala_order_ref
  ) values (
    p_user_id,
    p_scope_md,
    p_plan_tier,
    p_order_ref
  )
  on conflict (profile_id) do update set
    scope_md           = excluded.scope_md,
    plan_tier          = excluded.plan_tier,
    coconala_order_ref = excluded.coconala_order_ref;
end;
$$;

-- Only the service_role may call this function (server action uses service client)
revoke execute on function public.provision_managed_client(uuid, text, text, text, text, text, text, text) from public, authenticated, anon;
grant execute on function public.provision_managed_client(uuid, text, text, text, text, text, text, text) to service_role;
