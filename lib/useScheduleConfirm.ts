"use client";

import { useEffect } from "react";
import { track, trackServer } from "@/lib/tracking";

// Teşekkür sayfasında: randevu GERÇEKTEN alındıysa Meta `Schedule` (vsl_randevu_onay) gönder.
// Sayfaya girmek kanıt değildir (doğrudan adres, yenileme, e-posta linki) → sunucu GHL
// takviminden doğrular. GHL kaydı birkaç saniye gecikebilir → birkaç kez dener.
// Aynı randevu için tek sefer (localStorage, randevu kimliğiyle).
const WAITS_MS = [0, 3000, 6000, 10000, 15000];

export function useScheduleConfirm(location: string, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    let stopped = false;
    const timers: number[] = [];

    async function attempt() {
      try {
        const res = await fetch("/api/randevu-dogrula", { method: "POST", cache: "no-store" });
        const data = (await res.json().catch(() => ({}))) as { booked?: boolean; id?: string };
        if (stopped || !data.booked || !data.id) return;
        stopped = true; // bulundu → kalan denemeler durur
        const key = `fvp_schedule_${data.id}`;
        try {
          if (localStorage.getItem(key)) return; // bu randevu için zaten gönderildi
          localStorage.setItem(key, "1");
        } catch {}
        track("vsl_randevu_onay", { location });
        trackServer("vsl_randevu_onay");
      } catch {
        /* sessizce geç */
      }
    }

    WAITS_MS.forEach((ms) => {
      timers.push(window.setTimeout(() => void (!stopped && attempt()), ms));
    });
    return () => {
      stopped = true;
      timers.forEach((t) => clearTimeout(t));
    };
  }, [location, enabled]);
}
