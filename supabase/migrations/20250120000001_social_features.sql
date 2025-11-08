-- Social Features Migration
-- Funcionalidades sociales y de comunidad para EcoNexo

-- ============================================
-- 1. FOLLOW SYSTEM (Seguimiento de usuarios)
-- ============================================
create table if not exists public.follows (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid not null references auth.users(id) on delete cascade,
  following_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  unique (follower_id, following_id),
  check (follower_id != following_id) -- No puedes seguirte a ti mismo
);

create index idx_follows_follower on public.follows(follower_id);
create index idx_follows_following on public.follows(following_id);

alter table public.follows enable row level security;

create policy "Users can view all follows" on public.follows
  for select using (true);

create policy "Users can follow others" on public.follows
  for insert with check (auth.uid() = follower_id);

create policy "Users can unfollow" on public.follows
  for delete using (auth.uid() = follower_id);

-- ============================================
-- 2. ACTIVITY FEED
-- ============================================
create table if not exists public.activity_feed (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  activity_type text not null check (activity_type in (
    'event_created', 'event_joined', 'project_created', 
    'review_posted', 'achievement_earned', 'group_joined'
  )),
  activity_data jsonb not null,
  created_at timestamptz default now()
);

create index idx_activity_feed_user on public.activity_feed(user_id);
create index idx_activity_feed_created on public.activity_feed(created_at desc);

alter table public.activity_feed enable row level security;

create policy "Users can view activity feed" on public.activity_feed
  for select using (true);

create policy "System can insert activities" on public.activity_feed
  for insert with check (true);

-- ============================================
-- 3. LOCAL GROUPS (Grupos locales)
-- ============================================
create table if not exists public.local_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  city text not null,
  country text not null,
  region text,
  avatar_url text,
  cover_image_url text,
  created_by uuid not null references auth.users(id) on delete restrict,
  is_public boolean default true,
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_local_groups_location on public.local_groups(city, country);
create index idx_local_groups_created_by on public.local_groups(created_by);

alter table public.local_groups enable row level security;

create policy "Public groups are viewable by all" on public.local_groups
  for select using (is_public = true or created_by = auth.uid());

create policy "Users can create groups" on public.local_groups
  for insert with check (auth.uid() = created_by);

create policy "Group creators can update" on public.local_groups
  for update using (auth.uid() = created_by);

-- Group Members
create table if not exists public.group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.local_groups(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('admin', 'moderator', 'member')),
  joined_at timestamptz default now(),
  unique (group_id, user_id)
);

create index idx_group_members_group on public.group_members(group_id);
create index idx_group_members_user on public.group_members(user_id);

alter table public.group_members enable row level security;

create policy "Group members are viewable" on public.group_members
  for select using (true);

create policy "Users can join groups" on public.group_members
  for insert with check (auth.uid() = user_id);

create policy "Users can leave groups" on public.group_members
  for delete using (auth.uid() = user_id);

-- ============================================
-- 4. REVIEWS SYSTEM (Sistema de reviews)
-- ============================================
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
  updated_at timestamptz default now(),
  unique (reviewer_id, reviewable_type, reviewable_id)
);

create index idx_reviews_reviewable on public.reviews(reviewable_type, reviewable_id);
create index idx_reviews_reviewer on public.reviews(reviewer_id);

alter table public.reviews enable row level security;

create policy "Reviews are viewable by all" on public.reviews
  for select using (true);

create policy "Users can create reviews" on public.reviews
  for insert with check (auth.uid() = reviewer_id);

create policy "Users can update own reviews" on public.reviews
  for update using (auth.uid() = reviewer_id);

-- Review Helpful Votes
create table if not exists public.review_helpful (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.reviews(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  unique (review_id, user_id)
);

create index idx_review_helpful_review on public.review_helpful(review_id);

alter table public.review_helpful enable row level security;

create policy "Users can vote helpful" on public.review_helpful
  for all using (auth.uid() = user_id);

-- ============================================
-- 5. KARMA SYSTEM (Sistema de karma)
-- ============================================
create table if not exists public.karma_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount integer not null, -- positive or negative
  source text not null check (source in (
    'event_created', 'event_attended', 'review_posted', 
    'helpful_review', 'project_created', 'group_created', 
    'mentoring_session'
  )),
  source_id text,
  description text,
  created_at timestamptz default now()
);

create index idx_karma_user on public.karma_transactions(user_id);
create index idx_karma_created on public.karma_transactions(created_at desc);

alter table public.karma_transactions enable row level security;

create policy "Users can view own karma" on public.karma_transactions
  for select using (auth.uid() = user_id);

-- Add karma and reputation to profiles
alter table public.profiles 
  add column if not exists karma integer default 0,
  add column if not exists reputation_score numeric(5,2) default 0.0,
  add column if not exists is_mentor boolean default false,
  add column if not exists is_mentee boolean default false,
  add column if not exists expertise_areas text[] default '{}';

