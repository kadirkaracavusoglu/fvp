"use client";

// A/B TESTİ — B VARYANTI (Hande vakası). A varyantı: /vaka-hande.
// 23 Eyl 2026: OPT-IN KAPISI KALDIRILDI (Kadir kararı). Video sayfada doğrudan
// oynuyor; eleme tek noktada, başvuru formunda. E-posta artık yalnız başvuruda
// toplanıyor — izleyip başvurmayan kişi listeye girmez (bilinçli tercih).

import { useEffect } from "react";
import Link from "next/link";
import { VslPlayer } from "@/components/lp/VslPlayer";
import { VAKA_HANDE } from "@/lib/funnel";
import { captureAttribution, track, trackServer } from "@/lib/tracking";
import { WATCH_MINUTES } from "@/lib/video-watch";

const BASVURU_HREF = "/vaka-analizi/basvuru";

export default function VakaAnaliziPage() {
  useEffect(() => {
    captureAttribution();
    track("vsl_optin_view", { location: "vaka-analizi" });
    trackServer("vsl_optin_view");
  }, []);

  function basvuruyaGit(yer: string) {
    track("cta_click", { location: "vaka-analizi", yer });
    trackServer("cta_click", { video: VAKA_HANDE.videoId });
  }

  return (
    <>
      {/* Hero */}
      <section className="glow-bg">
        <div className="mx-auto max-w-4xl px-5 pb-8 pt-16 text-center sm:pt-20">
          <span className="chip inline-block px-4 py-1 text-xs" data-active="true">
            ÜCRETSİZ VAKA ANALİZİ · ONLINE KOÇLUK İŞİNİ KURMAK VEYA BÜYÜTMEK
            İSTEYEN FITNESS KOÇLARI İÇİN
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-balance text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
            Hande Hoca ile Fitsistem&apos;i 1,5 ayda kurduk; ilk duyuruda 65
            başvuru geldi ve 7 online danışan kazandı. Şimdi bu sistemi nasıl
            kurduğumuzu adım adım gösteriyorum.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-400">
            Bu 27 dakikalık vaka analizinde Hande Hoca&apos;nın sıfırdan online
            koçluğa geçerken yaşadığı kafa karışıklığını, Fitsistem&apos;i hangi
            sırayla kurduğumuzu ve içerikten başvuruya, satıştan işin
            sistemleşmesine kadar nasıl ilerlediğimizi gerçek süreç üzerinden
            göreceksin.
          </p>
        </div>
      </section>

      {/* Video — kilitsiz, sayfada doğrudan oynar */}
      <section className="mx-auto max-w-4xl px-5 pb-10">
        <VslPlayer
          videoId={VAKA_HANDE.videoId}
          location="vaka-analizi"
          onMilestone={(name) => {
            // Başvurusu olan kişide izleme süresi GHL'ye yazılır (imzalı çerez).
            if (name in WATCH_MINUTES) {
              void fetch("/api/vsl-progress", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ milestone: name }),
                keepalive: true,
              }).catch(() => {});
            }
          }}
        />
        <div className="mt-6 text-center">
          <Link
            href={BASVURU_HREF}
            onClick={() => basvuruyaGit("video-alti")}
            className="btn-primary inline-block w-full px-8 py-4 text-base sm:w-auto"
          >
            Başvurumu Doldur →
          </Link>
          <p className="mx-auto mt-3 max-w-lg text-sm text-gray-400">
            Birkaç soruyu cevapla, ardından sana uygun görüşme saatini seç.
          </p>
        </div>
      </section>

      {/* Vaka analizinin içeriği — Kadir'in metni (19 Eyl 2026). */}
      <section className="mx-auto max-w-3xl px-5 pb-14">
        <div className="rounded-2xl border border-[#e6e8ea] bg-white/70 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-[#0d204d] sm:text-2xl">
            Bu vaka analizinde göreceğin 3 şey
          </h2>
          <ol className="mt-6 space-y-6">
            {[
              {
                t: "Online koçluk işini hangi sırayla kurman gerektiğini.",
                d: "Hande Hoca nereden başlayacağını bilmiyordu; web sitesi, funnel, satış ve pazarlama gibi birçok konu aynı anda kafasını karıştırıyordu. Videoda bütün bunları hangi sırayla ele aldığımızı ve Fitsistem’i adım adım nasıl kurduğumuzu göreceksin.",
              },
              {
                t: "İçerik üretmekle düzenli danışan kazanmak arasındaki sistemi.",
                d: "İnsanların seni takip etmesi tek başına bir online koçluk işi oluşturmuyor. Hande Hoca’nın mevcut kitlesini nasıl bir hizmete, başvuru sürecine ve satışa bağladığımızı gerçek çalışma üzerinden göreceksin. İlk duyurusunda 65 başvuru gelmesi ve kısa süre içerisinde ilk satışların oluşması da bu sürecin sonucu oldu.",
              },
              {
                t: "Her şey mükemmel olmadan da sistemi nasıl kurabileceğini.",
                d: "Hande Hoca Amerika’da tam zamanlı çalışırken ve online koçluk tarafında hiç deneyimi yokken başladı. Süreci bir anda kusursuz hale getirmeye çalışmak yerine haftalık adımlarla ilerledik, eksikleri süreç içerisinde tamamladık ve işi çalışır hale getirdik.",
              },
            ].map((m, i) => (
              <li key={m.t} className="flex gap-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0d204d] text-sm font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <p className="font-bold text-[#0d204d]">{m.t}</p>
                  <p className="mt-1 text-base text-gray-500">{m.d}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-base text-gray-500">
            İster online koçluğa yeni başlıyor ol ister birkaç danışanın olmasına
            rağmen işi düzenli büyütemiyor ol, videonun sonunda kendi işinde
            hangi parçaların eksik olduğunu ve bir sonraki adımının ne olması
            gerektiğini çok daha net göreceksin.
          </p>
          <Link
            href={BASVURU_HREF}
            onClick={() => basvuruyaGit("icerik-alti")}
            className="btn-primary mt-6 inline-block w-full px-8 py-4 text-base sm:w-auto"
          >
            Başvurumu Doldur →
          </Link>
        </div>
        <p className="mt-8 text-center text-xs text-gray-400">
          Fitness ve Pazarlama · Kadir Karaçavuşoğlu
        </p>
      </section>

    </>
  );
}
