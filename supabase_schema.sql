-- Create products table
create table public.products (
  id text not null, -- Changed to text to support slugs like 'pollo-entero'
  name text not null,
  description text null,
  price text null, -- storing as text '$85' to match current frontend logic, but numeric is better
  unit text null,
  image text null,
  popular boolean null default false,
  created_at timestamp with time zone not null default now(),
  constraint products_pkey primary key (id)
);

-- Enable RLS
alter table public.products enable row level security;

-- Allow read access to everyone
create policy "Enable read access for all users" on public.products
  for select using (true);

-- Insert initial data
insert into public.products (name, description, price, unit, image, popular, id) values
  ('Pollo Entero', 'Pollo fresco entero, ideal para rostizar o preparar al horno. Entero o por pieza. Peso promedio 2.7 kg.', '$85', 'por pieza', '/img/pollo_entero.png', true, 'pollo-entero'),
  ('Pechuga de Pollo', 'Pechuga con o sin hueso, perfecta para filetes y comidas saludables.', '$120', 'por kg', '/img/pechuga.png', false, 'pechuga'),
  ('Pierna y Muslo', 'Pieza con hueso, ideal para guisos, caldos y platillos tradicionales.', '$75', 'por kg', '/img/pierna_muslo.png', false, 'pierna-muslo'),
  ('Alas de Pollo', 'Perfectas para botanear, preparar al carbón o en salsa BBQ.', '$65', 'por kg', '/img/alas.png', true, 'alas'),
  ('Menudencias', 'Hígado, patas, molleja y corazón frescos para platillos tradicionales.', '$45', 'por kg', '/img/menudencias.png', false, 'menudencias'),
  ('Pollo en Pie', 'Pollo vivo para quienes prefieren prepararlo a su manera. Peso promedio 2.9 kg.', '$70', 'por pieza', '/img/pollo_pie.png', false, 'pollo-pie');
