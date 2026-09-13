#!/usr/bin/env node
/**
 * GHL'e hiç gitmemiş (ghl_ok=false) MACFit lead'lerini aktarır.
 * Form API'siyle AYNI kodu kullanır (lib/ghl-macfit.ts).
 *
 *   node scripts/macfit-ghl-backfill.mjs            → kuru çalıştırma (hiçbir şey göndermez)
 *   GHL_LOCATION_KEY=pit-... node scripts/macfit-ghl-backfill.mjs --send
 *
 * Yalnız form_type=macfit_optin seçer (replay-ghl.mjs yalnız vsl_* seçer; birbirine karışmaz).
 */
import { readFileSync } from "node:fs";
import { argv, exit } from "node:process";
import { upsertMacfitContact, macfitFieldValues, postMacfitWebhook, MACFIT_GHL_WEBHOOK } from "../lib/ghl-macfit.ts";

const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const envGet = (k) => (env.match(new RegExp(`^${k}=(.*)$`, "m")) || [])[1]?.trim() || "";
const U = envGet("NEXT_PUBLIC_SUPABASE_URL"), K = envGet("SUPABASE_SERVICE_ROLE_KEY");
const H = { apikey: K, Authorization: `Bearer ${K}` };
const SEND = argv.includes("--send");

const rows = await (await fetch(
  `${U}/rest/v1/leads?select=id,first_name,last_name,email,phone,cevaplar,attribution,created_at,ghl_ok&form_type=eq.macfit_optin&or=(ghl_ok.eq.false,ghl_ok.is.null)&order=created_at.asc`,
  { headers: H },
)).json();
console.log(`${SEND ? "GÖNDERİM" : "KURU ÇALIŞTIRMA"} · GHL'e gitmemiş MACFit lead: ${rows.length}\n`);

let fail = 0;
for (const r of rows) {
  const c = r.cevaplar || {};
  const lead = {
    leadId: r.id, firstName: r.first_name || "", lastName: r.last_name || "", email: r.email || "",
    phone: r.phone || "", instagram: c.instagram || "", answers: c, attribution: r.attribution, createdAt: r.created_at,
  };
  const v = macfitFieldValues(lead);
  console.log(`• ${lead.firstName} ${lead.lastName} <${lead.email}>`);
  console.log(`  üye=${v.macfit_aktif_uye} · hedef=${v.macfit_hedef} · kreatif=${v.macfit_kreatif || "-"} · tarih=${v.macfit_form_tarihi}`);
  if (!SEND) continue;
  const contact = await upsertMacfitContact(lead);
  const webhook = await postMacfitWebhook(process.env.GHL_MACFIT_WEBHOOK || MACFIT_GHL_WEBHOOK, lead, contact.id);
  const ok = contact.ok && (webhook.ok || webhook.skipped);
  if (!ok) fail++;
  console.log(`  GHL kişi: ${contact.ok ? "✓ " + contact.id : "✗ " + (contact.status || "") + " " + (contact.error || "")} · webhook: ${webhook.skipped ? "atlandı (adres yok)" : webhook.ok ? "✓" : "✗ " + webhook.error}`);
  await fetch(`${U}/rest/v1/leads?id=eq.${r.id}`, {
    method: "PATCH",
    headers: { ...H, "Content-Type": "application/json" },
    body: JSON.stringify({
      ghl_ok: ok, ghl_last_status: contact.status ?? null,
      ghl_error: ok ? null : [contact.error, webhook.skipped ? null : webhook.error].filter(Boolean).join(" | ").slice(0, 1000),
      ghl_attempted_at: new Date().toISOString(),
    }),
  });
}
if (fail) { console.log(`\n${fail} kayıt başarısız`); exit(1); }
