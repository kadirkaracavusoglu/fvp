"use client";
import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { MACFIT } from "@/lib/macfit-funnel";
import { captureAttribution, getAttribution, track, trackServer } from "@/lib/tracking";

export function MacfitWatch() {
  const calendar = useRef<HTMLIFrameElement>(null);
  const [calendarUrl, setCalendarUrl] = useState<string>(MACFIT.calendarUrl);
  useEffect(() => {
    captureAttribution();
    const attr = getAttribution();
    const url = new URL(MACFIT.calendarUrl);
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_id", "gclid", "fbclid"]) {
      if (attr[key]) url.searchParams.set(key, attr[key]);
    }
    // Tarayıcıda yakalanan kampanya bilgileri SSR sonrasında takvime aktarılır.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCalendarUrl(url.toString());
    track("vsl_watch_view", { location: "fitsistem-macfit-vaka" });
    trackServer("vsl_watch_view");
    trackServer("vsl_calendar_view");
    let booked = false;
    const onBooking = (event: MessageEvent) => {
      if (booked || event.source !== calendar.current?.contentWindow || event.origin !== new URL(MACFIT.calendarUrl).origin) return;
      const data = event.data;
      if (!data || typeof data !== "object") return;
      const appointmentId = data.appointmentId || data.appointment_id;
      if (typeof appointmentId !== "string" || !appointmentId) return;
      booked = true;
      trackServer("vsl_calendar_booked", { meta: { funnel: "fitsistem-macfit-vaka" } });
      window.location.assign(`${MACFIT.path}/tesekkurler`);
    };
    window.addEventListener("message", onBooking);
    return () => window.removeEventListener("message", onBooking);
  }, []);
  return <div className="glow-bg min-h-screen px-5 pb-16 pt-16 sm:pt-20">
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 text-center"><span className="chip inline-block px-4 py-1 text-xs" data-active="true">FİTSİSTEM · MACFit VAKA ANALİZİ</span><h1 className="mt-6 text-balance text-3xl font-bold leading-tight tracking-tight sm:text-5xl">MACFit’in büyüme sistemine yakından bak.</h1><p className="mx-auto mt-5 max-w-2xl text-lg text-gray-400">Bilgilerin bize ulaştı. Salonun için Fitsistem’i konuşmak istersen aşağıdaki takvimden sana uygun bir görüşme saati seçebilirsin.</p></div>
      <div className="overflow-hidden rounded-2xl bg-[#0d204d] shadow-2xl">
        {MACFIT.videoId ? <iframe title="MACFit vaka analizi" src={`https://www.youtube-nocookie.com/embed/${MACFIT.videoId}?rel=0`} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="aspect-video w-full border-0" /> : <div className="flex aspect-video flex-col items-center justify-center px-6 text-center text-white"><p className="text-xs tracking-[0.2em] text-white/60">FİTSİSTEM · VAKA ANALİZİ</p><h2 className="mt-4 text-2xl font-bold sm:text-4xl">Video yakında burada.</h2><p className="mt-3 max-w-md text-sm text-white/70 sm:text-base">Bu sırada salonun için görüşme planlayabilirsin.</p></div>}
      </div>
      <section id="takvim" className="mt-14"><div className="mb-6 text-center"><h2 className="text-2xl font-bold sm:text-3xl">Salonun için bir görüşme planlayalım.</h2><p className="mx-auto mt-4 max-w-2xl text-base text-gray-400">Salonunun mevcut durumunu, büyüme hedefini ve Fitsistem’in sana nasıl yardımcı olabileceğini konuşalım. Takvimden katılabileceğin bir gün ve saat seç.</p></div>
        <div className="overflow-hidden rounded-2xl border border-[#e6e8ea] bg-white shadow-xl"><iframe ref={calendar} id="macfit-calendar" src={calendarUrl} title="Fitsistem görüşme takvimi" scrolling="yes" className="min-h-[1040px] w-full border-0" onLoad={() => trackServer("vsl_calendar_loaded")} /><Script src="https://link.msgsndr.com/js/form_embed.js" strategy="afterInteractive" /></div>
        <p className="mt-4 text-center text-sm text-gray-400">Takvim açılmıyorsa <a href={calendarUrl} target="_blank" rel="noopener noreferrer" className="underline">yeni sekmede açabilirsin.</a></p>
      </section>
    </div>
  </div>;
}
