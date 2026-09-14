import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { clientIp, isBot, rateLimit } from "@/lib/spam";
import { MACFIT, validateMacfitSubmission } from "@/lib/macfit-funnel";
import { createMacfitAccess, readMacfitAccess } from "@/lib/macfit-access";
import { cookies } from "next/headers";
import { MACFIT_GHL_WEBHOOK, ensureMacfitOpportunity, postMacfitWebhook, upsertMacfitContact } from "@/lib/ghl-macfit";
import { markLeadGhlDelivery } from "@/lib/lead-ghl-status";

export const maxDuration = 60;

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ ok: false, error: "Form bilgileri okunamadı." }, { status: 400 });
  if (isBot(body.website)) return NextResponse.json({ ok: false, error: "Formu tekrar doldur." }, { status: 400 });
  if (!rateLimit(`macfit:${clientIp(req)}`)) return NextResponse.json({ ok: false, error: "Çok fazla deneme. Bir dakika sonra tekrar dene." }, { status: 429 });
  const parsed = validateMacfitSubmission(body);
  if (parsed.error) return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  if (!supabaseAdmin) return NextResponse.json({ ok: false, error: "Kayıt şu anda tamamlanamıyor. Lütfen biraz sonra tekrar dene." }, { status: 503 });
  const existing = readMacfitAccess((await cookies()).get(MACFIT.cookie)?.value);
  if (existing) return NextResponse.json({ ok: true });
  const { firstName, lastName, email, phone, instagram, answers } = parsed.data!;
  const attribution: Record<string, string> = {};
  if (body.attribution && typeof body.attribution === "object") {
    for (const [key, value] of Object.entries(body.attribution).slice(0, 60)) {
      if (/^[a-zA-Z_]{1,60}$/.test(key) && typeof value === "string") attribution[key] = value.slice(0, 1000);
    }
  }
  attribution.landing_path = MACFIT.path;
  attribution.funnel = "fitsistem_macfit_vaka";
  const { data, error } = await supabaseAdmin.from("leads").insert({
    first_name: firstName, last_name: lastName, email, phone,
    form_type: MACFIT.formType, source: "fitnessvepazarlama.com/fitsistem-macfit-vaka",
    cevaplar: { instagram, ...answers }, attribution, ghl_ok: false,
  }).select("id").single();
  if (error || !data?.id) {
    console.error("macfit lead insert failed", error?.code);
    return NextResponse.json({ ok: false, error: "Bilgilerin kaydedilemedi. Lütfen tekrar dene." }, { status: 503 });
  }
  // GHL — AWAIT şart: serverless'ta yanıt döndükten sonra istekler kesilir.
  // 1) Kişiyi "MACFit Salon Funnel" alanları + macfit-optin etiketiyle yaz.
  // 2) Workflow webhook'u (tanımlıysa). 3) Sonucu lead'e işle (ghl_ok).
  // GHL hatası formu BOZMAZ: lead Supabase'de, kişi videoya geçer; ghl_ok=false kalır.
  const ghlLead = { leadId: data.id, firstName, lastName, email, phone, instagram, answers, attribution };
  const contact = await upsertMacfitContact(ghlLead);
  // "Sales Pipeline - Gym" → Yeni Başvuru (Kadir'e atanmış; açık fırsat varsa yenisi açılmaz).
  const opportunity = contact.ok && contact.id
    ? await ensureMacfitOpportunity({ contactId: contact.id, name: `${firstName} ${lastName}`.trim() || email })
    : { ok: false, skipped: true };
  const webhook = await postMacfitWebhook(process.env.GHL_MACFIT_WEBHOOK || MACFIT_GHL_WEBHOOK, ghlLead, contact.id);
  const failures = [
    !contact.ok && `contact_upsert: ${contact.status || ""} ${contact.error || "atlandı"}`.trim(),
    !opportunity.ok && !opportunity.skipped && `gym_opportunity: ${"status" in opportunity ? opportunity.status || "" : ""} ${"error" in opportunity ? opportunity.error || "" : ""}`.trim(),
    !webhook.ok && !webhook.skipped && `macfit_webhook: ${webhook.status || ""} ${webhook.error || ""}`.trim(),
  ].filter(Boolean) as string[];
  // Kişi GHL'e yazılamadıysa (anahtar yok dahil) ghl_ok=false — "atlandı"yı başarı sayma.
  await markLeadGhlDelivery(supabaseAdmin, data.id, {
    ok: failures.length === 0,
    status: (!contact.ok ? contact.status : !webhook.ok && !webhook.skipped ? webhook.status : contact.status) ?? null,
    error: failures.length ? failures.join(" | ").slice(0, 1000) : null,
  });
  if (failures.length) console.error("macfit ghl delivery:", failures.join(" | "));

  const res = NextResponse.json({ ok: true });
  res.cookies.set(MACFIT.cookie, createMacfitAccess(data.id), {
    httpOnly: true, sameSite: "lax", secure: new URL(req.url).protocol === "https:",
    path: "/", maxAge: 30 * 86400,
  });
  return res;
}
