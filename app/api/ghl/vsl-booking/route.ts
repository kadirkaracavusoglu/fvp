import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { rateLimit, clientIp } from "@/lib/spam";
import { SITE } from "@/lib/site";

function pickString(obj: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function safeBookingMeta(body: Record<string, unknown>) {
  return {
    appointmentId: pickString(body, ["appointmentId", "appointment_id", "id"]),
    calendarId: pickString(body, ["calendarId", "calendar_id"]),
    startTime: pickString(body, ["startTime", "start_time", "appointmentStartTime"]),
    status: pickString(body, ["status", "appointmentStatus"]),
    source: "GHL VSL booking webhook",
  };
}

export async function POST(req: Request) {
  try {
    const expected = process.env.GHL_BOOKING_WEBHOOK_SECRET || "";
    const url = new URL(req.url);
    const provided = req.headers.get("x-fvp-secret") || url.searchParams.get("secret") || "";
    if (!expected || provided !== expected) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    if (!rateLimit(`ghl-booking:${clientIp(req)}`, 120, 60_000)) {
      return NextResponse.json({ ok: true });
    }

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const firstName = pickString(body, ["firstName", "first_name"]);
    const lastName = pickString(body, ["lastName", "last_name"]);
    const name = pickString(body, ["name", "fullName", "contactName"]);
    const email = pickString(body, ["email", "contactEmail"]).toLowerCase();
    const phone = pickString(body, ["phone", "contactPhone"]);
    const meta = safeBookingMeta(body);

    if (supabaseAdmin) {
      await supabaseAdmin.from("leads").insert({
        first_name: firstName || name.split(" ")[0] || "",
        last_name: lastName || name.split(" ").slice(1).join(" ") || "",
        email,
        phone,
        form_type: "vsl_randevu",
        cevaplar: meta,
        attribution: null,
        source: SITE.domain,
      });

      await supabaseAdmin.from("events").insert({
        name: "vsl_calendar_booked",
        path: "/vsl/randevu",
        session_id: null,
        video: null,
        attribution: null,
        meta,
        ua: (req.headers.get("user-agent") || "").slice(0, 300),
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
