import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { getEpisodes } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { formatDate } from "@/lib/date";

export const metadata = {
  title: "Podcast — Fitness Pazarlama Anatomisi",
  description: "Antrenör gibi değil, fitness girişimcisi gibi düşün. Her Çarşamba 18:00.",
  alternates: { canonical: "/podcast" },
};

export const revalidate = 60;

export default async function PodcastPage() {
  const episodes = await getEpisodes();

  return (
    <>
      <section className="glow-bg">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center">
          <Reveal>
            <div className="text-xs font-medium text-cyan">🎙️ Podcast</div>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Fitness Pazarlama Anatomisi
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-gray-400">
              Antrenör gibi değil, fitness girişimcisi gibi düşün. Her Çarşamba 18:00.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mx-auto mt-8 max-w-2xl overflow-hidden rounded-xl border border-navy-600">
              <iframe
                title="Fitness Pazarlama Anatomisi"
                src="https://open.spotify.com/embed/show/0ZkEtnn8BB8ZUXfLtTSwHu"
                width="100%"
                height="232"
                frameBorder="0"
                allow="encrypted-media"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="mb-8 text-2xl font-bold sm:text-3xl">Bölümler</h2>

        {episodes.length === 0 ? (
          <p className="text-gray-400">Yakında ilk bölümler burada.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {episodes.map((e, i) => (
              <Reveal key={e.slug} delay={(i % 3) * 0.08}>
                <Link href={`/podcast/${e.slug}`} className="card block h-full overflow-hidden">
                  <div className="relative aspect-video bg-navy-800">
                    {e.coverImage ? (
                      <Image src={urlFor(e.coverImage).width(600).height(340).url()} alt={e.title} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-4xl">🎙️</div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="text-xs text-gray-400">
                      {e.episodeLabel ? `${e.episodeLabel} · ` : ""}{formatDate(e.date)}{e.duration ? ` · ${e.duration}` : ""}
                    </div>
                    <h3 className="mt-2 text-lg font-semibold leading-snug">{e.title}</h3>
                    {e.description && <p className="mt-2 line-clamp-2 text-sm text-gray-400">{e.description}</p>}
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
