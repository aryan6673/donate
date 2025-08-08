-- Run this SQL in Supabase SQL Editor
-- Enable required extension
create extension if not exists pgcrypto;

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

-- 2) Enable RLS and add a safe public policy (server uses service role for writes)
alter table public.donations enable row level security;

-- Allow the anon role to read only public, succeeded donations (names/messages intended for a wall)
DROP POLICY IF EXISTS "Public can read public succeeded donations" ON public.donations;
CREATE POLICY "Public can read public succeeded donations"
  ON public.donations
  FOR SELECT
  TO anon
  USING (is_public = true and status = 'succeeded');

-- 3) A view for aggregate stats (totals of public, succeeded donations)
create or replace view public.donation_stats as
  select coalesce(sum(amount_cents), 0)::bigint as total_raised_cents,
         count(*)::bigint as donations_count
  from public.donations
  where status = 'succeeded' and is_public = true;
