"use client";

// FvP bio sayfası (fitnessvepazarlama.com/bio) — tüm platformların profilinde
// tek link. Amaç: gelen kişiyi doğru yere göndermek ve hangi platformdan gelip
// nereye gittiğini ÖLÇMEK.
//
// Ölçüm: sayfaya gelen platform bilgisini korur (ör. /bio?utm_source=instagram),
// içerideki bağlantılara utm_content=bio_<etiket> ekler. İlk dokunuş
// captureAttribution ile donduğu için funnel'da kaynak kaybolmaz.

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SITE } from "@/lib/site";
import { captureAttribution, track, trackServer } from "@/lib/tracking";

type Baglanti = {
  etiket: string;
  baslik: string;
  alt: string;
  href: string;
  dis?: boolean;
  one?: boolean;
};

const BAGLANTILAR: Baglanti[] = [
  {
    etiket: "vaka_analizi",
    baslik: "Ücretsiz vaka analizi: 1,5 ayda 7 online danışan",
    alt: "Hande Hoca ile Fitsistem'i nasıl kurduğumuzu adım adım anlatıyorum.",
    href: "/vaka-analizi",
    one: true,
  },
  {
    etiket: "bulten",
    baslik: "Ücretsiz bülten",
    alt: "Haftada iki kez, fitness işini büyüten stratejiler. Spam yok.",
    href: "/bulten",
  },
  {
    etiket: "podcast",
    baslik: "Fitness Pazarlama Anatomisi (podcast)",
    alt: "Her hafta yeni bölüm. Spotify'da dinle.",
    href: SITE.social.spotify,
    dis: true,
  },
  {
    etiket: "youtube",
    baslik: "YouTube kanalı",
    alt: "Ücretsiz eğitimler ve vaka anlatımları.",
    href: SITE.social.youtube,
    dis: true,
  },
  {
    etiket: "topluluk",
    baslik: "WhatsApp topluluğu",
    alt: "Sektörden koçlarla aynı odada ol.",
    href: SITE.cta.whatsapp,
    dis: true,
  },
];

export default function BioPage() {
  const router = useRouter();

  useEffect(() => {
    captureAttribution();
    track("page_bio_view", { location: "bio" });
    trackServer("page_bio_view");
  }, []);

  // Sunucuda da aynı çıksın diye sade adres; platformdan gelen utm'ler tıklama
  // anında eklenir (aşağıda).
  function hedef(b: Baglanti) {
    return b.dis ? b.href : `${b.href}?utm_source=bio&utm_medium=social&utm_content=bio_${b.etiket}`;
  }

  function tikla(b: Baglanti, e: React.MouseEvent<HTMLAnchorElement>) {
    track("cta_bio_click", { location: "bio", hedef: b.etiket });
    trackServer("cta_bio_click", { meta: { hedef: b.etiket } });
    if (b.dis || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    // Platformdan gelen utm'leri koru (ör. /bio?utm_source=instagram).
    e.preventDefault();
    const p = new URLSearchParams(window.location.search);
    if (!p.get("utm_source")) p.set("utm_source", "bio");
    if (!p.get("utm_medium")) p.set("utm_medium", "social");
    p.set("utm_content", `bio_${b.etiket}`);
    router.push(`${b.href}?${p.toString()}`);
  }

  return (
    <div className="min-h-screen bg-[#0d204d] px-5 py-12 text-white sm:py-16">
      <div className="mx-auto max-w-lg">
        <div className="text-center">
          <Image
            src="/fvp-logo-beyaz.png"
            alt="Fitness ve Pazarlama"
            width={220}
            height={88}
            className="mx-auto h-auto w-[180px]"
            priority
          />
          <h1 className="mt-6 text-2xl font-bold text-white sm:text-3xl">
            Fitness işi şansa değil, sisteme dayanır.
          </h1>
          <p className="mt-3 text-base text-white/70">
            Fitness koçları için bülten, vaka analizleri ve podcast. Nereden
            başlayacağını aşağıdan seç.
          </p>
        </div>

        <div className="mt-9 space-y-3">
          {BAGLANTILAR.map((b) => (
            <a
              key={b.etiket}
              href={hedef(b)}
              onClick={(e) => tikla(b, e)}
              {...(b.dis ? { target: "_blank", rel: "noreferrer" } : {})}
              className={`block rounded-2xl border px-5 py-4 text-left transition hover:bg-white/10 ${
                b.one
                  ? "border-white bg-white/10"
                  : "border-white/25 bg-white/5"
              }`}
            >
              <span className="block font-bold text-white">{b.baslik}</span>
              <span className="mt-1 block text-sm text-white/70">{b.alt}</span>
            </a>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-white/60">
          <a href={SITE.social.instagram} target="_blank" rel="noreferrer" className="hover:text-white">
            Instagram
          </a>
          <a href={SITE.social.linkedin} target="_blank" rel="noreferrer" className="hover:text-white">
            LinkedIn
          </a>
          <Link href="/" className="hover:text-white">
            fitnessvepazarlama.com
          </Link>
        </div>
      </div>
    </div>
  );
}
