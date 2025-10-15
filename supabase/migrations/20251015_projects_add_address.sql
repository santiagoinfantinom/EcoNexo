-- Add postal address to projects
alter table public.projects add column if not exists address text;


