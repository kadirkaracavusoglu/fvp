type Attr = Record<string, unknown> | null | undefined;

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function inferredSource(attr: Attr): string {
  const source = str(attr?.utm_source);
  if (source) return source;
  if (str(attr?.fbclid)) return "meta";
  if (str(attr?.gclid)) return "google";
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
  const fbclid = str(attr?.fbclid);

  return {
    attributionSource: inferredSource(attr),
    utmSource,
    utmMedium,
    utmCampaign,
    utmTerm,
    utmContent,
    utmId,
    utm_source: utmSource,
    utm_medium: utmMedium,
    utm_campaign: utmCampaign,
    utm_term: utmTerm,
    utm_content: utmContent,
    utm_id: utmId,
    gclid,
    fbclid,
    landingPath: str(attr?.landing_path),
    landingUrl: str(attr?.landing_url),
    firstLandingPath: str(attr?.first_landing_path),
    firstLandingUrl: str(attr?.first_landing_url),
    firstSeen: str(attr?.first_seen),
    lastSeen: str(attr?.last_seen),
    referrer: str(attr?.referrer),
  };
}
