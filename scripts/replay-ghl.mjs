import { existsSync, readFileSync } from "node:fs";

const DEFAULT_LOCATION_ID = "ui4C7FNVHfgWeZk9DQpB";
const DEFAULT_VSL_WEBHOOK =
  "https://services.leadconnectorhq.com/hooks/ui4C7FNVHfgWeZk9DQpB/webhook-trigger/8d9d82de-d562-4c8c-ba39-49e224b4ebcd";
const GHL_BASE = "https://services.leadconnectorhq.com";
const SALES_PIPELINE_ID = "U97w7H09T0DqU58ZyKT7";
const STAGE_YENI_BASVURU = "2146119b-0b73-439f-9c2a-ff47b4fc09cd";

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
};

function loadEnv(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)\s*$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
  }
}

loadEnv(".env.local");
loadEnv(".env");

const limit = Number(process.env.REPLAY_LIMIT || process.argv.find((arg) => /^\d+$/.test(arg)) || 25);
const dryRun = process.argv.includes("--dry");
const includeUnknown = process.argv.includes("--include-unknown");
const forceAll = process.argv.includes("--force-all");
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const locationId = process.env.GHL_LOCATION_ID || DEFAULT_LOCATION_ID;
const locationKey = process.env.GHL_LOCATION_KEY || "";
const webhookUrl = process.env.GHL_VSL_WEBHOOK || process.env.GHL_WEBHOOK_URL || DEFAULT_VSL_WEBHOOK;

if (!supabaseUrl || !serviceKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY gerekli.");
}

const supabaseHeaders = {
  apikey: serviceKey,
  Authorization: `Bearer ${serviceKey}`,
  "Content-Type": "application/json",
  Accept: "application/json",
};
console.log(
  `Replay kontrolü: limit=${limit} dryRun=${dryRun ? "yes" : "no"} includeUnknown=${includeUnknown ? "yes" : "no"} forceAll=${forceAll ? "yes" : "no"}`,
);

function val(v) {
  if (Array.isArray(v)) return v.filter(Boolean).join(", ");
  return typeof v === "string" ? v : v == null ? "" : String(v);
}

function pushCustom(fields, id, value) {
  const text = val(value);
  if (text !== "") fields.push({ id, value: text });
}

function attrPayload(attr = {}) {
  const str = (value) => (typeof value === "string" ? value.trim() : "");
  const utmSource = str(attr.utm_source);
  const source =
    utmSource ||
    (str(attr.fbclid) ? "meta" : "") ||
    (str(attr.ttclid) ? "tiktok" : "") ||
    (str(attr.gclid) || str(attr.gbraid) || str(attr.wbraid) ? "google" : "") ||
    (str(attr.msclkid) ? "bing" : "") ||
    "direct";
  return {
    attributionSource: source,
    utmSource,
    utmMedium: str(attr.utm_medium),
    utmCampaign: str(attr.utm_campaign),
    utmTerm: str(attr.utm_term),
    utmContent: str(attr.utm_content),
    utmId: str(attr.utm_id),
    gaClientId: str(attr.ga_client_id),
    landingUrl: str(attr.landing_url),
    firstLandingUrl: str(attr.first_landing_url),
    utm_source: utmSource,
    utm_medium: str(attr.utm_medium),
    utm_campaign: str(attr.utm_campaign),
    utm_term: str(attr.utm_term),
    utm_content: str(attr.utm_content),
    utm_id: str(attr.utm_id),
    gclid: str(attr.gclid),
    gbraid: str(attr.gbraid),
    wbraid: str(attr.wbraid),
    fbclid: str(attr.fbclid),
    ttclid: str(attr.ttclid),
    msclkid: str(attr.msclkid),
    ga_client_id: str(attr.ga_client_id),
    fbp: str(attr.fbp),
    fbc: str(attr.fbc),
    landingPath: str(attr.landing_path),
    landing_url: str(attr.landing_url),
    page_url: str(attr.page_url) || str(attr.landing_url),
    firstLandingPath: str(attr.first_landing_path),
    first_landing_url: str(attr.first_landing_url),
    firstSeen: str(attr.first_seen),
    lastSeen: str(attr.last_seen),
    referrer: str(attr.referrer),
  };
}

