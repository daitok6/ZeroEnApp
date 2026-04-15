-- 0046_client_brand.sql
-- Create client_brand table to store design-wizard brand inputs per client profile.

create table public.client_brand (
  profile_id        uuid primary key references public.profiles(id) on delete cascade,
  business_name     text,
  industry          text,
  location          text,
  tagline           text,
  entity_name       text,
  timezone          text,
  logo_url          text,
  primary_color     text,
  secondary_color   text,
  font_preference   text,
  target_audience   text,
  primary_cta       text,
  key_offerings     text[],
  reference_urls    text[],
  vibe_keywords     text[],
  terms_accepted_at timestamptz,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

-- Enable RLS
alter table public.client_brand enable row level security;

-- Policy: authenticated users can select their own row
create policy "Users can select own brand"
  on public.client_brand for select
  using (auth.uid() = profile_id);

-- Policy: authenticated users can insert their own row
create policy "Users can insert own brand"
  on public.client_brand for insert
  with check (auth.uid() = profile_id);

-- Policy: authenticated users can update their own row
create policy "Users can update own brand"
  on public.client_brand for update
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

-- Auto-update updated_at on every row change
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger client_brand_updated_at
  before update on public.client_brand
  for each row execute function public.set_updated_at();
