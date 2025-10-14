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
  image_url text,
  created_at timestamptz default now()
);

-- Events table
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  title_en text,
  title_de text,
  description text,
  description_en text,
  description_de text,
  image_url text,
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
   'STEAM‑Programm für benachteiligte Jugendliche mit Schwerpunkt auf Prototyping und Computational Thinking.'),
  (gen_random_uuid(), 'Clínica móvil comunitaria', 'Community Mobile Clinic', 'Mobile Gemeinschaftsklinik', 'Salud', 'Milán', 'Italia', 45.4642, 9.19, 40,
   'Atención primaria itinerante con foco en prevención y chequeos básicos en barrios periféricos.',
   'Mobile primary care with a focus on prevention and basic check‑ups in peripheral neighborhoods.',
   'Mobile Grundversorgung mit Fokus auf Prävention und Basis‑Checks in Randbezirken.'),
  (gen_random_uuid(), 'Recuperación de playas', 'Beach Recovery', 'Strandaufbereitung', 'Océanos', 'Marsella', 'Francia', 43.2965, 5.3698, 120,
   'Limpieza costera, monitoreo de microplásticos y campañas de educación ambiental para turistas y residentes.',
   'Coastal clean‑ups, microplastic monitoring, and environmental education for tourists and residents.',
   'Küstenreinigung, Mikroplastik‑Monitoring und Umweltbildung für Tourist:innen und Einwohner:innen.'),
  (gen_random_uuid(), 'Huertos urbanos', 'Urban Gardens', 'Urbane Gärten', 'Alimentación', 'Londres', 'Reino Unido', 51.5072, -0.1276, 25,
   'Red de huertos comunitarios para fortalecer la seguridad alimentaria y promover dietas sostenibles.',
   'Network of community gardens to strengthen food security and promote sustainable diets.',
   'Netzwerk von Gemeinschaftsgärten zur Stärkung der Ernährungssicherheit und Förderung nachhaltiger Ernährung.'),
  (gen_random_uuid(), 'Centros vecinales inclusivos', 'Inclusive Neighborhood Centers', 'Inklusive Nachbarschaftszentren', 'Comunidad', 'Estocolmo', 'Suecia', 59.3293, 18.0686, 60,
   'Creación de espacios de encuentro con programación cultural y talleres de integración para nuevos residentes.',
   'Creation of community centers with cultural programming and integration workshops for new residents.',
   'Aufbau von Nachbarschaftszentren mit Kulturprogramm und Integrationsworkshops für neue Einwohner:innen.');
