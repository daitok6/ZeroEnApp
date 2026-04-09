-- Invoices table
create table public.invoices (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  client_id uuid references public.profiles(id) not null,
  stripe_invoice_id text,
  stripe_payment_intent_id text,
  amount_cents int not null,
  currency text default 'usd',
  description text not null,
  type text check (type in ('subscription', 'per_request')),
  status text default 'pending' check (
    status in ('pending', 'paid', 'overdue', 'cancelled')
  ),
  due_date date,
  paid_at timestamptz,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.invoices enable row level security;

-- Clients can view own invoices
create policy "Clients can view own invoices"
  on public.invoices for select
  using (auth.uid() = client_id);
