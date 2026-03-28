-- ============================================================
-- GOLF CHARITY PLATFORM — FULL DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- HELPER FUNCTION: check admin role (security definer to bypass RLS)
-- ============================================================
create or replace function public.is_admin()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  return coalesce(
    (select role = 'admin' from public.users where id = auth.uid()),
    false
  );
end;
$$;

-- ============================================================
-- TABLE: charities (created first for foreign key reference)
-- ============================================================
create table public.charities (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  image_url text,
  website_url text,
  featured_status boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- TABLE: users
-- ============================================================
create table public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  role text not null default 'user' check (role in ('admin', 'user')),
  selected_charity_id uuid references public.charities(id) on delete set null,
  charity_contribution_pct integer not null default 10
    check (charity_contribution_pct >= 10 and charity_contribution_pct <= 100),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- TABLE: subscriptions
-- ============================================================
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null unique,
  stripe_customer_id text,
  stripe_subscription_id text unique,
  status text not null default 'inactive'
    check (status in ('active', 'inactive', 'past_due', 'canceled', 'trialing')),
  plan_type text check (plan_type in ('monthly', 'yearly')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- TABLE: scores (Stableford 1-45)
-- ============================================================
create table public.scores (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  score integer not null check (score >= 1 and score <= 45),
  played_date date not null default current_date,
  created_at timestamptz not null default now()
);

create index idx_scores_user_date on public.scores(user_id, created_at desc);

-- ============================================================
-- TRIGGER: keep only 5 most recent scores per user
-- ============================================================
create or replace function keep_latest_five_scores()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.scores
  where id in (
    select s.id
    from public.scores s
    where s.user_id = NEW.user_id
    order by s.created_at desc
    offset 5
  );
  return NEW;
end;
$$;

create trigger trg_keep_latest_five_scores
  after insert on public.scores
  for each row
  execute function keep_latest_five_scores();

-- ============================================================
-- TABLE: draws
-- ============================================================
create table public.draws (
  id uuid default uuid_generate_v4() primary key,
  month date not null,
  winning_numbers integer[] not null default '{}',
  type text not null default 'random' check (type in ('random', 'algorithmic')),
  status text not null default 'simulation' check (status in ('simulation', 'published')),
  total_pool decimal(10,2) not null default 0,
  rollover_amount decimal(10,2) not null default 0,
  charity_total decimal(10,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- TABLE: winners
-- ============================================================
create table public.winners (
  id uuid default uuid_generate_v4() primary key,
  draw_id uuid references public.draws(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  match_tier integer not null check (match_tier in (3, 4, 5)),
  prize_share decimal(10,2) not null default 0,
  proof_image_url text,
  verification_status text not null default 'pending'
    check (verification_status in ('pending', 'approved', 'rejected')),
  payout_status text not null default 'pending'
    check (payout_status in ('pending', 'paid', 'failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_winners_draw on public.winners(draw_id);
create index idx_winners_user on public.winners(user_id);

-- ============================================================
-- RLS POLICIES
-- ============================================================

alter table public.users enable row level security;
alter table public.subscriptions enable row level security;
alter table public.scores enable row level security;
alter table public.charities enable row level security;
alter table public.draws enable row level security;
alter table public.winners enable row level security;

-- USERS
create policy "users_select_own"  on public.users for select using (auth.uid() = id);
create policy "users_update_own"  on public.users for update using (auth.uid() = id);
create policy "users_admin_select" on public.users for select using (public.is_admin());
create policy "users_admin_all"   on public.users for all    using (public.is_admin());

-- SUBSCRIPTIONS
create policy "subs_select_own"   on public.subscriptions for select using (auth.uid() = user_id);
create policy "subs_admin_select" on public.subscriptions for select using (public.is_admin());

-- SCORES
create policy "scores_select_own" on public.scores for select using (auth.uid() = user_id);
create policy "scores_insert_own" on public.scores for insert with check (auth.uid() = user_id);
create policy "scores_admin_all"  on public.scores for all    using (public.is_admin());

-- CHARITIES (publicly readable)
create policy "charities_public_read" on public.charities for select using (true);
create policy "charities_admin_all"   on public.charities for all    using (public.is_admin());

-- DRAWS
create policy "draws_public_read"  on public.draws for select using (status = 'published');
create policy "draws_admin_all"    on public.draws for all    using (public.is_admin());

-- WINNERS
create policy "winners_select_own" on public.winners for select using (auth.uid() = user_id);
create policy "winners_update_own" on public.winners for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
create policy "winners_admin_all"  on public.winners for all using (public.is_admin());

-- ============================================================
-- AUTO-CREATE USER PROFILE ON SIGNUP
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- UPDATED_AT TRIGGERS
-- ============================================================
create or replace function update_updated_at()
returns trigger
language plpgsql
as $$
begin
  NEW.updated_at = now();
  return NEW;
end;
$$;

create trigger trg_users_updated_at before update on public.users
  for each row execute function update_updated_at();
create trigger trg_subs_updated_at before update on public.subscriptions
  for each row execute function update_updated_at();
create trigger trg_charities_updated_at before update on public.charities
  for each row execute function update_updated_at();
create trigger trg_draws_updated_at before update on public.draws
  for each row execute function update_updated_at();
create trigger trg_winners_updated_at before update on public.winners
  for each row execute function update_updated_at();

-- ============================================================
-- SEED DATA: Sample Charities
-- ============================================================
insert into public.charities (name, description, image_url, featured_status) values
  ('Hearts for Homes', 'Building safe, warm homes for families who need them most. Every brick laid is a step toward dignity.', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600', true),
  ('Ocean''s Promise', 'Restoring marine ecosystems and empowering coastal communities through sustainable practices.', 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600', true),
  ('Minds in Motion', 'Providing mental health resources and counseling to underserved youth around the world.', 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=600', true),
  ('Feed Forward', 'Connecting surplus food from producers to communities facing hunger. Zero waste, zero hunger.', 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600', false),
  ('Code the Future', 'Teaching coding and digital skills to children in developing nations, opening doors to opportunity.', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600', false);
