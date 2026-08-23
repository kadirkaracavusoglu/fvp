// GHL takviminden randevu sayımı — panelin "booked" metriği için.
// Neden: GHL'de randevu alınıyor ama booking webhook'u bağlı olmayınca bizim
// `vsl_calendar_booked` event'imiz düşmüyordu → panel randevuyu göremiyordu.
// Bu yardımcı, randevuları doğrudan GHL takviminden sayar (webhook'a bağımsız).
//
// ⚠️ Anahtar server-side (GHL_LOCATION_KEY). Bu dosya ASLA client'a import edilmez.

const GHL_BASE = "https://services.leadconnectorhq.com";
const LOCATION_ID = process.env.GHL_LOCATION_ID || "ui4C7FNVHfgWeZk9DQpB";
const LOCATION_KEY = process.env.GHL_LOCATION_KEY || "";
// VSL strateji görüşmesi takvimi (funnel.ts calendarUrl ile aynı).
const CALENDAR_ID = "SSw6HZHR3j9veTWH8xTp";

type ApptRaw = {
  contactId?: string;
  dateAdded?: string; // randevunun oluşturulduğu (booked) an
  title?: string; // kişi adı (ör. "Hüseyin Bediz")
  appointmentStatus?: string;
};

export type GhlBooking = { contactId: string; bookedMs: number; name: string };
export type GhlBookings = { count: number; appts: GhlBooking[] };

/**
 * [sinceISO, untilISO] aralığında BOOKED olan randevular (dateAdded'e göre).
 * TEK GHL çağrısı: hem tekil-kişi SAYISINI hem de her randevunun {kişi, booked anı,
 * ad} bilgisini döndürür (ad, panelde lead'e isimden eşlenip süre hesabı için —
 * ekstra çağrı YOK). GHL erişimi yoksa/patlarsa null (panel eldeki tracking'e düşer).
 */
export async function getGhlBookings(
  sinceISO: string,
  untilISO?: string,
): Promise<GhlBookings | null> {
  if (!LOCATION_KEY) return null;
  try {
    const sinceMs = new Date(sinceISO).getTime();
    const untilMs = untilISO ? new Date(untilISO).getTime() : Date.now();
    // Takvim events endpoint'i PLANLANAN saate göre filtreler → geniş bir pencere
    // çek (tampon geçmiş + 90 gün ileri), sonra BOOKED anına (dateAdded) göre ele.
    const startMs = sinceMs - 3 * 86400000;
    const endMs = Date.now() + 90 * 86400000;
    const url =
      `${GHL_BASE}/calendars/events?locationId=${LOCATION_ID}` +
      `&calendarId=${CALENDAR_ID}&startTime=${startMs}&endTime=${endMs}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${LOCATION_KEY}`, Version: "2021-07-28" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { events?: ApptRaw[] };
    // Kişi başına EN ERKEN booked randevu (ilk randevu).
    const first = new Map<string, GhlBooking>();
    for (const e of data.events || []) {
      const booked = e.dateAdded ? new Date(e.dateAdded).getTime() : NaN;
      if (!Number.isFinite(booked)) continue;
      if (booked < sinceMs || booked >= untilMs) continue; // BOOKED aralıkta mı
      const cid = e.contactId;
      if (!cid) continue;
      const prev = first.get(cid);
      if (!prev || booked < prev.bookedMs) {
        first.set(cid, { contactId: cid, bookedMs: booked, name: e.title || "" });
      }
    }
    return { count: first.size, appts: [...first.values()] };
  } catch {
    return null;
  }
}
