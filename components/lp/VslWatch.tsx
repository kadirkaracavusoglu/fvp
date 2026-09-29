"use client";

// VSL İZLEME görünümü — /fitsistem/izle. Opt-in SONRASI uzun video sayfası.
// Guard: opt-in vermemişse /fitsistem'e geri yollar.
// Başvuru butonu varsayılan olarak sayfa açılınca görünür (22 Eyl 2026 kararı).
// ctaAfterMinutes verilirse buton o dakika izlenene kadar gizlenir — 29 Eyl 2026'da
// yalnız /vaka-analizi için geri açıldı; Fitsistem ve Vaka-Hande kapısız kalır.

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { VslPlayer } from "@/components/lp/VslPlayer";
import { VSL_UNLOCK_KEY, VSL_CTA_KEY } from "@/lib/funnel";
import { WATCH_MINUTES } from "@/lib/video-watch";
import { captureAttribution, track, trackServer } from "@/lib/tracking";

export function VslWatch({
  videoId,
  unlockKey = VSL_UNLOCK_KEY,
  ctaKey = VSL_CTA_KEY,
  backHref = "/fitsistem",
  basvuruHref = "/fitsistem/basvuru",
  ctaText = "Başvurumu Doldur →",
  location = "vsl",
  note,
  ctaAfterMinutes,
}: {
  videoId: string;
  unlockKey?: string;
  ctaKey?: string;
  backHref?: string;
  basvuruHref?: string;
  ctaText?: string;
  location?: string;
  note?: string;
  ctaAfterMinutes?: number;
}) {
  const router = useRouter();
  const [ready, setReady] = useState(false); // localStorage okundu mu (SSR flash önle)
  const [allowed, setAllowed] = useState(false); // opt-in verilmiş mi
  // Süre kapısı yoksa buton baştan açık; varsa eşiğe kadar kapalı.
  const [ctaReady, setCtaReady] = useState(ctaAfterMinutes === undefined);

  useEffect(() => {
    captureAttribution();
    try {
      if (!localStorage.getItem(unlockKey)) {
        router.replace(backHref); // opt-in yoksa kapıya geri
        return;
      }
      setAllowed(true);
      // Daha önce eşiği geçmişse tekrar beklemesin.
      if (ctaAfterMinutes !== undefined && localStorage.getItem(ctaKey)) {
        setCtaReady(true);
      }
    } catch {
      router.replace(backHref);
      return;
    }
    setReady(true);
  }, [router, unlockKey, ctaKey, backHref, ctaAfterMinutes]);

  if (!ready || !allowed) {
    return <div className="aspect-video w-full rounded-2xl bg-[#0b1a3a]" />;
  }

  return (
    <div>
      <VslPlayer
        videoId={videoId}
        autoplay
        location={location}
        onMilestone={(name) => {
          // İzleme süresini GHL kişi kartına yaz. Kimlik, opt-in anında yazılan
          // imzalı çerezden gelir (lib/watch-access.ts); bir kez/eşik.
          if (name in WATCH_MINUTES) {
            void fetch("/api/vsl-progress", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ milestone: name }),
              keepalive: true,
            }).catch(() => {});
            // Süre kapısı: eşiğe ulaşan ilk olayda butonu açar ve hatırlar.
            if (
              ctaAfterMinutes !== undefined &&
              WATCH_MINUTES[name] >= ctaAfterMinutes
            ) {
              setCtaReady(true);
              try {
                localStorage.setItem(ctaKey, "1");
              } catch {}
            }
          }
        }}
      />
      {/* Video altı kısa bilgi */}
      {note && (
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-gray-400">
          {note}
        </p>
      )}
      {/* CTA — kapı yoksa hemen, varsa eşik geçilince. Sonraki adım: başvuru. */}
      {ctaReady && (
        <div className="mt-8 text-center">
          <Link
            href={basvuruHref}
            className="btn-primary inline-block px-8 py-4 text-base"
            onClick={() => {
              track("cta_click", { location });
              trackServer("cta_click", { video: videoId });
            }}
          >
            {ctaText}
          </Link>
          <p className="mx-auto mt-3 max-w-xl text-sm text-gray-400">
            Birkaç soruyu cevapla, ardından sana uygun görüşme saatini seç.
          </p>
        </div>
      )}
    </div>
  );
}
