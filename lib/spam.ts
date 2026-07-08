// Basit, bağımlılıksız bot/spam koruması: honeypot + IP başına hız sınırı.
// Not: Serverless'ta hız sınırı "warm instance" başına çalışır (best-effort).
// Daha güçlü koruma gerekince Cloudflare Turnstile / Upstash Redis eklenebilir.

const hits = new Map<string, number[]>();

/** IP başına belirli pencerede istek sınırı. true = izin ver, false = engelle. */
export function rateLimit(id: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const arr = (hits.get(id) || []).filter((t) => now - t < windowMs);
  if (arr.length >= limit) {
    hits.set(id, arr);
    return false;
  }
  arr.push(now);
  hits.set(id, arr);
  return true;
}

/** İstekten istemci IP'sini çıkar (Vercel/proxy başlıkları). */
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

/** Honeypot alanı dolduysa bot demektir. */
export function isBot(honeypot: unknown): boolean {
  return typeof honeypot === "string" && honeypot.trim().length > 0;
}
