import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { SITE, CATEGORIES, readingTime } from "@/lib/site";
import { Reveal } from "@/components/Reveal";
import { formatDate } from "@/lib/date";
import { coverUrl } from "@/lib/cover";
import { getPostsByCategory } from "@/sanity/lib/queries";

export const revalidate = 60;

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) return { title: "Kategori" };
  return {
    title: `${cat.label} — ${SITE.name}`,
    description: `Fitness sektörü ${cat.label.toLowerCase()} üzerine yazılar — iş ve büyüme gözüyle.`,
    alternates: { canonical: `/kategori/${slug}` },
  };
}

export default async function KategoriPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) notFound();
  const posts = await getPostsByCategory(slug);

  return (
    <>
      <section className="glow-bg">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center">
          <Reveal>
            <div className="text-xs font-medium text-cyan">{cat.emoji} Kategori</div>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">{cat.label}</h1>
            <p className="mx-auto mt-4 max-w-xl text-gray-400">
              Fitness sektörü {cat.label.toLowerCase()} üzerine tüm yazılar.
            </p>
          </Reveal>
          {/* Diğer kategoriler */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/kategori/${c.slug}`}
                className="chip px-3 py-1 text-xs"
                data-active={c.slug === slug}
              >
                {c.emoji} {c.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        {posts.length === 0 ? (
          <p className="text-center text-gray-400">Bu kategoride henüz yazı yok.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 0.08}>
                <Link href={`/yazi/${p.slug}`} className="card block h-full overflow-hidden">
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={coverUrl(p, 700)} alt={p.title} className="aspect-[1200/630] w-full object-cover" loading="lazy" />
                    <span className="absolute left-3 top-3 rounded-full bg-navy px-3 py-1 text-xs font-medium text-white">
                      {cat.emoji} {cat.label}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold leading-snug">{p.title}</h3>
                    <p className="mt-2 text-sm text-gray-400">{p.excerpt}</p>
                    <div className="mt-4 text-xs text-gray-400">
                      {formatDate(p.date)} · {readingTime(p.chars)} dk okuma
                    </div>
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
