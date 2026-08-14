"use client";

import { useEffect } from "react";
import { track, trackServer } from "@/lib/tracking";

const VIDEO_URL = "https://www.youtube.com/watch?v=L_2y4a_k5hY&t=24s";
const EMBED_URL = "https://www.youtube.com/embed/L_2y4a_k5hY?start=24&rel=0";

export default function VslTesekkurlerPage() {
  useEffect(() => {
    track("vsl_thankyou_view", { location: "vsl" });
    trackServer("vsl_thankyou_view");
  }, []);

  return (
    <div className="glow-bg min-h-screen px-5 py-10 sm:py-16">
      <div className="mx-auto max-w-4xl text-center">
        <span className="chip inline-block px-4 py-1 text-xs" data-active="true">
          Randevun alındı
        </span>
        <h1 className="mx-auto mt-5 max-w-3xl text-balance text-3xl font-bold leading-tight text-[#0d204d] sm:text-5xl">
          Görüşmeye kadar bu videoyu izle
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-gray-400 sm:text-lg">
          Görüşmeye daha hazırlıklı gelmen için önce bu videoyu izlemeni öneririm.
        </p>

        <div className="mt-8 overflow-hidden rounded-2xl border border-[#e6e8ea] bg-black shadow-2xl">
          <iframe
            src={EMBED_URL}
            title="Görüşme öncesi izlenecek video"
            className="aspect-video w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        <a
          href={VIDEO_URL}
          target="_blank"
          rel="noreferrer"
          className="btn-primary mt-6 inline-block px-8 py-4 text-base"
          onClick={() => {
            track("vsl_thankyou_video_click", { location: "vsl" });
            trackServer("vsl_thankyou_video_click");
          }}
        >
          YouTube'da aç
        </a>
      </div>
    </div>
  );
}
