-- Push notification subscriptions table
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

-- Index for faster lookups
create index if not exists push_subscriptions_user_id_idx on public.push_subscriptions(user_id);
create index if not exists push_subscriptions_endpoint_idx on public.push_subscriptions(endpoint);

-- Enable RLS
alter table public.push_subscriptions enable row level security;

-- Policy: Users can manage their own subscriptions
create policy "Users can manage their own push subscriptions"
  on public.push_subscriptions
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Table to track which events have been notified
create table if not exists public.event_notifications (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  subscription_id uuid not null references public.push_subscriptions(id) on delete cascade,
  notification_type text not null, -- '24h_before', '1h_before', 'starting'
  sent_at timestamptz default now(),
  created_at timestamptz default now(),
  unique(event_id, subscription_id, notification_type)
);

-- Index for faster lookups
create index if not exists event_notifications_event_id_idx on public.event_notifications(event_id);
create index if not exists event_notifications_subscription_id_idx on public.event_notifications(subscription_id);

-- Enable RLS
alter table public.event_notifications enable row level security;

-- Policy: Users can view their own notifications
create policy "Users can view their own event notifications"
  on public.event_notifications
  for select
  using (
    exists (
      select 1 from public.push_subscriptions ps
      where ps.id = event_notifications.subscription_id
      and ps.user_id = auth.uid()
    )
  );

