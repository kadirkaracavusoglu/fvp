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

-- Funnel lead'leri (VSL opt-in + detaylı başvuru). Opt-in erken yakalar,
-- başvuru aynı e-postayı zenginleştirir. form_type ile ayrılır.
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  first_name text,
  last_name text,
  email text,
  phone text,
  form_type text not null default 'vsl_optin',  -- vsl_optin | vsl_basvuru | vsl_randevu
  cevaplar jsonb,                                -- başvuru formu cevapları (soru→değer)
  attribution jsonb,                             -- gclid / fbclid / utm_*
  source text,
  created_at timestamptz not null default now()
);
create index if not exists leads_email_idx on leads (email);
create index if not exists leads_form_type_idx on leads (form_type);
create index if not exists leads_created_idx on leads (created_at);

-- RLS: tabloları kilitle (yalnızca service_role erişir, API route'lar üzerinden)
alter table subscribers enable row level security;
alter table contacts enable row level security;
alter table events enable row level security;
alter table leads enable row level security;
