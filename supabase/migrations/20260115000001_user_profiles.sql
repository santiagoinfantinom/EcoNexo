-- User profiles table updates (making it compatible with previous partial creation)
-- Instead of create table, we alter the existing one from 0000

alter table public.profiles 
add column if not exists first_name text,
add column if not exists last_name text,
add column if not exists phone text,
add column if not exists pronouns text,
add column if not exists gender text,
add column if not exists city text,
add column if not exists country text,
add column if not exists timezone text,
add column if not exists about_me text,
add column if not exists bio text,
add column if not exists passions text,
add column if not exists hobbies text,
add column if not exists interests text,
add column if not exists skills text,
add column if not exists areas_of_expertise text,
add column if not exists languages text,
add column if not exists linkedin_url text,
add column if not exists twitter_url text,
add column if not exists instagram_url text,
add column if not exists website_url text,
add column if not exists github_url text,
add column if not exists preferred_language text default 'es',
add column if not exists newsletter_subscribed boolean default false,
add column if not exists notifications_enabled boolean default true,
add column if not exists profile_visibility text default 'public',
add column if not exists oauth_provider text,
add column if not exists oauth_data jsonb,
add column if not exists last_login timestamptz;

-- Enable Row Level Security (idempotent)
alter table public.profiles enable row level security;

-- Drop old policies to replace them with new ones
drop policy if exists "Profiles are viewable by owner" on public.profiles;
drop policy if exists "Profiles can be upserted by owner" on public.profiles;
drop policy if exists "Profiles can be updated by owner" on public.profiles;

-- Create policies (safe drop before create)
drop policy if exists "Users can view all profiles" on public.profiles;
create policy "Users can view all profiles" on public.profiles
  for select using (true);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Create function to automatically create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, created_at)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    now()
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger to automatically create profile
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger to update updated_at
drop trigger if exists update_profiles_updated_at on public.profiles;
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at_column();

-- Create indexes for better performance
create index if not exists profiles_email_idx on public.profiles (email);
create index if not exists profiles_city_idx on public.profiles (city);
create index if not exists profiles_country_idx on public.profiles (country);
create index if not exists profiles_created_at_idx on public.profiles (created_at);
