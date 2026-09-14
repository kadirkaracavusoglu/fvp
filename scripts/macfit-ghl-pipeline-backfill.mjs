#!/usr/bin/env node
/**
 * Mevcut MACFit lead'lerini "Sales Pipeline - Gym"e ekler ve Kadir'e atar.
 * Kişiyi YENİDEN upsert ETMEZ (kaynak vb. alanlara dokunmaz): e-postayla bulur,
 * yalnız atamayı günceller ve açık fırsatı yoksa açar.
 *
 *   node scripts/macfit-ghl-pipeline-backfill.mjs                → kuru çalıştırma
 *   GHL_LOCATION_KEY=pit-... node scripts/macfit-ghl-pipeline-backfill.mjs --send
 *
 * Randevusu olan kişi (MACFit takviminde) "Randevu Aldı"da, diğerleri "Yeni Başvuru"da açılır.
 */
import { readFileSync } from "node:fs";
import { argv, exit } from "node:process";
import { ensureMacfitOpportunity, MACFIT_OWNER_USER_ID, MACFIT_STAGE } from "../lib/ghl-macfit.ts";

const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const envGet = (k) => (env.match(new RegExp(`^${k}=(.*)$`, "m")) || [])[1]?.trim() || "";
const U = envGet("NEXT_PUBLIC_SUPABASE_URL"), K = envGet("SUPABASE_SERVICE_ROLE_KEY");
const SEND = argv.includes("--send");
const KEY = process.env.GHL_LOCATION_KEY || "";
const LOC = process.env.GHL_LOCATION_ID || "ui4C7FNVHfgWeZk9DQpB";
const CALENDAR = "pnGEhOlcaumcO8YAaBqC";
if (!KEY) { console.error("GHL_LOCATION_KEY gerekli"); exit(1); }
const GH = { Authorization: `Bearer ${KEY}`, Version: "2021-07-28", "Content-Type": "application/json", Accept: "application/json" };

const leads = await (await fetch(`${U}/rest/v1/leads?select=first_name,last_name,email,created_at&form_type=eq.macfit_optin&order=created_at.asc`,
  { headers: { apikey: K, Authorization: `Bearer ${K}` } })).json();

// MACFit takviminde randevusu olan kişi kimlikleri
const since = Date.parse("2026-09-13T00:00:00+03:00");
const ev = await (await fetch(`https://services.leadconnectorhq.com/calendars/events?locationId=${LOC}&calendarId=${CALENDAR}&startTime=${since}&endTime=${Date.now() + 90 * 864e5}`, { headers: GH })).json();
const booked = new Set((ev.events || []).filter((e) => !/cancel/i.test(e.appointmentStatus || "")).map((e) => e.contactId));

console.log(`${SEND ? "GÖNDERİM" : "KURU ÇALIŞTIRMA"} · MACFit lead: ${leads.length} · randevulu kişi: ${booked.size}\n`);
let fail = 0;
for (const l of leads) {
  const name = `${l.first_name || ""} ${l.last_name || ""}`.trim();
  const dup = await (await fetch(`https://services.leadconnectorhq.com/contacts/search/duplicate?locationId=${LOC}&email=${encodeURIComponent(l.email)}`, { headers: GH })).json();
  const c = dup.contact;
  if (!c) { console.log(`✗ ${name} <${l.email}> GHL'de bulunamadı`); fail++; continue; }
  const stage = booked.has(c.id) ? "randevuAldi" : "yeniBasvuru";
  console.log(`• ${name} · aşama=${stage === "randevuAldi" ? "Randevu Aldı" : "Yeni Başvuru"} · şu anki atama=${c.assignedTo || "yok"}`);
  if (!SEND) continue;
  if (c.assignedTo !== MACFIT_OWNER_USER_ID) {
    const r = await fetch(`https://services.leadconnectorhq.com/contacts/${c.id}`, { method: "PUT", headers: GH, body: JSON.stringify({ assignedTo: MACFIT_OWNER_USER_ID }) });
    console.log(`  atama: ${r.ok ? "✓ Kadir" : "✗ " + r.status + " " + (await r.text()).slice(0, 120)}`);
    if (!r.ok) fail++;
  }
  const opp = await ensureMacfitOpportunity({ contactId: c.id, name: name || l.email, stageId: MACFIT_STAGE[stage] }, { locationKey: KEY, locationId: LOC });
  console.log(`  fırsat: ${opp.ok ? (opp.existed ? "zaten vardı " : "✓ açıldı ") + opp.id : "✗ " + (opp.status || "") + " " + (opp.error || "")}`);
  if (!opp.ok) fail++;
}
if (fail) { console.log(`\n${fail} hata`); exit(1); }
