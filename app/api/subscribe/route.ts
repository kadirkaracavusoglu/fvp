import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: "Geçerli bir e-posta girin." }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ ok: false, error: "Kayıt sistemi henüz bağlanmadı." }, { status: 503 });
    }

    const { error } = await supabaseAdmin
      .from("subscribers")
      .upsert(
        { email: email.toLowerCase().trim(), source: "fitnessvepazarlama.com" },
        { onConflict: "email", ignoreDuplicates: true }
      );

    if (error) {
      console.error("Supabase subscribe error:", error.message);
      return NextResponse.json({ ok: false, error: "Kayıt sırasında bir sorun oluştu." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Beklenmeyen bir hata oluştu." }, { status: 500 });
  }
}
