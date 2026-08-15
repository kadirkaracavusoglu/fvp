import { SITE } from "@/lib/site";
import { Reveal } from "@/components/Reveal";
import { VslWatch } from "@/components/lp/VslWatch";
import { VSL_VIDEO } from "@/lib/funnel";

// VSL İZLEME sayfası — opt-in SONRASI. Kilitli değil; guard opt-in'siz gireni
// /vsl/optin'e yollar. Reklam /vsl/optin'e gelir, form dolunca buraya yönlenir.
// Görünüm: sitenin açık teması (native, chrome yok).

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
              {VSL_VIDEO.headline}
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-400">{VSL_VIDEO.sub}</p>
          </Reveal>
        </div>
      </section>

      {/* Video + 5 dk sonra CTA (guard içeride) */}
      <section className="mx-auto max-w-4xl px-5 pb-16">
        <Reveal delay={0.1}>
          <VslWatch videoId={VSL_VIDEO.videoId} />
        </Reveal>
      </section>
    </>
  );
}
