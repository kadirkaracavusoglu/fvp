"use client";

// MACFit İZLEME — opt-in sonrası video sayfası. Erişim sunucuda imzalı çerezle
// korunuyor (page.tsx), burada ayrıca localStorage kilidi YOK: çift kilit
// (çerez var ama localStorage silinmiş) opt-in ↔ izle arasında sonsuz döngü yapardı.
//
// Video varsa görüşme butonu diğer funnel'lar gibi 5 dk izlemeden sonra açılır.
// Video henüz yokken buton hemen açıktır (kilitlenecek bir şey yok).

import { useEffect, useState } from "react";
import Link from "next/link";
import { VslPlayer } from "@/components/lp/VslPlayer";
import { MACFIT } from "@/lib/macfit-funnel";
import { captureAttribution, track, trackServer } from "@/lib/tracking";

const LOCATION = "fitsistem-macfit-vaka";

export function MacfitWatch() {
  const hasVideo = Boolean(MACFIT.videoId);
  const [ctaReady, setCtaReady] = useState(!hasVideo);

  useEffect(() => {
    captureAttribution();
    track("vsl_watch_view", { location: LOCATION });
    trackServer("vsl_watch_view");
    if (!hasVideo) return;
    try {
      // Daha önce 5 dk izlemişse butonu tekrar kilitleme.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (localStorage.getItem(MACFIT.ctaKey)) setCtaReady(true);
    } catch {}
  }, [hasVideo]);

  return (
    <div className="glow-bg min-h-screen px-5 pb-16 pt-16 sm:pt-20">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <span className="chip inline-block px-4 py-1 text-xs" data-active="true">
            FİTSİSTEM · MACFit VAKA ANALİZİ
          </span>
          <h1 className="mt-6 text-balance text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
            MACFit’in büyüme sistemine yakından bak.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-400">
            Bu videoda MACFit’in nasıl büyüdüğünü parça parça inceliyoruz.
            Ardından aynı yaklaşımın senin salonunda nasıl çalışabileceğini
            konuşabiliriz.
          </p>
        </div>

        {hasVideo ? (
          <>
            <VslPlayer
              videoId={MACFIT.videoId}
              autoplay
              location={LOCATION}
              onMilestone={(name) => {
                if (name !== "vsl_min5") return;
                setCtaReady(true);
                try {
                  localStorage.setItem(MACFIT.ctaKey, "1");
                } catch {}
              }}
            />
            {!ctaReady && (
              <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-gray-400">
                Videoyu izlemeye başla ve sesini açmayı unutma. Yaklaşık 5
                dakika sonra, tam bu videonun altında görüşme planlama butonu
                açılacak.
              </p>
            )}
          </>
        ) : (
          <div className="overflow-hidden rounded-2xl bg-[#0d204d] shadow-2xl">
            <div className="flex aspect-video flex-col items-center justify-center px-6 text-center text-white">
              <p className="text-xs tracking-[0.2em] text-white/60">
                FİTSİSTEM · VAKA ANALİZİ
              </p>
              <h2 className="mt-4 text-2xl font-bold sm:text-4xl">
                Video yakında burada.
              </h2>
              <p className="mt-3 max-w-md text-sm text-white/70 sm:text-base">
                Bu sırada salonun için görüşme planlayabilirsin.
              </p>
            </div>
          </div>
        )}

        {ctaReady && (
          <div className="mt-8 text-center">
            <Link
              href={`${MACFIT.path}/randevu`}
              className="btn-primary inline-block px-8 py-4 text-base"
              onClick={() => {
                track("cta_click", { location: LOCATION });
                trackServer("cta_click", { video: MACFIT.videoId || undefined });
              }}
            >
              Salonum İçin Görüşme Planlamak İstiyorum →
            </Link>
            <p className="mx-auto mt-3 max-w-xl text-sm text-gray-400">
              Salonunun bugünkü durumunu ve hedefini konuşacağımız 30
              dakikalık görüşme için sana uygun bir gün ve saat seçeceksin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
