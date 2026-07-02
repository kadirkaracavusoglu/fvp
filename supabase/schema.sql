-- FvP — Supabase tabloları
-- Supabase paneli → SQL Editor → bu dosyayı yapıştır → Run

-- Bülten aboneleri
create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text,
  created_at timestamptz not null default now()
);

-- İletişim / sponsorluk talepleri
create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text,
  source text,
  created_at timestamptz not null default now()
);

-- RLS: tabloları kilitle (yalnızca service_role erişir, API route'lar üzerinden)
alter table subscribers enable row level security;
alter table contacts enable row level security;
