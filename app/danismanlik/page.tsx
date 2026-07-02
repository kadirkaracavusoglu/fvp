import { SITE } from "@/lib/site";
import { Reveal } from "@/components/Reveal";

const kapsam = [
  { t: "Konumlandırma", d: "Kime, neden sen? Ayrışan bir marka ekseni." },
  { t: "İçerik & Trafik", d: "Talep yaratan içerik ve reklam sistemleri." },
  { t: "Funnel", d: "Lead'i satışa çeviren adım adım yapı." },
  { t: "CRM & Otomasyon", d: "Takip, satış süreci ve AI destekli operasyon." },
];

const surec = [
  { n: "1", t: "Ücretsiz Görüşme", d: "İşini konuşup ihtiyacı netleştiriyoruz." },
  { n: "2", t: "Sistem Kurulumu", d: "Konumlanmadan funnel'a yapıyı kuruyoruz." },
  { n: "3", t: "Büyüme", d: "Ölçüp iyileştiriyor, sistemi ölçekliyoruz." },
];

export const metadata = {
  title: "Danışmanlık",
  description:
    "FitSistem Birebir Danışmanlık — konumlanmadan funnel'a, içerikten CRM'e fitness işini sisteme oturt.",
  alternates: { canonical: "/danismanlik" },
};

export default function DanismanlikPage() {
  return (
    <>
      <section className="glow-bg">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center">
          <Reveal>
            <div className="text-xs font-medium text-cyan">FitSistem Birebir Danışmanlık</div>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              İşini şansa değil, sisteme oturt.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-400">
              Konumlanmadan funnel'a, içerikten CRM'e — fitness işini büyüten yapıyı
              birlikte kuruyoruz. Ekip değil, doğrudan Kadir.
            </p>
            <a href={SITE.cta.gorusme} target="_blank" rel="noreferrer" className="btn-primary mt-8 inline-block px-8 py-3">
              Ücretsiz 30 Dk Görüşme Ayarla
            </a>
          </Reveal>
        </div>
      </section>

      {/* Kapsam */}
      <section className="mx-auto max-w-6xl px-5 py-16">
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
      </section>

      {/* Süreç */}
      <section className="border-y border-navy-600 bg-navy-800">
        <div className="mx-auto max-w-5xl px-5 py-16">
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
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-5 py-20 text-center">
        <Reveal>
          <h2 className="text-2xl font-bold sm:text-3xl">Uygun muyuz, konuşarak görelim.</h2>
          <p className="mx-auto mt-3 max-w-xl text-gray-400">
            Baskı yok. 30 dakikada işini konuşup net bir yol haritası çıkarıyoruz.
          </p>
          <a href={SITE.cta.gorusme} target="_blank" rel="noreferrer" className="btn-primary mt-8 inline-block px-8 py-3">
            Ücretsiz Görüşme Ayarla
          </a>
        </Reveal>
      </section>
    </>
  );
}
