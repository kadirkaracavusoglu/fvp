import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { rateLimit, clientIp } from "@/lib/spam";

// First-party olay toplama — VSL milestone'ları + funnel adımları.
// Teşhis metriği; reklam pixel'lerine GİTMEZ (o iş track() → GA4/Meta'da).
//
// Güvenlik: olay adı beyaz listeye uymalı (rastgele event enjeksiyonu engellenir),
// IP başına dakikada 240 olay (bir izleme oturumu ~20 milestone üretir, bol pay).

const NAME_OK = /^(vsl|cta|form|quiz|page)_[a-z0-9_]{1,40}$/;

export async function POST(req: Request) {
  try {
    // Hız sınırı — track çok olay ürettiği için yüksek tutuldu
    if (!rateLimit(`trk:${clientIp(req)}`, 240, 60_000)) {
      return NextResponse.json({ ok: true }); // sessizce yut, istemciyi bozma
    }

    const body = await req.json().catch(() => ({}));
    const name: unknown = body?.name;
    if (typeof name !== "string" || !NAME_OK.test(name)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // Supabase bağlı değilse sessizce başarı dön (ölçüm yoksa sayfa çalışmaya devam etsin)
    if (!supabaseAdmin) return NextResponse.json({ ok: true });

    const row = {
      name,
      path: typeof body?.path === "string" ? body.path.slice(0, 120) : null,
      session_id: typeof body?.sessionId === "string" ? body.sessionId.slice(0, 64) : null,
      video: typeof body?.video === "string" ? body.video.slice(0, 32) : null,
      attribution:
        body?.attribution && typeof body.attribution === "object" ? body.attribution : null,
      meta: body?.meta && typeof body.meta === "object" ? body.meta : null,
      ua: (req.headers.get("user-agent") || "").slice(0, 300),
    };

    const { error } = await supabaseAdmin.from("events").insert(row);
    // "events" tablosu henüz oluşturulmadıysa sessizce geç (kayıp = sadece o olay)
    if (error && !/relation .*events.* does not exist|schema cache/i.test(error.message)) {
      console.error("track insert error:", error.message);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true }); // ölçüm asla akışı bozmaz
  }
}
