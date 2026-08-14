import { supabaseAdmin } from "@/lib/supabase";

export type PanelRange = "today" | "yesterday" | "week" | "month" | "launch";

type EventRow = {
  name: string;
  path: string | null;
  session_id: string | null;
  attribution: Record<string, string> | null;
  meta: Record<string, unknown> | null;
  created_at: string;
};

type LeadRow = {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  form_type: string | null;
  cevaplar: Record<string, unknown> | null;
  attribution: Record<string, string> | null;
  created_at: string;
};

export type FunnelStep = {
  key: string;
  label: string;
  count: number;
  pct: number | null;
  pctPrev?: number | null;
};

export type ChannelRow = {
  key: string;
  label: string;
  visits: number;
  optins: number;
  applications: number;
  booked: number;
};

export type RecentLead = {
  name: string;
  email: string;
  phone: string;
  instagram: string;
  formType: string;
  channel: string;
  createdAt: string;
};

export type VslPanelData = {
  ok: boolean;
  error?: string;
  generatedAt: string;
  range: PanelRange;
  startDate: string;
  endDate: string;
  kpi: {
    visits: number;
    popupOpens: number;
    optins: number;
    plays: number;
    watch5m: number;
    applications: number;
    calendarViews: number;
    booked: number;
    optinRate: number | null;
    applicationRate: number | null;
    bookedRate: number | null;
  };
  funnel: FunnelStep[];
  form: FunnelStep[];
  video: FunnelStep[];
  channels: ChannelRow[];
  recentLeads: RecentLead[];
  trackingHealth: { label: string; value: string; state: "ok" | "warn" }[];
};

const LAUNCH_DATE = "2026-08-14";
const PAGE_SIZE = 1000;

function trToday(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function addDays(date: string, days: number): string {
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days, 12, 0, 0));
  return dt.toISOString().slice(0, 10);
}

function startIso(date: string): string {
  return new Date(`${date}T00:00:00+03:00`).toISOString();
}

function resolveRange(range: PanelRange) {
  const today = trToday();
  if (range === "today") {
    return { startDate: today, endDate: today, since: startIso(today), until: startIso(addDays(today, 1)) };
  }
  if (range === "yesterday") {
    const y = addDays(today, -1);
    return { startDate: y, endDate: y, since: startIso(y), until: startIso(today) };
  }
  if (range === "month") {
    const s = addDays(today, -29);
    return { startDate: s, endDate: today, since: startIso(s), until: startIso(addDays(today, 1)) };
  }
  if (range === "launch") {
    return { startDate: LAUNCH_DATE, endDate: today, since: startIso(LAUNCH_DATE), until: startIso(addDays(today, 1)) };
  }
  const s = addDays(today, -6);
  return { startDate: s, endDate: today, since: startIso(s), until: startIso(addDays(today, 1)) };
}

async function fetchAll<T extends object>(
  table: "events" | "leads",
  select: string,
  since: string,
  until: string
): Promise<T[]> {
  if (!supabaseAdmin) return [];
  const all: T[] = [];
  for (let from = 0; from < 200000; from += PAGE_SIZE) {
    const { data, error } = await supabaseAdmin
      .from(table)
      .select(select)
      .gte("created_at", since)
      .lt("created_at", until)
      .order("created_at", { ascending: true })
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw new Error(`${table}: ${error.message}`);
    if (!data?.length) break;
    all.push(...(data as T[]));
    if (data.length < PAGE_SIZE) break;
  }
  return all;
}

function uniqueBy(rows: EventRow[], name: string): number {
  const sessions = new Set<string>();
  let anonymous = 0;
  for (const row of rows) {
    if (row.name !== name) continue;
    if (row.session_id) sessions.add(row.session_id);
    else anonymous++;
  }
  return sessions.size + anonymous;
}

