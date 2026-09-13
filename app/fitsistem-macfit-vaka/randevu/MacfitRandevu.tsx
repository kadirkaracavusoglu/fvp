"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { MACFIT } from "@/lib/macfit-funnel";
import { captureAttribution, getAttribution, track, trackServer } from "@/lib/tracking";
import { useBookingRedirect } from "@/lib/useBookingRedirect";

const LOCATION = "fitsistem-macfit-vaka";
const CALENDAR_UTM_FIELDS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "utm_id", "gclid", "fbclid"];

export function MacfitRandevu() {
  const [calendarUrl, setCalendarUrl] = useState<string>(MACFIT.calendarUrl);

  // Randevu alınınca MACFit'in KENDİ teşekkür sayfasına git (ortak takvim düzeltmesi).
  useBookingRedirect(LOCATION, `${MACFIT.path}/tesekkurler`);

  useEffect(() => {
    captureAttribution();
    const attr = getAttribution();
    const query = new URLSearchParams(window.location.search);
    const url = new URL(MACFIT.calendarUrl);
    CALENDAR_UTM_FIELDS.forEach((field) => {
      const value = query.get(field) || attr[field];
      if (value) url.searchParams.set(field, value);
    });
    // Kampanya bilgileri tarayıcıda yakalanıyor; takvime SSR sonrasında aktarılır.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCalendarUrl(url.toString());
    track("vsl_calendar_view", { location: LOCATION });
    trackServer("vsl_calendar_view");
  }, []);

  return (
    <div className="glow-bg min-h-screen px-5 py-10 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 text-center">
          <h1 className="mx-auto mt-2 max-w-3xl text-balance text-3xl font-bold leading-tight text-[#0d204d] sm:text-5xl">
            Salonun için sana uygun görüşme saatini seç.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-400 sm:text-lg">
            Bu 30 dakikalık görüşmede salonunun bugün nerede olduğunu, önümüzdeki
            aylarda nereye ulaşmak istediğini ve bunun önündeki en önemli
            sorunu birlikte değerlendireceğiz.
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-base text-gray-400 sm:text-lg">
            Sana gerçekten yardımcı olabileceğimizi düşünürsek, MACFit’in
            kullandığı yaklaşımı kendi salonunda nasıl uygulayabileceğini ve
            birlikte nasıl ilerleyebileceğimizi de konuşacağız.
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-400">
            Aşağıdaki takvimden gerçekten katılabileceğin bir gün ve saat seç.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#e6e8ea] bg-white shadow-xl">
          <iframe
            id={`${MACFIT.calendarId}_1789306213549`}
            src={calendarUrl}
            allow="payment; private-state-token-issuance; private-state-token-redemption"
            scrolling="yes"
            title="Salon strateji görüşmesi takvimi"
            className="h-[calc(100vh-96px)] min-h-[1040px] w-full"
            style={{ border: "none", overflow: "auto" }}
            onLoad={() => {
              track("vsl_calendar_loaded", { location: LOCATION });
              trackServer("vsl_calendar_loaded");
            }}
          />
          <Script src="https://link.fitsistem.co/js/form_embed.js" strategy="afterInteractive" />
        </div>
        <p className="mt-4 text-center text-sm text-gray-400">
          Takvim açılmıyorsa{" "}
          <a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
            onClick={() => trackServer("vsl_calendar_external_click")}
          >
            yeni sekmede açabilirsin
          </a>
          .
        </p>
      </div>
    </div>
  );
}
