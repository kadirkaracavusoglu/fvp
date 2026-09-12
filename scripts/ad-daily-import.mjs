#!/usr/bin/env node
/**
 * ad_daily içe aktarım — günlük Meta reklam metriklerini Supabase'e yazar.
 *
 * İki kaynak:
 *   1) Meta API   : node scripts/ad-daily-import.mjs --meta --since 2026-09-01 --until 2026-09-12
 *   2) CSV (elle) : node scripts/ad-daily-import.mjs --csv veri.csv
 *
 * CSV başlıkları (sıra önemsiz, eksik kolonlar 0/null sayılır):
 *   date,funnel,campaign,adset,creative,spend,impressions,clicks,ctr,cpc,cpm,meta_leads,landing_views
 *
 * Idempotent: (date, funnel, adset, creative) benzersiz → aynı gün tekrar
 * çalıştırılırsa satır KOPYALANMAZ, üzerine yazılır. Gün içinde birden çok kez
 * çalıştırıp en güncel rakamı tutabilirsin.
 *
 * NOT (12 Eyl 2026): FvP reklam hesabının (act_591162417349195) Meta API
 * token'ının süresi 11 Haz 2026'da doldu. --meta yolu, yeni bir System User
 * token META_ACCESS_TOKEN_FVP + META_AD_ACCOUNT_ID_FVP olarak tanımlanana
 * kadar çalışmaz; o zamana dek --csv kullan.
 */

import { readFileSync } from "node:fs";
import { argv, exit } from "node:process";

// ---- env (.env.local) ----
const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const envGet = (k) => (env.match(new RegExp(`^${k}=(.*)$`, "m")) || [])[1]?.trim() || "";

const SUPABASE_URL = envGet("NEXT_PUBLIC_SUPABASE_URL");
const SERVICE_KEY = envGet("SUPABASE_SERVICE_ROLE_KEY");
const META_TOKEN =
  process.env.META_ACCESS_TOKEN_FVP || envGet("META_ACCESS_TOKEN_FVP");
const META_ACCOUNT = (
  process.env.META_AD_ACCOUNT_ID_FVP || envGet("META_AD_ACCOUNT_ID_FVP")
).replace(/^act_/, "");

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("HATA: .env.local içinde Supabase bilgileri yok.");
  exit(1);
}

// ---- funnel eşlemesi ----
// Hangi kampanya hangi funnel'a ait? Kampanya adı yeterli ayırt edici değilse
// CSV'de funnel kolonunu elle doldur.
const FUNNELS = ["fitsistem", "vaka-hande"];

/** Kreatif adından numarayı at: "ertelemek - 3" → "ertelemek".
 *  Meta'daki numaralar ile UTM'e düşen numaralar tutmuyor (url_tags reklam
 *  oluşturulduktan sonra değişmiyor), bu yüzden dönüşüm eşleştirmesi AÇI ADIYLA
 *  yapılır. Karşılaştırma tutarlı olsun diye Türkçe küçültme kullanılır. */
export function aciAdi(creative) {
  return String(creative || "")
    .replace(/\s*-\s*\d+\s*$/, "")
    .trim()
    .toLocaleLowerCase("tr");
}

const num = (v) => {
  if (v === undefined || v === null || v === "") return null;
  // "1.234,56 TL" / "%2,63" / "1,234.56" → sayı
  const s = String(v).replace(/[^\d.,-]/g, "");
  if (!s) return null;
  // Son ayırıcı ondalık kabul edilir
  const lastComma = s.lastIndexOf(",");
  const lastDot = s.lastIndexOf(".");
  let normalized = s;
  if (lastComma > lastDot) normalized = s.replace(/\./g, "").replace(",", ".");
  else normalized = s.replace(/,/g, "");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
};
const int = (v) => {
  const n = num(v);
  return n === null ? 0 : Math.round(n);
};

// ---- CSV okuma (tırnaklı alanları destekler) ----
function parseCsv(text) {
  const rows = [];
  let row = [], field = "", inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQ = false;
      } else field += c;
    } else if (c === '"') inQ = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (c !== "\r") field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  if (!rows.length) return [];
  const head = rows[0].map((h) => h.trim().toLowerCase());
  return rows.slice(1)
    .filter((r) => r.some((c) => c.trim()))
    .map((r) => Object.fromEntries(head.map((h, i) => [h, (r[i] ?? "").trim()])));
}

