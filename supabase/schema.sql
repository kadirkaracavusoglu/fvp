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
-- Amaç: GA4'ün bucketladığı izleme süresini dakika milestone'larıyla kendi verimizde tutmak.
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  name text not null,              -- vsl_play, vsl_min5, vsl_25, cta_click ...
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
  ghl_ok boolean,                                -- null = eski/izlenmeyen kayıt; yeni route önce false yazar
  ghl_last_status integer,
  ghl_error text,
  ghl_attempted_at timestamptz,
  ghl_attempt_count integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists leads_email_idx on leads (email);
create index if not exists leads_form_type_idx on leads (form_type);
create index if not exists leads_created_idx on leads (created_at);
create index if not exists leads_ghl_ok_idx on leads (ghl_ok);

-- RLS: tabloları kilitle (yalnızca service_role erişir, API route'lar üzerinden)
alter table subscribers enable row level security;
alter table contacts enable row level security;
alter table events enable row level security;
alter table leads enable row level security;

-- ---------------------------------------------------------------------------
-- Günlük reklam metrikleri (Meta) — funnel / kampanya / adset / kreatif kırılımı.
-- Neden: panel ve aylık rapor "harcama"yı Meta'dan canlı çekemiyor (FvP reklam
-- hesabının API token'ı yok/süresi dolmuş). Bu tablo tek doğru kaynak: ister
-- Meta API'den otomatik doldurulur, ister elle girilir.
--
-- `aci` = kreatif adının numarasız hâli ("ertelemek - 3" → "ertelemek").
-- Gerekli çünkü Meta'daki reklam numaraları ile UTM'e düşen numaralar
-- birbirini tutmuyor (url_tags reklam oluşturulduktan sonra değişmiyor);
-- dönüşüm eşleştirmesi bu yüzden numarayla değil AÇI ADIYLA yapılır.
create table if not exists ad_daily (
  -- PK dışarıya hiç verilmiyor; sıralı id index yerelliği için uuid'den iyi.
  id bigint generated always as identity primary key,
  date date not null,
  funnel text not null,                        -- fitsistem | vaka-hande
  campaign text not null default '',
  adset text not null default '',              -- Meta adset adı (ör. "Broad 3")
  creative text not null default '',           -- Meta reklam adı (ör. "ertelemek - 3")
  aci text not null default '',                -- numarasız açı adı (eşleştirme anahtarı)
  spend numeric(12,2) not null default 0,
  impressions integer not null default 0,
  clicks integer not null default 0,
  ctr numeric(6,3),
  cpc numeric(10,2),
  cpm numeric(10,2),
  meta_leads integer not null default 0,
  landing_views integer not null default 0,
  source text not null default 'manual',       -- manual | meta_api
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ad_daily_funnel_chk check (funnel in ('fitsistem', 'vaka-hande')),
  constraint ad_daily_source_chk check (source in ('manual', 'meta_api')),
  -- Aynı gün/funnel/adset/kreatif tek satır → içe aktarım tekrar çalışsa da
  -- veri KOPYALANMAZ, üzerine yazar (idempotent upsert).
  -- adset/creative NOT NULL DEFAULT '' çünkü UNIQUE'te NULL'lar birbirinden
  -- farklı sayılır ve çakışma yakalanmazdı.
  constraint ad_daily_uniq unique (date, funnel, adset, creative)
);
-- Panel/rapor sorgusu: WHERE funnel = ? AND date BETWEEN ? AND ?
-- Eşitlik kolonu önce, aralık kolonu sonra.
create index if not exists ad_daily_funnel_date_idx on ad_daily (funnel, date);
create index if not exists ad_daily_date_idx on ad_daily (date);
create index if not exists ad_daily_aci_idx on ad_daily (aci);

alter table ad_daily enable row level security;
