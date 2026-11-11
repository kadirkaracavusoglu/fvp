import { NextResponse, type NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// kadirkaracavusoglu.com/youtube — takipli yönlendirme (Instagram bio YouTube bağlantısı).
// Tıklamayı first-party `events` tablosuna yazar, sonra ytbe.app kısa adresine yönlendirir.
//
// Olay adı `yt_yonlendirme`: path /youtube funnel'lara (/fitsistem, /vaka-analizi) ait değil ve panel
// yalnız bilinen olay adlarını sayar → funnel ziyaret/opt-in rakamlarını ŞİŞİRMEZ.
// Sayım: events'te name = 'yt_yonlendirme' ve meta->>'bot' = 'false'.
// Hedef değişirse yalnız HEDEF sabiti değişir; 307 (kalıcı değil) ki tarayıcı hedefi önbelleğe almasın.
// ⚠️ Serverless: yanıt dönmeden önce insert await edilir (yoksa kayıt kaybolur); en fazla 800 ms beklenir.

const HEDEF =
  "https://ytbe.app/yIVXnEFd?utm_source=ig&utm_medium=social&utm_content=bio_youtube";
const BOT = /bot|crawl|spider|preview|facebookexternalhit|whatsapp|telegram|slackbot|embedly|headless|curl|wget/i;

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const ua = req.headers.get("user-agent") || "";
  const bot = BOT.test(ua);
  const ref = req.headers.get("referer") || "";

  if (supabaseAdmin) {
    const kayit = supabaseAdmin
      .from("events")
      .insert({
        name: "yt_yonlendirme",
        path: "/youtube",
        session_id: null,
        video: null,
        // Bio bağlantısı sabit utm taşır; kaynak panelde organik/bio sayılır.
        attribution: { utm_source: "ig", utm_medium: "social", utm_content: "bio_youtube" },
        meta: { bot, referrer: ref.slice(0, 200) || null, hedef: HEDEF },
        ua: ua.slice(0, 300),
      })
      .then(() => undefined, () => undefined);
    await Promise.race([kayit, new Promise((r) => setTimeout(r, 800))]);
  }

  const res = NextResponse.redirect(HEDEF, 307);
  res.headers.set("Cache-Control", "no-store");
  return res;
}
