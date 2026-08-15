import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { rateLimit, clientIp, isBot } from "@/lib/spam";
import { BASVURU_LABELS, FUNNEL, scoreApplication, type BasvuruCevaplar } from "@/lib/funnel";
import { ghlAttributionPayload } from "@/lib/ghl";
import { upsertGhlContact } from "@/lib/ghl-contact";
import { SITE } from "@/lib/site";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function cleanText(value: unknown, limit = 600) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

function cleanAnswers(value: unknown): BasvuruCevaplar {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const out: BasvuruCevaplar = {};
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    if (Array.isArray(raw)) {
      const arr = raw.map((v) => cleanText(v, 160)).filter(Boolean).slice(0, 8);
      if (arr.length) out[key] = arr;
    } else {
      const text = cleanText(raw, 700);
      if (text) out[key] = text;
    }
  }
  return out;
}

function answerSummary(answers: BasvuruCevaplar) {
  return Object.entries(answers)
    .map(([key, value]) => {
      const label = BASVURU_LABELS[key] || key;
      const text = Array.isArray(value) ? value.join(", ") : value;
      return `${label}: ${text}`;
    })
    .join("\n");
}

// VSL detaylı başvuru — opt-in sonrası zenginleştirme. Cevaplar + iletişim.
export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, phone, instagram, businessName, websiteUrl, cevaplar, website, attribution } = await req.json();

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
    const ig = typeof instagram === "string" ? instagram.trim().slice(0, 120) : "";
    const business = cleanText(businessName, 120);
    const web = cleanText(websiteUrl, 180);
    const mail = email.toLowerCase().trim();
    const answers = cleanAnswers(cevaplar);
    const score = scoreApplication(answers);
    const enrichedAnswers = {
      ...answers,
      instagram: ig,
      businessName: business,
      websiteUrl: web,
      _lead_score: score.score,
      _lead_segment: score.segment,
      _lead_reasons: score.reasons,
    };
    const attr = attribution && Object.keys(attribution).length ? attribution : null;

    if (supabaseAdmin) {
      const row = {
        first_name: fn, last_name: ln, email: mail, phone: tel,
        form_type: "vsl_basvuru", cevaplar: enrichedAnswers, attribution: attr, source: SITE.domain,
      };
      const { error } = await supabaseAdmin.from("leads").insert(row);
      if (error && !/relation .*leads.* does not exist|schema cache/i.test(error.message)) {
        console.error("basvuru leads insert:", error.message);
      }
    }

    // GHL'e doğrudan upsert — tüm custom field'lar id ile dolar (workflow gerekmez).
    const ozet = answerSummary(answers);
    // AWAIT — serverless yanıt dönünce GHL isteğini kesmesin
    await upsertGhlContact({
      firstName: fn, lastName: ln, email: mail, phone: tel,
      tags: ["vsl-basvuru"],
      source: "VSL başvuru (/vsl/basvuru)",
      funnelStage: "application_submitted",
      instagram: ig,
      businessName: business,
      websiteUrl: web,
      answers,
      lead: { score: score.score, segment: score.segment, reasons: score.reasons },
      applicationSummary: ozet,
      attribution: attr,
    });

    // Ek VSL webhook — AWAIT. Cevaplar tek metinde de gider.
    if (FUNNEL.ghlWebhook) {
      const ghlAttr = ghlAttributionPayload(attr);
      await fetch(FUNNEL.ghlWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...enrichedAnswers,
          firstName: fn, lastName: ln, first_name: fn, last_name: ln, name: `${fn} ${ln}`.trim(),
          email: mail,
          phone: tel,
          instagram: ig,
          businessName: business,
          websiteUrl: web,
          source: "VSL başvuru (/vsl/basvuru)",
          formType: "vsl_basvuru",
          leadStage: "application_submitted",
          funnel: "fvp_vsl",
          pageUrl: `${SITE.url}/vsl/basvuru`,
          applicationSummary: ozet,
          problem: ozet,
          leadScore: score.score,
          leadSegment: score.segment,
          leadReasons: score.reasons.join(", "),
          ...ghlAttr,
          ...(attr || {}),
        }),
      }).catch(() => {});
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Beklenmeyen bir hata." }, { status: 500 });
  }
}
