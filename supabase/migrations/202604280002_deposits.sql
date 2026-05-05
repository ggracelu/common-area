-- Deposits table for tracking seasonal participation payments
-- This table is server-controlled and payment state is updated by webhooks only

create table if not exists public.deposits (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  season_id uuid not null references public.seasons(id) on delete cascade,
  clerk_user_id text not null,
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,
  amount_cents integer not null default 2000,
  currency text not null default 'usd',
  status text not null default 'pending',
  paid_at timestamptz,
  failed_at timestamptz,
  refunded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint deposits_status_check
    check (status in ('pending', 'paid', 'refunded', 'failed')),
  constraint deposits_amount_cents_check
    check (amount_cents > 0),
  constraint deposits_currency_check
    check (currency = lower(currency)),
  constraint deposits_unique_user_season
    unique (clerk_user_id, season_id)
);

-- Indexes for efficient queries
create index if not exists deposits_clerk_user_id_idx on public.deposits (clerk_user_id);
create index if not exists deposits_season_id_idx on public.deposits (season_id);
create index if not exists deposits_status_idx on public.deposits (status);
create index if not exists deposits_stripe_checkout_session_id_idx on public.deposits (stripe_checkout_session_id);
create index if not exists deposits_stripe_payment_intent_id_idx on public.deposits (stripe_payment_intent_id);

-- Trigger for updated_at
drop trigger if exists deposits_set_updated_at on public.deposits;
create trigger deposits_set_updated_at
before update on public.deposits
for each row
execute function public.set_updated_at();

-- Enable RLS
alter table public.deposits enable row level security;

-- RLS Policies:
-- - Users can only read their own deposits (when Clerk/Supabase claims are wired safely)
-- - No public write policies - all writes are server-controlled
-- - Payment state transitions happen via server-side webhook handlers only

-- Users can read their own deposits
-- Note: This policy will be enforced once Clerk auth claims are wired to Supabase
create policy "users can read their own deposits"
on public.deposits
for select
to authenticated
using (clerk_user_id = auth.jwt() ->> 'clerk_user_id');

-- No insert, update, or delete policies for authenticated users
-- All deposit state changes are server-controlled via webhook handlers
