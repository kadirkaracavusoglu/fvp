import { SITE } from "@/lib/site";
import { Reveal } from "@/components/Reveal";

// JTBD — koçun gerçek acısı (status quo'nun bedeli)
const acilar = [
  { t: "Her ay sıfırdan", d: "Geçen ayın danışanları bitince ay yeniden boş başlıyor. Gelir tahmin edilemiyor." },
  { t: "İyi antrenör, görünmez marka", d: "İşini iyi yapıyorsun ama piyasa seni görmüyor. Kalite tek başına müşteri getirmiyor." },
  { t: "İlgi var, satış yok", d: "Mesaj geliyor, görüşme oluyor ama iş bağlanmıyor. Gelen ilgi paraya dönmüyor." },
];

// Why FvP — neyi birlikte kuruyoruz
const kapsam = [
  { t: "Konumlandırma", d: "Kime, neden sen? Kalabalıkta ayrışan bir marka ekseni." },
  { t: "İçerik & Trafik", d: "Talep yaratan içerik ve reklam sistemleri." },
  { t: "Funnel", d: "Gelen ilgiyi adım adım satışa çeviren yapı." },
  { t: "CRM & Otomasyon", d: "Takip, satış süreci ve AI destekli operasyon." },
];

const surec = [
  { n: "1", t: "Ücretsiz Görüşme", d: "İşini konuşup gerçek engeli netleştiriyoruz." },
  { n: "2", t: "Sistem Kurulumu", d: "Konumlanmadan funnel'a yapıyı kuruyoruz." },
  { n: "3", t: "Büyüme", d: "Ölçüp iyileştiriyor, sistemi ölçekliyoruz." },
];

export const metadata = {
  title: "Danışmanlık",
  description:
    "FitSistem Birebir Danışmanlık — konumlanmadan funnel'a, içerikten CRM'e fitness işini sisteme oturt. Her ay sıfırdan başlamayı bitir.",
  alternates: { canonical: "/danismanlik" },
};

export default function DanismanlikPage() {
  return (
    <>
      {/* Hero — JTBD acısı + değişim çağrısı */}
      <section className="glow-bg">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center">
          <Reveal>
            <div className="text-xs font-medium text-cyan">FitSistem Birebir Danışmanlık</div>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              İşini şansa değil, sisteme oturt.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-400">
              İyi antrenör olmak yetmiyor. Fitness işi büyümüyorsa sorun yeteneğinde değil —
              düzenli müşteri getiren bir sistemin olmamasında. O sistemi, ekip değil doğrudan
              Kadir ile birlikte kuruyoruz.
            </p>
            <a href={SITE.cta.gorusme} target="_blank" rel="noreferrer" className="btn-primary mt-8 inline-block px-8 py-3">
              Ücretsiz 30 Dk Görüşme Ayarla
            </a>
          </Reveal>
        </div>
      </section>

      {/* Neden değişmeli — status quo'nun bedeli */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <Reveal>
          <h2 className="mb-3 text-2xl font-bold sm:text-3xl">Tanıdık geldi mi?</h2>
          <p className="mb-8 max-w-2xl text-gray-400">
            Bunların ortak sebebi tek: sistem yokluğu. &quot;Böyle idare ederim&quot; demek en
            pahalı karar — çünkü her geçen ay aynı yerde başlıyorsun.
          </p>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-3">
          {acilar.map((a, i) => (
            <Reveal key={a.t} delay={i * 0.08}>
              <div className="card h-full p-6">
                <h3 className="text-lg font-semibold text-cyan">{a.t}</h3>
                <p className="mt-2 text-sm text-gray-400">{a.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Why FvP — Kapsam */}
      <section className="border-y border-navy-600 bg-navy-800">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="mb-8 text-2xl font-bold sm:text-3xl">Neyi birlikte kuruyoruz?</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {kapsam.map((k, i) => (
              <Reveal key={k.t} delay={i * 0.08}>
                <div className="card h-full p-6">
                  <h3 className="text-lg font-semibold text-cyan">{k.t}</h3>
                  <p className="mt-2 text-sm text-gray-400">{k.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Süreç */}
      <section className="mx-auto max-w-5xl px-5 py-16">
        <h2 className="mb-8 text-2xl font-bold sm:text-3xl">Nasıl ilerliyor?</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {surec.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <div className="card h-full p-6">
                <div className="text-3xl font-bold text-cyan">{s.n}</div>
                <h3 className="mt-3 text-lg font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm text-gray-400">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Neden şimdi + CTA */}
      <section className="border-t border-navy-600 bg-navy-800">
        <div className="mx-auto max-w-3xl px-5 py-20 text-center">
          <Reveal>
            <h2 className="text-2xl font-bold sm:text-3xl">Neden şimdi?</h2>
            <p className="mx-auto mt-3 max-w-xl text-gray-400">
              Pazar her gün kalabalıklaşıyor, yapay zeka bilgiyi ücretsizleştirdi. Sistem kuran
              öne geçiyor, geç kalan görünmez oluyor. Baskı yok — 30 dakikada işini konuşup
              net bir yol haritası çıkarıyoruz.
            </p>
            <a href={SITE.cta.gorusme} target="_blank" rel="noreferrer" className="btn-primary mt-8 inline-block px-8 py-3">
              Ücretsiz Görüşme Ayarla
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