function answerSummary(answers = {}) {
  return Object.entries(answers)
    .filter(([key]) => !key.startsWith("_"))
    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
    .join("\n");
}

async function shortText(res) {
  try {
    return (await res.text()).slice(0, 200);
  } catch {
    return "";
  }
}

async function fetchWithTimeout(url, options, ms = 20000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function upsertContact(row) {
  if (!locationKey) return { ok: false, skipped: true };
  const answers = row.cevaplar || {};
  const attr = row.attribution || {};
  const isApplication = row.form_type === "vsl_basvuru";
  const customFields = [];
  for (const key of [
    "asama",
    "is_modeli",
    "gelir",
    "hedef_12_ay",
    "darbogazlar",
    "engel_detay",
    "degismezse",
    "yatirim",
    "karar_hizi",
    "basari_kriteri",
    "businessName",
    "websiteUrl",
    "instagram",
  ]) {
    pushCustom(customFields, CF[key], answers[key]);
  }
  pushCustom(customFields, CF.lead_score, answers._lead_score);
  pushCustom(customFields, CF.lead_segment, answers._lead_segment);
  pushCustom(customFields, CF.lead_reasons, answers._lead_reasons);
  pushCustom(customFields, CF.application_summary, isApplication ? answerSummary(answers) : "");
  pushCustom(customFields, CF.funnel_stage, isApplication ? "application_submitted" : "video_unlocked");
  pushCustom(customFields, CF.utm_source, attr.utm_source);
  pushCustom(customFields, CF.utm_campaign, attr.utm_campaign);
  pushCustom(customFields, CF.utm_content, attr.utm_content);

  const res = await fetchWithTimeout(`${GHL_BASE}/contacts/upsert`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${locationKey}`,
      Version: "2021-07-28",
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      locationId,
      firstName: row.first_name || "",
      lastName: row.last_name || "",
      email: row.email,
      phone: row.phone || "",
      source: isApplication ? "VSL başvuru (/fitsistem/basvuru)" : "VSL opt-in (/fitsistem)",
      tags: [isApplication ? "vsl-basvuru" : "vsl-optin"],
      customFields,
    }),
  });
  if (!res.ok) return { ok: false, status: res.status, error: await shortText(res) };
  const data = await res.json();
  return { ok: true, status: res.status, id: data.contact?.id };
}

async function ensureOpportunity(contactId, name) {
  if (!locationKey || !contactId) return { ok: false, skipped: true };
  const headers = {
    Authorization: `Bearer ${locationKey}`,
    Version: "2021-07-28",
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const searchUrl =
    `${GHL_BASE}/opportunities/search?location_id=${locationId}` +
    `&contact_id=${encodeURIComponent(contactId)}` +
    `&pipeline_id=${SALES_PIPELINE_ID}&status=open`;
  const existing = await fetchWithTimeout(searchUrl, { headers });
  if (existing.ok) {
    const data = await existing.json();
    if (data.opportunities?.[0]?.id) return { ok: true, status: existing.status, id: data.opportunities[0].id };
  }
  const res = await fetchWithTimeout(`${GHL_BASE}/opportunities/`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      pipelineId: SALES_PIPELINE_ID,
      pipelineStageId: STAGE_YENI_BASVURU,
      locationId,
      name,
      status: "open",
      contactId,
    }),
  });
  if (!res.ok) return { ok: false, status: res.status, error: await shortText(res) };
  const data = await res.json();
  return { ok: true, status: res.status, id: data.opportunity?.id };
}

async function postWebhook(row) {
  const answers = row.cevaplar || {};
  const attr = row.attribution || {};
  const isApplication = row.form_type === "vsl_basvuru";
  const summary = answerSummary(answers);
  const pageUrl = isApplication
    ? "https://fitnessvepazarlama.com/fitsistem/basvuru"
    : "https://fitnessvepazarlama.com/fitsistem";
  const body = {
    ...(isApplication ? answers : {}),
    firstName: row.first_name || "",
    lastName: row.last_name || "",
    first_name: row.first_name || "",
    last_name: row.last_name || "",
    name: `${row.first_name || ""} ${row.last_name || ""}`.trim(),
    email: row.email,
    phone: row.phone || "",
    source: isApplication ? "VSL başvuru (/fitsistem/basvuru)" : "VSL opt-in (/fitsistem)",
    formType: row.form_type,
    leadStage: isApplication ? "application_submitted" : "video_unlocked",
    funnel: "fvp_vsl",
    pageUrl,
    ...(isApplication
      ? {
          applicationSummary: summary,
          problem: summary,
          leadScore: answers._lead_score,
          leadSegment: answers._lead_segment,
          leadReasons: Array.isArray(answers._lead_reasons)
            ? answers._lead_reasons.join(", ")
            : val(answers._lead_reasons),
        }
      : {}),
    ...attrPayload(attr),
    ...attr,
  };
  const res = await fetchWithTimeout(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) return { ok: false, status: res.status, error: await shortText(res) };
  return { ok: true, status: res.status };
}

function summarize(steps) {
  const failures = steps
    .filter((step) => !step.result.ok && !step.result.skipped)
    .map((step) => `${step.label}: ${step.result.status || "error"} ${step.result.error || ""}`.trim());
  const status =
    steps.find((step) => !step.result.ok && !step.result.skipped && step.result.status)?.result.status ||
    [...steps].reverse().find((step) => step.result.status)?.result.status ||
    null;
  return { ok: failures.length === 0, status, error: failures.length ? failures.join(" | ").slice(0, 1000) : null };
}

const listUrl = new URL("/rest/v1/leads", supabaseUrl);
listUrl.searchParams.set(
  "select",
  "id,first_name,last_name,email,phone,form_type,cevaplar,attribution,ghl_attempt_count,created_at",
);
if (forceAll) {
  console.log("Force mode: ghl_ok durumuna bakmadan optin/basvuru kayıtları seçilecek.");
} else if (includeUnknown) {
  listUrl.searchParams.set("or", "(ghl_ok.eq.false,ghl_ok.is.null)");
} else {
  listUrl.searchParams.set("ghl_ok", "eq.false");
}
listUrl.searchParams.set("form_type", "in.(vsl_optin,vsl_basvuru)");
listUrl.searchParams.set("order", "created_at.asc");
listUrl.searchParams.set("limit", String(limit));
const listRes = await fetchWithTimeout(listUrl, { headers: supabaseHeaders }, 15000);
if (!listRes.ok) throw new Error(`Supabase list failed: ${listRes.status} ${await shortText(listRes)}`);
const rows = await listRes.json();

console.log(`Replay adayları: ${rows.length}${dryRun ? " (dry-run)" : ""}`);

let ok = 0;
let failed = 0;
for (const row of rows) {
  if (dryRun) {
    console.log(`DRY ${row.id} form=${row.form_type} attempts=${Number(row.ghl_attempt_count || 0)}`);
    continue;
  }

  const contact = await upsertContact(row);
  const opportunity =
    row.form_type === "vsl_basvuru" && contact.ok
      ? await ensureOpportunity(contact.id, `${row.first_name || ""} ${row.last_name || ""}`.trim() || row.email)
      : { ok: false, skipped: true };
  const webhook = await postWebhook(row);
  const delivery = summarize([
    { label: "contact_upsert", result: contact },
    { label: "opportunity", result: opportunity },
    { label: "vsl_webhook", result: webhook },
  ]);

  const updateUrl = new URL("/rest/v1/leads", supabaseUrl);
  updateUrl.searchParams.set("id", `eq.${row.id}`);
  const updateRes = await fetchWithTimeout(updateUrl, {
    method: "PATCH",
    headers: { ...supabaseHeaders, Prefer: "return=minimal" },
    body: JSON.stringify({
      ghl_ok: delivery.ok,
      ghl_last_status: delivery.status,
      ghl_error: delivery.error,
      ghl_attempted_at: new Date().toISOString(),
      ghl_attempt_count: Number(row.ghl_attempt_count || 0) + 1,
    }),
  });
  if (!updateRes.ok) throw new Error(`Supabase update failed: ${updateRes.status} ${await shortText(updateRes)}`);

  if (delivery.ok) ok += 1;
  else failed += 1;
  console.log(`${delivery.ok ? "OK" : "FAIL"} ${row.id} status=${delivery.status || "-"} attempts=${Number(row.ghl_attempt_count || 0) + 1}`);
}

console.log(`Bitti. OK=${ok} FAIL=${failed}`);
