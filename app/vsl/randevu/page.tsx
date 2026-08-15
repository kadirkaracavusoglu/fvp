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
          <span
            className="chip inline-block px-4 py-1 text-xs"
            data-active="true"
          >
            Son adım
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-balance text-3xl font-bold leading-tight text-[#0d204d] sm:text-5xl">
            Strateji görüşmeni seç
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-400 sm:text-lg">
            Başvurunu aldık. Uygun zamanı seç, görüşme detayları e-posta ile
            gelsin.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#e6e8ea] bg-white shadow-xl">
          <iframe
            id="SSw6HZHR3j9veTWH8xTp_1786750718220"
            src={calendarUrl}
            allow="payment"
            scrolling="no"
            title="Online Koçluk Strateji Görüşmesi takvimi"
            className="min-h-[760px] w-full"
            loading="lazy"
            style={{ border: "none", overflow: "hidden" }}
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

        <div className="mt-5 text-center text-sm text-gray-400">
          Takvim açılmazsa{" "}
          <a
            href={calendarUrl}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-[#0d204d] underline underline-offset-4"
            onClick={() => {
              track("vsl_calendar_external_click", { location: "vsl" });
              trackServer("vsl_calendar_external_click");
            }}
          >
            buradan yeni sekmede aç
          </a>
          .
        </div>
      </div>
    </div>
  );
}
