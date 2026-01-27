-- Create products table (safe to run if exists)
create table if not exists public.products (
  id text not null,
  name text not null,
  description text null,
  price text null,
  unit text null,
  image text null,
  popular boolean null default false,
  created_at timestamp with time zone not null default now(),
  constraint products_pkey primary key (id)
);

-- Add discount columns if they don't exist
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'products' and column_name = 'discount_percentage') then
        alter table public.products add column discount_percentage integer null default 0;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'products' and column_name = 'discount_expires_at') then
        alter table public.products add column discount_expires_at timestamp with time zone null;
    end if;
end $$;

-- Enable RLS
alter table public.products enable row level security;

-- Policy: Everyone can READ products
drop policy if exists "Enable read access for all users" on public.products;
create policy "Enable read access for all users" on public.products
  for select using (true);

-- Policy: Only Authenticated users (Admin) can INSERT/UPDATE/DELETE
drop policy if exists "Enable insert for authenticated users only" on public.products;
create policy "Enable insert for authenticated users only"
on public.products
for insert
to authenticated
with check (true);

drop policy if exists "Enable update for authenticated users only" on public.products;
create policy "Enable update for authenticated users only"
on public.products
for update
to authenticated
using (true);

drop policy if exists "Enable delete for authenticated users only" on public.products;
create policy "Enable delete for authenticated users only"
on public.products
for delete
to authenticated
using (true);

-- Storage bucket setup (Instructional, usually done via UI or API)
-- insert into storage.buckets (id, name, public) values ('products', 'products', true);
-- create policy "Public Access" on storage.objects for select using ( bucket_id = 'products' );
-- create policy "Auth Upload" on storage.objects for insert to authenticated with check ( bucket_id = 'products' );

-- Insert initial data (only if not exists)
insert into public.products (name, description, price, unit, image, popular, id) values
  ('Pollo Entero', 'Pollo fresco entero, ideal para rostizar o preparar al horno. Entero o por pieza. Peso promedio 2.7 kg.', '$85', 'por pieza', '/img/pollo_entero.png', true, 'pollo-entero'),
  ('Pechuga de Pollo', 'Pechuga con o sin hueso, perfecta para filetes y comidas saludables.', '$120', 'por kg', '/img/pechuga.png', false, 'pechuga'),
  ('Pierna y Muslo', 'Pieza con hueso, ideal para guisos, caldos y platillos tradicionales.', '$75', 'por kg', '/img/pierna_muslo.png', false, 'pierna-muslo'),
  ('Alas de Pollo', 'Perfectas para botanear, preparar al carbón o en salsa BBQ.', '$65', 'por kg', '/img/alas.png', true, 'alas'),
  ('Menudencias', 'Hígado, patas, molleja y corazón frescos para platillos tradicionales.', '$45', 'por kg', '/img/menudencias.png', false, 'menudencias'),
  ('Pollo en Pie', 'Pollo vivo para quienes prefieren prepararlo a su manera. Peso promedio 2.9 kg.', '$70', 'por pieza', '/img/pollo_pie.png', false, 'pollo-pie')
on conflict (id) do nothing;
