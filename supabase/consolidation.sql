-- ============================================================
-- GOLF CHARITY PLATFORM — FINAL CONSOLIDATION SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. STORAGE: winner-proofs bucket
-- Note: Use the Supabase Dashboard to create the bucket 'winner-proofs' 
-- or run the following if using the storage API.

insert into storage.buckets (id, name, public) 
values ('winner-proofs', 'winner-proofs', false)
on conflict (id) do nothing;

-- RLS: winner-proofs
create policy "winners_upload_proof"
on storage.objects for insert
with check (
  bucket_id = 'winner-proofs' AND
  (select auth.uid() = user_id from public.winners where id::text = (storage.foldername(name))[1])
);

create policy "admins_read_proof"
on storage.objects for select
using (
  bucket_id = 'winner-proofs' AND
  (select role = 'admin' from public.users where id = auth.uid())
);

-- 2. TABLE: donations (Independent)
create table public.donations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete set null,
  amount decimal(10,2) not null check (amount > 0),
  charity_id uuid references public.charities(id) on delete set null,
  stripe_payment_id text unique,
  status text not null default 'pending' check (status in ('pending', 'succeeded', 'failed')),
  created_at timestamptz not null default now()
);

alter table public.donations enable row level security;

create policy "donations_select_own" on public.donations for select using (auth.uid() = user_id);
create policy "donations_admin_all" on public.donations for all using (public.is_admin());

-- 3. Update draws table for rollover_amount if not exists
do $$ 
begin
  if not exists (select 1 from information_schema.columns where table_name='draws' and column_name='rollover_amount') then
    alter table public.draws add column rollover_amount decimal(10,2) not null default 0;
  end if;
end $$;
