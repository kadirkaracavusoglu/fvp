"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { FUNNEL } from "@/lib/funnel";
import {
  captureAttribution,
  getAttribution,
  track,
  trackServer,
} from "@/lib/tracking";

const CALENDAR_UTM_FIELDS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
  "gclid",
  "fbclid",
];

export default function VslRandevuPage() {
  const [calendarUrl, setCalendarUrl] = useState<string>(FUNNEL.calendarUrl);

  useEffect(() => {
    captureAttribution();
    const attr = getAttribution();
    const query = new URLSearchParams(window.location.search);
    const url = new URL(FUNNEL.calendarUrl);
    CALENDAR_UTM_FIELDS.forEach((field) => {
      const value = query.get(field) || attr[field];
      if (value) url.searchParams.set(field, value);
    });
    setCalendarUrl(url.toString());
    track("vsl_calendar_view", { location: "vsl" });
    trackServer("vsl_calendar_view");
  }, []);

  return (
    <div className="glow-bg min-h-screen px-5 py-10 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 text-center">
          <h1 className="mx-auto mt-2 max-w-3xl text-balance text-3xl font-bold leading-tight text-[#0d204d] sm:text-5xl">
            Başvurun tamamlandı. Şimdi sana uygun görüşme saatini seç.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-400 sm:text-lg">
            Bu 30 dakikalık görüşmede işinin bugün nerede olduğunu, nereye
            ulaşmak istediğini ve bunun önündeki en önemli problemi birlikte
            değerlendireceğiz.
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-base text-gray-400 sm:text-lg">
            Sana gerçekten yardımcı olabileceğimizi düşünürsek,
            FitSistem&apos;i kendi işinde nasıl uygulayabileceğimizi ve birlikte
            nasıl ilerleyebileceğimizi de konuşacağız.
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-400">
            Aşağıdaki takvimden gerçekten katılabileceğin bir gün ve saat seç.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#e6e8ea] bg-white shadow-xl">
          <iframe
            id="SSw6HZHR3j9veTWH8xTp_1786750718220"
            src={calendarUrl}
            allow="payment; private-state-token-issuance; private-state-token-redemption"
            scrolling="yes"
            title="Online Koçluk Strateji Görüşmesi takvimi"
            className="h-[calc(100vh-96px)] min-h-[1040px] w-full"
            style={{ border: "none", overflow: "auto" }}
            onLoad={() => {
              track("vsl_calendar_loaded", { location: "vsl" });
              trackServer("vsl_calendar_loaded");
            }}
          />
          <Script
            src="https://link.fitsistem.co/js/form_embed.js"
            strategy="afterInteractive"
          />
        </div>
      </div>
    </div>
  );
}
