-- ─────────────────────────────────────────────────────────────────────────────
-- WealthyFlow 2.0  –  Initial Supabase schema + RLS
-- Run this in the Supabase SQL Editor (or via supabase db push)
-- ─────────────────────────────────────────────────────────────────────────────

-- ── profiles ──────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id               uuid references auth.users(id) on delete cascade primary key,
  email            text,
  subscription_tier text not null default 'free'
    check (subscription_tier in ('free', 'pro', 'premium')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Auto-create a profile row on sign-up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── holdings ──────────────────────────────────────────────────────────────────
create table if not exists public.holdings (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade not null,
  coin_id    text not null,           -- CoinGecko id, e.g. 'bitcoin'
  symbol     text not null,
  name       text not null,
  quantity   numeric not null default 0 check (quantity >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, coin_id)
);

-- ── enrollments ───────────────────────────────────────────────────────────────
create table if not exists public.enrollments (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users(id) on delete cascade not null,
  course_id    int not null,
  enrolled_at  timestamptz not null default now(),
  completed_at timestamptz,
  unique (user_id, course_id)
);

-- ── transactions ──────────────────────────────────────────────────────────────
create table if not exists public.transactions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete set null,
  course_id  int,
  amount     numeric not null,
  status     text not null default 'pending'
    check (status in ('completed', 'pending', 'failed')),
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Row-Level Security
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.profiles    enable row level security;
alter table public.holdings    enable row level security;
alter table public.enrollments enable row level security;
alter table public.transactions enable row level security;

-- profiles: each user reads/updates their own row
create policy "profiles: own row" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- holdings: each user reads/writes their own holdings
create policy "holdings: own rows" on public.holdings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- enrollments: each user reads/writes their own enrollments
create policy "enrollments: own rows" on public.enrollments
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- transactions: users see their own; premium users (admins) see all
create policy "transactions: own rows" on public.transactions
  for select using (auth.uid() = user_id);

create policy "transactions: admin reads all" on public.transactions
  for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and subscription_tier = 'premium'
    )
  );

-- Allow backend / service-role to insert transactions
create policy "transactions: service insert" on public.transactions
  for insert with check (true);
