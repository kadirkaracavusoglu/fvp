"use client";

import { useEffect } from "react";
import { track, trackServer } from "@/lib/tracking";

// Ortak GHL takvim "randevu alındı" yakalayıcısı.
// Neden: iki funnel (fitsistem + vaka-hande) AYNI GHL takvimini paylaşıyor
// (calendarId SSw6HZHR3j9veTWH8xTp). GHL takviminin tek bir sabit "randevu sonrası
// redirect" ayarı var → herkesi /fitsistem/tesekkurler'e atıyordu, bu yüzden
// vaka-hande'nin teşekkür görüntülemesi (vsl_thankyou_view) hiç düşmüyordu.
//
// Bu hook, gömülü takvimin booking-başarı postMessage'ını yakalayıp funnel'ın
// KENDİ teşekkür sayfasına (top-level) yönlendirir ve doğru location ile
// vsl_calendar_booked atar. Yakalarsa doğru sayfaya gider; yakalamazsa eski
// davranış (GHL'in kendi redirect'i) sürer → hiçbir şeyi bozmaz, yalnız iyileştirir.
export function useBookingRedirect(location: string, tesekkurlerPath: string) {
  useEffect(() => {
    let done = false;

    const onMsg = (e: MessageEvent) => {
      if (done) return;
      // Yalnız GHL/LeadConnector kaynaklı mesajlar.
      const origin = e.origin || "";
      if (!/fitsistem\.co|leadconnectorhq|gohighlevel|msgsndr/i.test(origin)) {
        return;
      }
      const d = e.data as unknown;
      const signal =
        typeof d === "string"
          ? d
          : d && typeof d === "object"
            ? String(
                (d as Record<string, unknown>).type ??
                  (d as Record<string, unknown>).action ??
                  (d as Record<string, unknown>).event ??
                  "",
              )
            : "";
      const hasApptField =
        !!d &&
        typeof d === "object" &&
        Boolean(
          (d as Record<string, unknown>).appointmentId ||
            (d as Record<string, unknown>).appointment_id ||
            (d as Record<string, unknown>).selectedSlot,
        );
      // form_embed.js'in gürültü mesajları (iframeLoaded, scrollTo, modify-parent-url…)
      // bu kalıplara UYMAZ; yalnız gerçek booking-başarı sinyalinde tetiklenir.
      const isBooking =
        /success|booked|appointment|confirm/i.test(signal) || hasApptField;
      if (!isBooking) return;

      done = true;
      track("vsl_calendar_booked", { location });
      trackServer("vsl_calendar_booked");
      // Kısa gecikme: track beacon'ları çıksın, sonra funnel'ın kendi teşekkürüne git.
      window.setTimeout(() => {
        window.location.href = tesekkurlerPath;
      }, 150);
    };

    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [location, tesekkurlerPath]);
}
