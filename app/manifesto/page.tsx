import { SITE } from "@/lib/site";
import { Reveal } from "@/components/Reveal";

export const metadata = {
  title: "Manifesto",
  description:
    `${SITE.belief} ${SITE.name} manifestosu. ${SITE.author.name}.`,
  alternates: { canonical: "/manifesto" },
};

export default function ManifestoPage() {
  return (
    <>
      <section className="glow-bg">
        <div className="mx-auto max-w-3xl px-5 py-20 text-center">
          <Reveal>
            <div className="text-xs font-medium text-cyan">Manifesto</div>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              {SITE.belief}
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-5 py-8 pb-20">
        <Reveal>
          <div className="space-y-5 text-lg leading-relaxed text-gray-100">
            <p>
              <strong>{SITE.name}</strong>, fitness sektörünün gündemini, işini
              ve geleceğini konuşan bağımsız bir medya ve topluluk. Amaç basit: bu işi
              ciddiye alan koçlara, salon sahiplerine ve markalara sektörü anlamayı ve
              işini büyütmeyi kolaylaştırmak.
            </p>
            <p>
              Antrenör gibi değil, fitness girişimcisi gibi düşünmeni istiyoruz. Çünkü
              fitness işi şansa, yeteneğe ya da güne değil; kurulabilir, tekrarlanabilir bir
              sisteme dayanır.
            </p>
            <p>
              Burayı <strong>{SITE.author.name}</strong> yürütüyor. Podcast, bülten ve
              toplulukla büyüyen bu yapı; zamanla üyelerin ve gerçek vakaların kanıtıyla
              besleniyor. Göster, anlatma — ilkesi bu.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-12 flex flex-wrap gap-3">
            <a href={SITE.cta.bulten} target="_blank" rel="noreferrer" className="btn-primary px-6 py-3">
              Bülten'e Katıl
            </a>
            <a href={SITE.cta.whatsapp} target="_blank" rel="noreferrer" className="btn-ghost px-6 py-3">
              Topluluğa Gir
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
