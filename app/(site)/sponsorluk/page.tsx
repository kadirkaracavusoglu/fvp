import { Reveal } from "@/components/Reveal";
import { ContactForm } from "@/components/ContactForm";

export const metadata = {
  title: "Sponsorluk",
  description:
    "Fitness ve wellness ekosistemindeki karar vericilere ulaş. Bülten, podcast ve toplulukta sponsorluk fırsatları.",
  alternates: { canonical: "/sponsorluk" },
};

const kanallar = [
  {
    title: "Bülten",
    desc: "Haftada 2 kez, doğrudan gelen kutusuna. Sektörün karar vericileri okuyor.",
    metric: "Yerleşik reklam alanı",
    icon: "📩",
  },
  {
    title: "Podcast",
    desc: "Fitness Pazarlama Anatomisi bölümlerinde okunan sponsor mesajı.",
    metric: "Bölüm içi okuma",
    icon: "🎙️",
  },
  {
    title: "Topluluk & Sosyal",
    desc: "WhatsApp topluluğu ve sosyal kanallarda görünürlük.",
    metric: "Doğrudan erişim",
    icon: "💬",
  },
];

const kime = [
  "Supplement, ekipman, giyim ve gıda markaları",
  "Fitness SaaS, yazılım ve ajanslar",
  "Eğitim şirketleri ve etkinlik organizatörleri",
  "Wellness merkezleri ve kurumsal wellness çözümleri",
];

export default function SponsorlukPage() {
  return (
    <>
      <section className="glow-bg">
        <div className="mx-auto max-w-3xl px-5 py-20 text-center">
          <Reveal>
            <div className="text-xs font-medium text-cyan">Sponsorluk</div>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Doğru kitleye, doğru yerden ulaş.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-400">
              Fitness ve wellness ekosistemindeki koçlara, salon sahiplerine ve
              karar vericilere markanı tanıt. Rastgele reklam değil, güvenilen bir
              sesin yanında yer al.
            </p>
            <a href="#form" className="btn-primary mt-8 inline-block px-8 py-3">
              Sponsorluk İçin Başvur
            </a>
          </Reveal>
        </div>
      </section>

      {/* Kanallar */}
      <section className="mx-auto max-w-5xl px-5 py-16">
        <h2 className="mb-8 text-2xl font-bold sm:text-3xl">Nerede görünürsün?</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {kanallar.map((k, i) => (
            <Reveal key={k.title} delay={i * 0.08}>
              <div className="card h-full p-6">
                <div className="text-3xl">{k.icon}</div>
                <h3 className="mt-4 text-lg font-semibold">{k.title}</h3>
                <p className="mt-2 text-sm text-gray-400">{k.desc}</p>
                <div className="mt-4 text-xs font-medium text-cyan">{k.metric}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Kime uygun */}
      <section className="border-y border-navy-600 bg-navy-800">
        <div className="mx-auto max-w-4xl px-5 py-16">
          <h2 className="mb-8 text-2xl font-bold sm:text-3xl">Kimler için uygun?</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {kime.map((k, i) => (
              <Reveal key={k} delay={i * 0.06}>
                <div className="card flex items-start gap-3 p-5 text-sm">
                  <span className="text-cyan">✓</span>
                  <span className="text-gray-100">{k}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section id="form" className="mx-auto max-w-3xl scroll-mt-20 px-5 py-20">
        <Reveal>
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">Konuşalım.</h2>
            <p className="mx-auto mt-3 max-w-xl text-gray-400">
              Markana en uygun paketi birlikte çıkaralım. Aşağıdaki formu doldur,
              medya kiti ve güncel erişim rakamlarıyla dönelim.
            </p>
          </div>
          <ContactForm multi multiTitle="Hangi alanlarla ilgileniyorsun? (birden fazla seçebilirsin)" />
        </Reveal>
      </section>
    </>
  );
}
