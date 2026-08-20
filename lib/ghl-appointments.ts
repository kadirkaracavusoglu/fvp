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
  appointmentStatus?: string;
};

/**
 * [sinceISO, untilISO] aralığında BOOKED olan (dateAdded'e göre) randevuları,
 * kişi başına tekilleştirerek say. GHL erişimi yoksa/patlarsa null döner
 * (panel eldeki tracking'e düşer).
 */
export async function getGhlBookedCount(
  sinceISO: string,
  untilISO?: string,
): Promise<number | null> {
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
    const contacts = new Set<string>();
    for (const e of data.events || []) {
      const booked = e.dateAdded ? new Date(e.dateAdded).getTime() : NaN;
      if (!Number.isFinite(booked)) continue;
      if (booked < sinceMs || booked >= untilMs) continue; // BOOKED aralıkta mı
      if (e.contactId) contacts.add(e.contactId);
    }
    return contacts.size;
  } catch {
    return null;
  }
}
