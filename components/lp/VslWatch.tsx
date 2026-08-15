"use client";

// VSL İZLEME görünümü — /vsl. Opt-in SONRASI uzun video sayfası.
// Guard: opt-in vermemişse /vsl/optin'e geri yollar. CTA yalnız 5 dk izlenince açılır.

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { VslPlayer } from "@/components/lp/VslPlayer";
import { VSL_UNLOCK_KEY, VSL_CTA_KEY } from "@/lib/funnel";
import { captureAttribution, track, trackServer } from "@/lib/tracking";

export function VslWatch({ videoId }: { videoId: string }) {
  const router = useRouter();
  const [ready, setReady] = useState(false); // localStorage okundu mu (SSR flash önle)
  const [allowed, setAllowed] = useState(false); // opt-in verilmiş mi
  const [ctaReady, setCtaReady] = useState(false); // 5 dk izlendi mi

  useEffect(() => {
    captureAttribution();
    try {
      if (!localStorage.getItem(VSL_UNLOCK_KEY)) {
        router.replace("/vsl/optin"); // opt-in yoksa kapıya geri
        return;
      }
      setAllowed(true);
      if (localStorage.getItem(VSL_CTA_KEY)) setCtaReady(true); // daha önce 5 dk izlemiş
    } catch {
      router.replace("/vsl/optin");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready || !allowed) {
    return <div className="aspect-video w-full rounded-2xl bg-[#0b1a3a]" />;
  }

  return (
    <div>
      <VslPlayer
        videoId={videoId}
        autoplay
        onMilestone={(name) => {
          // CTA yalnız 5 dakika izlendikten sonra açılır (time-on-brand).
          if (name === "vsl_min5") {
            setCtaReady(true);
            try {
              localStorage.setItem(VSL_CTA_KEY, "1");
            } catch {}
          }
        }}
      />
      {/* CTA — yalnız 5 dk izlendikten sonra görünür (adım 2: detaylı başvuru) */}
      {ctaReady && (
        <div className="mt-8 text-center">
          <Link
            href="/vsl/basvuru"
            className="btn-primary inline-block px-8 py-4 text-base"
            onClick={() => {
              track("cta_click", { location: "vsl" });
              trackServer("cta_click", { video: videoId });
            }}
          >
            Yol haritanı birlikte konuşalım →
          </Link>
          <p className="mt-3 text-sm text-gray-400">
            Kısa bir başvuru + ücretsiz strateji görüşmesi.
          </p>
        </div>
      )}
    </div>
  );
}
