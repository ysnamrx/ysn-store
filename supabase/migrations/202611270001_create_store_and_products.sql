create table public.stores (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 80),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  currency text not null default 'DZD' check (currency = 'DZD'),
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 160),
  description text not null default '',
  category text not null default '',
  price_dzd bigint not null check (price_dzd >= 0),
  stock integer not null default 0 check (stock >= 0),
  status text not null default 'draft' check (status in ('draft', 'active')),
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_store_id_created_at_idx on public.products(store_id, created_at desc);
create index products_store_id_status_idx on public.products(store_id, status);

alter table public.stores enable row level security;
alter table public.products enable row level security;

create policy "Owners can read their stores"
  on public.stores for select to authenticated
  using (owner_id = (select auth.uid()));

create policy "Owners can create their stores"
  on public.stores for insert to authenticated
  with check (owner_id = (select auth.uid()));

create policy "Owners can update their stores"
  on public.stores for update to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

create policy "Owners can delete their stores"
  on public.stores for delete to authenticated
  using (owner_id = (select auth.uid()));

create policy "Public can view published stores"
  on public.stores for select to anon, authenticated
  using (is_published = true);

create policy "Owners can read their products"
  on public.products for select to authenticated
  using (exists (
    select 1 from public.stores
    where stores.id = products.store_id
      and stores.owner_id = (select auth.uid())
  ));

create policy "Owners can add products"
  on public.products for insert to authenticated
  with check (exists (
    select 1 from public.stores
    where stores.id = products.store_id
      and stores.owner_id = (select auth.uid())
  ));

create policy "Owners can update products"
  on public.products for update to authenticated
  using (exists (
    select 1 from public.stores
    where stores.id = products.store_id
      and stores.owner_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.stores
    where stores.id = products.store_id
      and stores.owner_id = (select auth.uid())
  ));

create policy "Owners can delete products"
  on public.products for delete to authenticated
  using (exists (
    select 1 from public.stores
    where stores.id = products.store_id
      and stores.owner_id = (select auth.uid())
  ));

create policy "Public can view active products in published stores"
  on public.products for select to anon, authenticated
  using (
    status = 'active'
    and exists (
      select 1 from public.stores
      where stores.id = products.store_id
        and stores.is_published = true
    )
  );

grant select on public.stores, public.products to anon, authenticated;
grant insert, update, delete on public.stores, public.products to authenticated;
