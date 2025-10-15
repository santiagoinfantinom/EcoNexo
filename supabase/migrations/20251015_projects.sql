-- Projects schema for EcoNexo
create table if not exists public.projects (
  id text primary key,
  name text not null,
  name_en text,
  name_de text,
  description text,
  description_en text,
  description_de text,
  image_url text,
  category text not null check (category in ('Medio ambiente','Educación','Salud','Comunidad','Océanos','Alimentación')),
  lat double precision not null,
  lng double precision not null,
  city text not null,
  country text not null,
  spots integer,
  created_at timestamp with time zone default now() not null
);

-- Enable Row Level Security
alter table public.projects enable row level security;

-- Basic RLS: public read; authenticated can write
create policy if not exists projects_read_public
  on public.projects for select
  to anon, authenticated
  using (true);

create policy if not exists projects_write_auth
  on public.projects for insert
  to authenticated
  with check (true);

create policy if not exists projects_update_auth
  on public.projects for update
  to authenticated
  using (true) with check (true);

create policy if not exists projects_delete_auth
  on public.projects for delete
  to authenticated
  using (true);


