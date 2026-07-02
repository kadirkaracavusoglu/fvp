import { SITE } from "@/lib/site";
import { Reveal } from "@/components/Reveal";
import { ContactForm } from "@/components/ContactForm";

export const metadata = {
  title: "İletişim",
  description: "Fitness ve Pazarlama ile iletişime geç: WhatsApp topluluk, e-posta ve ücretsiz strateji görüşmesi.",
  alternates: { canonical: "/iletisim" },
};

const CONTACT_EMAIL = SITE.email;

const kanallar = [
  {
    title: "WhatsApp Topluluk",
    desc: "İşini ciddiye alanların odasına katıl, soru sor, örneklerden öğren.",
    cta: "Topluluğa Gir",
    href: SITE.cta.whatsapp,
    icon: "💬",
  },
  {
    title: "Ücretsiz Strateji Görüşmesi",
    desc: "30 dakikada işini konuşup net bir yol haritası çıkaralım. Baskı yok.",
    cta: "Randevu Ayarla",
    href: SITE.cta.gorusme,
    icon: "📅",
  },
  {
    title: "E-posta",
    desc: "İş birliği, soru veya öneri için doğrudan yaz.",
    cta: CONTACT_EMAIL,
    href: `mailto:${CONTACT_EMAIL}`,
    icon: "✉️",
  },
];

export default function IletisimPage() {
  return (
    <>
      <section className="glow-bg">
        <div className="mx-auto max-w-3xl px-5 py-20 text-center">
          <Reveal>
            <div className="text-xs font-medium text-cyan">İletişim</div>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Konuşalım.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-gray-400">
              Sorun, iş birliği fikrin ya da işini büyütmek için bir planın mı var?
              Sana en uygun kanaldan ulaş.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {kanallar.map((k, i) => (
            <Reveal key={k.title} delay={i * 0.08}>
              <a
                href={k.href}
                target={k.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noreferrer"
                className="card flex h-full flex-col p-6"
              >
                <div className="text-3xl">{k.icon}</div>
                <h3 className="mt-4 text-lg font-semibold">{k.title}</h3>
                <p className="mt-2 flex-1 text-sm text-gray-400">{k.desc}</p>
                <span className="mt-5 text-sm font-semibold text-cyan">{k.cta} →</span>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* İletişim formu */}
      <section className="mx-auto max-w-3xl px-5 pb-16">
        <Reveal>
          <h2 className="mb-6 text-center text-2xl font-bold sm:text-3xl">Bize yaz</h2>
          <ContactForm />
        </Reveal>
      </section>

      <section className="mx-auto max-w-3xl px-5 pb-20 text-center">
        <Reveal>
          <div className="text-sm text-gray-400">
            Bizi takip et:{" "}
            <a href={SITE.social.instagram} target="_blank" rel="noreferrer" className="text-cyan hover:underline">Instagram</a>
            {" · "}
            <a href={SITE.social.youtube} target="_blank" rel="noreferrer" className="text-cyan hover:underline">YouTube</a>
            {" · "}
            <a href={SITE.social.linkedin} target="_blank" rel="noreferrer" className="text-cyan hover:underline">LinkedIn</a>
            {" · "}
            <a href={SITE.social.spotify} target="_blank" rel="noreferrer" className="text-cyan hover:underline">Spotify</a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
