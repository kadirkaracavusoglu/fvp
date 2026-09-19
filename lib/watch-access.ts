import { createHmac, timingSafeEqual } from "node:crypto";

// İzleme süresi yazımı için sahiplik kanıtı. Opt-in/başvuru anında tarayıcıya
// e-postaya bağlı imzalı, httpOnly bir çerez yazılır; /api/vsl-progress yalnız
// bu çerezle gelen isteği ve yalnız çerezdeki e-posta için kabul eder. Böylece
// başkasının e-postasını bilen biri o kişinin izleme alanını değiştiremez.

export const WATCH_COOKIE = "fvp_watch";
const MAX_AGE_S = 60 * 86400;

const secret = () => process.env.VSL_WATCH_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const sign = (value: string) => createHmac("sha256", secret()).update(`vslwatch:${value}`).digest("hex");
const norm = (email: string) => email.trim().toLowerCase();

export function createWatchToken(email: string): string | null {
  if (!secret()) return null;
  const payload = `${Buffer.from(norm(email)).toString("base64url")}.${Date.now() + MAX_AGE_S * 1000}`;
  return `${payload}.${sign(payload)}`;
}

/** Geçerli çerezse içindeki e-postayı döndürür; değilse null. */
export function readWatchToken(token?: string | null): string | null {
  if (!token || !secret()) return null;
  const [em, expiry, signature, extra] = token.split(".");
  if (extra || !em || !/^\d+$/.test(expiry || "") || Number(expiry) < Date.now() || !/^[0-9a-f]{64}$/.test(signature || "")) return null;
  const expected = sign(`${em}.${expiry}`);
  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try {
    return Buffer.from(em, "base64url").toString("utf8");
  } catch {
    return null;
  }
}

export const watchCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: MAX_AGE_S,
};
