-- Rollback for demo localized projects inserted by schema.sql
-- Safe cleanup: only deletes specific demo rows by (name, city, country)
begin;

delete from public.projects
where (name, city, country) in (
  ('Reforestación Urbana Berlín','Berlín','Alemania'),
  ('Taller de Robótica Educativa','Madrid','España'),
  ('Clínica móvil comunitaria','Milán','Italia'),
  ('Recuperación de playas','Marsella','Francia'),
  ('Huertos urbanos','Londres','Reino Unido'),
  ('Centros vecinales inclusivos','Estocolmo','Suecia')
);

-- OPTIONAL: drop localized columns (uncomment if you want to remove them)
-- alter table public.projects drop column if exists name_en;
-- alter table public.projects drop column if exists name_de;
-- alter table public.projects drop column if exists description_en;
-- alter table public.projects drop column if exists description_de;

commit;


