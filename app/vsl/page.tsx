import { SITE } from "@/lib/site";
import { Reveal } from "@/components/Reveal";
import { VslFunnel } from "@/components/lp/VslFunnel";

// ⚙️ Konumlandırma/CTA Kadir tarafından yönlendirilecek. Video, başlık ve
// alttaki çağrı tek yerden değiştirilir. Görünüm: sitenin açık teması (native).
const VSL = {
  videoId: "DwMVqyS20Bo", // taslak: "10 ayda 9M TL" vaka videosu (26:57)
  headline: "Bir fitness koçunun online koçluk işini 10 ayda nasıl 9.000.000 TL'ye büyüttük?",
  sub: "Şansla değil, sistemle. Adım adım, gerçek rakamlarla anlatıyorum.",
};

export default function VslPage() {
  return (
    <>
      {/* Hero — tez cümlesi, dikkat videoya */}
      <section className="glow-bg">
        <div className="mx-auto max-w-4xl px-5 pb-8 pt-16 text-center sm:pt-20">
          <Reveal>
            <span className="chip inline-block px-4 py-1 text-xs" data-active="true">
              {SITE.belief}
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mx-auto mt-6 max-w-3xl text-balance text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
              {VSL.headline}
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-400">{VSL.sub}</p>
          </Reveal>
        </div>
      </section>

      {/* Opt-in kapısı → video → CTA */}
      <section className="mx-auto max-w-4xl px-5 pb-16">
        <Reveal delay={0.1}>
          <VslFunnel videoId={VSL.videoId} />
        </Reveal>
      </section>
    </>
  );
}
