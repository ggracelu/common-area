-- Cohort membership metadata for reveal and assignment gating.

alter table public.cohort_members
  add column if not exists reveal_seen_at timestamptz,
  add column if not exists assigned_at timestamptz not null default now();

create index if not exists cohort_members_profile_id_idx
  on public.cohort_members (profile_id);