function uniqueAny(rows: EventRow[], names: string[]): number {
  const sessions = new Set<string>();
  let anonymous = 0;
  const wanted = new Set(names);
  for (const row of rows) {
    if (!wanted.has(row.name)) continue;
    if (row.session_id) sessions.add(row.session_id);
    else anonymous++;
  }
  return sessions.size + anonymous;
}

function uniqueLeadCount(rows: LeadRow[], formType: string): number {
  const emails = new Set<string>();
  let anonymous = 0;
  for (const row of rows) {
    if (row.form_type !== formType) continue;
    const email = (row.email || "").toLowerCase().trim();
    if (email) emails.add(email);
    else anonymous++;
  }
  return emails.size + anonymous;
}

function pct(part: number, whole: number): number | null {
  if (!whole) return null;
  return Math.round((part / whole) * 1000) / 10;
}

function channelKey(attr?: Record<string, string> | null): string {
  const source = (attr?.utm_source || "").toLowerCase();
  const medium = (attr?.utm_medium || "").toLowerCase();
  if (attr?.fbclid || /meta|facebook|fb|instagram|ig/.test(source)) return "meta";
  if (attr?.gclid || /google|youtube|yt/.test(source)) return "google";
  if (/tiktok|tt/.test(source)) return "tiktok";
  if (/email|beehiiv|bulten|newsletter/.test(source) || /email/.test(medium)) return "email";
  if (/instagram|ig/.test(source)) return "instagram";
  return "organik";
}

const CHANNEL_LABELS: Record<string, string> = {
  meta: "Meta / IG",
  google: "Google / YouTube",
  tiktok: "TikTok",
  email: "E-posta",
  instagram: "Instagram organik",
  organik: "Organik / direkt",
};

function bump(map: Map<string, ChannelRow>, key: string, field: keyof Pick<ChannelRow, "visits" | "optins" | "applications" | "booked">) {
  const row = map.get(key) || {
    key,
    label: CHANNEL_LABELS[key] || key,
    visits: 0,
    optins: 0,
    applications: 0,
    booked: 0,
  };
  row[field] += 1;
  map.set(key, row);
}

function leadName(row: LeadRow): string {
  return `${row.first_name || ""} ${row.last_name || ""}`.trim() || "—";
}

function instagram(row: LeadRow): string {
  const val = row.cevaplar?.instagram;
  return typeof val === "string" ? val : "";
}

function formLabel(type?: string | null): string {
  if (type === "vsl_basvuru") return "Başvuru";
  if (type === "vsl_randevu") return "Randevu";
  return "Opt-in";
}

