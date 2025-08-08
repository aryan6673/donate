-- Run this SQL in Supabase SQL Editor
-- 1) Create donations table
create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  payment_intent_id text unique,
  amount_cents integer not null check (amount_cents >= 0),
  currency text not null default 'usd',
  status text not null default 'processing', -- processing | succeeded | failed | canceled | refunded
  name text,
  email text,
  github_id text,
  message text,
  is_public boolean not null default true,
  cover_fees boolean not null default false,
  recurring boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists donations_created_at_idx on public.donations(created_at desc);
create index if not exists donations_status_idx on public.donations(status);
create index if not exists donations_public_idx on public.donations(is_public);

-- 2) Enable RLS and add a safe public policy (optional, server can use service role)
alter table public.donations enable row level security;

-- Allow the anon role to read only public, succeeded donations (names/messages intended for a wall)
create policy if not exists "Public can read public succeeded donations"
  on public.donations for select
  to anon
  using (is_public = true and status = 'succeeded');

-- 3) (Optional) A view for aggregate stats (total raised)
create or replace view public.donation_stats as
  select coalesce(sum(amount_cents), 0)::bigint as total_raised_cents,
         count(*)::bigint as donations_count
  from public.donations
  where status = 'succeeded';
