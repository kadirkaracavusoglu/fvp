import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const { name, email, phone, subject, message } = await req.json();

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

    const { error } = await supabaseAdmin.from("contacts").insert({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      subject: subject || "Genel",
      message: message.trim(),
      source: "fitnessvepazarlama.com",
    });

    if (error) {
      console.error("Supabase contact error:", error.message);
      return NextResponse.json({ ok: false, error: "Gönderim sırasında bir sorun oluştu." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Beklenmeyen bir hata oluştu." }, { status: 500 });
  }
}
