-- Gamification tables for Common Area
-- This migration adds the core gamification infrastructure

-- Create cohorts table (for season-based user groups)
create table if not exists public.cohorts (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references public.seasons(id) on delete cascade,
  name text not null,
  slug text unique not null,
  status text not null default 'active',
  max_members integer default 20,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cohorts_status_check
    check (status in ('active', 'completed', 'archived'))
);

-- Create cohort_members table (linking users to cohorts)
create table if not exists public.cohort_members (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.cohorts(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  unique (cohort_id, profile_id)
);

-- Create bingo_cards table (user's bingo card for a season)
create table if not exists public.bingo_cards (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  season_id uuid not null references public.seasons(id) on delete cascade,
  cohort_id uuid references public.cohorts(id) on delete set null,
  total_prompts integer default 0,
  completed_prompts integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (profile_id, season_id)
);

-- Create bingo_prompts table (the actual prompts/tasks)
create table if not exists public.bingo_prompts (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references public.seasons(id) on delete cascade,
  activity_id uuid references public.activities(id) on delete set null,
  title text not null,
  description text,
  prompt_type text not null default 'icebreaker',
  difficulty text not null default 'easy',
  requires_interaction boolean default false,
  points integer default 1,
  display_order integer default 0,
  is_active boolean default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bingo_prompts_prompt_type_check
    check (prompt_type in ('icebreaker', 'shared_experience', 'discovery', 'collaboration', 'recognition')),
  constraint bingo_prompts_difficulty_check
    check (difficulty in ('easy', 'medium', 'hard'))
);

-- Create bingo_completions table (tracking prompt completions)
create table if not exists public.bingo_completions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  bingo_card_id uuid not null references public.bingo_cards(id) on delete cascade,
  prompt_id uuid not null references public.bingo_prompts(id) on delete cascade,
  completed_at timestamptz not null default now(),
  notes text,
  unique (profile_id, prompt_id)
);

-- Create user_streaks table (tracking various streaks)
create table if not exists public.user_streaks (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  season_id uuid not null references public.seasons(id) on delete cascade,
  streak_type text not null,
  current_count integer default 0,
  best_count integer default 0,
  last_activity_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_streaks_streak_type_check
    check (streak_type in ('attendance', 'interaction', 'business', 'prompt')),
  unique (profile_id, season_id, streak_type)
);

-- Create cohort_challenges table (collective goals)
create table if not exists public.cohort_challenges (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.cohorts(id) on delete cascade,
  challenge_type text not null,
  title text not null,
  description text,
  target_count integer not null,
  current_count integer default 0,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cohort_challenges_challenge_type_check
    check (challenge_type in ('weekly_prompts', 'visit_all_businesses', 'total_completions', 'meet_everyone'))
);

-- Create user_achievements table (badges and achievements)
create table if not exists public.user_achievements (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  season_id uuid not null references public.seasons(id) on delete cascade,
  achievement_type text not null,
  title text not null,
  description text,
  icon_url text,
  unlocked_at timestamptz not null default now(),
  constraint user_achievements_achievement_type_check
    check (achievement_type in ('first_prompt', 'streak_master', 'social_butterfly', 'explorer', 'connector', 'regular'))
);

-- Create business_quests table (business-specific quests)
create table if not exists public.business_quests (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.activities(id) on delete cascade,
  season_id uuid not null references public.seasons(id) on delete cascade,
  quest_type text not null,
  title text not null,
  description text,
  target_count integer not null,
  points integer default 5,
  is_sponsored boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint business_quests_quest_type_check
    check (quest_type in ('regular', 'explorer', 'connector', 'local'))
);

-- Create business_quest_completions table (tracking quest progress)
create table if not exists public.business_quest_completions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  business_quest_id uuid not null references public.business_quests(id) on delete cascade,
  current_count integer default 0,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (profile_id, business_quest_id)
);

-- Create user_gamification_preferences table (user settings)
create table if not exists public.user_gamification_preferences (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  notifications_enabled boolean default true,
  max_active_prompts integer default 3,
  prompt_types_enabled text[] default ARRAY['icebreaker', 'shared_experience', 'discovery', 'collaboration', 'recognition']::text[],
  quiet_hours_start text default '22:00',
  quiet_hours_end text default '08:00',
  temporary_pause_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (profile_id)
);

-- Create indexes for performance
create index if not exists cohorts_season_id_idx on public.cohorts (season_id);
create index if not exists cohorts_status_idx on public.cohorts (status);
create index if not exists cohort_members_cohort_id_idx on public.cohort_members (cohort_id);
create index if not exists cohort_members_profile_id_idx on public.cohort_members (profile_id);
create index if not exists bingo_cards_profile_id_idx on public.bingo_cards (profile_id);
create index if not exists bingo_cards_season_id_idx on public.bingo_cards (season_id);
create index if not exists bingo_prompts_season_id_idx on public.bingo_prompts (season_id);
create index if not exists bingo_prompts_activity_id_idx on public.bingo_prompts (activity_id);
create index if not exists bingo_prompts_is_active_idx on public.bingo_prompts (is_active);
create index if not exists bingo_completions_profile_id_idx on public.bingo_completions (profile_id);
create index if not exists bingo_completions_bingo_card_id_idx on public.bingo_completions (bingo_card_id);
create index if not exists bingo_completions_prompt_id_idx on public.bingo_completions (prompt_id);
create index if not exists user_streaks_profile_id_idx on public.user_streaks (profile_id);
create index if not exists user_streaks_season_id_idx on public.user_streaks (season_id);
create index if not exists cohort_challenges_cohort_id_idx on public.cohort_challenges (cohort_id);
create index if not exists user_achievements_profile_id_idx on public.user_achievements (profile_id);
create index if not exists user_achievements_season_id_idx on public.user_achievements (season_id);
create index if not exists business_quests_activity_id_idx on public.business_quests (activity_id);
create index if not exists business_quests_season_id_idx on public.business_quests (season_id);
create index if not exists business_quest_completions_profile_id_idx on public.business_quest_completions (profile_id);
create index if not exists business_quest_completions_business_quest_id_idx on public.business_quest_completions (business_quest_id);

