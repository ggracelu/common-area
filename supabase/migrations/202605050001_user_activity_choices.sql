-- Per-user seasonal activity picks (up to 4). Writes are server-controlled via service role + Clerk auth.

create table if not exists public.user_activity_choices (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  season_id uuid not null references public.seasons(id) on delete cascade,
  activity_id uuid not null references public.activities(id) on delete cascade,
  choice_rank smallint not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (profile_id, season_id, activity_id),
  unique (profile_id, season_id, choice_rank),
  constraint user_activity_choices_choice_rank_check
    check (choice_rank >= 1 and choice_rank <= 4)
);

create index if not exists user_activity_choices_profile_season_idx
  on public.user_activity_choices (profile_id, season_id);

drop trigger if exists user_activity_choices_set_updated_at on public.user_activity_choices;
create trigger user_activity_choices_set_updated_at
before update on public.user_activity_choices
for each row
execute function public.set_updated_at();

create or replace function public.user_activity_choices_enforce_max_four()
returns trigger
language plpgsql
as $$
declare
  existing_count integer;
begin
  select count(*)::integer into existing_count
  from public.user_activity_choices
  where profile_id = new.profile_id
    and season_id = new.season_id;

  if existing_count >= 4 then
    raise exception 'At most 4 activity choices allowed per profile and season';
  end if;

  return new;
end;
$$;

drop trigger if exists user_activity_choices_enforce_max_four_trigger on public.user_activity_choices;
create trigger user_activity_choices_enforce_max_four_trigger
before insert on public.user_activity_choices
for each row
execute function public.user_activity_choices_enforce_max_four();

alter table public.user_activity_choices enable row level security;
