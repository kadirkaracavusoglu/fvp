// A/B testi B varyantı (/vaka-analizi) — /vaka-hande/izle ile aynı içerik, ayrı adres.
import { Reveal } from "@/components/Reveal";
import { VslWatch } from "@/components/lp/VslWatch";
import { VAKA_HANDE } from "@/lib/funnel";

// VSL İZLEME sayfası (Hande vakası) — opt-in SONRASI. Guard opt-in'siz gireni
// /vaka-analizi'ye yollar. CTA yalnız 10 dk izlenince açılır.

export default function VakaHandeIzlePage() {
  return (
    <>
      <section className="glow-bg">
        <div className="mx-auto max-w-4xl px-5 pb-8 pt-16 text-center sm:pt-20">
          <Reveal delay={0.08}>
            <h1 className="mx-auto mt-6 max-w-3xl text-balance text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
              Vaka analizi başlıyor: Hande Hoca ile Fitsistem&apos;i 1,5 ayda
              nasıl kurduk?
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-400">
              Önce Hande Hoca&apos;nın başlangıçtaki kafa karışıklığını, sonra
              Fitsistem&apos;i hangi sırayla kurduğumuzu ve ilk duyuruda 65
              başvurunun nasıl geldiğini göreceksin. İzlerken kendi işinde hangi
              parçanın eksik olduğunu not al; videonun sonunda bir sonraki
              adımın netleşecek.
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
            backHref="/vaka-analizi"
            basvuruHref="/vaka-analizi/basvuru"
            ctaText="Fitsistem’i Kendi İşime Kurmak İstiyorum →"
            location="vaka-analizi"
            note="Sesini açmayı unutma. Yaklaşık 5 dakika sonra bu videonun altında başvuru butonu açılacak. Kısa bir başvuruyla işini anlatıp sana uygun görüşme saatini seçebileceksin."
          />
        </Reveal>
      </section>
    </>
  );
}
