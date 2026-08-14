import { VslPlayer } from "@/components/lp/VslPlayer";

// ⚙️ TASLAK — konumlandırma/CTA Kadir tarafından yönlendirilecek.
// Video, başlık ve alt CTA aşağıda tek yerden değiştirilir.
const VSL = {
  videoId: "DwMVqyS20Bo", // taslak: "10 ayda 9M TL" vaka videosu (26:57)
  eyebrow: "Fitness ve Pazarlama",
  headline: "Bir fitness koçunun online koçluk işini 10 ayda nasıl 9.000.000 TL'ye büyüttük?",
  sub: "Şansla değil, sistemle. Adım adım, gerçek rakamlarla anlatıyorum.",
};

export default function VslPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-4 py-10 sm:py-14">
      {/* Üst: tez cümlesi (dikkat videoya) */}
      <div className="mb-6 text-center sm:mb-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#22d3ee]">
          {VSL.eyebrow}
        </span>
        <h1 className="mx-auto mt-3 max-w-3xl text-balance text-2xl font-bold leading-tight sm:text-4xl">
          {VSL.headline}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-white/70 sm:text-base">{VSL.sub}</p>
      </div>

      {/* Video — sayfanın varış noktası */}
      <VslPlayer videoId={VSL.videoId} autoplay />

      {/* Alt CTA alanı — TASLAK placeholder (Kadir yönlendirecek) */}
      <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center">
        <p className="text-sm text-white/60">
          ⚙️ CTA alanı — hedef netleştiğinde buraya gelecek (bülten kaydı / topluluk / görüşme).
        </p>
      </div>
    </main>
  );
}
