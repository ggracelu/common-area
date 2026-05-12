-- Seasonal deposits and row-level security for user-scoped tables.

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
  unique (clerk_user_id, season_id)
);

create index if not exists deposits_profile_season_idx
  on public.deposits (profile_id, season_id);

create index if not exists deposits_clerk_user_season_idx
  on public.deposits (clerk_user_id, season_id);

create index if not exists deposits_stripe_checkout_session_idx
  on public.deposits (stripe_checkout_session_id)
  where stripe_checkout_session_id is not null;

drop trigger if exists deposits_set_updated_at on public.deposits;
create trigger deposits_set_updated_at
before update on public.deposits
for each row
execute function public.set_updated_at();

alter table public.deposits enable row level security;

-- Profiles: authenticated reads/updates are deferred until Supabase JWT claims exist.
-- Block direct anon access; privileged server workflows use the service role.
create policy "deny anon profiles"
on public.profiles
as restrictive
for all
to anon
using (false)
with check (false);

create policy "deny anon deposits"
on public.deposits
as restrictive
for all
to anon
using (false)
with check (false);

create policy "deny anon user activity choices"
on public.user_activity_choices
as restrictive
for all
to anon
using (false)
with check (false);
