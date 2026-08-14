import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { rateLimit, clientIp, isBot } from "@/lib/spam";
import { FUNNEL } from "@/lib/funnel";
import { SITE } from "@/lib/site";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// VSL detaylı başvuru — opt-in sonrası zenginleştirme. Cevaplar + iletişim.
export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, phone, cevaplar, website, attribution } = await req.json();

    if (isBot(website)) return NextResponse.json({ ok: true });
    if (!rateLimit(`basvuru:${clientIp(req)}`)) {
      return NextResponse.json({ ok: false, error: "Çok fazla deneme. Biraz sonra tekrar." }, { status: 429 });
    }
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: "Geçerli bir e-posta girin." }, { status: 400 });
    }

    const fn = typeof firstName === "string" ? firstName.trim().slice(0, 80) : "";
    const ln = typeof lastName === "string" ? lastName.trim().slice(0, 80) : "";
    const tel = typeof phone === "string" ? phone.trim().slice(0, 40) : "";
    const mail = email.toLowerCase().trim();
    const answers = cevaplar && typeof cevaplar === "object" ? cevaplar : null;
    const attr = attribution && Object.keys(attribution).length ? attribution : null;

    if (supabaseAdmin) {
      const row = {
        first_name: fn, last_name: ln, email: mail, phone: tel,
        form_type: "vsl_basvuru", cevaplar: answers, attribution: attr, source: SITE.domain,
      };
      const { error } = await supabaseAdmin.from("leads").insert(row);
      if (error && !/relation .*leads.* does not exist|schema cache/i.test(error.message)) {
        console.error("basvuru leads insert:", error.message);
      }
    }

    // GHL'e özet (webhook tanımlıysa). Cevaplar tek metinde de gider (satışçı okusun).
    if (FUNNEL.ghlWebhook) {
      const ozet = answers
        ? Object.entries(answers).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`).join("\n")
        : "";
      fetch(FUNNEL.ghlWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: fn, lastName: ln, first_name: fn, last_name: ln, name: `${fn} ${ln}`.trim(),
          email: mail, phone: tel, source: "VSL başvuru (/vsl/basvuru)",
          problem: ozet, ...(answers || {}), ...(attr || {}),
        }),
      }).catch(() => {});
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Beklenmeyen bir hata." }, { status: 500 });
  }
}
