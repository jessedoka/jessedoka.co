-- packs
create table public.packs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  cover_url text not null,
  preview_urls jsonb not null,   -- ["https://.../1.jpg", ...]
  r2_prefix text not null,       -- wallpapers/{slug}/v1
  version text not null default 'v1',
  stripe_price_id text not null,
  active boolean not null default true,
  created_at timestamptz default now()
);

-- orders
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  pack_id uuid not null references public.packs(id),
  email text not null,
  stripe_session_id text unique not null,
  amount integer not null,       -- in pence
  currency text not null default 'gbp',
  status text not null default 'paid', -- 'paid' | 'refunded'
  created_at timestamptz default now()
);

-- download grants
create table public.downloads (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id),
  path text not null,            -- e.g. wallpapers/slug/v1/deliverable/all.zip
  token text unique not null,    -- random id / JWT id
  expires_at timestamptz not null,
  remaining int not null default 5,
  created_at timestamptz default now()
);

-- Enable RLS (Row Level Security)
alter table public.packs enable row level security;
alter table public.orders enable row level security;
alter table public.downloads enable row level security;

-- POLICIES
-- packs: readable by anyone (for storefront), writable only by service role.
create policy "read packs for anon"
  on public.packs for select
  to anon
  using (active = true);

-- orders: nobody from the browser; server-only via service role.
create policy "no anon read orders"
  on public.orders for select
  to anon
  using (false);

create policy "no anon write orders"
  on public.orders for insert
  to anon
  with check (false);

-- downloads: allow anon to SELECT only if they present a valid token via RPC (we won’t expose raw rows).
create policy "no direct anon select downloads"
  on public.downloads for select
  to anon
  using (false);
