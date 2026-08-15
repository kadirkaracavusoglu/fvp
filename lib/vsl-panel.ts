import { supabaseAdmin } from "@/lib/supabase";
import { BASVURU_SORULARI } from "@/lib/funnel";
import { getMetaSpend } from "@/lib/meta-insights";

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
  calendarViews: number;
  booked: number;
};

export type RecentLead = {
  name: string;
  email: string;
  phone: string;
  instagram: string;
  businessName: string;
  formType: string;
  channel: string;
  score: number | null;
  segment: string;
  goal: string;
  bottlenecks: string;
  utmSource: string;
  utmCampaign: string;
  utmContent: string;
  createdAt: string;
};

export type AnswerBreakdown = {
  key: string;
  label: string;
  total: number;
  answers: { label: string; count: number }[];
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
    qualifiedApplications: number;
    hotApplications: number;
    calendarViews: number;
    calendarLoaded: number;
    calendarExternalClicks: number;
    thankyouViews: number;
    thankyouVideoClicks: number;
    booked: number;
    utmCaptured: number;
    spend: number | null;
    sales: number;
    revenue: number;
    reached: number;
    optinRate: number | null;
    playRate: number | null;
    watch5Rate: number | null;
    visitToApplicationRate: number | null;
    applicationRate: number | null;
    calendarLoadRate: number | null;
    bookedRate: number | null;
    leadCost: number | null;
    appointmentCost: number | null;
    salesConversionRate: number | null;
    cpa: number | null;
    roas: number | null;
    reachRate: number | null;
    closeRate: number | null;
    leadToAppointmentMinutes: number | null;
    leadToAppointmentAvgMinutes: number | null;
    leadToAppointmentMeasured: number;
    leadToSaleMinutes: number | null;
    leadToSaleAvgMinutes: number | null;
    leadToSaleMeasured: number;
    utmRate: number | null;
  };
  funnel: FunnelStep[];
  form: FunnelStep[];
  video: FunnelStep[];
  channels: ChannelRow[];
  questionBreakdown: AnswerBreakdown[];
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
    return {
      startDate: today,
      endDate: today,
      since: startIso(today),
      until: startIso(addDays(today, 1)),
    };
  }
  if (range === "yesterday") {
    const y = addDays(today, -1);
    return {
      startDate: y,
      endDate: y,
      since: startIso(y),
      until: startIso(today),
    };
  }
  if (range === "month") {
    const s = addDays(today, -29);
    return {
      startDate: s,
      endDate: today,
      since: startIso(s),
      until: startIso(addDays(today, 1)),
    };
  }
  if (range === "launch") {
    return {
      startDate: LAUNCH_DATE,
      endDate: today,
      since: startIso(LAUNCH_DATE),
      until: startIso(addDays(today, 1)),
    };
  }
  const s = addDays(today, -6);
  return {
    startDate: s,
    endDate: today,
    since: startIso(s),
    until: startIso(addDays(today, 1)),
  };
}

