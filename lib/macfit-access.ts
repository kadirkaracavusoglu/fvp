import { createHmac, timingSafeEqual } from "node:crypto";

const secret = () => process.env.MACFIT_ACCESS_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const sign = (value: string) => createHmac("sha256", secret()).update(`macfit:${value}`).digest("hex");
export function createMacfitAccess(leadId: string) {
  if (!secret()) throw new Error("MACFit access secret missing");
  const payload = `${leadId}.${Date.now() + 30 * 86400_000}`;
  return `${payload}.${sign(payload)}`;
}
export function readMacfitAccess(token?: string): string | null {
  if (!token || !secret()) return null;
  const [id, expiry, signature, extra] = token.split(".");
  if (extra || !/^[0-9a-f-]{36}$/.test(id || "") || !/^\d+$/.test(expiry || "") || Number(expiry) < Date.now() || !/^[0-9a-f]{64}$/.test(signature || "")) return null;
  const expected = sign(`${id}.${expiry}`);
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected)) ? id : null;
}
