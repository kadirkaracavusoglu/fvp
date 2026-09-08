"use client";

// VSL İZLEME görünümü — /fitsistem/izle. Opt-in SONRASI uzun video sayfası.
// Guard: opt-in vermemişse /fitsistem'e geri yollar. CTA yalnız 5 dk izlenince açılır.

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { VslPlayer } from "@/components/lp/VslPlayer";
import { VSL_UNLOCK_KEY, VSL_CTA_KEY } from "@/lib/funnel";
import { captureAttribution, track, trackServer } from "@/lib/tracking";

export function VslWatch({
  videoId,
  unlockKey = VSL_UNLOCK_KEY,
  ctaKey = VSL_CTA_KEY,
  backHref = "/fitsistem",
  basvuruHref = "/fitsistem/basvuru",
  ctaText = "Fitsistem'i Kendi İşime Uygulamak İstiyorum →",
  location = "vsl",
}: {
  videoId: string;
  unlockKey?: string;
  ctaKey?: string;
  backHref?: string;
  basvuruHref?: string;
  ctaText?: string;
  location?: string;
}) {
  const router = useRouter();
  const [ready, setReady] = useState(false); // localStorage okundu mu (SSR flash önle)
  const [allowed, setAllowed] = useState(false); // opt-in verilmiş mi
  const [ctaReady, setCtaReady] = useState(false); // 5 dk izlendi mi

  useEffect(() => {
    captureAttribution();
    try {
      if (!localStorage.getItem(unlockKey)) {
        router.replace(backHref); // opt-in yoksa kapıya geri
        return;
      }
      setAllowed(true);
      if (localStorage.getItem(ctaKey)) setCtaReady(true); // daha önce 5 dk izlemiş
    } catch {
      router.replace(backHref);
      return;
    }
    setReady(true);
  }, [router, unlockKey, ctaKey, backHref]);

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
          // CTA yalnız 10 dakika izlendikten sonra açılır (time-on-brand + niyet).
          if (name === "vsl_min10") {
            setCtaReady(true);
            try {
              localStorage.setItem(ctaKey, "1");
            } catch {}
          }
        }}
      />
      {/* CTA — yalnız 10 dk izlendikten sonra görünür. Sonraki adım: başvuru. */}
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
            İşinin bugün nerede olduğunu ve neyi değiştirmek istediğini
            anlatacağın kısa başvuruyu tamamla. Ardından sana uygun görüşme
            saatini seçebilirsin.
          </p>
        </div>
      )}
    </div>
  );
}
