import { SITE } from "@/lib/site";
import { Reveal } from "@/components/Reveal";

const faydalar = [
  "Fitness girişimcileriyle aynı odada ol — yalnız çalışmıyorsun",
  "Soru sor, gerçek örneklerden ve sektörün nabzından öğren",
  "Yeni içerik, podcast ve fırsatlardan ilk sen haberdar ol",
];

export const metadata = {
  title: "Topluluk",
  description: "Fitness işini ciddiye alanların WhatsApp topluluğuna katıl.",
  alternates: { canonical: "/topluluk" },
};

export default function ToplulukPage() {
  return (
    <section className="glow-bg min-h-[75vh]">
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <Reveal>
          <div className="text-xs font-medium text-cyan">💬 Topluluk</div>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            İşini ciddiye alanların odası.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-gray-400">
            Fitness işini büyütmek isteyenlerin buluştuğu WhatsApp topluluğuna katıl.
            Baskı yok, satış yok — önce tanış, sektörü konuş, sonrası kendiliğinden gelir.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <ul className="mx-auto mt-10 max-w-lg space-y-3 text-left">
            {faydalar.map((f) => (
              <li key={f} className="card flex items-start gap-3 p-4 text-sm">
                <span className="text-cyan">✓</span>
                <span className="text-gray-100">{f}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.2}>
          <a href={SITE.cta.whatsapp} target="_blank" rel="noreferrer" className="btn-primary mt-10 inline-block px-8 py-3">
            WhatsApp Topluluğa Katıl
          </a>
        </Reveal>
      </div>
    </section>
  );
}
