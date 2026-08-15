// FvP dönüşüm/olay takibi — GA4 (dataLayer) + Meta Pixel + attribution (gclid/utm/fbclid)
// Amaç: funnel'ı "trafik" değil "dönüşüm" düzeyinde ölçmek; reklam ID'lerini lead ile sakla.

type Params = Record<string, unknown>;

// Dönüşüm event'i → Meta Pixel standart event eşlemesi
const FB_MAP: Record<string, string> = {
  newsletter_signup: "Lead",
  quiz_start: "InitiateCheckout",
  quiz_complete: "CompleteRegistration",
  contact_submit: "Contact",
  sponsorship_submit: "Contact",
  vsl_optin_submit: "Lead",
  vsl_basvuru_submit: "SubmitApplication",
};

/** GA4/GTM (dataLayer) + varsa Meta Pixel'e olay gönder */
export function track(event: string, params: Params = {}) {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    dataLayer?: Params[];
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  };
  // GTM dataLayer (ileride GTM'de tag kurulursa diye)
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...params });
  // GA4'e DOĞRUDAN gönder (GTM yapılandırması gerekmeden görünür)
  if (typeof w.gtag === "function") {
    w.gtag("event", event, params);
  }
  // Meta Pixel (yalnızca dönüşüm event'lerinde)
  if (FB_MAP[event] && typeof w.fbq === "function") {
    w.fbq("track", FB_MAP[event], params);
  }
}

// ---- Attribution (reklam tıklama kimlikleri) ----
const ATTR_KEY = "fvp_attribution";
const ATTR_FIELDS = [
  "gclid",
  "fbclid",
  "utm_id",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_source_platform",
  "utm_creative_format",
  "utm_marketing_tactic",
];

export type Attribution = Record<string, string>;

/** Sayfa açılışında URL'deki reklam ID'lerini yakala, ilk dokunuşu koru (localStorage) */
export function captureAttribution() {
  if (typeof window === "undefined") return;
  try {
    const url = new URL(window.location.href);
    const now = new Date().toISOString();
    const found: Attribution = {};
    ATTR_FIELDS.forEach((f) => {
      const v = url.searchParams.get(f);
      if (v) found[f] = v;
    });
    if (Object.keys(found).length === 0) return;
    const existing = getAttribution();
    const merged: Attribution = {
      ...existing,
      ...found,
      first_seen: existing.first_seen || now,
      first_landing_path: existing.first_landing_path || url.pathname,
      first_landing_url: existing.first_landing_url || url.href,
      landing_path: url.pathname,
      landing_url: url.href,
      last_seen: now,
      referrer: existing.referrer || document.referrer || "",
    };
    localStorage.setItem(ATTR_KEY, JSON.stringify(merged));
  } catch {
    /* sessizce geç */
  }
}

/** Kayıtlı attribution'ı oku (form gönderiminde lead'e eklenir) */
export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(ATTR_KEY) || "{}");
  } catch {
    return {};
  }
}

// ---- First-party olay ölçümü (VSL milestone'ları → /api/track → Supabase) ----
// track() reklam pixel'lerine gider; trackServer() kendi verimize (teşhis/analiz).
const SID_KEY = "fvp_sid";

/** Oturum kimliği — huni analizi için (cihaz başına kalıcı, PII yok) */
export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let sid = localStorage.getItem(SID_KEY);
    if (!sid) {
      sid =
        (crypto as { randomUUID?: () => string })?.randomUUID?.() ||
        `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(SID_KEY, sid);
    }
    return sid;
  } catch {
    return "";
  }
}

/** Olayı kendi sunucumuza gönder (sendBeacon → sekme kapansa bile ulaşır) */
export function trackServer(
  name: string,
  opts: { path?: string; video?: string; meta?: Params } = {}
) {
  if (typeof window === "undefined") return;
  try {
    captureAttribution();
    const payload = JSON.stringify({
      name,
      path: opts.path ?? window.location.pathname,
      video: opts.video,
      sessionId: getSessionId(),
      attribution: getAttribution(),
      meta: opts.meta,
    });
    const w = window as unknown as { navigator: Navigator };
    if (w.navigator?.sendBeacon) {
      w.navigator.sendBeacon("/api/track", new Blob([payload], { type: "application/json" }));
    } else {
      fetch("/api/track", { method: "POST", body: payload, keepalive: true, headers: { "Content-Type": "application/json" } });
    }
  } catch {
    /* ölçüm asla akışı bozmaz */
  }
}
