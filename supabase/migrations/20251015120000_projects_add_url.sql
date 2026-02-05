-- Add info_url to projects
alter table public.projects add column if not exists info_url text;


