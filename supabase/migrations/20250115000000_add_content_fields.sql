-- Auth & Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text generated always as (lower((auth.jwt() ->> 'email')::text)) stored,
  full_name text,
  birthdate date,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by owner" on public.profiles
  for select using (auth.uid() = id);

create policy "Profiles can be upserted by owner" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Profiles can be updated by owner" on public.profiles
  for update using (auth.uid() = id);

-- Favorites (projects and events)
create type if not exists public.favorite_type as enum ('project', 'event');

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_type public.favorite_type not null,
  item_id text not null,
  created_at timestamp with time zone default now(),
  unique (user_id, item_type, item_id)
);

alter table public.favorites enable row level security;

create policy "Favorites are viewable by owner" on public.favorites
  for select using (auth.uid() = user_id);

create policy "Favorites insert by owner" on public.favorites
  for insert with check (auth.uid() = user_id);

create policy "Favorites delete by owner" on public.favorites
  for delete using (auth.uid() = user_id);

-- Event registrations
create table if not exists public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  phone text not null,
  emergency_contact text,
  emergency_phone text,
  dietary_restrictions text,
  accessibility_needs text,
  experience text,
  motivation text,
  agree_to_terms boolean not null default false,
  agree_to_photos boolean not null default false,
  created_at timestamp with time zone default now(),
  unique (event_id, user_id)
);

alter table public.event_registrations enable row level security;

create policy "Registrations are viewable by owner" on public.event_registrations
  for select using (auth.uid() = user_id);

create policy "Registrations insert by owner" on public.event_registrations
  for insert with check (auth.uid() = user_id);

-- Helpers to keep updated_at in profiles
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();
-- Migration: Add description and image fields to existing tables
-- Run this SQL in your Supabase project's SQL editor

-- Add description and image fields to projects table
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS title_en text,
ADD COLUMN IF NOT EXISTS title_de text,
ADD COLUMN IF NOT EXISTS image_url text;

-- Add description and image fields to events table  
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS title_en text,
ADD COLUMN IF NOT EXISTS title_de text,
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS description_en text,
ADD COLUMN IF NOT EXISTS description_de text,
ADD COLUMN IF NOT EXISTS image_url text;

-- Update existing projects with relevant descriptions and images
UPDATE public.projects SET 
  description = CASE 
    WHEN name = 'Reforestación Urbana Berlín' THEN 'Proyecto de plantación de árboles nativos en parques urbanos para mejorar la calidad del aire y crear corredores verdes en la ciudad.'
    WHEN name = 'Taller de Robótica Educativa' THEN 'Talleres prácticos de programación y construcción de robots para jóvenes, promoviendo habilidades STEM y pensamiento crítico.'
    WHEN name = 'Clínica móvil comunitaria' THEN 'Servicio médico itinerante que lleva atención sanitaria básica a comunidades desatendidas y zonas rurales.'
    WHEN name = 'Recuperación de playas' THEN 'Campaña de limpieza y restauración de ecosistemas costeros, eliminando contaminación y protegiendo la vida marina.'
    WHEN name = 'Huertos urbanos' THEN 'Creación de espacios verdes comunitarios para agricultura sostenible y educación ambiental en entornos urbanos.'
    WHEN name = 'Centros vecinales inclusivos' THEN 'Espacios comunitarios que fomentan la inclusión social, el intercambio cultural y el apoyo mutuo entre vecinos.'
    ELSE description
  END,
  description_en = CASE 
    WHEN name = 'Reforestación Urbana Berlín' THEN 'Native tree planting project in urban parks to improve air quality and create green corridors in the city.'
    WHEN name = 'Taller de Robótica Educativa' THEN 'Practical workshops on programming and robot building for youth, promoting STEM skills and critical thinking.'
    WHEN name = 'Clínica móvil comunitaria' THEN 'Mobile medical service bringing basic healthcare to underserved communities and rural areas.'
    WHEN name = 'Recuperación de playas' THEN 'Beach cleanup and coastal ecosystem restoration campaign, removing pollution and protecting marine life.'
    WHEN name = 'Huertos urbanos' THEN 'Creation of community green spaces for sustainable agriculture and environmental education in urban settings.'
    WHEN name = 'Centros vecinales inclusivos' THEN 'Community spaces that promote social inclusion, cultural exchange and mutual support among neighbors.'
    ELSE description_en
  END,
  description_de = CASE 
    WHEN name = 'Reforestación Urbana Berlín' THEN 'Projekt zur Pflanzung einheimischer Bäume in Stadtparks zur Verbesserung der Luftqualität und Schaffung grüner Korridore.'
    WHEN name = 'Taller de Robótica Educativa' THEN 'Praktische Workshops zu Programmierung und Roboterbau für Jugendliche, Förderung von MINT-Fähigkeiten und kritischem Denken.'
    WHEN name = 'Clínica móvil comunitaria' THEN 'Mobiler medizinischer Dienst, der grundlegende Gesundheitsversorgung in unterversorgte Gemeinden und ländliche Gebiete bringt.'
    WHEN name = 'Recuperación de playas' THEN 'Strandreinigung und Küstenökosystem-Restaurierungskampagne zur Entfernung von Verschmutzung und zum Schutz des Meereslebens.'
    WHEN name = 'Huertos urbanos' THEN 'Schaffung von Gemeinschaftsgrünflächen für nachhaltige Landwirtschaft und Umweltbildung in städtischen Umgebungen.'
    WHEN name = 'Centros vecinales inclusivos' THEN 'Gemeinschaftsräume, die soziale Inklusion, kulturellen Austausch und gegenseitige Unterstützung unter Nachbarn fördern.'
    ELSE description_de
  END,
  image_url = CASE 
    WHEN category = 'Medio ambiente' THEN 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'
    WHEN category = 'Educación' THEN 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop'
    WHEN category = 'Salud' THEN 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop'
    WHEN category = 'Océanos' THEN 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop'
    WHEN category = 'Alimentación' THEN 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop'
    WHEN category = 'Comunidad' THEN 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop'
    ELSE NULL
  END;

