"use client";

import { track, trackServer } from "@/lib/tracking";

// Randevu sonrası (teşekkür) sayfasında görüşmeye kadar izlenecek ücretsiz eğitim.
// Tıklama olayı panelin "teşekkür videosu tıklaması" metriğine sayılır.
const VIDEO_ID = "BxA2Vt5A2nE"; // "Fitness Antrenörü Olarak Online Koçluk İşine Nasıl Başlarsın?" (~80 dk)
const VIDEO_URL = `https://www.youtube.com/watch?v=${VIDEO_ID}`;
const EMBED_URL = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?rel=0`;

export function OnGorusmeEgitimi({ location }: { location: string }) {
  return (
    <div className="mt-10 text-center">
      <h2 className="text-xl font-bold text-[#0d204d] sm:text-2xl">
        Görüşmeye kadar izleyebileceğin ücretsiz bir eğitim
      </h2>
      <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-400">
        Online koçluk işini sıfırdan nasıl kuracağını adım adım anlattığım
        yaklaşık 80 dakikalık eğitim. Görüşmeden önce izlersen temel konulara
        zaman ayırmadan doğrudan senin işine odaklanabiliriz. Hepsini izlemek
        zorunda değilsin; sana uygun bölümlerden başlayabilirsin.
      </p>
      <div className="mt-6 overflow-hidden rounded-2xl border border-[#e6e8ea] bg-black shadow-2xl">
        <iframe
          src={EMBED_URL}
          title="Fitness antrenörü olarak online koçluk işine nasıl başlarsın"
          className="aspect-video w-full"
          loading="lazy"
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
          track("vsl_thankyou_video_click", { location });
          trackServer("vsl_thankyou_video_click");
        }}
      >
        Eğitimi YouTube&apos;da İzle →
      </a>
    </div>
  );
}
