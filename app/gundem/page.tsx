import Link from "next/link";
import { formatDate } from "@/lib/date";
import { coverUrl } from "@/lib/cover";
import { CATEGORIES } from "@/lib/site";
import { Reveal } from "@/components/Reveal";
import { getPostsByCategory } from "@/sanity/lib/queries";

export const metadata = {
  title: "Gündem — Fitness ve Pazarlama",
  description: "Fitness sektöründe bu hafta: trendler, haberler, dikkat çeken hamleler.",
};

export const revalidate = 60;

export default async function GundemPage() {
  const posts = await getPostsByCategory("gundem");
  const cat = CATEGORIES.find((c) => c.slug === "gundem")!;

  return (
    <>
      <section className="glow-bg">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center">
          <Reveal>
            <div className="text-xs font-medium text-cyan">{cat.emoji} Gündem</div>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Fitness sektöründe bu hafta
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-gray-400">
              Sektörün nabzı: trendler, haberler ve dikkat çeken hamleler — pazarlama merceğinden.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        {posts.length === 0 ? (
          <p className="text-center text-gray-400">Yakında ilk gündem yazıları burada.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 0.08}>
                <Link href={`/yazi/${p.slug}`} className="card block h-full overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={coverUrl(p, 700)} alt={p.title} className="aspect-[1200/630] w-full object-cover" loading="lazy" />
                  <div className="p-6">
                    <div className="mb-2 text-xs font-medium text-cyan">{cat.emoji} {cat.label}</div>
                    <h3 className="text-lg font-semibold leading-snug">{p.title}</h3>
                    <p className="mt-2 text-sm text-gray-400">{p.excerpt}</p>
                    <div className="mt-4 text-xs text-gray-400">{formatDate(p.date)}</div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
