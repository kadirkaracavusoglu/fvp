import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { NewsletterForm } from "@/components/NewsletterForm";
import { getGuides } from "@/sanity/lib/queries";
import { CATEGORIES } from "@/lib/site";
import { coverUrl } from "@/lib/cover";

export const metadata = {
  title: "Rehberler",
  description:
    "Fitness işini büyütmek için kalıcı rehberler: online antrenör nasıl olunur, fiyat nasıl belirlenir, koçluk işi nasıl büyütülür. Aradığınız cevap burada.",
  alternates: { canonical: "/rehber" },
};

export const revalidate = 60;

function catLabel(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}
function catEmoji(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug)?.emoji ?? "•";
}

export default async function RehberPage() {
  const guides = await getGuides();

  return (
    <>
      <section className="glow-bg">
        <div className="mx-auto max-w-3xl px-5 py-20 text-center">
          <Reveal>
            <div className="text-xs font-medium text-cyan">📘 Rehberler</div>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Fitness işini büyütmenin kalıcı rehberleri.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-gray-400">
              Bülten bu haftayı anlatır; rehberler ise hep aradığınız sorulara net cevap verir.
              Online antrenörlükten fiyatlamaya, işinizi büyütmenin temellerini burada bulursunuz.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((g, i) => (
            <Reveal key={g.slug} delay={(i % 3) * 0.08}>
              <Link href={`/rehber/${g.slug}`} className="card block h-full overflow-hidden">
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverUrl({ title: g.title, category: g.category, coverImage: g.coverImage }, 700)}
                    alt={g.title}
                    className="aspect-[1200/630] w-full object-cover"
                    loading="lazy"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-[#0d204d] px-3 py-1 text-xs font-medium text-white">
                    {catEmoji(g.category)} {catLabel(g.category)}
                  </span>
                </div>
                <div className="p-6">
                  <h2 className="text-lg font-semibold leading-snug">{g.title}</h2>
                  <p className="mt-2 line-clamp-3 text-sm text-gray-400">{g.excerpt}</p>
                  <span className="mt-4 inline-block text-sm font-medium text-cyan">Rehberi oku →</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-20">
        <Reveal>
          <div className="card p-10 text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">Her hafta sektörün nabzı gelen kutunuzda.</h2>
            <p className="mx-auto mt-3 mb-6 max-w-xl text-gray-400">
              Rehberler kalıcı; bülten güncel. İkisiyle birlikte bir adım öndesiniz.
            </p>
            <NewsletterForm />
          </div>
        </Reveal>
      </section>
    </>
  );
}
