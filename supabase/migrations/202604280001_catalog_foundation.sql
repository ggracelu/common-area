create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text unique not null,
  email text,
  display_name text,
  avatar_url text,
  onboarding_status text not null default 'created',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_onboarding_status_check
    check (onboarding_status in ('created', 'deposit_pending', 'selection_pending', 'assignment_pending', 'active'))
);

create table if not exists public.seasons (
  id uuid primary key default gen_random_uuid(),
  city text not null,
  name text not null,
  slug text unique not null,
  status text not null default 'draft',
  tagline text,
  description text,
  starts_at date,
  ends_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint seasons_status_check
    check (status in ('draft', 'published', 'active', 'closed'))
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  business_name text not null,
  neighborhood text,
  address text,
  activity_type text,
  vibe text,
  image_url text,
  starts_at timestamptz,
  ends_at timestamptz,
  capacity integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint activities_capacity_check
    check (capacity is null or capacity > 0)
);

create table if not exists public.season_activities (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references public.seasons(id) on delete cascade,
  activity_id uuid not null references public.activities(id) on delete cascade,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (season_id, activity_id)
);

-- Unique constraints above also provide indexes for:
-- profiles.clerk_user_id, seasons.slug, and activities.slug
create index if not exists seasons_status_idx on public.seasons (status);
create index if not exists season_activities_season_id_idx on public.season_activities (season_id);
create index if not exists season_activities_activity_id_idx on public.season_activities (activity_id);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists seasons_set_updated_at on public.seasons;
create trigger seasons_set_updated_at
before update on public.seasons
for each row
execute function public.set_updated_at();

drop trigger if exists activities_set_updated_at on public.activities;
create trigger activities_set_updated_at
before update on public.activities
for each row
execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.seasons enable row level security;
alter table public.activities enable row level security;
alter table public.season_activities enable row level security;

create policy "public read published or active seasons"
on public.seasons
for select
to public
using (status in ('published', 'active'));

create policy "public read activities attached to published or active seasons"
on public.activities
for select
to public
using (
  exists (
    select 1
    from public.season_activities sa
    join public.seasons s on s.id = sa.season_id
    where sa.activity_id = activities.id
      and s.status in ('published', 'active')
  )
);

create policy "public read season activity links for published or active seasons"
on public.season_activities
for select
to public
using (
  exists (
    select 1
    from public.seasons s
    where s.id = season_activities.season_id
      and s.status in ('published', 'active')
  )
);

-- Profiles RLS intentionally has no read/write policy yet.
-- Clerk currently owns identity, and Clerk-to-Supabase auth claims are not wired in this phase.
-- Keep profile persistence server-controlled until a later phase can safely enforce
-- clerk_user_id-aware access through authenticated Supabase claims.
