import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";
import { rateLimit, clientIp } from "@/lib/spam";
import { confirmBookingFor } from "@/lib/ghl-appointments";
import { opaqueId, readWatchToken, watchTokenIssuedMs, WATCH_COOKIE } from "@/lib/watch-access";

// Randevu gerçekten alındı mı? Teşekkür sayfası bunu sorar; "evet" ise Meta `Schedule`
// olayı gönderilir. Kimlik istek gövdesinden DEĞİL, opt-in anında yazılan imzalı httpOnly
// çerezden gelir (bkz. lib/watch-access.ts). Yanıt kişi hakkında başka bir şey sızdırmaz.
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const NO = () => NextResponse.json({ booked: false });
  try {
    if (!rateLimit(`randevu-dogrula:${clientIp(req)}`, 20, 60_000)) return NO();
    const token = (await cookies()).get(WATCH_COOKIE)?.value;
    const email = readWatchToken(token);
    const issuedMs = watchTokenIssuedMs(token);
    if (!email || issuedMs === null) return NO();

    // Takvimde farklı e-posta yazmış olabilir → başvuru formundaki telefonla da ara.
    let phone = "";
    if (supabaseAdmin) {
      const { data } = await supabaseAdmin
        .from("leads")
        .select("phone")
        .eq("email", email)
        .order("created_at", { ascending: false })
        .limit(5);
      phone = data?.find((r) => r.phone)?.phone || "";
    }

    // Serverless: yanıt dönmeden GHL sorguları bitmeli (await şart).
    // Yalnız çerez verildikten SONRA alınan randevu sayılır (e-posta sahipliği doğrulanmıyor;
    // başkasının e-postasıyla alınan çerez, o kişinin ESKİ randevusunu sorgulayamasın).
    const r = await confirmBookingFor({ email, phone }, { notBeforeMs: issuedMs });
    // GHL randevu kimliği dışarı verilmez; istemci yalnız tekilleştirme için opak özet alır.
    return NextResponse.json(
      r.booked && r.appointmentId ? { booked: true, id: opaqueId(r.appointmentId) } : { booked: false },
    );
  } catch {
    return NO();
  }
}
