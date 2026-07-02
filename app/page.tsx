import Link from "next/link";
import { SITE } from "@/lib/site";
import { Reveal } from "@/components/Reveal";
import { ContentFeed } from "@/components/ContentFeed";
import { getPosts, getEpisodes } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { formatDate } from "@/lib/date";
import { NewsletterForm } from "@/components/NewsletterForm";

export const revalidate = 60;

export default async function Home() {
  const [posts, episodes] = await Promise.all([getPosts(), getEpisodes()]);
  const recentEpisodes = episodes.slice(0, 3);

  return (
    <>
      {/* Hero — tek amaç: bülten kaydı */}
      <section className="glow-bg">
        <div className="mx-auto max-w-4xl px-5 py-24 text-center sm:py-32">
          <Reveal>
            <span className="chip inline-block px-4 py-1 text-xs" data-active="true">
              {SITE.belief}
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
              {SITE.hero.title}
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
              {SITE.hero.subtitle}
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-10">
              <NewsletterForm />
            </div>
          </Reveal>
        </div>
      </section>

      {/* FvP nedir — net tanım */}
      <section className="border-y border-navy-600 bg-navy-800">
        <div className="mx-auto max-w-4xl px-5 py-14 text-center">
          <Reveal>
            <p className="text-xl font-semibold leading-relaxed text-[#0d204d] sm:text-2xl">
              Fitness ve Pazarlama; fitness sektörünü tümüyle{" "}
              <span className="text-cyan">pazarlama merceğinden</span> süzen bağımsız bir
              medya ve topluluktur.
            </p>
          </Reveal>
        </div>
      </section>

      {/* İçerik akışı (blog) */}
      <ContentFeed allPosts={posts} heading="Son İçerikler" />

      {/* Podcast akışı */}
      {recentEpisodes.length > 0 && (
        <section className="border-t border-navy-600 bg-navy-800">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="text-xs font-medium text-cyan">🎙️ Podcast</div>
                <h2 className="mt-1 text-2xl font-bold sm:text-3xl">Fitness Pazarlama Anatomisi</h2>
              </div>
              <Link href="/podcast" className="text-sm font-medium text-cyan hover:underline">
                Tüm bölümler →
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recentEpisodes.map((e, i) => (
                <Reveal key={e.slug} delay={(i % 3) * 0.08}>
                  <Link href={`/podcast/${e.slug}`} className="card block h-full overflow-hidden">
                    {e.coverImage ? (
                      <div className="relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={urlFor(e.coverImage).width(600).height(600).url()} alt={e.title} className="aspect-square w-full object-cover" loading="lazy" />
                        {e.episodeLabel && (
                          <span className="absolute left-3 top-3 rounded-full bg-[#0d204d] px-3 py-1 text-xs font-medium text-white">
                            🎙️ {e.episodeLabel}
                          </span>
                        )}
                      </div>
                    ) : null}
                    <div className="p-6">
                      <div className="text-xs font-medium text-cyan">
                        {formatDate(e.date)}{e.duration ? ` · ${e.duration}` : ""}
                      </div>
                      <h3 className="mt-2 text-lg font-semibold leading-snug">{e.title}</h3>
                      {e.description && <p className="mt-2 line-clamp-2 text-sm text-gray-400">{e.description}</p>}
                      <span className="mt-4 inline-block text-sm font-medium text-cyan">Dinle →</span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bülten CTA */}
      <section className="mx-auto max-w-4xl px-5 py-16">
        <Reveal>
          <div className="card p-10 text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">Haftada 2 e-posta. Boş laf yok.</h2>
            <p className="mx-auto mt-3 mb-6 max-w-xl text-gray-400">
              Fitness işinde gerçekten ne işe yarıyor? İsimler, rakamlar, örnekler — doğrudan gelen kutuna.
            </p>
            <NewsletterForm />
          </div>
        </Reveal>
      </section>
    </>
  );
}
