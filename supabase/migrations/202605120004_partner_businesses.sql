create table if not exists public.partner_businesses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null,
  neighborhood text not null,
  address text,
  host_summary text not null,
  cadence text not null,
  group_size text not null,
  image_url text not null,
  accent_token text not null default 'var(--v16-blue)',
  clerk_user_id text unique,
  is_grader boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists partner_businesses_display_order_idx
  on public.partner_businesses (display_order);

drop trigger if exists partner_businesses_set_updated_at on public.partner_businesses;
create trigger partner_businesses_set_updated_at
before update on public.partner_businesses
for each row
execute function public.set_updated_at();

alter table public.partner_businesses enable row level security;

create policy "public read partner businesses"
on public.partner_businesses
for select
to public
using (true);
