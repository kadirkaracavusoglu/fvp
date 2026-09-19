import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { rateLimit, clientIp } from "@/lib/spam";
import { updateVideoWatch } from "@/lib/ghl-contact";
import { WATCH_MINUTES, watchLevel } from "@/lib/video-watch";

// VSL izleme ilerlemesi → GHL kişi alanı ("VSL Video İzleme (dk)" + seviye).
// İstemci (VslWatch) her dakika eşiğinde bir kez çağırır. Yalnız sitemizde
// opt-in yapmış bir e-posta için yazılır; rastgele e-postaya alan yazılamaz.
export async function POST(req: Request) {
  try {
    if (!rateLimit(`vsl-progress:${clientIp(req)}`, 30, 60_000)) {
      return NextResponse.json({ ok: true, skipped: "rate" });
    }
    const body = (await req.json().catch(() => ({}))) as { email?: unknown; milestone?: unknown };
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const milestone = typeof body.milestone === "string" ? body.milestone : "";
    const minutes = WATCH_MINUTES[milestone];
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || minutes === undefined) {
      return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
    }

    let phone = "";
    if (supabaseAdmin) {
      const { data } = await supabaseAdmin
        .from("leads")
        .select("phone")
        .eq("email", email)
        .in("form_type", ["vsl_optin", "vsl_basvuru"])
        .order("created_at", { ascending: false })
        .limit(5);
      if (!data?.length) return NextResponse.json({ ok: true, skipped: "unknown_email" });
      phone = data.find((r) => r.phone)?.phone || "";
    }

    // Serverless: yanıt dönmeden GHL yazımı bitmeli (await şart).
    const r = await updateVideoWatch(email, phone, minutes, watchLevel(minutes));
    return NextResponse.json({ ok: r.ok, updated: r.updated ?? false, reason: r.reason });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
