import { SITE } from "@/lib/site";
import { Reveal } from "@/components/Reveal";
import { VslPlayer } from "@/components/lp/VslPlayer";
import { NewsletterForm } from "@/components/NewsletterForm";

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

      {/* Video — sayfanın varış noktası */}
      <section className="mx-auto max-w-4xl px-5 pb-4">
        <Reveal delay={0.1}>
          <VslPlayer videoId={VSL.videoId} autoplay />
        </Reveal>
      </section>

      {/* Çağrı — sitenin kanonik CTA'sı (bülten). Hedef netleşince buradan değişir. */}
      <section className="mx-auto max-w-6xl px-5 py-14">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-[#071331] px-6 py-14 text-center sm:px-12">
            <div
              className="pointer-events-none absolute inset-0 opacity-70"
              style={{ background: "radial-gradient(60% 60% at 50% 0%, rgba(34,211,238,0.18), transparent 70%)" }}
            />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-2xl font-bold leading-tight text-white sm:text-3xl">
                Bunun gibi gerçek örnekleri her hafta e-postana gönderelim.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-white/70">
                Fitness işini büyütenlerin okuduğu bülten. İstediğin an çıkarsın.
              </p>
              <div className="mt-8">
                <NewsletterForm variant="onNavy" />
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
