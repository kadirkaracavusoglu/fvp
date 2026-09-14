// MACFit salon funnel'ı → GHL. Kişiyi "MACFit Salon Funnel" klasöründeki
// custom field'larla birlikte doğrudan yazar (upsert) ve workflow'u tetiklemek
// için inbound webhook'a gönderir.
//
// Bu dosya BİLEREK dışa bağımlılıksız (import yok): hem Next API route'u hem de
// geçmiş lead'leri aktaran `scripts/macfit-ghl-backfill.mjs` (Node) aynı kodu
// kullansın. Node "@/..." takma adlarını çözemez.
//
// ⚠️ GHL_LOCATION_KEY gizli: yalnız env'den. Yoksa upsert atlanır (lead Supabase'de kalır).

const GHL_BASE = "https://services.leadconnectorhq.com";

// "MACFit Salon Funnel" klasörü (Op6O5tc6FZT0EcD19xyW) — API ile açıldı 14 Eyl 2026.
// Açılır listelerin seçenekleri lib/macfit-funnel.ts MACFIT_QUESTIONS ile BİREBİR
// aynı; formdaki bir seçenek değişirse GHL'deki liste de güncellenmeli, yoksa
// değer GHL'e düşmez.
export const MACFIT_CF = {
  macfit_aktif_uye: "KqF3GMHmyyrB78KRpUbx",
  macfit_kapasite: "3w0VsPCOzcZHFXZy967U",
  macfit_reklam_durumu: "k0HkLxctKdfA1Fv5VNrz",
  macfit_sorun: "0pPpGBwkPPcUUIggj3ag",
  macfit_sorun_detay: "uD6gEfQFzZM4RLltzBGt",
  macfit_hedef: "gdNCnurq0hnmcPQDWth4",
  macfit_hedef_detay: "zyzYAB0EAAG0XPd31NRL",
  macfit_salon_instagram: "YO1FukdwHo6SlCokwkQp",
  macfit_form_tarihi: "hVnPi1CXn96cnEA5bGqZ",
  macfit_trafik_kaynagi: "r6bxatbatd0Y8HaGpA3d",
  macfit_kampanya: "ZqaLWiQ3ALOXKF0U6Tde",
  macfit_kreatif: "84kTMY7pJ4qsLJG71I4P",
  macfit_adset: "augsWs27wAEbaJbc5T5z",
} as const;

// Genel Instagram alanı (tüm funnel'larda ortak) — satışçı her yerde aynı alana bakar.
const CF_INSTAGRAM = "XcU7bUnQZIEVYpvafllT";

export const MACFIT_GHL_TAG = "macfit-optin";

// "Sales Pipeline - Gym" (Kadir açtı, 14 Eyl 2026). Salon lead'i "Yeni Başvuru"da açılır;
// sonraki aşamalara geçişi GHL tarafı (workflow / Kadir) yönetir.
export const MACFIT_PIPELINE_ID = "Zzju7aBAkLYvGg7avO91";
export const MACFIT_STAGE = {
  yeniBasvuru: "a822deba-3b4d-4083-8300-f46fe3d9b150",
  randevuAldi: "b540c9c3-c16e-4c0d-b71f-7efae0b7d4c0",
} as const;
// Salon lead'leri (kişi + fırsat) doğrudan Kadir'e atanır (GHL'deki tek kullanıcı).
export const MACFIT_OWNER_USER_ID = "UcQPGqAeU1OXIaZuxe8l";

// GHL workflow'undaki "Inbound Webhook" tetikleyicisinin adresi. Workflow kurulunca
// buraya (veya Vercel env GHL_MACFIT_WEBHOOK) yazılır; boşken webhook adımı ATLANIR
// ama kişi yine alanlarıyla + etiketle GHL'e yazılır (veri kaybı yok).
export const MACFIT_GHL_WEBHOOK = "";

export type MacfitGhlLead = {
  leadId?: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  instagram: string;
  answers: Record<string, string>;
  attribution?: Record<string, unknown> | null;
  createdAt?: string; // ISO; yoksa şimdi
};

export type MacfitGhlStep = { ok: boolean; skipped?: boolean; id?: string; status?: number; error?: string };

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

/** İlk dokunuşu çöz: first_utm_* → first_landing_url query → son dokunuş utm_*.
 *  (Reklamdan gelip sonra bio'dan dönen kişi reklama yazılsın.) */
export function macfitFirstTouch(attr?: Record<string, unknown> | null) {
  const a = attr || {};
  const fromUrl: Record<string, string> = {};
  try {
    const q = new URL(str(a.first_landing_url)).searchParams;
    for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
      const v = q.get(k);
      if (v) fromUrl[k] = v;
    }
  } catch {}
  const pick = (k: string) => str(a[`first_${k}`]) || fromUrl[k] || str(a[k]);
  const medium = pick("utm_medium");
  const source = pick("utm_source");
  return {
    trafik: [medium || (source ? "" : "organik/direkt"), source].filter(Boolean).join(" · "),
    kampanya: pick("utm_campaign"),
    kreatif: pick("utm_content"),
    adset: pick("utm_term"),
  };
}

function istanbulDate(iso?: string): string {
  const d = iso ? new Date(iso) : new Date();
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Istanbul" }).format(d); // YYYY-MM-DD
}

