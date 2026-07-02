import Link from "next/link";
import { SITE, COACHES, WHY_FOLLOW } from "@/lib/site";
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

          {/* Yan yana çalıştığımız koçlar */}
          <Reveal delay={0.32}>
            <div className="mt-14">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Yan yana çalıştığımız koçlar
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-5">
                {COACHES.map((c) => (
                  <div key={c.name} className="flex items-center gap-2.5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0d204d] text-sm font-bold text-white">
                      {c.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                    </span>
                    <span className="text-left">
                      <span className="block text-sm font-semibold text-[#0d204d]">{c.name}</span>
                      <span className="block text-xs text-gray-400">{c.role}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Neden bizi takip etmelisin? */}
      <section className="border-y border-navy-600 bg-navy-800">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <Reveal>
            <h2 className="text-center text-2xl font-bold sm:text-3xl">Neden bizi takip etmelisin?</h2>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_FOLLOW.map((w, i) => (
              <Reveal key={w.title} delay={(i % 4) * 0.08}>
                <div className="card h-full p-6">
                  <div className="text-3xl">{w.icon}</div>
                  <h3 className="mt-4 text-lg font-semibold text-[#0d204d]">{w.title}</h3>
                  <p className="mt-2 text-sm text-gray-400">{w.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
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

      {/* Bülten CTA — lacivert vurgu bandı */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-[#071331] px-6 py-14 text-center sm:px-12">
            {/* ışıma */}
            <div
              className="pointer-events-none absolute inset-0 opacity-70"
              style={{ background: "radial-gradient(60% 60% at 50% 0%, rgba(34,211,238,0.18), transparent 70%)" }}
            />
            <div className="relative">
              <span className="chip inline-block px-4 py-1 text-xs" data-active="true">📩 Ücretsiz Bülten</span>
              <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-bold leading-tight text-white sm:text-4xl">
                Fitness işini büyütenlerin okuduğu bülten.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-white/70">
                Haftada 2 e-posta; gerçek stratejiler, gerçek örnekler. İstediğin an çık.
              </p>
              <div className="mt-8">
                <NewsletterForm variant="onNavy" />
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
