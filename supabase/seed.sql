insert into public.seasons (
  city,
  name,
  slug,
  status,
  tagline,
  description,
  starts_at,
  ends_at
)
values (
  'Chicago',
  'Common Area Chicago Summer 2026',
  'chicago-summer-2026',
  'active',
  'Turn your city into a campus.',
  'A recurring summer season built around familiar faces, shared interests, and local Chicago spots that start to feel like campus buildings again.',
  '2026-06-15',
  '2026-08-20'
)
on conflict (slug) do update
set
  city = excluded.city,
  name = excluded.name,
  status = excluded.status,
  tagline = excluded.tagline,
  description = excluded.description,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  updated_at = now();

insert into public.activities (
  title,
  slug,
  description,
  business_name,
  neighborhood,
  address,
  activity_type,
  vibe,
  starts_at,
  ends_at,
  capacity
)
values
  (
    'Pottery night in Logan Square',
    'pottery-night-logan-square',
    'An easygoing ceramics night for people who want a reason to talk without forcing it.',
    'Kiln House Studio',
    'Logan Square',
    '2432 N Milwaukee Ave, Chicago, IL',
    'Workshop',
    'Hands-on, messy, neighborhood energy',
    '2026-06-22T19:00:00-05:00',
    '2026-06-22T21:00:00-05:00',
    24
  ),
  (
    'Group cooking class in West Loop',
    'group-cooking-class-west-loop',
    'A shared-table cooking class where chopping vegetables does some of the social work for you.',
    'Apron Theory Kitchen',
    'West Loop',
    '1010 W Lake St, Chicago, IL',
    'Class',
    'Warm, collaborative, dinner-party starter kit',
    '2026-06-29T18:30:00-05:00',
    '2026-06-29T21:00:00-05:00',
    20
  ),
  (
    'Comedy show in Old Town',
    'comedy-show-old-town',
    'A low-pressure group outing with built-in laughs and plenty to talk about after.',
    'Second Room Comedy',
    'Old Town',
    '1540 N Wells St, Chicago, IL',
    'Show',
    'Dry, social, easy first-night energy',
    '2026-07-07T19:30:00-05:00',
    '2026-07-07T21:30:00-05:00',
    30
  ),
  (
    'Mural walk in Pilsen',
    'mural-walk-pilsen',
    'A neighborhood art walk built for wandering, noticing details, and meeting people at a gentler pace.',
    'Pilsen Public Arts Walk',
    'Pilsen',
    '1100 W 18th St, Chicago, IL',
    'Walk',
    'Colorful, outdoors, city-feeling',
    '2026-07-12T11:00:00-05:00',
    '2026-07-12T13:00:00-05:00',
    28
  ),
  (
    'Coffee crawl in Wicker Park',
    'coffee-crawl-wicker-park',
    'Three neighborhood coffee stops, one afternoon, and enough structure to keep things moving.',
    'Common Grounds Crawl',
    'Wicker Park',
    '1560 N Damen Ave, Chicago, IL',
    'Crawl',
    'Cozy, caffeinated, low-stakes',
    '2026-07-19T13:00:00-05:00',
    '2026-07-19T15:30:00-05:00',
    26
  ),
  (
    'Board game night in Lakeview',
    'board-game-night-lakeview',
    'A structured social night for people who like conversation with a clear objective on the table.',
    'North Side Game Room',
    'Lakeview',
    '3150 N Broadway, Chicago, IL',
    'Game Night',
    'Playful, familiar, no-pressure competition',
    '2026-07-28T18:30:00-05:00',
    '2026-07-28T21:30:00-05:00',
    22
  ),
  (
    'Bookshop browsing in Lincoln Square',
    'bookshop-browsing-lincoln-square',
    'Browse shelves, spot bulletin-board flyers, and leave with a new micro-obsession.',
    'Margin Notes Books',
    'Lincoln Square',
    '4732 N Western Ave, Chicago, IL',
    'Social',
    'Curiosity with a side of paper textures',
    '2026-06-16T23:30:00-05:00',
    '2026-06-17T01:15:00-05:00',
    28
  ),
  (
    'Flower bar workshop in Ravenswood',
    'flower-bar-ravenswood',
    'Hands-busy arranging with stems, trades, and bouquets that feel like personality tests.',
    'Petals & Pins Studio',
    'Ravenswood',
    '1812 W Lawrence Ave, Chicago, IL',
    'Workshop',
    'Hands busy, nervous system calmer',
    '2026-06-17T23:00:00-05:00',
    '2026-06-18T00:40:00-05:00',
    20
  )
on conflict (slug) do update
set
  title = excluded.title,
  description = excluded.description,
  business_name = excluded.business_name,
  neighborhood = excluded.neighborhood,
  address = excluded.address,
  activity_type = excluded.activity_type,
  vibe = excluded.vibe,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  capacity = excluded.capacity,
  updated_at = now();

insert into public.season_activities (season_id, activity_id, display_order)
select
  s.id,
  a.id,
  items.display_order
from (
  values
    ('pottery-night-logan-square', 1),
    ('group-cooking-class-west-loop', 2),
    ('comedy-show-old-town', 3),
    ('mural-walk-pilsen', 4),
    ('coffee-crawl-wicker-park', 5),
    ('board-game-night-lakeview', 6)
) as items(activity_slug, display_order)
join public.seasons s
  on s.slug = 'chicago-summer-2026'
join public.activities a
  on a.slug = items.activity_slug
on conflict (season_id, activity_id) do update
set display_order = excluded.display_order;

delete from public.season_activities sa
using public.seasons s, public.activities a
where sa.season_id = s.id
  and sa.activity_id = a.id
  and s.slug = 'chicago-summer-2026'
  and a.slug in ('bookshop-browsing-lincoln-square', 'flower-bar-ravenswood');
