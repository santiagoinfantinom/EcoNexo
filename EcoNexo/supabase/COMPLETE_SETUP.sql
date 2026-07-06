-- ==========================================
-- ECO-NEXO COMPLETE DATABASE SETUP
-- ==========================================
-- Run this script in the Supabase SQL Editor to set up the entire database.

-- 1. CLEANUP (Optional - remove comment to reset DB)
-- DROP SCHEMA public CASCADE;
-- CREATE SCHEMA public;

-- 2. CORE TABLES (Projects & Events)
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
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);

create index if not exists projects_category_idx on public.projects (category);
create index if not exists events_category_idx on public.events (category);

-- 3. PROFILES SYSTEM
create table if not exists public.profiles (
  id uuid references auth.users(id) primary key,
  email text,
  full_name text,
  first_name text,
  last_name text,
  phone text,
  pronouns text,
  gender text,
  city text,
  country text,
  timezone text,
  about_me text,
  bio text,
  avatar_url text,
  passions text,
  hobbies text,
  interests text,
  skills text,
  areas_of_expertise text,
  languages text,
  linkedin_url text,
  twitter_url text,
  instagram_url text,
  website_url text,
  github_url text,
  preferred_language text default 'es',
  newsletter_subscribed boolean default false,
  notifications_enabled boolean default true,
  profile_visibility text default 'public',
  oauth_provider text,
  oauth_data jsonb,
  karma integer default 0,
  reputation_score numeric(5,2) default 0.0,
  is_mentor boolean default false,
  is_mentee boolean default false,
  expertise_areas text[] default '{}',
  last_login timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone" on public.profiles
  for select using (true);

create policy "Users can insert their own profile" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- Trigger for new users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, created_at)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    now()
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4. PUSH NOTIFICATIONS
create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  user_agent text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.push_subscriptions enable row level security;

create policy "Users can manage their own subscriptions" on public.push_subscriptions
  for all using (auth.uid() = user_id);

create table if not exists public.event_notifications (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  subscription_id uuid not null references public.push_subscriptions(id) on delete cascade,
  notification_type text not null,
  sent_at timestamptz default now(),
  created_at timestamptz default now(),
  unique(event_id, subscription_id, notification_type)
);

alter table public.event_notifications enable row level security;

-- 5. EVENT REGISTRATIONS (New)
create table if not exists public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text default 'confirmed' check (status in ('confirmed', 'cancelled', 'waitlist')),
  created_at timestamptz default now(),
  unique(event_id, user_id)
);

alter table public.event_registrations enable row level security;

create policy "Users can view own registrations" on public.event_registrations
  for select using (auth.uid() = user_id);

create policy "Users can register themselves" on public.event_registrations
  for insert with check (auth.uid() = user_id);

create policy "Users can update own registrations" on public.event_registrations
  for update using (auth.uid() = user_id);

-- 6. FAVORITES (New - Generic)
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_type text not null check (item_type in ('event', 'project')),
  item_id uuid not null, -- Can reference events or projects
  created_at timestamptz default now(),
  unique(user_id, item_type, item_id)
);

alter table public.favorites enable row level security;

create policy "Users can manage own favorites" on public.favorites
  for all using (auth.uid() = user_id);

-- 7. SOCIAL FEATURES (Follows, Reviews)
create table if not exists public.follows (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid not null references auth.users(id) on delete cascade,
  following_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  unique (follower_id, following_id),
  check (follower_id != following_id)
);

alter table public.follows enable row level security;
create policy "Users can manage follows" on public.follows for all using (auth.uid() = follower_id);
create policy "Follows are public" on public.follows for select using (true);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  reviewer_id uuid not null references auth.users(id) on delete cascade,
  reviewable_type text not null check (reviewable_type in ('event', 'project', 'user')),
  reviewable_id text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  title text,
  comment text not null,
  helpful_count integer default 0,
  created_at timestamptz default now(),
  unique (reviewer_id, reviewable_type, reviewable_id)
);

alter table public.reviews enable row level security;
create policy "Reviews are public" on public.reviews for select using (true);
create policy "Users can create reviews" on public.reviews for insert with check (auth.uid() = reviewer_id);

-- 8. MARKETPLACE (Simplified)
create table if not exists public.marketplace_items (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text not null,
  category text not null,
  price numeric(10,2),
  currency text default 'EUR',
  images text[] default '{}',
  status text not null default 'available',
  created_at timestamptz default now()
);

alter table public.marketplace_items enable row level security;
create policy "Marketplace items are public" on public.marketplace_items for select using (true);
create policy "Users can manage own items" on public.marketplace_items for all using (auth.uid() = seller_id);