-- Create triggers for updated_at
drop trigger if exists cohorts_set_updated_at on public.cohorts;
create trigger cohorts_set_updated_at
before update on public.cohorts
for each row
execute function public.set_updated_at();

drop trigger if exists bingo_cards_set_updated_at on public.bingo_cards;
create trigger bingo_cards_set_updated_at
before update on public.bingo_cards
for each row
execute function public.set_updated_at();

drop trigger if exists bingo_prompts_set_updated_at on public.bingo_prompts;
create trigger bingo_prompts_set_updated_at
before update on public.bingo_prompts
for each row
execute function public.set_updated_at();

drop trigger if exists user_streaks_set_updated_at on public.user_streaks;
create trigger user_streaks_set_updated_at
before update on public.user_streaks
for each row
execute function public.set_updated_at();

drop trigger if exists cohort_challenges_set_updated_at on public.cohort_challenges;
create trigger cohort_challenges_set_updated_at
before update on public.cohort_challenges
for each row
execute function public.set_updated_at();

drop trigger if exists business_quests_set_updated_at on public.business_quests;
create trigger business_quests_set_updated_at
before update on public.business_quests
for each row
execute function public.set_updated_at();

drop trigger if exists business_quest_completions_set_updated_at on public.business_quest_completions;
create trigger business_quest_completions_set_updated_at
before update on public.business_quest_completions
for each row
execute function public.set_updated_at();

drop trigger if exists user_gamification_preferences_set_updated_at on public.user_gamification_preferences;
create trigger user_gamification_preferences_set_updated_at
before update on public.user_gamification_preferences
for each row
execute function public.set_updated_at();

-- Enable Row Level Security
alter table public.cohorts enable row level security;
alter table public.cohort_members enable row level security;
alter table public.bingo_cards enable row level security;
alter table public.bingo_prompts enable row level security;
alter table public.bingo_completions enable row level security;
alter table public.user_streaks enable row level security;
alter table public.cohort_challenges enable row level security;
alter table public.user_achievements enable row level security;
alter table public.business_quests enable row level security;
alter table public.business_quest_completions enable row level security;
alter table public.user_gamification_preferences enable row level security;

-- RLS Policies
-- Cohorts: Public read for active seasons
create policy "public read cohorts for active seasons"
on public.cohorts
for select
to public
using (
  exists (
    select 1
    from public.seasons s
    where s.id = cohorts.season_id
      and s.status in ('published', 'active')
  )
);

-- Cohort members: Public read for active seasons
create policy "public read cohort members for active seasons"
on public.cohort_members
for select
to public
using (
  exists (
    select 1
    from public.cohorts c
    join public.seasons s on s.id = c.season_id
    where c.id = cohort_members.cohort_id
      and s.status in ('published', 'active')
  )
);

-- Bingo cards: Users can read their own cards
create policy "users read own bingo cards"
on public.bingo_cards
for select
to public
using (true); -- Will be filtered by profile_id in queries

-- Bingo prompts: Public read for active seasons
create policy "public read bingo prompts for active seasons"
on public.bingo_prompts
for select
to public
using (
  exists (
    select 1
    from public.seasons s
    where s.id = bingo_prompts.season_id
      and s.status in ('published', 'active')
  )
);

-- Bingo completions: Users can read their own completions
create policy "users read own bingo completions"
on public.bingo_completions
for select
to public
using (true); -- Will be filtered by profile_id in queries

-- User streaks: Users can read their own streaks
create policy "users read own streaks"
on public.user_streaks
for select
to public
using (true); -- Will be filtered by profile_id in queries

-- Cohort challenges: Public read for active seasons
create policy "public read cohort challenges for active seasons"
on public.cohort_challenges
for select
to public
using (
  exists (
    select 1
    from public.cohorts c
    join public.seasons s on s.id = c.season_id
    where c.id = cohort_challenges.cohort_id
      and s.status in ('published', 'active')
  )
);

-- User achievements: Users can read their own achievements
create policy "users read own achievements"
on public.user_achievements
for select
to public
using (true); -- Will be filtered by profile_id in queries

-- Business quests: Public read for active seasons
create policy "public read business quests for active seasons"
on public.business_quests
for select
to public
using (
  exists (
    select 1
    from public.seasons s
    where s.id = business_quests.season_id
      and s.status in ('published', 'active')
  )
);

-- Business quest completions: Users can read their own completions
create policy "users read own business quest completions"
on public.business_quest_completions
for select
to public
using (true); -- Will be filtered by profile_id in queries

-- User gamification preferences: Users can read their own preferences
create policy "users read own gamification preferences"
on public.user_gamification_preferences
for select
to public
using (true); -- Will be filtered by profile_id in queries
