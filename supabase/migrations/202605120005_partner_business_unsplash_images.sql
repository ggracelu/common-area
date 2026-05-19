-- Stable Unsplash URLs for partner gallery (matches lib/business-partners.ts and seed_partner_businesses.sql).

update public.partner_businesses
set
  image_url = case slug
    when 'graders-coffee' then 'https://images.unsplash.com/photo-1495474472287-4d776bcee65f?auto=format&fit=crop&w=1600&q=80'
    when 'lantern-ladle' then 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80'
    when 'ruby-room-bar' then 'https://images.unsplash.com/photo-1572116463494-4433d6a4f3e2?auto=format&fit=crop&w=1600&q=80'
    when 'daily-crumb-bakery' then 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1600&q=80'
    when 'kiln-kiln-studio' then 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1600&q=80'
    when 'stillpoint-yoga' then 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1600&q=80'
    when 'reach-climbing' then 'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=1600&q=80'
    when 'south-loop-boxing' then 'https://images.unsplash.com/photo-1549719386-69df31e82f2d?auto=format&fit=crop&w=1600&q=80'
    when 'north-branch-tavern' then 'https://images.unsplash.com/photo-1514933659908-005e4a119257?auto=format&fit=crop&w=1600&q=80'
    when 'harvest-table' then 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80'
    else image_url
  end,
  updated_at = now()
where slug in (
  'graders-coffee',
  'lantern-ladle',
  'ruby-room-bar',
  'daily-crumb-bakery',
  'kiln-kiln-studio',
  'stillpoint-yoga',
  'reach-climbing',
  'south-loop-boxing',
  'north-branch-tavern',
  'harvest-table'
);
