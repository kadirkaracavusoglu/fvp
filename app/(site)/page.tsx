import Link from "next/link";
import { SITE, FAQS } from "@/lib/site";
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
        <div className="mx-auto max-w-4xl px-5 py-16 text-center sm:py-24">
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
                        <img src={urlFor(e.coverImage).width(600).height(600).url()} alt={`${e.title} — Fitness Pazarlama Anatomisi podcast`} className="aspect-square w-full object-cover" loading="lazy" />
                        {e.episodeLabel && (
                          <span className="absolute left-3 top-3 rounded-full bg-navy px-3 py-1 text-xs font-medium text-white">
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

      {/* SSS — AEO/GEO */}
      <section className="mx-auto max-w-3xl px-5 py-16">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: FAQS.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            }),
          }}
        />
        <Reveal>
          <h2 className="text-center text-2xl font-bold sm:text-3xl">Sık Sorulan Sorular</h2>
        </Reveal>
        <div className="mt-8 space-y-3">
          {FAQS.map((f, i) => (
            <Reveal key={f.q} delay={(i % 4) * 0.06}>
              <details className="group rounded-xl border border-[#e6e8ea] bg-white p-5">
                <summary className="flex cursor-pointer items-center justify-between text-base font-semibold text-navy">
                  {f.q}
                  <span className="ml-3 text-cyan transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-gray-400">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

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
              <h2 className="mx-auto max-w-2xl text-3xl font-bold leading-tight text-white sm:text-4xl">
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
