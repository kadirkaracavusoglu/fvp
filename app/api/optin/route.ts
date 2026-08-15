import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { rateLimit, clientIp, isBot } from "@/lib/spam";
import { FUNNEL } from "@/lib/funnel";
import { ghlAttributionPayload } from "@/lib/ghl";
import { upsertGhlContact } from "@/lib/ghl-contact";
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
    if (supabaseAdmin) {
      const row = { first_name: fn, last_name: ln, email: mail, form_type: "vsl_optin", attribution: attr, source: SITE.domain };
      const { error } = await supabaseAdmin.from("leads").insert(row);
      if (error && !/relation .*leads.* does not exist|schema cache/i.test(error.message)) {
        console.error("optin leads insert:", error.message);
      }
    }

    // 2) GHL'e doğrudan upsert — AWAIT (serverless yanıt dönünce isteği kesmesin)
    await upsertGhlContact({
      firstName: fn, lastName: ln, email: mail,
      tags: ["vsl-optin"],
      source: "VSL opt-in (/vsl)",
      funnelStage: "video_unlocked",
      attribution: attr,
    });

    // 3) Ek VSL webhook — AWAIT (fire-and-forget serverless'ta düşüyordu)
    if (FUNNEL.ghlWebhook) {
      const ghlAttr = ghlAttributionPayload(attr);
      await fetch(FUNNEL.ghlWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: fn, lastName: ln, first_name: fn, last_name: ln, name: `${fn} ${ln}`.trim(),
          email: mail,
          source: "VSL opt-in (/vsl)",
          formType: "vsl_optin",
          leadStage: "video_unlocked",
          funnel: "fvp_vsl",
          pageUrl: `${SITE.url}/vsl`,
          ...ghlAttr,
          ...(attr || {}),
        }),
      }).catch(() => {});
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Beklenmeyen bir hata oluştu." }, { status: 500 });
  }
}