-- Insert sample events with relevant content and images
INSERT INTO public.events (title, title_en, title_de, description, description_en, description_de, image_url, date, city, country, category, capacity, notes) VALUES
('Plantación de árboles nativos', 'Native Tree Planting', 'Pflanzung einheimischer Bäume', 
 'Únete a nuestra plantación comunitaria de especies nativas para restaurar el ecosistema local. Aprenderás sobre las especies autóctonas y su importancia para la biodiversidad urbana.',
 'Join our community planting of native species to restore the local ecosystem. You will learn about native species and their importance for urban biodiversity.',
 'Schließe dich unserer Gemeinschaftspflanzung einheimischer Arten an, um das lokale Ökosystem wiederherzustellen. Du wirst über einheimische Arten und ihre Bedeutung für die städtische Biodiversität lernen.',
 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
 '2025-02-15', 'Berlín', 'Alemania', 'Medio ambiente', 30, 'Incluye herramientas y almuerzo'),

('Taller de energía solar', 'Solar Energy Workshop', 'Solar-Energie-Workshop',
 'Aprende sobre instalación y beneficios de paneles solares residenciales. Incluye demostración práctica y cálculo de ahorro energético.',
 'Learn about installation and benefits of residential solar panels. Includes practical demonstration and energy savings calculation.',
 'Lerne über Installation und Vorteile von Wohnsolarpanelen. Beinhaltet praktische Demonstration und Energiesparberechnung.',
 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=600&fit=crop',
 '2025-02-22', 'Madrid', 'España', 'Educación', 20, 'Material incluido'),

('Limpieza de playas', 'Beach Cleanup', 'Strandreinigung',
 'Campaña de limpieza para eliminar plásticos y contaminantes de nuestras costas. Ayuda a proteger la vida marina y mantener playas limpias.',
 'Cleanup campaign to remove plastics and pollutants from our coasts. Help protect marine life and keep beaches clean.',
 'Reinigungskampagne zur Entfernung von Plastik und Schadstoffen von unseren Küsten. Hilf beim Schutz des Meereslebens und halte Strände sauber.',
 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
 '2025-03-01', 'Marsella', 'Francia', 'Océanos', 50, 'Guantes y bolsas incluidos'),

('Huerto comunitario', 'Community Garden', 'Gemeinschaftsgarten',
 'Creación y mantenimiento de espacios verdes urbanos para agricultura sostenible. Aprende técnicas de cultivo ecológico.',
 'Creation and maintenance of urban green spaces for sustainable agriculture. Learn ecological farming techniques.',
 'Schaffung und Pflege städtischer Grünflächen für nachhaltige Landwirtschaft. Lerne ökologische Anbautechniken.',
 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop',
 '2025-03-08', 'Londres', 'Reino Unido', 'Alimentación', 25, 'Semillas y herramientas incluidas'),

('Clínica móvil', 'Mobile Clinic', 'Mobile Klinik',
 'Servicio médico itinerante que lleva atención sanitaria básica a comunidades desatendidas. Participa en la promoción de la salud comunitaria.',
 'Mobile medical service bringing basic healthcare to underserved communities. Participate in community health promotion.',
 'Mobiler medizinischer Dienst, der grundlegende Gesundheitsversorgung in unterversorgte Gemeinden bringt. Nimm an der Förderung der Gemeinschaftsgesundheit teil.',
 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop',
 '2025-03-15', 'Milán', 'Italia', 'Salud', 15, 'Formación médica básica incluida'),

('Centro comunitario', 'Community Center', 'Gemeindezentrum',
 'Espacio de encuentro que fomenta la inclusión social y el intercambio cultural. Participa en actividades de cohesión vecinal.',
 'Meeting space that promotes social inclusion and cultural exchange. Participate in neighborhood cohesion activities.',
 'Begegnungsraum, der soziale Inklusion und kulturellen Austausch fördert. Nimm an Aktivitäten der Nachbarschaftskohäsion teil.',
 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop',
 '2025-03-22', 'Estocolmo', 'Suecia', 'Comunidad', 40, 'Actividades culturales incluidas');
