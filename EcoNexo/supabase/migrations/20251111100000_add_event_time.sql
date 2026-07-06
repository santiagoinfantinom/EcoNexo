-- Add start_time and end_time to events table
alter table if exists public.events
  add column if not exists start_time time,
  add column if not exists end_time time;

-- Optional composite index to speed up ordering by date/time
create index if not exists events_date_time_idx on public.events (date, start_time);