function toRow(o, source) {
  const funnel = String(o.funnel || "").trim();
  if (!FUNNELS.includes(funnel)) {
    throw new Error(`geçersiz funnel "${funnel}" (beklenen: ${FUNNELS.join(" | ")})`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(o.date || "")) {
    throw new Error(`geçersiz tarih "${o.date}" (YYYY-MM-DD olmalı)`);
  }
  const creative = o.creative || "";
  return {
    date: o.date,
    funnel,
    campaign: o.campaign || "",
    adset: o.adset || "",
    creative,
    aci: aciAdi(creative),
    spend: num(o.spend) ?? 0,
    impressions: int(o.impressions),
    clicks: int(o.clicks),
    ctr: num(o.ctr),
    cpc: num(o.cpc),
    cpm: num(o.cpm),
    meta_leads: int(o.meta_leads),
    landing_views: int(o.landing_views),
    source,
    updated_at: new Date().toISOString(),
  };
}

// ---- Meta API'den çek ----
async function fromMeta(since, until) {
  if (!META_TOKEN || !META_ACCOUNT) {
    throw new Error(
      "META_ACCESS_TOKEN_FVP / META_AD_ACCOUNT_ID_FVP tanımlı değil.\n" +
      "FvP hesabının token'ı 11 Haz 2026'da doldu — yeni System User token gerekiyor.\n" +
      "O gelene kadar --csv yolunu kullan.",
    );
  }
  const fields = [
    "date_start", "campaign_name", "adset_name", "ad_name",
    "spend", "impressions", "clicks", "ctr", "cpc", "cpm", "actions",
  ].join(",");
  const url =
    `https://graph.facebook.com/v21.0/act_${META_ACCOUNT}/insights` +
    `?level=ad&time_increment=1&fields=${fields}` +
    `&time_range=${encodeURIComponent(JSON.stringify({ since, until }))}` +
    `&limit=500&access_token=${META_TOKEN}`;
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok || json.error) {
    throw new Error(`Meta API: ${json.error?.message || res.status}`);
  }
  return (json.data || []).map((r) => {
    const leadAction = (r.actions || []).find((a) => /lead/i.test(a.action_type));
    const lpv = (r.actions || []).find((a) => /landing_page_view/i.test(a.action_type));
    // Funnel'ı kampanya adından çıkar; bulunamazsa boş bırakılır (elle düzelt).
    const camp = r.campaign_name || "";
    const funnel = /hande|vaka/i.test(camp) ? "vaka-hande" : "fitsistem";
    return toRow({
      date: r.date_start,
      funnel,
      campaign: camp,
      adset: r.adset_name,
      creative: r.ad_name,
      spend: r.spend,
      impressions: r.impressions,
      clicks: r.clicks,
      ctr: r.ctr,
      cpc: r.cpc,
      cpm: r.cpm,
      meta_leads: leadAction?.value,
      landing_views: lpv?.value,
    }, "meta_api");
  });
}

// ---- Supabase upsert ----
async function upsert(rows) {
  if (!rows.length) return 0;
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/ad_daily?on_conflict=date,funnel,adset,creative`,
    {
      method: "POST",
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify(rows),
    },
  );
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return rows.length;
}

// ---- main ----
const arg = (name) => {
  const i = argv.indexOf(name);
  return i >= 0 ? argv[i + 1] : undefined;
};

try {
  let rows;
  if (argv.includes("--meta")) {
    const since = arg("--since"), until = arg("--until");
    if (!since || !until) throw new Error("--since ve --until gerekli (YYYY-MM-DD)");
    rows = await fromMeta(since, until);
    console.log(`Meta API'den ${rows.length} satır çekildi.`);
  } else if (argv.includes("--csv")) {
    const file = arg("--csv");
    if (!file) throw new Error("--csv <dosya> gerekli");
    rows = parseCsv(readFileSync(file, "utf8")).map((o) => toRow(o, "manual"));
    console.log(`CSV'den ${rows.length} satır okundu.`);
  } else {
    console.log(`Kullanım:
  node scripts/ad-daily-import.mjs --meta --since 2026-09-01 --until 2026-09-12
  node scripts/ad-daily-import.mjs --csv veri.csv`);
    exit(0);
  }

  const n = await upsert(rows);
  // Özet: funnel × gün harcama
  const ozet = {};
  for (const r of rows) {
    const k = `${r.funnel} ${r.date}`;
    ozet[k] = (ozet[k] || 0) + Number(r.spend);
  }
  console.log(`\n✅ ${n} satır yazıldı (upsert).\n`);
  for (const [k, v] of Object.entries(ozet).sort()) {
    console.log(`   ${k}  ${v.toFixed(2)} TL`);
  }
} catch (e) {
  console.error(`\n❌ ${e.message}\n`);
  exit(1);
}
