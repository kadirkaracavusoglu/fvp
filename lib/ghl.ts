type Attr = Record<string, unknown> | null | undefined;

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function inferredSource(attr: Attr): string {
  const source = str(attr?.utm_source);
  if (source) return source;
  if (str(attr?.fbclid)) return "meta";
  if (str(attr?.ttclid)) return "tiktok";
  if (str(attr?.gclid) || str(attr?.gbraid) || str(attr?.wbraid)) return "google";
  if (str(attr?.msclkid)) return "bing";
  return "direct";
}

export function ghlAttributionPayload(attr: Attr) {
  const utmSource = str(attr?.utm_source);
  const utmMedium = str(attr?.utm_medium);
  const utmCampaign = str(attr?.utm_campaign);
  const utmTerm = str(attr?.utm_term);
  const utmContent = str(attr?.utm_content);
  const utmId = str(attr?.utm_id);
  const gclid = str(attr?.gclid);
  const gbraid = str(attr?.gbraid);
  const wbraid = str(attr?.wbraid);
  const fbclid = str(attr?.fbclid);
  const ttclid = str(attr?.ttclid);
  const msclkid = str(attr?.msclkid);
  const gaClientId = str(attr?.ga_client_id);
  const fbp = str(attr?.fbp);
  const fbc = str(attr?.fbc);
  const landingUrl = str(attr?.landing_url);
  const firstLandingUrl = str(attr?.first_landing_url);
  const pageUrl = str(attr?.page_url) || landingUrl;

  return {
    attributionSource: inferredSource(attr),
    // camelCase
    utmSource,
    utmMedium,
    utmCampaign,
    utmTerm,
    utmContent,
    utmId,
    gaClientId,
    landingUrl,
    firstLandingUrl,
    pageUrl,
    // snake_case (workflow eşlemesi kolay olsun diye ikisi de)
    utm_source: utmSource,
    utm_medium: utmMedium,
    utm_campaign: utmCampaign,
    utm_term: utmTerm,
    utm_content: utmContent,
    utm_id: utmId,
    // click id'ler (tüm kanallar)
    gclid,
    gbraid,
    wbraid,
    fbclid,
    ttclid,
    msclkid,
    // pixel dedup kimlikleri
    ga_client_id: gaClientId,
    fbp,
    fbc,
    // sayfa/iniş bilgisi
    landingPath: str(attr?.landing_path),
    landingUrl_snake: landingUrl,
    page_url: pageUrl,
    firstLandingPath: str(attr?.first_landing_path),
    firstLandingUrl,
    firstSeen: str(attr?.first_seen),
    lastSeen: str(attr?.last_seen),
    referrer: str(attr?.referrer),
  };
}
