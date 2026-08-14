"use client";

import { usePathname } from "next/navigation";

// VSL/funnel rotalarında site "chrome"unu (header/footer/popup) gizler.
// Amaç: dikkat dağıtmadan tek varlığa (video) odaklamak. Mert /kocluk deseni.
// Gizlenen rotalar tek yerden yönetilir.
const BARE_PREFIXES = ["/vsl"];

export function Chrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const bare = BARE_PREFIXES.some((p) => pathname.startsWith(p));
  if (bare) return null;
  return <>{children}</>;
}
