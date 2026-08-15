import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { rateLimit, clientIp } from "@/lib/spam";

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function num(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^\d.,-]/g, "").replace(",", "."));
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function eventName(status: string): "vsl_reached" | "vsl_sale" | null {
  const s = status.toLowerCase();
  if (["reached", "contacted", "ulasildi", "ulaşıldı"].includes(s)) {
    return "vsl_reached";
  }
  if (["sale", "sold", "won", "closed_won", "satis", "satış"].includes(s)) {
    return "vsl_sale";
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const expected =
      process.env.GHL_VSL_STATUS_WEBHOOK_SECRET ||
      process.env.GHL_BOOKING_WEBHOOK_SECRET ||
      "";
    const url = new URL(req.url);
    const provided =
      req.headers.get("x-fvp-secret") || url.searchParams.get("secret") || "";
    if (!expected || provided !== expected) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    if (!rateLimit(`ghl-vsl-status:${clientIp(req)}`, 180, 60_000)) {
      return NextResponse.json({ ok: true });
    }

    const body = (await req.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    const name = eventName(str(body.status || body.event || body.type));
    if (!name) return NextResponse.json({ ok: false }, { status: 400 });

    const meta = {
      opportunityId: str(body.opportunityId || body.opportunity_id || body.id),
      contactId: str(body.contactId || body.contact_id),
      appointmentId: str(body.appointmentId || body.appointment_id),
      email: str(body.email || body.contactEmail).toLowerCase(),
      phone: str(body.phone || body.contactPhone),
      revenue: num(body.revenue || body.amount || body.value || body.price),
      source: "GHL VSL status webhook",
    };

    if (supabaseAdmin) {
      const { error } = await supabaseAdmin.from("events").insert({
        name,
        path: "/vsl",
        session_id: null,
        video: null,
        attribution: null,
        meta,
        ua: (req.headers.get("user-agent") || "").slice(0, 300),
      });
      if (error) {
        return NextResponse.json({ ok: false }, { status: 500 });
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
