import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { rateLimit, clientIp } from "@/lib/spam";
import { resolveFunnelPath } from "@/lib/funnel-attribution";

// GHL workflow → funnel sonucu (ulaşıldı / satış) webhook'u.
//
// Neden var: panelin "Satış", "Ciro", "ROAS", "CPA", "Ulaşılma oranı",
// "Close rate" ve "Lead → satış süresi" KPI'ları `vsl_reached` ve `vsl_sale`
// event'lerinden besleniyor, ama bu event'leri sistemde HİÇBİR ŞEY üretmiyordu
// (0 kayıt) — çünkü "ulaştım" ve "sattım" bilgisi funnel'da değil CRM'de oluşuyor.
// Bu route, GHL'deki fırsat durumu değişince o bilgiyi panele taşır.
//
// Kurulum (GHL Workflow → Webhook action, POST):
//   Ulaşıldı : https://fitnessvepazarlama.com/api/ghl/vsl-outcome?event=vsl_reached&secret=<SECRET>
//   Satış    : https://fitnessvepazarlama.com/api/ghl/vsl-outcome?event=vsl_sale&secret=<SECRET>
// Gövdeye en az e-posta veya telefon; satışta ayrıca tutar (revenue/amount/value)
// ve varsa opportunityId/contactId gönderilmeli.
//
// SECRET = GHL_BOOKING_WEBHOOK_SECRET (booking webhook'uyla aynı anahtar).

// Panelin okuduğu event adları — dışarıdan serbest isim kabul EDİLMEZ.
const ALLOWED = new Set(["vsl_reached", "vsl_sale", "vsl_closed_won"]);

function pickString(obj: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }
  return "";
}

function pickNumber(obj: Record<string, unknown>, keys: string[]): number {
  for (const key of keys) {
    const raw = obj[key];
    if (typeof raw === "number" && Number.isFinite(raw) && raw > 0) return raw;
    if (typeof raw === "string") {
      // "12.500,00 TL" / "12500" → sayı
      const s = raw.replace(/[^\d.,-]/g, "");
      if (!s) continue;
      const lastComma = s.lastIndexOf(",");
      const lastDot = s.lastIndexOf(".");
      const normalized =
        lastComma > lastDot
          ? s.replace(/\./g, "").replace(",", ".")
          : s.replace(/,/g, "");
      const n = Number(normalized);
      if (Number.isFinite(n) && n > 0) return n;
    }
  }
  return 0;
}

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const expected = process.env.GHL_BOOKING_WEBHOOK_SECRET || "";
    const provided =
      req.headers.get("x-fvp-secret") || url.searchParams.get("secret") || "";
    if (!expected || provided !== expected) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    if (!rateLimit(`ghl-outcome:${clientIp(req)}`, 120, 60_000)) {
      return NextResponse.json({ ok: true });
    }

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

    const event = (url.searchParams.get("event") || pickString(body, ["event"]))
      .trim()
      .toLowerCase();
    if (!ALLOWED.has(event)) {
      return NextResponse.json(
        { ok: false, error: "unknown_event" },
        { status: 400 },
      );
    }

    const email = pickString(body, ["email", "contactEmail"]).toLowerCase();
    const phone = pickString(body, ["phone", "contactPhone"]);
    // Kimlik yoksa panel bu satırı bir kişiye bağlayamaz ve tekilleştiremez.
    const contactId = pickString(body, ["contactId", "contact_id"]);
    if (!email && !phone && !contactId) {
      return NextResponse.json(
        { ok: false, error: "missing_identity" },
        { status: 400 },
      );
    }

    const revenue = pickNumber(body, [
      "revenue",
      "amount",
      "value",
      "monetaryValue",
      "saleValue",
      "price",
    ]);

    // Panel event'leri `path` ön ekiyle funnel'lara ayırıyor → kişinin
    // gerçek funnel'ını lead kaydından çöz (sabit yazmak yanlış funnel'a yazar).
    const suffix = event === "vsl_reached" ? "/ulasildi" : "/satis";
    const path = await resolveFunnelPath(email, phone, suffix);

    if (supabaseAdmin) {
      await supabaseAdmin.from("events").insert({
        name: event,
        path,
        session_id: null,
        video: null,
        attribution: null,
        // Panel bu alanlardan kişiyi tekilleştirir ve ciroyu okur.
        meta: {
          contactId,
          opportunityId: pickString(body, ["opportunityId", "opportunity_id"]),
          email,
          phone,
          revenue,
          stage: pickString(body, ["stage", "pipelineStage", "status"]),
          source: "GHL VSL outcome webhook",
        },
        ua: (req.headers.get("user-agent") || "").slice(0, 300),
      });
    }

    return NextResponse.json({ ok: true, event, path, revenue });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
