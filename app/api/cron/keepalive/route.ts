import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Veritabanını uyanık tut.
//
// Supabase ücretsiz planda 7 gün istek gelmezse projeyi duraklatıyor.
// Bu site veritabanına yalnız form gönderiminde dokunuyor (yazılar Sanity'den
// okunuyor) → form gelmediği hafta DB uyur, uyuyunca form da çalışmaz.
// Bu tam olarak yaşandı: 1 Tem - 15 Tem arası form gelmedi, DB uyudu, bülten
// formu sessizce bozuldu. Kimse fark etmedi.
//
// Günde bir kez buraya uğramak döngüyü kırıyor. Maliyeti yok.
// Vercel cron ayarı: vercel.json

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  // Vercel cron çağrılarına CRON_SECRET'i Authorization başlığında yollar.
  // Ayarlıysa doğrula — yoksa adresi bilen herkes tetikler.
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ ok: false, error: "supabase_yok" }, { status: 503 });
  }

  // En ucuz gerçek sorgu: tek satır say. Veri okumuyor, sadece "buradayım" diyor.
  const { error } = await supabaseAdmin
    .from("subscribers")
    .select("id", { count: "exact", head: true });

  if (error) {
    console.error("Keepalive hata:", error.message);
    return NextResponse.json({ ok: false, error: error.message }, { status: 502 });
  }

  return NextResponse.json({ ok: true, at: new Date().toISOString() });
}
