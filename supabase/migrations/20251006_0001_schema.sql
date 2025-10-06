-- Schema migration: create tables and indexes
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

create table if not exists public.volunteers (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  email text not null,
  availability text not null,
  notes text,
  created_at timestamptz default now()
);

create index if not exists projects_category_idx on public.projects (category);
create index if not exists events_category_idx on public.events (category);


