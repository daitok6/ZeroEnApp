-- 0048_lp_inquiries.sql
-- LP inquiry table for the free-build application form on zeroen.dev/apply.
-- This is the paid-ad and note-article conversion target (2026-04 first-5 campaign).
-- Separate from the old `applications` table (dropped in 0045) which was for the startup equity flow.

create table public.lp_inquiries (
  id uuid default gen_random_uuid() primary key,
  -- Form fields
  name text not null,
  email text not null,
  occupation text not null check (occupation in ('coach', 'therapist', 'counselor', 'other')),
  current_site_url text,
  challenge text not null,
  -- Attribution (first-touch, from localStorage)
  first_touch text,          -- compact "source/medium/campaign" string
  attribution_meta jsonb,    -- full UTM params JSON
  -- Scoring (admin-filled after review)
  score int check (score between 1 and 20),
  status text default 'pending' check (status in ('pending', 'reviewing', 'accepted', 'rejected')),
  notes text,
  -- Metadata
  locale text default 'ja',
  created_at timestamptz default now()
);

-- RLS: anyone can insert (anonymous application), admin reads via service role
alter table public.lp_inquiries enable row level security;

create policy "Anyone can submit lp inquiry"
  on public.lp_inquiries for insert
  with check (true);

-- Admin reads via service role (bypasses RLS)
-- No select policy needed — only service role (server-side admin) reads these.
