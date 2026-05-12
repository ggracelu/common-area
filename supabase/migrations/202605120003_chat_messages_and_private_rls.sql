-- Member-scoped chat and removal of earlier public-read prototype policies.

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.cohorts(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  constraint chat_messages_body_length_check
    check (char_length(body) between 1 and 500)
);

create index if not exists chat_messages_cohort_created_idx
  on public.chat_messages (cohort_id, created_at);

create index if not exists chat_messages_profile_id_idx
  on public.chat_messages (profile_id);

alter table public.chat_messages enable row level security;

-- Until Clerk-to-Supabase JWT claims are wired, member-private reads and writes
-- go through server actions using the service role after checking cohort_members.
drop policy if exists "public read cohorts for active seasons" on public.cohorts;
drop policy if exists "public read cohort members for active seasons" on public.cohort_members;
drop policy if exists "users read own bingo cards" on public.bingo_cards;
drop policy if exists "users read own bingo completions" on public.bingo_completions;
drop policy if exists "users read own streaks" on public.user_streaks;
drop policy if exists "public read cohort challenges for active seasons" on public.cohort_challenges;
drop policy if exists "users read own achievements" on public.user_achievements;
drop policy if exists "users read own business quest completions" on public.business_quest_completions;
drop policy if exists "users read own gamification preferences" on public.user_gamification_preferences;

create policy "deny anon chat messages"
on public.chat_messages
as restrictive
for all
to anon
using (false)
with check (false);

-- Lock Chicago Summer 2026 to the MVP contract: 4 selections from 6 curated activities.
delete from public.season_activities sa
using public.seasons s, public.activities a
where sa.season_id = s.id
  and sa.activity_id = a.id
  and s.slug = 'chicago-summer-2026'
  and a.slug in ('bookshop-browsing-lincoln-square', 'flower-bar-ravenswood');
