create table public.newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  locale text default 'en' check (locale in ('en', 'ja')),
  subscribed_at timestamptz default now(),
  unsubscribed_at timestamptz
);

alter table public.newsletter_subscribers enable row level security;

create policy "Anyone can subscribe"
  on public.newsletter_subscribers for insert
  with check (true);
