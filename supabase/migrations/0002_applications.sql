create table public.applications (
  id uuid default gen_random_uuid() primary key,
  -- Step 1: Idea
  idea_name text not null,
  idea_description text not null,
  problem_solved text not null,
  -- Step 2: Market
  target_users text not null,
  competitors text,
  monetization_plan text not null,
  -- Step 3: Founder
  founder_name text not null,
  founder_email text not null,
  founder_background text not null,
  founder_commitment text not null check (founder_commitment in ('full-time', 'part-time', 'side-project')),
  linkedin_url text,
  -- Scoring (admin-filled)
  score_viability int check (score_viability between 1 and 5),
  score_commitment int check (score_commitment between 1 and 5),
  score_feasibility int check (score_feasibility between 1 and 5),
  score_market int check (score_market between 1 and 5),
  status text default 'pending' check (status in ('pending', 'reviewing', 'accepted', 'rejected')),
  notes text,
  locale text default 'en',
  created_at timestamptz default now()
);

-- RLS: anyone can insert (anonymous application), only admin can read
alter table public.applications enable row level security;

create policy "Anyone can submit application"
  on public.applications for insert
  with check (true);

-- Admin reads via service role (bypasses RLS)
