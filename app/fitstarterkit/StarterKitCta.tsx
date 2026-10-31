"use client";

import { useEffect } from "react";
import { captureAttribution, track, trackServer } from "@/lib/tracking";

// Sayfa görüntüleme + ödeme butonu tıklaması takibi.
// Olay adları /api/track beyaz listesine (page_/cta_) uyar; panel bilinmeyen adları saymaz.
export function StarterKitView() {
  useEffect(() => {
    captureAttribution();
    track("page_starterkit_view", { location: "fitstarterkit" });
    trackServer("page_starterkit_view");
  }, []);
  return null;
}

export function StarterKitCta({ href, className, children }: { href: string; className: string; children: React.ReactNode }) {
  function onClick() {
    track("cta_starterkit_click", { location: "fitstarterkit" }); // Meta: InitiateCheckout
    trackServer("cta_starterkit_click");
  }
  return (
    <a href={href} onClick={onClick} className={className}>
      {children}
    </a>
  );
}
