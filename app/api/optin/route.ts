import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { rateLimit, clientIp, isBot } from "@/lib/spam";
import { FUNNEL } from "@/lib/funnel";
import { ghlAttributionPayload } from "@/lib/ghl";
import { postGhlWebhook, summarizeGhlDelivery, upsertGhlContact, type GhlStepResult } from "@/lib/ghl-contact";
import { markLeadGhlDelivery } from "@/lib/lead-ghl-status";
import { SITE } from "@/lib/site";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// VSL opt-in kapısı — videoyu açmak için ad+soyad+e-posta.
// Kişiyi ERKEN yakalar (videoyu yarıda bırakan da kayıtlı olur).
export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, website, attribution } = await req.json();

    if (isBot(website)) return NextResponse.json({ ok: true }); // honeypot
    if (!rateLimit(`optin:${clientIp(req)}`)) {
      return NextResponse.json({ ok: false, error: "Çok fazla deneme. Biraz sonra tekrar deneyin." }, { status: 429 });
    }
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: "Geçerli bir e-posta girin." }, { status: 400 });
    }

    const fn = typeof firstName === "string" ? firstName.trim().slice(0, 80) : "";
    const ln = typeof lastName === "string" ? lastName.trim().slice(0, 80) : "";
    const mail = email.toLowerCase().trim();
    const attr = attribution && Object.keys(attribution).length ? attribution : null;

    // 1) Kendi DB'mize (leads) — GHL'den bağımsız, her zaman
    let leadId: string | null = null;
    if (supabaseAdmin) {
      const row = { first_name: fn, last_name: ln, email: mail, form_type: "vsl_optin", attribution: attr, source: SITE.domain, ghl_ok: false };
      const { data, error } = await supabaseAdmin.from("leads").insert(row).select("id").single();
      if (error && !/relation .*leads.* does not exist|schema cache/i.test(error.message)) {
        console.error("optin leads insert:", error.message);
      }
      leadId = data?.id || null;
    }

    // 2) GHL'e doğrudan upsert — AWAIT (serverless yanıt dönünce isteği kesmesin)
    const contact = await upsertGhlContact({
      firstName: fn, lastName: ln, email: mail,
      tags: ["vsl-optin"],
      source: "VSL opt-in (/fitsistem)",
      funnelStage: "video_unlocked",
      attribution: attr,
    });

    // 3) Ek VSL webhook — AWAIT (fire-and-forget serverless'ta düşüyordu)
    let webhook: GhlStepResult = { ok: false, skipped: true };
    if (FUNNEL.ghlWebhook) {
      const ghlAttr = ghlAttributionPayload(attr);
      webhook = await postGhlWebhook(
        FUNNEL.ghlWebhook,
        {
          firstName: fn, lastName: ln, first_name: fn, last_name: ln, name: `${fn} ${ln}`.trim(),
          email: mail,
          source: "VSL opt-in (/fitsistem)",
          formType: "vsl_optin",
          leadStage: "video_unlocked",
          funnel: "fvp_vsl",
          pageUrl: `${SITE.url}/fitsistem`,
          ...ghlAttr,
          ...(attr || {}),
        },
      );
    }
    const delivery = summarizeGhlDelivery([
      { label: "contact_upsert", result: contact },
      { label: "vsl_webhook", result: webhook },
    ]);
    await markLeadGhlDelivery(supabaseAdmin, leadId, delivery);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Beklenmeyen bir hata oluştu." }, { status: 500 });
  }
}
