"use client";

import { track, trackServer } from "@/lib/tracking";

// Randevu sonrası (teşekkür) sayfasında görüşmeye kadar izlenecek ücretsiz eğitim.
// Tıklama olayı panelin "teşekkür videosu tıklaması" metriğine sayılır.
const VIDEO_ID = "BxA2Vt5A2nE"; // "Fitness Antrenörü Olarak Online Koçluk İşine Nasıl Başlarsın?" (~80 dk)
const VIDEO_URL = `https://www.youtube.com/watch?v=${VIDEO_ID}`;
const EMBED_URL = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?rel=0`;

type Props = {
  location: string;
  /** Varsayılan: 80 dk'lık eğitim (Fitsistem teşekkür sayfası). */
  videoId?: string;
  heading?: string;
  description?: string;
  iframeTitle?: string;
  buttonLabel?: string;
};

export function OnGorusmeEgitimi({
  location,
  videoId = VIDEO_ID,
  heading = "Görüşmeye kadar izleyebileceğin ücretsiz bir eğitim",
  description = `Online koçluk işinizi sıfırdan nasıl kuracağınızı adım adım anlattığım
        yaklaşık 80 dakikalık eğitim. Görüşmeden önce izlersen temel konulara
        zaman ayırmadan doğrudan sizin işinize odaklanabiliriz. Hepsini izlemek
        zorunda değilsiniz; size uygun bölümlerden başlayabilirsiniz.`,
  iframeTitle = "Fitness antrenörü olarak online koçluk işine nasıl başlanır",
  buttonLabel = "Eğitimi YouTube'da İzle →",
}: Props) {
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`;
  return (
    <div className="mt-10 text-center">
      <h2 className="text-xl font-bold text-[#0d204d] sm:text-2xl">
        {heading}
      </h2>
      <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-400">{description}</p>
      <div className="mt-6 overflow-hidden rounded-2xl border border-[#e6e8ea] bg-black shadow-2xl">
        <iframe
          src={embedUrl}
          title={iframeTitle}
          className="aspect-video w-full"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      <a
        href={videoUrl}
        target="_blank"
        rel="noreferrer"
        className="btn-primary mt-6 inline-block px-8 py-4 text-base"
        onClick={() => {
          track("vsl_thankyou_video_click", { location });
          trackServer("vsl_thankyou_video_click");
        }}
      >
        {buttonLabel}
      </a>
    </div>
  );
}
