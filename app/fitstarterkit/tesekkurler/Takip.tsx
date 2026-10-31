"use client";

import { useEffect } from "react";
import { captureAttribution, track, trackServer } from "@/lib/tracking";

// Meta Purchase değeri: Stripe'taki fiyatla aynı tut.
const FIYAT = 600;

export function StarterKitThanks() {
  useEffect(() => {
    // Sayfa yenilenince çifte sayım olmasın
    try {
      if (sessionStorage.getItem("fsk_purchase_sent")) return;
      sessionStorage.setItem("fsk_purchase_sent", "1");
    } catch {}
    captureAttribution();
    track("page_starterkit_thanks", { location: "fitstarterkit", value: FIYAT, currency: "TRY" }); // Meta: Purchase
    trackServer("page_starterkit_thanks", { meta: { value: FIYAT, currency: "TRY" } });
  }, []);
  return null;
}
