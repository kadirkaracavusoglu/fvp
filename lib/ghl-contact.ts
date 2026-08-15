// GHL (FitSistem location) contact upsert — VSL funnel lead'lerini doğrudan
// GHL API'ye yazar. Custom field'lar API ile önceden oluşturuldu; burada id ile
// doldurulur → GHL'de workflow field-mapping'ine GEREK YOK.
//
// ⚠️ Location API key gizlidir: yalnızca env'den (GHL_LOCATION_KEY). Repoya gömülmez.
// Env yoksa no-op döner (Supabase lead yine kaydedilir, veri kaybı olmaz).

import type { BasvuruCevaplar } from "@/lib/funnel";

const GHL_BASE = "https://services.leadconnectorhq.com";
const LOCATION_ID = process.env.GHL_LOCATION_ID || "ui4C7FNVHfgWeZk9DQpB";
const LOCATION_KEY = process.env.GHL_LOCATION_KEY || "";

export const ghlContactEnabled = Boolean(LOCATION_KEY);

// API ile oluşturulan custom field id'leri (2026-08-15). Anahtar = başvuru cevabı key'i.
const CF = {
  asama: "cPwEEzGet292lBqZigF3",
  is_modeli: "SPRmlYy9CyTbDkg4MxWE",
  gelir: "F3k78CwLQEqfKfRhhTYd",
  hedef_12_ay: "7pQZfbbAcBThz3XA0mDi",
  darbogazlar: "bnKKai4IcnqnabeX1T3m",
  engel_detay: "OYnZP1PZifyghIvO04T8",
  degismezse: "GV3OcJV1VY4U3FFioJC6",
  yatirim: "8mvT4oGV222YpPravkJJ",
  karar_hizi: "2EVdWsO70hSn64REpRYn",
  basari_kriteri: "2gcWUNsXsCRlQ3F5lvNt",
  businessName: "InZkDontk0sLgdfNjUTZ",
  websiteUrl: "FoAh461J3O2WdYbux17B",
  lead_score: "tuf3jN8JmEKkC3dHiLr4",
  lead_segment: "cWJdlMQpDxuQTnwF1Yz2",
  lead_reasons: "tMKItFOEws9KC0uMH1Ez",
  application_summary: "o4gDeIjvGg9522jGOdSO",
  utm_source: "QyCBbH571JSQe2SqJAUY",
  utm_campaign: "4EhovX1qRWW59XtoCY5C",
  utm_content: "Z3S3Lcz0eogkqd8ldztz",
  funnel_stage: "WtECgb4zZB3QV5h89nNF",
  instagram: "XcU7bUnQZIEVYpvafllT",
} as const;

type CustomField = { id: string; value: string | number };

function val(v: unknown): string {
  if (Array.isArray(v)) return v.filter(Boolean).join(", ");
  return typeof v === "string" ? v : v == null ? "" : String(v);
}

export type GhlUpsertInput = {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  tags?: string[];
  source?: string;
  funnelStage?: string;
  instagram?: string;
  businessName?: string;
  websiteUrl?: string;
  answers?: BasvuruCevaplar;
  lead?: { score?: number; segment?: string; reasons?: string[] };
  applicationSummary?: string;
  attribution?: Record<string, string> | null;
};

/** Contact'ı GHL'e upsert et (email/phone ile dedup). Field'ları id ile doldurur. */
export async function upsertGhlContact(input: GhlUpsertInput): Promise<{ ok: boolean; id?: string; skipped?: boolean }> {
  if (!LOCATION_KEY) return { ok: false, skipped: true };

  const cf: CustomField[] = [];
  const push = (id: string, v: unknown) => {
    const s = val(v);
    if (s !== "") cf.push({ id, value: s });
  };

  const a = input.answers || {};
  push(CF.asama, a.asama);
  push(CF.is_modeli, a.is_modeli);
  push(CF.gelir, a.gelir);
  push(CF.hedef_12_ay, a.hedef_12_ay);
  push(CF.darbogazlar, a.darbogazlar);
  push(CF.engel_detay, a.engel_detay);
  push(CF.degismezse, a.degismezse);
  push(CF.yatirim, a.yatirim);
  push(CF.karar_hizi, a.karar_hizi);
  push(CF.basari_kriteri, a.basari_kriteri);
  push(CF.businessName, input.businessName);
  push(CF.websiteUrl, input.websiteUrl);
  push(CF.instagram, input.instagram);
  if (typeof input.lead?.score === "number") cf.push({ id: CF.lead_score, value: input.lead.score });
  push(CF.lead_segment, input.lead?.segment);
  push(CF.lead_reasons, input.lead?.reasons);
  push(CF.application_summary, input.applicationSummary);
  push(CF.funnel_stage, input.funnelStage);
  const attr = input.attribution || {};
  push(CF.utm_source, attr.utm_source);
  push(CF.utm_campaign, attr.utm_campaign);
  push(CF.utm_content, attr.utm_content);

  const body = {
    locationId: LOCATION_ID,
    firstName: input.firstName || "",
    lastName: input.lastName || "",
    email: input.email,
    phone: input.phone || "",
    source: input.source || "VSL funnel",
    tags: input.tags || [],
    customFields: cf,
  };

  try {
    const res = await fetch(`${GHL_BASE}/contacts/upsert`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOCATION_KEY}`,
        Version: "2021-07-28",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      console.error("ghl upsert failed:", res.status, (await res.text()).slice(0, 200));
      return { ok: false };
    }
    const data = (await res.json()) as { contact?: { id?: string } };
    return { ok: true, id: data.contact?.id };
  } catch (e) {
    console.error("ghl upsert error:", e instanceof Error ? e.message : e);
    return { ok: false };
  }
}
