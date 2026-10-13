// Trafik kalitesi: Meta'nın reklam inceleme/önizleme ziyaretlerini gerçek ziyaretçiden ayırır.
//
// Gözlem (13 Eki 2026): inceleme ziyaretlerinde reklam adresindeki `utm_content` DEĞERİ ÇİFT
// kodlanmış geliyor (`Hook%2B3%2B-%2B…`). Gerçek ziyaretçide değer tek kodlu: boşluk `+`,
// Türkçe karakter `%C4%9F`; kodlanmış artı (`%2B`) ya da kodlanmış yüzde (`%25`) YOK.
// Bu yüzden yalnız `utm_content` parametresine bakılır; fbclid vb. başka parametrelerde geçen
// `%25` kuralı tetiklemez.
//
// Ayıklama yalnız şu koşulda yapılır: olay `vsl_optin_view` VE aynı oturumda başka hiçbir
// olay yok. Oturumda eylem (popup, oynatma, form…) varsa ziyaret gerçek kabul edilir, KALIR.
// Ham veri silinmez; yalnız panel/rapor sayımından çıkar.

type Row = {
  name: string;
  session_id: string | null;
  attribution: Record<string, unknown> | null;
};

const VIEW = "vsl_optin_view";

/** page_url içindeki HAM (çözülmemiş) utm_content değeri; yoksa null. */
function rawUtmContent(pageUrl: unknown): string | null {
  if (typeof pageUrl !== "string") return null;
  const m = pageUrl.match(/[?&]utm_content=([^&#]*)/);
  return m ? m[1] : null;
}

/** utm_content değeri çift kodlama izi taşıyor mu? */
export function hasDoubleEncodedUtmContent(
  attribution: Record<string, unknown> | null | undefined,
): boolean {
  const a = attribution || {};
  const raw = rawUtmContent(a.page_url);
  if (raw != null) return /%2B|%25/i.test(raw);
  // page_url yoksa saklanan değere bak: tek çözülmüş gerçek değerde gerçek `+` ya da
  // `%XX` kalmaz (boşluk olarak gelir).
  const stored = a.utm_content;
  return typeof stored === "string" && (stored.includes("+") || /%[0-9A-Fa-f]{2}/.test(stored));
}

/**
 * İnceleme trafiğini ayıklar. Oturumda `vsl_optin_view` dışında olay varsa o oturuma
 * dokunmaz. Döner: kalan satırlar + ayıklanan benzersiz ziyaret (oturum) sayısı.
 */
export function dropReviewTraffic<T extends Row>(rows: T[]): { rows: T[]; removed: number } {
  const hasAction = new Set<string>();
  for (const r of rows) {
    if (r.session_id && r.name !== VIEW) hasAction.add(r.session_id);
  }
  const sessions = new Set<string>();
  let anonymous = 0;
  const kept = rows.filter((r) => {
    const review =
      r.name === VIEW &&
      hasDoubleEncodedUtmContent(r.attribution) &&
      !(r.session_id && hasAction.has(r.session_id));
    if (!review) return true;
    if (r.session_id) sessions.add(r.session_id);
    else anonymous++;
    return false;
  });
  return { rows: kept, removed: sessions.size + anonymous };
}
