import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { rateLimit, clientIp, isBot } from "@/lib/spam";
import { SITE } from "@/lib/site";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const { email, attribution, website } = await req.json();

    // Honeypot: "website" alanı doluysa bot → sahte başarı dön (kaydetme)
    if (isBot(website)) {
      return NextResponse.json({ ok: true });
    }

    // Hız sınırı: IP başına dakikada 5 istek
    if (!rateLimit(`sub:${clientIp(req)}`)) {
      return NextResponse.json({ ok: false, error: "Çok fazla deneme. Lütfen biraz sonra tekrar deneyin." }, { status: 429 });
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: "Geçerli bir e-posta girin." }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ ok: false, error: "Kayıt sistemi henüz bağlanmadı." }, { status: 503 });
    }

    const base = { email: email.toLowerCase().trim(), source: SITE.domain };
    const attr = attribution && Object.keys(attribution).length ? attribution : null;

    let { error } = await supabaseAdmin
      .from("subscribers")
      .upsert({ ...base, attribution: attr }, { onConflict: "email", ignoreDuplicates: true });

    // "attribution" kolonu henüz eklenmediyse attribution'sız kaydet (kayıp lead olmasın)
    if (error && /attribution|column|schema cache/i.test(error.message)) {
      ({ error } = await supabaseAdmin
        .from("subscribers")
        .upsert(base, { onConflict: "email", ignoreDuplicates: true }));
    }

    if (error) {
      console.error("Supabase subscribe error:", error.message);
      return NextResponse.json({ ok: false, error: "Kayıt sırasında bir sorun oluştu." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Beklenmeyen bir hata oluştu." }, { status: 500 });
  }
}
