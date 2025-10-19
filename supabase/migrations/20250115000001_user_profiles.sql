-- User profiles table with comprehensive personal information
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  -- Basic Information
  full_name text,
  first_name text,
  last_name text,
  email text,
  phone text,
  
  -- Personal Details
  birthdate date,
  birth_place text,
  pronouns text, -- e.g., "él/ella", "they/them", "er/sie"
  gender text,
  
  -- Location
  city text,
  country text,
  timezone text,
  
  -- Profile Content
  about_me text,
  bio text,
  avatar_url text,
  
  -- Interests and Skills
  passions text,
  hobbies text,
  interests text,
  skills text,
  areas_of_expertise text,
  languages text,
  
  -- Social Media
  linkedin_url text,
  twitter_url text,
  instagram_url text,
  website_url text,
  github_url text,
  
  -- Preferences
  preferred_language text default 'es',
  newsletter_subscribed boolean default false,
  notifications_enabled boolean default true,
  profile_visibility text default 'public', -- public, friends, private
  
  -- OAuth Data (for enhanced profile creation)
  oauth_provider text,
  oauth_data jsonb,
  
  -- Timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  last_login timestamptz
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Create policies
create policy "Users can view all profiles" on public.profiles
  for select using (true);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

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
