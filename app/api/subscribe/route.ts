import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const { email, attribution } = await req.json();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: "Geçerli bir e-posta girin." }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ ok: false, error: "Kayıt sistemi henüz bağlanmadı." }, { status: 503 });
    }

    const base = { email: email.toLowerCase().trim(), source: "fitnessvepazarlama.com" };
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