-- ============================================
-- 6. MENTORING SYSTEM
-- ============================================
create table if not exists public.mentoring_matches (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid not null references auth.users(id) on delete cascade,
  mentee_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'active', 'completed', 'cancelled')),
  topic text not null,
  started_at timestamptz,
  completed_at timestamptz,
  rating_mentor integer check (rating_mentor >= 1 and rating_mentor <= 5),
  rating_mentee integer check (rating_mentee >= 1 and rating_mentee <= 5),
  created_at timestamptz default now(),
  check (mentor_id != mentee_id)
);

create index idx_mentoring_mentor on public.mentoring_matches(mentor_id);
create index idx_mentoring_mentee on public.mentoring_matches(mentee_id);
create index idx_mentoring_status on public.mentoring_matches(status);

alter table public.mentoring_matches enable row level security;

create policy "Users can view own mentoring matches" on public.mentoring_matches
  for select using (auth.uid() = mentor_id or auth.uid() = mentee_id);

create policy "Users can create mentoring requests" on public.mentoring_matches
  for insert with check (auth.uid() = mentee_id);

create policy "Mentors can accept/update matches" on public.mentoring_matches
  for update using (auth.uid() = mentor_id);

-- ============================================
-- 7. MARKETPLACE (Marketplace ecológico)
-- ============================================
create table if not exists public.marketplace_items (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text not null,
  category text not null check (category in ('product', 'service', 'exchange', 'donation')),
  item_type text not null check (item_type in (
    'sustainable_product', 'eco_service', 'second_hand', 
    'handmade', 'organic', 'repair', 'other'
  )),
  price numeric(10,2),
  currency text default 'EUR',
  is_exchange boolean default false,
  exchange_for text,
  images text[] default '{}',
  location_city text,
  location_country text,
  condition text check (condition in ('new', 'like_new', 'good', 'fair')),
  eco_certifications text[] default '{}',
  status text not null default 'available' check (status in ('available', 'reserved', 'sold', 'completed')),
  views_count integer default 0,
  favorites_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_marketplace_seller on public.marketplace_items(seller_id);
create index idx_marketplace_category on public.marketplace_items(category);
create index idx_marketplace_status on public.marketplace_items(status);
create index idx_marketplace_location on public.marketplace_items(location_city, location_country);

alter table public.marketplace_items enable row level security;

create policy "Marketplace items are viewable by all" on public.marketplace_items
  for select using (status != 'sold' or seller_id = auth.uid());

create policy "Users can create marketplace items" on public.marketplace_items
  for insert with check (auth.uid() = seller_id);

create policy "Sellers can update own items" on public.marketplace_items
  for update using (auth.uid() = seller_id);

-- Marketplace Transactions
create table if not exists public.marketplace_transactions (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.marketplace_items(id) on delete restrict,
  buyer_id uuid not null references auth.users(id) on delete cascade,
  seller_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in (
    'pending', 'confirmed', 'shipped', 'delivered', 'completed', 'cancelled'
  )),
  payment_method text,
  total_amount numeric(10,2),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_marketplace_trans_buyer on public.marketplace_transactions(buyer_id);
create index idx_marketplace_trans_seller on public.marketplace_transactions(seller_id);

alter table public.marketplace_transactions enable row level security;

create policy "Users can view own transactions" on public.marketplace_transactions
  for select using (auth.uid() = buyer_id or auth.uid() = seller_id);

-- Marketplace Favorites
create table if not exists public.marketplace_favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_id uuid not null references public.marketplace_items(id) on delete cascade,
  created_at timestamptz default now(),
  unique (user_id, item_id)
);

create index idx_marketplace_fav_user on public.marketplace_favorites(user_id);

alter table public.marketplace_favorites enable row level security;

create policy "Users can manage own favorites" on public.marketplace_favorites
  for all using (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update karma when activity happens
create or replace function public.update_user_karma()
returns trigger as $$
begin
  update public.profiles
  set karma = (
    select coalesce(sum(amount), 0)
    from public.karma_transactions
    where user_id = new.user_id
  )
  where id = new.user_id;
  return new;
end;
$$ language plpgsql;

create trigger trigger_update_karma
after insert on public.karma_transactions
for each row execute function public.update_user_karma();

-- Function to update reputation score based on reviews
create or replace function public.update_reputation_score()
returns trigger as $$
begin
  update public.profiles
  set reputation_score = (
    select coalesce(avg(rating)::numeric(5,2), 0.0)
    from public.reviews
    where reviewable_type = 'user' and reviewable_id = profiles.id::text
  )
  where id::text = new.reviewable_id and new.reviewable_type = 'user';
  return new;
end;
$$ language plpgsql;

create trigger trigger_update_reputation
after insert or update on public.reviews
for each row execute function public.update_reputation_score();

-- Function to update helpful count on reviews
create or replace function public.update_review_helpful_count()
returns trigger as $$
begin
  if tg_op = 'INSERT' then
    update public.reviews
    set helpful_count = helpful_count + 1
    where id = new.review_id;
  elsif tg_op = 'DELETE' then
    update public.reviews
    set helpful_count = helpful_count - 1
    where id = old.review_id;
  end if;
  return coalesce(new, old);
end;
$$ language plpgsql;

create trigger trigger_update_helpful_count
after insert or delete on public.review_helpful
for each row execute function public.update_review_helpful_count();