export async function getVslPanelData(range: PanelRange): Promise<VslPanelData> {
  const r = resolveRange(range);
  const base: VslPanelData = {
    ok: false,
    generatedAt: new Date().toISOString(),
    range,
    startDate: r.startDate,
    endDate: r.endDate,
    kpi: {
      visits: 0,
      popupOpens: 0,
      optins: 0,
      plays: 0,
      watch5m: 0,
      applications: 0,
      calendarViews: 0,
      booked: 0,
      optinRate: null,
      applicationRate: null,
      bookedRate: null,
    },
    funnel: [],
    form: [],
    video: [],
    channels: [],
    recentLeads: [],
    trackingHealth: [],
  };

  if (!supabaseAdmin) return { ...base, error: "Supabase env tanımlı değil." };

  try {
    const [events, leads] = await Promise.all([
      fetchAll<EventRow>("events", "name,path,session_id,attribution,meta,created_at", r.since, r.until),
      fetchAll<LeadRow>("leads", "first_name,last_name,email,phone,form_type,cevaplar,attribution,created_at", r.since, r.until),
    ]);

    const visits = uniqueBy(events, "vsl_optin_view");
    const popupOpens = uniqueBy(events, "vsl_optin_cta_click");
    const plays = uniqueBy(events, "vsl_play");
    const unmute = uniqueBy(events, "vsl_unmute");
    const watch1m = uniqueAny(events, ["vsl_min1", "vsl_sn60"]);
    const watch3m = uniqueAny(events, ["vsl_min3"]);
    const watch5m = uniqueAny(events, ["vsl_min5", "vsl_sn300"]);
    const watch10m = uniqueAny(events, ["vsl_min10", "vsl_sn600"]);
    const watch15m = uniqueAny(events, ["vsl_min15", "vsl_sn900"]);
    const watch50 = uniqueBy(events, "vsl_50");
    const cta = uniqueBy(events, "cta_click");
    const formStart = uniqueBy(events, "vsl_basvuru_start");
    const formS1 = uniqueBy(events, "vsl_basvuru_s1");
    const formS4 = uniqueBy(events, "vsl_basvuru_s4");
    const formS8 = uniqueBy(events, "vsl_basvuru_s8");
    const formSubmitEvent = uniqueBy(events, "vsl_basvuru_submit");
    const calendarViews = uniqueBy(events, "vsl_calendar_view");
    const calendarLoaded = uniqueBy(events, "vsl_calendar_loaded");
    const bookedEvent = uniqueBy(events, "vsl_calendar_booked");

    const optins = uniqueLeadCount(leads, "vsl_optin");
    const applications = uniqueLeadCount(leads, "vsl_basvuru");
    const booked = uniqueLeadCount(leads, "vsl_randevu") || bookedEvent;

    const funnel: FunnelStep[] = [
      { key: "visit", label: "VSL sayfasını gördü", count: visits, pct: 100 },
      { key: "popup", label: "Video kilidini açmak istedi", count: popupOpens, pct: pct(popupOpens, visits), pctPrev: pct(popupOpens, visits) },
      { key: "optin", label: "Opt-in bıraktı", count: optins, pct: pct(optins, visits), pctPrev: pct(optins, popupOpens) },
      { key: "play", label: "Videoyu oynattı", count: plays, pct: pct(plays, visits), pctPrev: pct(plays, optins) },
      { key: "watch5", label: "5 dakika izledi", count: watch5m, pct: pct(watch5m, visits), pctPrev: pct(watch5m, plays) },
      { key: "cta", label: "Başvuru CTA tıkladı", count: cta, pct: pct(cta, visits), pctPrev: pct(cta, watch5m) },
      { key: "apply", label: "Başvuruyu tamamladı", count: applications, pct: pct(applications, visits), pctPrev: pct(applications, cta || formStart) },
      { key: "calendar", label: "Takvimi gördü", count: calendarViews, pct: pct(calendarViews, visits), pctPrev: pct(calendarViews, applications) },
      { key: "booked", label: "Randevu aldı", count: booked, pct: pct(booked, visits), pctPrev: pct(booked, calendarViews) },
    ];

    const form: FunnelStep[] = [
      { key: "start", label: "Forma girdi", count: formStart, pct: 100 },
      { key: "s1", label: "İlk soruyu gördü", count: formS1, pct: pct(formS1, formStart), pctPrev: pct(formS1, formStart) },
      { key: "s4", label: "Engel sorusuna geldi", count: formS4, pct: pct(formS4, formStart), pctPrev: pct(formS4, formS1) },
      { key: "contact", label: "İletişim ekranına geldi", count: formS8, pct: pct(formS8, formStart), pctPrev: pct(formS8, formS4) },
      { key: "submit", label: "Başvuruyu gönderdi", count: applications || formSubmitEvent, pct: pct(applications || formSubmitEvent, formStart), pctPrev: pct(applications || formSubmitEvent, formS8) },
    ];

    const video: FunnelStep[] = [
      { key: "play", label: "Oynattı", count: plays, pct: pct(plays, optins || visits) },
      { key: "unmute", label: "Sesi açtı", count: unmute, pct: pct(unmute, plays), pctPrev: pct(unmute, plays) },
      { key: "min1", label: "1 dakika", count: watch1m, pct: pct(watch1m, plays), pctPrev: pct(watch1m, unmute || plays) },
      { key: "min3", label: "3 dakika", count: watch3m, pct: pct(watch3m, plays), pctPrev: pct(watch3m, watch1m) },
      { key: "min5", label: "5 dakika", count: watch5m, pct: pct(watch5m, plays), pctPrev: pct(watch5m, watch3m) },
      { key: "min10", label: "10 dakika", count: watch10m, pct: pct(watch10m, plays), pctPrev: pct(watch10m, watch5m) },
      { key: "min15", label: "15 dakika", count: watch15m, pct: pct(watch15m, plays), pctPrev: pct(watch15m, watch10m) },
      { key: "half", label: "%50", count: watch50, pct: pct(watch50, plays), pctPrev: pct(watch50, watch5m) },
    ];

    const channelMap = new Map<string, ChannelRow>();
    const seenVisits = new Set<string>();
    for (const event of events) {
      if (event.name !== "vsl_optin_view") continue;
      const id = event.session_id || `${event.created_at}-${event.path}`;
      if (seenVisits.has(id)) continue;
      seenVisits.add(id);
      bump(channelMap, channelKey(event.attribution), "visits");
    }
    const seenLead = new Set<string>();
    for (const lead of leads) {
      const type = lead.form_type || "";
      if (!["vsl_optin", "vsl_basvuru", "vsl_randevu"].includes(type)) continue;
      const email = (lead.email || "").toLowerCase().trim();
      const id = `${type}:${email || lead.created_at}`;
      if (seenLead.has(id)) continue;
      seenLead.add(id);
      const key = channelKey(lead.attribution);
      if (type === "vsl_optin") bump(channelMap, key, "optins");
      if (type === "vsl_basvuru") bump(channelMap, key, "applications");
      if (type === "vsl_randevu") bump(channelMap, key, "booked");
    }

    const recentLeads = leads
      .filter((l) => l.form_type === "vsl_basvuru" || l.form_type === "vsl_randevu")
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, 20)
      .map((l) => ({
        name: leadName(l),
        email: l.email || "",
        phone: l.phone || "",
        instagram: instagram(l),
        formType: formLabel(l.form_type),
        channel: CHANNEL_LABELS[channelKey(l.attribution)] || channelKey(l.attribution),
        createdAt: l.created_at,
      }));

    const trackingHealth = [
      { label: "Event akışı", value: `${events.length} olay`, state: events.length ? "ok" : "warn" },
      { label: "Lead akışı", value: `${leads.length} kayıt`, state: leads.length ? "ok" : "warn" },
      { label: "Opt-in → Supabase", value: `${optins} kişi`, state: optins ? "ok" : "warn" },
      { label: "Başvuru → Supabase", value: `${applications} kişi`, state: applications ? "ok" : "warn" },
      { label: "Takvim embed", value: `${calendarLoaded} yükleme`, state: calendarLoaded ? "ok" : "warn" },
      { label: "GHL randevu webhook", value: booked ? `${booked} randevu` : "henüz sinyal yok", state: booked ? "ok" : "warn" },
    ] satisfies VslPanelData["trackingHealth"];

    return {
      ...base,
      ok: true,
      kpi: {
        visits,
        popupOpens,
        optins,
        plays,
        watch5m,
        applications,
        calendarViews,
        booked,
        optinRate: pct(optins, visits),
        applicationRate: pct(applications, optins),
        bookedRate: pct(booked, applications),
      },
      funnel,
      form,
      video,
      channels: [...channelMap.values()].sort((a, b) => b.applications - a.applications || b.optins - a.optins || b.visits - a.visits),
      recentLeads,
      trackingHealth,
    };
  } catch (e) {
    return { ...base, error: e instanceof Error ? e.message : "Panel verisi okunamadı." };
  }
}

export const PANEL_RANGES: { key: PanelRange; label: string }[] = [
  { key: "today", label: "Bugün" },
  { key: "yesterday", label: "Dün" },
  { key: "week", label: "Son 7 gün" },
  { key: "month", label: "Son 30 gün" },
  { key: "launch", label: "Lansmandan beri" },
];
