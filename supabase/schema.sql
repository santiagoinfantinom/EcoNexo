-- Run this SQL in your Supabase project's SQL editor
-- Projects table
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_en text,
  name_de text,
  category text not null,
  city text not null,
  country text not null,
  lat double precision not null,
  lng double precision not null,
  spots integer,
  description text,
  description_en text,
  description_de text,
  created_at timestamptz default now()
);

-- Events table
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date not null,
  city text not null,
  country text not null,
  category text not null,
  optional_categories text[] default '{}',
  capacity integer,
  notes text,
  created_at timestamptz default now()
);

-- Volunteers table
create table if not exists public.volunteers (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  email text not null,
  availability text not null,
  notes text,
  created_at timestamptz default now()
);

-- Helpful indexes
create index if not exists projects_category_idx on public.projects (category);
create index if not exists events_category_idx on public.events (category);

-- Demo data (optional)
insert into public.projects (id, name, name_en, name_de, category, city, country, lat, lng, spots, description, description_en, description_de)
values
  (gen_random_uuid(), 'Reforestación Urbana Berlín', 'Berlin Urban Reforestation', 'Urbane Aufforstung Berlin', 'Medio ambiente', 'Berlín', 'Alemania', 52.52, 13.405, 50,
   'Plantación de árboles nativos en barrios con déficit de áreas verdes, involucrando a escuelas y organizaciones locales.',
   'Planting native trees in neighborhoods lacking green areas, engaging schools and local organizations.',
   'Pflanzung einheimischer Bäume in Vierteln mit wenig Grünflächen, unter Einbindung von Schulen und lokalen Organisationen.'),
  (gen_random_uuid(), 'Taller de Robótica Educativa', 'Educational Robotics Workshop', 'Workshop für Bildungsrobotik', 'Educación', 'Madrid', 'España', 40.4168, -3.7038, 30,
   'Programa STEAM para jóvenes en situación de vulnerabilidad con enfoque en prototipado y pensamiento computacional.',
   'STEAM program for at‑risk youth focusing on prototyping and computational thinking.',
   'STEAM‑Programm für benachteiligte Jugendliche mit Schwerpunkt auf Prototyping und Computational Thinking.');
