import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { rateLimit, clientIp, isBot } from "@/lib/spam";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const { name, email, phone, subject, message, attribution, website } = await req.json();

    // Honeypot: "website" alanı doluysa bot → sahte başarı dön (kaydetme)
    if (isBot(website)) {
      return NextResponse.json({ ok: true });
    }

    // Hız sınırı: IP başına dakikada 5 istek
    if (!rateLimit(`contact:${clientIp(req)}`)) {
      return NextResponse.json({ ok: false, error: "Çok fazla deneme. Lütfen biraz sonra tekrar deneyin." }, { status: 429 });
    }

    if (!name || name.trim().length < 2) {
      return NextResponse.json({ ok: false, error: "Lütfen adını gir." }, { status: 400 });
    }
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: "Geçerli bir e-posta gir." }, { status: 400 });
    }
    if (!phone || phone.replace(/\D/g, "").length < 7) {
      return NextResponse.json({ ok: false, error: "Geçerli bir telefon numarası gir." }, { status: 400 });
    }
    if (!message || message.trim().length < 5) {
      return NextResponse.json({ ok: false, error: "Lütfen mesajını yaz." }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ ok: false, error: "İletişim sistemi henüz bağlanmadı." }, { status: 503 });
    }

    const base = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      subject: subject || "Genel",
      message: message.trim(),
      source: "fitnessvepazarlama.com",
    };
    const attr = attribution && Object.keys(attribution).length ? attribution : null;

    let { error } = await supabaseAdmin.from("contacts").insert({ ...base, attribution: attr });

    // "attribution" kolonu henüz eklenmediyse attribution'sız kaydet (kayıp lead olmasın)
    if (error && /attribution|column|schema cache/i.test(error.message)) {
      ({ error } = await supabaseAdmin.from("contacts").insert(base));
    }

    if (error) {
      console.error("Supabase contact error:", error.message);
      return NextResponse.json({ ok: false, error: "Gönderim sırasında bir sorun oluştu." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Beklenmeyen bir hata oluştu." }, { status: 500 });
  }
}
