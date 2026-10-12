import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { VAKA_HANDE } from "@/lib/funnel";

// /vaka-analizi funnel'ının meta etiketleri — tek yerde.
// Neden: bu sayfalar kök layout'tan ana sayfanın başlık/açıklama/görsel/canonical'ını
// devralıyordu (canonical + og:url ana sayfayı gösteriyordu). Link önizlemesi
// (WhatsApp/IG/Meta) ve reklam paylaşımları artık sayfanın kendi bilgisini gösterir.
// Metinler sayfanın kendi içeriğinden alındı; yeni iddia eklenmedi.
// Sayfalar arama motoruna kapalı kalır (robots noindex).

const DESCRIPTION =
  "27 dakikalık vaka analizinde Hande Hoca'nın sıfırdan online koçluğa geçişini ve Fitsistem'i hangi sırayla kurduğumuzu gerçek süreç üzerinden izleyin.";

const IMAGE = `https://i.ytimg.com/vi/${VAKA_HANDE.videoId}/maxresdefault.jpg`;

export function vakaMeta(opts: { title: string; path: string; absolute?: boolean }): Metadata {
  const { title, path, absolute } = opts;
  const full = absolute ? title : `${title} — ${SITE.name}`;
  return {
    title: absolute ? { absolute: title } : title,
    description: DESCRIPTION,
    alternates: { canonical: path },
    robots: { index: false, follow: false },
    openGraph: {
      type: "website",
      locale: SITE.locale,
      siteName: SITE.name,
      url: path,
      title: full,
      description: DESCRIPTION,
      images: [{ url: IMAGE, width: 1280, height: 720, alt: "Vaka analizi videosu kapağı" }],
    },
    twitter: {
      card: "summary_large_image",
      title: full,
      description: DESCRIPTION,
      images: [IMAGE],
    },
  };
}