/** GHL custom field değerleri — anahtar = alan anahtarı (webhook payload'ında da aynı anahtarlar). */
export function macfitFieldValues(lead: MacfitGhlLead): Record<keyof typeof MACFIT_CF, string> {
  const t = macfitFirstTouch(lead.attribution);
  const a = lead.answers || {};
  return {
    macfit_aktif_uye: str(a.activeMembers),
    macfit_kapasite: str(a.capacity),
    macfit_reklam_durumu: str(a.advertising),
    macfit_sorun: str(a.problem),
    macfit_sorun_detay: str(a.problemOther),
    macfit_hedef: str(a.goal),
    macfit_hedef_detay: str(a.goalOther),
    macfit_salon_instagram: str(lead.instagram),
    macfit_form_tarihi: istanbulDate(lead.createdAt),
    macfit_trafik_kaynagi: t.trafik,
    macfit_kampanya: t.kampanya,
    macfit_kreatif: t.kreatif,
    macfit_adset: t.adset,
  };
}

export async function upsertMacfitContact(
  lead: MacfitGhlLead,
  opts: { locationKey?: string; locationId?: string } = {},
): Promise<MacfitGhlStep> {
  const key = opts.locationKey ?? process.env.GHL_LOCATION_KEY ?? "";
  const locationId = opts.locationId ?? process.env.GHL_LOCATION_ID ?? "ui4C7FNVHfgWeZk9DQpB";
  if (!key) return { ok: false, skipped: true, error: "GHL_LOCATION_KEY yok" };

  const values = macfitFieldValues(lead);
  const customFields: { id: string; value: string }[] = (Object.keys(MACFIT_CF) as (keyof typeof MACFIT_CF)[])
    .filter((k) => values[k] !== "")
    .map((k) => ({ id: MACFIT_CF[k], value: values[k] }));
  if (lead.instagram) customFields.push({ id: CF_INSTAGRAM, value: lead.instagram });

  try {
    const res = await fetch(`${GHL_BASE}/contacts/upsert`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        Version: "2021-07-28",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        locationId,
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead.phone,
        source: "MACFit Salon Funnel",
        assignedTo: MACFIT_OWNER_USER_ID,
        tags: [MACFIT_GHL_TAG],
        customFields,
      }),
    });
    if (!res.ok) return { ok: false, status: res.status, error: (await res.text()).slice(0, 300) };
    const data = (await res.json()) as { contact?: { id?: string } };
    return { ok: true, status: res.status, id: data.contact?.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

/**
 * "Sales Pipeline - Gym"de kişinin AÇIK fırsatı yoksa oluşturur (Kadir'e atanmış).
 * Mükerrer açmaz: aynı kişi formu ikinci kez doldurursa mevcut fırsat kullanılır.
 */
export async function ensureMacfitOpportunity(
  input: { contactId: string; name: string; stageId?: string },
  opts: { locationKey?: string; locationId?: string } = {},
): Promise<MacfitGhlStep & { existed?: boolean }> {
  const key = opts.locationKey ?? process.env.GHL_LOCATION_KEY ?? "";
  const locationId = opts.locationId ?? process.env.GHL_LOCATION_ID ?? "ui4C7FNVHfgWeZk9DQpB";
  if (!key) return { ok: false, skipped: true, error: "GHL_LOCATION_KEY yok" };
  const headers = {
    Authorization: `Bearer ${key}`,
    Version: "2021-07-28",
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  try {
    const search = await fetch(
      `${GHL_BASE}/opportunities/search?location_id=${locationId}` +
        `&contact_id=${encodeURIComponent(input.contactId)}` +
        `&pipeline_id=${MACFIT_PIPELINE_ID}&status=open`,
      { headers },
    );
    if (search.ok) {
      const data = (await search.json()) as { opportunities?: Array<{ id?: string }> };
      const existing = data.opportunities?.[0]?.id;
      if (existing) return { ok: true, id: existing, existed: true };
    }
    const res = await fetch(`${GHL_BASE}/opportunities/`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        pipelineId: MACFIT_PIPELINE_ID,
        pipelineStageId: input.stageId || MACFIT_STAGE.yeniBasvuru,
        locationId,
        name: input.name,
        status: "open",
        contactId: input.contactId,
        assignedTo: MACFIT_OWNER_USER_ID,
        source: "MACFit Salon Funnel",
      }),
    });
    if (!res.ok) return { ok: false, status: res.status, error: (await res.text()).slice(0, 300) };
    const data = (await res.json()) as { opportunity?: { id?: string } };
    return { ok: true, status: res.status, id: data.opportunity?.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

/** Workflow'un "Inbound Webhook" tetikleyicisine gönderilen düz payload.
 *  Alan anahtarları custom field anahtarlarıyla aynı → GHL'de eşleme kolay. */
export function macfitWebhookPayload(lead: MacfitGhlLead, contactId?: string) {
  return {
    funnel: "fitsistem_macfit_vaka",
    lead_id: lead.leadId || "",
    contact_id: contactId || "",
    first_name: lead.firstName,
    last_name: lead.lastName,
    full_name: `${lead.firstName} ${lead.lastName}`.trim(),
    email: lead.email,
    phone: lead.phone,
    instagram: lead.instagram,
    tag: MACFIT_GHL_TAG,
    ...macfitFieldValues(lead),
  };
}

export async function postMacfitWebhook(url: string, lead: MacfitGhlLead, contactId?: string): Promise<MacfitGhlStep> {
  if (!url) return { ok: false, skipped: true, error: "webhook adresi tanımlı değil" };
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(macfitWebhookPayload(lead, contactId)),
    });
    if (!res.ok) return { ok: false, status: res.status, error: (await res.text()).slice(0, 300) };
    return { ok: true, status: res.status };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
