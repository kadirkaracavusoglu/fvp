import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";
import { rateLimit, clientIp } from "@/lib/spam";
import { updateVideoWatch } from "@/lib/ghl-contact";
import { WATCH_MINUTES, watchLevel } from "@/lib/video-watch";
import { readWatchToken, WATCH_COOKIE } from "@/lib/watch-access";

// VSL izleme ilerlemesi → GHL kişi alanı ("VSL Video İzleme (dk)" + seviye).
// Güvenlik: e-posta istek gövdesinden DEĞİL, opt-in/başvuru anında yazılan
// imzalı httpOnly çerezden okunur → kimse başkasının kaydını değiştiremez.
// Yanıt her durumda aynıdır (e-posta listede mi sorusuna cevap vermez);
// veritabanı erişimi yoksa hiçbir şey yazılmaz.
const DONE = () => NextResponse.json({ ok: true });

export async function POST(req: Request) {
  try {
    if (!rateLimit(`vsl-progress:${clientIp(req)}`, 30, 60_000)) return DONE();

    const email = readWatchToken((await cookies()).get(WATCH_COOKIE)?.value);
    if (!email) return DONE();

    const body = (await req.json().catch(() => ({}))) as { milestone?: unknown };
    const milestone = typeof body.milestone === "string" ? body.milestone : "";
    const minutes = WATCH_MINUTES[milestone];
    if (minutes === undefined) return DONE();

    if (!supabaseAdmin) return DONE();
    const { data } = await supabaseAdmin
      .from("leads")
      .select("phone")
      .eq("email", email)
      .in("form_type", ["vsl_optin", "vsl_basvuru"])
      .order("created_at", { ascending: false })
      .limit(5);
    if (!data?.length) return DONE();
    const phone = data.find((r) => r.phone)?.phone || "";

    // Serverless: yanıt dönmeden GHL yazımı bitmeli (await şart).
    await updateVideoWatch(email, phone, minutes, watchLevel(minutes));
    return DONE();
  } catch {
    return DONE();
  }
}