async function fetchAll<T extends object>(
  table: "events" | "leads",
  select: string,
  since: string,
  until: string,
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
    all.push(...(data as unknown as T[]));
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

function cost(total: number | null, count: number): number | null {
  if (total == null || total <= 0 || count <= 0) return null;
  return Math.round(total / count);
}

function ratio(part: number, whole: number): number | null {
  return pct(part, whole);
}

function num(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const cleaned = value.replace(/[^\d.,-]/g, "").replace(",", ".");
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function identity(row: EventRow): string {
  const meta = row.meta || {};
  for (const key of [
    "opportunityId",
    "opportunity_id",
    "appointmentId",
    "appointment_id",
    "contactId",
    "contact_id",
    "email",
    "phone",
  ]) {
    const value = meta[key];
    if (typeof value === "string" && value.trim()) {
      return `${key}:${value.trim().toLowerCase()}`;
    }
  }
  return row.session_id || `${row.name}:${row.created_at}`;
}

function uniqueEvents(rows: EventRow[], names: string[]): EventRow[] {
  const wanted = new Set(names);
  const seen = new Set<string>();
  const out: EventRow[] = [];
  for (const row of rows) {
    if (!wanted.has(row.name)) continue;
    const id = identity(row);
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(row);
  }
  return out;
}

function eventRevenue(row: EventRow): number {
  const meta = row.meta || {};
  for (const key of ["revenue", "amount", "value", "saleValue", "price"]) {
    const value = num(meta[key]);
    if (value > 0) return value;
  }
  return 0;
}

function addIdentityKey(keys: Set<string>, prefix: string, value: unknown) {
  if (typeof value !== "string") return;
  const cleaned = value.trim().toLowerCase();
  if (!cleaned) return;
  keys.add(`${prefix}:${cleaned}`);
}

function addPhoneKey(keys: Set<string>, value: unknown) {
  if (typeof value !== "string") return;
  const digits = value.replace(/\D/g, "");
  if (digits.length >= 7) keys.add(`phone:${digits}`);
}

function recordIdentityKeys(record?: Record<string, unknown> | null): string[] {
  const keys = new Set<string>();
  if (!record) return [];
  for (const key of [
    "contactId",
    "contact_id",
    "ghlContactId",
    "_ghl_contact_id",
  ]) {
    addIdentityKey(keys, "contact", record[key]);
  }
  for (const key of ["opportunityId", "opportunity_id"]) {
    addIdentityKey(keys, "opportunity", record[key]);
  }
  for (const key of ["appointmentId", "appointment_id"]) {
    addIdentityKey(keys, "appointment", record[key]);
  }
  for (const key of ["email", "contactEmail"]) {
    addIdentityKey(keys, "email", record[key]);
  }
  for (const key of ["phone", "contactPhone"]) {
    addPhoneKey(keys, record[key]);
  }
  return [...keys];
}

function leadIdentityKeys(row: LeadRow): string[] {
  const keys = new Set<string>();
  addIdentityKey(keys, "email", row.email);
  addPhoneKey(keys, row.phone);
  for (const key of recordIdentityKeys(row.cevaplar)) keys.add(key);
  return [...keys];
}

function eventIdentityKeys(row: EventRow): string[] {
  return recordIdentityKeys(row.meta);
}

function ms(value: string): number | null {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

type TimedSignal = {
  at: number;
  keys: string[];
};

function leadSignal(row: LeadRow): TimedSignal | null {
  const at = ms(row.created_at);
  const keys = leadIdentityKeys(row);
  if (at == null || !keys.length) return null;
  return { at, keys };
}

function eventSignal(row: EventRow): TimedSignal | null {
  const at = ms(row.created_at);
  const keys = eventIdentityKeys(row);
  if (at == null || !keys.length) return null;
  return { at, keys };
}

function uniquePersonLeads(rows: LeadRow[], formTypes: string[]): LeadRow[] {
  const wanted = new Set(formTypes);
  const seen = new Set<string>();
  const out: LeadRow[] = [];
  for (const row of rows) {
    if (!wanted.has(row.form_type || "")) continue;
    const keys = leadIdentityKeys(row);
    const id =
      keys.find((key) => key.startsWith("email:")) ||
      keys.find((key) => key.startsWith("phone:")) ||
      `${row.form_type}:${row.created_at}`;
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(row);
  }
  return out;
}

function median(values: number[]): number | null {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2) return sorted[mid];
  return Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

function average(values: number[]): number | null {
  if (!values.length) return null;
  return Math.round(
    values.reduce((sum, value) => sum + value, 0) / values.length,
  );
}

function conversionTiming(leads: LeadRow[], signals: TimedSignal[]) {
  const signalMap = new Map<string, TimedSignal[]>();
  for (const signal of signals) {
    for (const key of signal.keys) {
      const list = signalMap.get(key) || [];
      list.push(signal);
      signalMap.set(key, list);
    }
  }
  for (const list of signalMap.values()) list.sort((a, b) => a.at - b.at);

  const minutes: number[] = [];
  for (const lead of leads) {
    const leadAt = ms(lead.created_at);
    if (leadAt == null) continue;
    let matchedAt: number | null = null;
    for (const key of leadIdentityKeys(lead)) {
      const list = signalMap.get(key) || [];
      const match = list.find((signal) => signal.at >= leadAt);
      if (!match) continue;
      matchedAt = matchedAt == null ? match.at : Math.min(matchedAt, match.at);
    }
    if (matchedAt == null) continue;
    minutes.push(Math.max(0, Math.round((matchedAt - leadAt) / 60000)));
  }

  return {
    measured: minutes.length,
    medianMinutes: median(minutes),
    avgMinutes: average(minutes),
  };
}

function channelKey(attr?: Record<string, string> | null): string {
  const source = (attr?.utm_source || "").toLowerCase();
  const medium = (attr?.utm_medium || "").toLowerCase();
  if (attr?.fbclid || /meta|facebook|fb|instagram|ig/.test(source))
    return "meta";
  if (attr?.gclid || /google|youtube|yt/.test(source)) return "google";
  if (/tiktok|tt/.test(source)) return "tiktok";
  if (/email|beehiiv|bulten|newsletter/.test(source) || /email/.test(medium))
    return "email";
  if (/instagram|ig/.test(source)) return "instagram";
  return "organik";
}

function hasCampaign(attr?: Record<string, string> | null): boolean {
  if (!attr) return false;
  return Boolean(
    attr.utm_source ||
    attr.utm_campaign ||
    attr.utm_content ||
    attr.fbclid ||
    attr.gclid,
  );
}

const CHANNEL_LABELS: Record<string, string> = {
  meta: "Meta / IG",
  google: "Google / YouTube",
  tiktok: "TikTok",
  email: "E-posta",
  instagram: "Instagram organik",
  organik: "Organik / direkt",
};

function bump(
  map: Map<string, ChannelRow>,
  key: string,
  field: keyof Pick<
    ChannelRow,
    "visits" | "optins" | "applications" | "calendarViews" | "booked"
  >,
) {
  const row = map.get(key) || {
    key,
    label: CHANNEL_LABELS[key] || key,
    visits: 0,
    optins: 0,
    applications: 0,
    calendarViews: 0,
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

function textAnswer(row: LeadRow, key: string): string {
  const val = row.cevaplar?.[key];
  if (typeof val === "string") return val;
  if (Array.isArray(val))
    return val.filter((v) => typeof v === "string").join(", ");
  return "";
}

function leadScore(row: LeadRow): number | null {
  const val = row.cevaplar?._lead_score;
  return typeof val === "number" ? val : null;
}

function leadSegment(row: LeadRow): string {
  const val = row.cevaplar?._lead_segment;
  return typeof val === "string" ? val : "";
}

function uniqueLeadRows(rows: LeadRow[], formType: string): LeadRow[] {
  const seen = new Set<string>();
  const out: LeadRow[] = [];
  for (const row of rows) {
    if (row.form_type !== formType) continue;
    const email = (row.email || "").toLowerCase().trim();
    const id = email || `${row.created_at}:${row.phone || ""}`;
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(row);
  }
  return out;
}

function answerBreakdown(rows: LeadRow[]): AnswerBreakdown[] {
  const keys = ["asama", "gelir", "darbogazlar", "yatirim", "karar_hizi"];
  return keys
    .map((key) => {
      const question = BASVURU_SORULARI.find((s) => s.key === key);
      const counts = new Map<string, number>();
      for (const row of rows) {
        const value = row.cevaplar?.[key];
        const values = Array.isArray(value)
          ? value
          : typeof value === "string"
            ? [value]
            : [];
        for (const item of values) {
          if (typeof item !== "string" || !item.trim()) continue;
          counts.set(item, (counts.get(item) || 0) + 1);
        }
      }
      return {
        key,
        label: question?.soru || key,
        total: [...counts.values()].reduce((a, b) => a + b, 0),
        answers: [...counts.entries()]
          .map(([label, count]) => ({ label, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5),
      };
    })
    .filter((row) => row.total > 0);
}

function formLabel(type?: string | null): string {
  if (type === "vsl_basvuru") return "Başvuru";
  if (type === "vsl_randevu") return "Randevu";
  return "Opt-in";
}

export async function getVslPanelData(
  range: PanelRange,
): Promise<VslPanelData> {
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
      qualifiedApplications: 0,
      hotApplications: 0,
      calendarViews: 0,
      calendarLoaded: 0,
      calendarExternalClicks: 0,
      thankyouViews: 0,
      thankyouVideoClicks: 0,
      booked: 0,
      utmCaptured: 0,
      spend: null,
      sales: 0,
      revenue: 0,
      reached: 0,
      optinRate: null,
      playRate: null,
      watch5Rate: null,
      visitToApplicationRate: null,
      applicationRate: null,
      calendarLoadRate: null,
      bookedRate: null,
      leadCost: null,
      appointmentCost: null,
      salesConversionRate: null,
      cpa: null,
      roas: null,
      reachRate: null,
      closeRate: null,
      leadToAppointmentMinutes: null,
      leadToAppointmentAvgMinutes: null,
      leadToAppointmentMeasured: 0,
      leadToSaleMinutes: null,
      leadToSaleAvgMinutes: null,
      leadToSaleMeasured: 0,
      utmRate: null,
    },
    funnel: [],
    form: [],
    video: [],
    channels: [],
    questionBreakdown: [],
    recentLeads: [],
    trackingHealth: [],
  };

  if (!supabaseAdmin) return { ...base, error: "Supabase env tanımlı değil." };

  try {
    const [events, leads] = await Promise.all([
      fetchAll<EventRow>(
        "events",
        "name,path,session_id,attribution,meta,created_at",
        r.since,
        r.until,
      ),
      fetchAll<LeadRow>(
        "leads",
        "first_name,last_name,email,phone,form_type,cevaplar,attribution,created_at",
        r.since,
        r.until,
      ),
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
    const formBottleneckStep =
      BASVURU_SORULARI.findIndex((s) => s.key === "darbogazlar") + 1;
    const formInvestmentStep =
      BASVURU_SORULARI.findIndex((s) => s.key === "yatirim") + 1;
    const contactStep = BASVURU_SORULARI.length + 1;
    const formBottleneck =
      formBottleneckStep > 0
        ? uniqueBy(events, `vsl_basvuru_s${formBottleneckStep}`)
        : 0;
    const formInvestment =
      formInvestmentStep > 0
        ? uniqueBy(events, `vsl_basvuru_s${formInvestmentStep}`)
        : 0;
    const formContact = uniqueAny(events, [
      "vsl_basvuru_contact_view",
      `vsl_basvuru_s${contactStep}`,
    ]);
    const formSubmitEvent = uniqueBy(events, "vsl_basvuru_submit");
    const calendarViews = uniqueBy(events, "vsl_calendar_view");
    const calendarLoaded = uniqueBy(events, "vsl_calendar_loaded");
    const calendarExternalClicks = uniqueBy(
      events,
      "vsl_calendar_external_click",
    );
    const thankyouViews = uniqueBy(events, "vsl_thankyou_view");
    const thankyouVideoClicks = uniqueBy(events, "vsl_thankyou_video_click");
    const bookedEvent = uniqueBy(events, "vsl_calendar_booked");
    const reachedRows = uniqueEvents(events, ["vsl_reached"]);
    const saleRows = uniqueEvents(events, ["vsl_sale", "vsl_closed_won"]);
    const reached = reachedRows.length;
    const sales = saleRows.length;
    const revenue = saleRows.reduce((sum, row) => sum + eventRevenue(row), 0);
    const metaSpend = await getMetaSpend(r.startDate, r.endDate);
    const spend = metaSpend.ok ? metaSpend.spend : null;

    const optins = uniqueLeadCount(leads, "vsl_optin");
    const applicationRows = uniqueLeadRows(leads, "vsl_basvuru");
    const timingLeadRows = uniquePersonLeads(leads, [
      "vsl_optin",
      "vsl_basvuru",
    ]);
    const appointmentSignals = [
      ...leads
        .filter((row) => row.form_type === "vsl_randevu")
        .map(leadSignal)
        .filter((signal): signal is TimedSignal => Boolean(signal)),
      ...events
        .filter((row) => row.name === "vsl_calendar_booked")
        .map(eventSignal)
        .filter((signal): signal is TimedSignal => Boolean(signal)),
    ];
    const saleSignals = saleRows
      .map(eventSignal)
      .filter((signal): signal is TimedSignal => Boolean(signal));
    const leadToAppointment = conversionTiming(
      timingLeadRows,
      appointmentSignals,
    );
    const leadToSale = conversionTiming(timingLeadRows, saleSignals);
    const applications = applicationRows.length;
    const booked = Math.max(uniqueLeadCount(leads, "vsl_randevu"), bookedEvent);
    const qualifiedApplications = applicationRows.filter((row) => {
      const score = leadScore(row) || 0;
      return score >= 5 || /Yüksek|Orta/.test(leadSegment(row));
    }).length;
    const hotApplications = applicationRows.filter((row) => {
      const score = leadScore(row) || 0;
      return score >= 8 || /Yüksek/.test(leadSegment(row));
    }).length;
    const utmCaptured = uniqueLeadRows(leads, "vsl_optin")
      .concat(applicationRows)
      .filter((row, index, arr) => {
        const email = (row.email || "").toLowerCase().trim();
        return (
          hasCampaign(row.attribution) &&
          arr.findIndex(
            (r) => (r.email || "").toLowerCase().trim() === email,
          ) === index
        );
      }).length;

    const funnel: FunnelStep[] = [
      { key: "visit", label: "VSL sayfasını gördü", count: visits, pct: 100 },
      {
        key: "popup",
        label: "Video kilidini açmak istedi",
        count: popupOpens,
        pct: pct(popupOpens, visits),
        pctPrev: pct(popupOpens, visits),
      },
      {
        key: "optin",
        label: "Opt-in bıraktı",
        count: optins,
        pct: pct(optins, visits),
        pctPrev: pct(optins, popupOpens),
      },
      {
        key: "play",
        label: "Videoyu oynattı",
        count: plays,
        pct: pct(plays, visits),
        pctPrev: pct(plays, optins),
      },
      {
        key: "watch5",
        label: "5 dakika izledi",
        count: watch5m,
        pct: pct(watch5m, visits),
        pctPrev: pct(watch5m, plays),
      },
      {
        key: "cta",
        label: "Başvuru CTA tıkladı",
        count: cta,
        pct: pct(cta, visits),
        pctPrev: pct(cta, watch5m),
      },
      {
        key: "apply",
        label: "Başvuruyu tamamladı",
        count: applications,
        pct: pct(applications, visits),
        pctPrev: pct(applications, cta || formStart),
      },
      {
        key: "calendar",
        label: "Takvimi gördü",
        count: calendarViews,
        pct: pct(calendarViews, visits),
        pctPrev: pct(calendarViews, applications),
      },
      {
        key: "thankyou",
        label: "Teşekkür sayfasını gördü",
        count: thankyouViews,
        pct: pct(thankyouViews, visits),
        pctPrev: pct(thankyouViews, calendarViews),
      },
      {
        key: "booked",
        label: "Randevu aldı",
        count: booked,
        pct: pct(booked, visits),
        pctPrev: pct(booked, calendarViews),
      },
    ];

    const form: FunnelStep[] = [
      { key: "start", label: "Forma girdi", count: formStart, pct: 100 },
      {
        key: "s1",
        label: "İlk soruyu gördü",
        count: formS1,
        pct: pct(formS1, formStart),
        pctPrev: pct(formS1, formStart),
      },
      {
        key: "bottleneck",
        label: "Darboğaz sorusuna geldi",
        count: formBottleneck,
        pct: pct(formBottleneck, formStart),
        pctPrev: pct(formBottleneck, formS1),
      },
      {
        key: "investment",
        label: "Yatırım sorusuna geldi",
        count: formInvestment,
        pct: pct(formInvestment, formStart),
        pctPrev: pct(formInvestment, formBottleneck),
      },
      {
        key: "contact",
        label: "İletişim ekranına geldi",
        count: formContact,
        pct: pct(formContact, formStart),
        pctPrev: pct(formContact, formInvestment),
      },
      {
        key: "submit",
        label: "Başvuruyu gönderdi",
        count: applications || formSubmitEvent,
        pct: pct(applications || formSubmitEvent, formStart),
        pctPrev: pct(applications || formSubmitEvent, formContact),
      },
    ];

    const video: FunnelStep[] = [
      {
        key: "play",
        label: "Oynattı",
        count: plays,
        pct: pct(plays, optins || visits),
      },
      {
        key: "unmute",
        label: "Sesi açtı",
        count: unmute,
        pct: pct(unmute, plays),
        pctPrev: pct(unmute, plays),
      },
      {
        key: "min1",
        label: "1 dakika",
        count: watch1m,
        pct: pct(watch1m, plays),
        pctPrev: pct(watch1m, unmute || plays),
      },
      {
        key: "min3",
        label: "3 dakika",
        count: watch3m,
        pct: pct(watch3m, plays),
        pctPrev: pct(watch3m, watch1m),
      },
      {
        key: "min5",
        label: "5 dakika",
        count: watch5m,
        pct: pct(watch5m, plays),
        pctPrev: pct(watch5m, watch3m),
      },
      {
        key: "min10",
        label: "10 dakika",
        count: watch10m,
        pct: pct(watch10m, plays),
        pctPrev: pct(watch10m, watch5m),
      },
      {
        key: "min15",
        label: "15 dakika",
        count: watch15m,
        pct: pct(watch15m, plays),
        pctPrev: pct(watch15m, watch10m),
      },
      {
        key: "half",
        label: "%50",
        count: watch50,
        pct: pct(watch50, plays),
        pctPrev: pct(watch50, watch5m),
      },
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
    const seenCalendar = new Set<string>();
    for (const event of events) {
      if (event.name !== "vsl_calendar_view") continue;
      const id = event.session_id || `${event.created_at}-${event.path}`;
      if (seenCalendar.has(id)) continue;
      seenCalendar.add(id);
      bump(channelMap, channelKey(event.attribution), "calendarViews");
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
      .filter(
        (l) => l.form_type === "vsl_basvuru" || l.form_type === "vsl_randevu",
      )
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, 20)
      .map((l) => ({
        name: leadName(l),
        email: l.email || "",
        phone: l.phone || "",
        instagram: instagram(l),
        businessName: textAnswer(l, "businessName"),
        formType: formLabel(l.form_type),
        channel:
          CHANNEL_LABELS[channelKey(l.attribution)] ||
          channelKey(l.attribution),
        score: leadScore(l),
        segment: leadSegment(l),
        goal: textAnswer(l, "hedef_12_ay"),
        bottlenecks: textAnswer(l, "darbogazlar"),
        utmSource: l.attribution?.utm_source || "",
        utmCampaign: l.attribution?.utm_campaign || "",
        utmContent: l.attribution?.utm_content || "",
        createdAt: l.created_at,
      }));

    const trackingHealth = [
      {
        label: "Event akışı",
        value: `${events.length} olay`,
        state: events.length ? "ok" : "warn",
      },
      {
        label: "Lead akışı",
        value: `${leads.length} kayıt`,
        state: leads.length ? "ok" : "warn",
      },
      {
        label: "Opt-in → Supabase",
        value: `${optins} kişi`,
        state: optins ? "ok" : "warn",
      },
      {
        label: "Başvuru → Supabase",
        value: `${applications} kişi`,
        state: applications ? "ok" : "warn",
      },
      {
        label: "UTM yakalama",
        value: `${utmCaptured} kayıt`,
        state: utmCaptured ? "ok" : "warn",
      },
      {
        label: "Form iletişim adımı",
        value: `${formContact} kişi`,
        state: formContact ? "ok" : "warn",
      },
      {
        label: "Takvim embed",
        value: `${calendarLoaded} yükleme`,
        state: calendarLoaded ? "ok" : "warn",
      },
      {
        label: "Teşekkür sayfası",
        value: `${thankyouViews} görüntüleme`,
        state: thankyouViews ? "ok" : "warn",
      },
      {
        label: "GHL randevu webhook",
        value: booked ? `${booked} randevu` : "henüz sinyal yok",
        state: booked ? "ok" : "warn",
      },
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
        qualifiedApplications,
        hotApplications,
        calendarViews,
        calendarLoaded,
        calendarExternalClicks,
        thankyouViews,
        thankyouVideoClicks,
        booked,
        utmCaptured,
        spend,
        sales,
        revenue,
        reached,
        optinRate: pct(optins, visits),
        playRate: pct(plays, optins || visits),
        watch5Rate: pct(watch5m, plays),
        visitToApplicationRate: pct(applications, visits),
        applicationRate: pct(applications, optins),
        calendarLoadRate: pct(calendarLoaded, calendarViews),
        bookedRate: pct(booked, applications),
        leadCost: cost(spend, applications),
        appointmentCost: cost(spend, booked),
        salesConversionRate: ratio(sales, applications),
        cpa: cost(spend, sales),
        roas:
          spend != null && spend > 0 && revenue > 0
            ? Math.round((revenue / spend) * 100) / 100
            : null,
        reachRate: ratio(reached, applications),
        closeRate: ratio(sales, reached),
        leadToAppointmentMinutes: leadToAppointment.medianMinutes,
        leadToAppointmentAvgMinutes: leadToAppointment.avgMinutes,
        leadToAppointmentMeasured: leadToAppointment.measured,
        leadToSaleMinutes: leadToSale.medianMinutes,
        leadToSaleAvgMinutes: leadToSale.avgMinutes,
        leadToSaleMeasured: leadToSale.measured,
        utmRate: pct(utmCaptured, optins + applications),
      },
      funnel,
      form,
      video,
      channels: [...channelMap.values()].sort(
        (a, b) =>
          b.applications - a.applications ||
          b.optins - a.optins ||
          b.visits - a.visits,
      ),
      questionBreakdown: answerBreakdown(applicationRows),
      recentLeads,
      trackingHealth,
    };
  } catch (e) {
    return {
      ...base,
      error: e instanceof Error ? e.message : "Panel verisi okunamadı.",
    };
  }
}

export const PANEL_RANGES: { key: PanelRange; label: string }[] = [
  { key: "today", label: "Bugün" },
  { key: "yesterday", label: "Dün" },
  { key: "week", label: "Son 7 gün" },
  { key: "month", label: "Son 30 gün" },
  { key: "launch", label: "Lansmandan beri" },
];
