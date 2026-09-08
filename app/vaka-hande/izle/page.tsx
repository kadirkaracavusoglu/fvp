import { Reveal } from "@/components/Reveal";
import { VslWatch } from "@/components/lp/VslWatch";
import { VAKA_HANDE } from "@/lib/funnel";

// VSL İZLEME sayfası (Hande vakası) — opt-in SONRASI. Guard opt-in'siz gireni
// /vaka-hande'ye yollar. CTA yalnız 10 dk izlenince açılır.

export default function VakaHandeIzlePage() {
  return (
    <>
      <section className="glow-bg">
        <div className="mx-auto max-w-4xl px-5 pb-8 pt-16 text-center sm:pt-20">
          <Reveal delay={0.08}>
            <h1 className="mx-auto mt-6 max-w-3xl text-balance text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
              Hande ile 1,5 ayda ve tek bir reklam vermeden ilk 7 danışanı nasıl
              kazandığımızı şimdi adım adım göreceksin.
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-400">
              Önce Hande&apos;nin nereden başladığını ve süreçte birlikte neleri
              değiştirdiğimizi göreceksin. Sonra aynı sistemi kendi online
              koçluk işinde nasıl kurabileceğini anlatacağım.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-16">
        <Reveal delay={0.1}>
          <VslWatch
            videoId={VAKA_HANDE.videoId}
            unlockKey={VAKA_HANDE.unlockKey}
            ctaKey={VAKA_HANDE.ctaKey}
            backHref="/vaka-hande"
            basvuruHref="/vaka-hande/basvuru"
            ctaText="Aynı Sistemi Kendi İşime Kurmak İstiyorum →"
            location="vaka-hande"
          />
        </Reveal>
      </section>
    </>
  );
}
