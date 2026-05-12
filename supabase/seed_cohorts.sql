-- Sample cohorts and synthetic roster members for Chicago Summer 2026.

insert into public.cohorts (season_id, name, slug, status, max_members)
select
  s.id,
  v.name,
  v.slug,
  'active',
  20
from public.seasons s
cross join (
  values
    ('Art room regulars', 'art-room-regulars'),
    ('Table & laughs', 'table-and-laughs'),
    ('Neighborhood strollers', 'neighborhood-strollers')
) as v(name, slug)
where s.slug = 'chicago-summer-2026'
on conflict (slug) do update
set
  name = excluded.name,
  status = excluded.status,
  max_members = excluded.max_members,
  updated_at = now();

do $$
declare
  cohort_row record;
  member_index integer;
  profile_uuid uuid;
  cohort_slug text;
begin
  for cohort_row in
    select c.id, c.slug
    from public.cohorts c
    join public.seasons s on s.id = c.season_id
    where s.slug = 'chicago-summer-2026'
      and c.slug in ('art-room-regulars', 'table-and-laughs', 'neighborhood-strollers')
  loop
    cohort_slug := cohort_row.slug;
    for member_index in 1..17 loop
      profile_uuid := gen_random_uuid();

      insert into public.profiles (
        id,
        clerk_user_id,
        email,
        display_name,
        onboarding_status
      )
      values (
        profile_uuid,
        format('seed:%s:%03s', cohort_slug, member_index),
        format('seed+%s+%03s@common-area.local', cohort_slug, member_index),
        format('Seed member %s %s', cohort_slug, member_index),
        'active'
      )
      on conflict (clerk_user_id) do update
      set
        display_name = excluded.display_name,
        onboarding_status = excluded.onboarding_status,
        updated_at = now();

      insert into public.cohort_members (cohort_id, profile_id)
      select cohort_row.id, p.id
      from public.profiles p
      where p.clerk_user_id = format('seed:%s:%03s', cohort_slug, member_index)
      on conflict (cohort_id, profile_id) do nothing;
    end loop;
  end loop;
end $$;
