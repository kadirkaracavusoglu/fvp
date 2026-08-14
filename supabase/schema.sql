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

-- First-party olay ölçümü (VSL funnel + genel dönüşüm huniileri)
-- Her satır = tek bir olay (video milestone, CTA tık, form adımı...).
-- Amaç: GA4'ün bucketladığı izleme süresini SANİYE bazında, kendi verimizde tutmak.
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  name text not null,              -- vsl_play, vsl_sn30, vsl_25, cta_click ...
  path text,                       -- /vsl
  session_id text,                 -- istemci üretir, oturum hunisi için
  video text,                      -- videoId (VSL olaylarında)
  attribution jsonb,               -- gclid / fbclid / utm_*
  meta jsonb,                      -- ekstra parametreler
  ua text,
  created_at timestamptz not null default now()
);
create index if not exists events_name_idx on events (name);
create index if not exists events_path_idx on events (path);
create index if not exists events_session_idx on events (session_id);
create index if not exists events_created_idx on events (created_at);

-- RLS: tabloları kilitle (yalnızca service_role erişir, API route'lar üzerinden)
alter table subscribers enable row level security;
alter table contacts enable row level security;
alter table events enable row level security;
