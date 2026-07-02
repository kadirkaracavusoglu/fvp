import Link from "next/link";
import { SITE, CATEGORIES } from "@/lib/site";
import { Reveal } from "@/components/Reveal";
import { ContentFeed } from "@/components/ContentFeed";
import { getPosts } from "@/sanity/lib/queries";
import { formatDate } from "@/lib/date";
import { coverUrl } from "@/lib/cover";
import { NewsletterForm } from "@/components/NewsletterForm";

function catLabel(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}

export const revalidate = 60;

export default async function Home() {
  const posts = await getPosts();
  const featured = posts.find((p) => p.featured) ?? posts[0];
  const secondary = posts.filter((p) => p.slug !== featured.slug).slice(0, 3);

  return (
    <>
      {/* Hero */}
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

      {/* Öne çıkan içerik */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-5 lg:grid-cols-2">
          <Reveal>
            <Link href={`/yazi/${featured.slug}`} className="card block h-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverUrl(featured, 1000)} alt={featured.title} className="aspect-[1200/630] w-full object-cover" />
              <div className="p-8">
                <div className="mb-3 text-xs font-medium text-cyan">
                  ⭐ Öne Çıkan · {catLabel(featured.category)}
                </div>
                <h2 className="text-2xl font-bold leading-snug sm:text-3xl">{featured.title}</h2>
                <p className="mt-3 text-gray-400">{featured.excerpt}</p>
                <div className="mt-6 text-xs text-gray-400">{formatDate(featured.date)}</div>
              </div>
            </Link>
          </Reveal>

          <div className="grid gap-5">
            {secondary.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.08}>
                <Link href={`/yazi/${p.slug}`} className="card block p-6">
                  <div className="mb-2 text-xs font-medium text-cyan">{catLabel(p.category)}</div>
                  <h3 className="text-lg font-semibold leading-snug">{p.title}</h3>
                  <p className="mt-1 text-sm text-gray-400">{p.excerpt}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Podcast şeridi */}
      <section className="border-y border-navy-600 bg-navy-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 py-14 text-center md:flex-row md:text-left">
          <div className="flex-1">
            <div className="text-xs font-medium text-cyan">🎙️ Podcast</div>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Fitness Pazarlama Anatomisi</h2>
            <p className="mt-2 text-gray-400">
              Antrenör gibi değil, fitness girişimcisi gibi düşün. Her Çarşamba 18:00.
            </p>
          </div>
          <Link href="/podcast" className="btn-primary px-6 py-3">
            Bölümleri Dinle
          </Link>
        </div>
      </section>

      {/* İçerik akışı (pillar filtreli) */}
      <ContentFeed allPosts={posts} />

      {/* Bülten CTA */}
      <section className="mx-auto max-w-4xl px-5 pb-16">
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

      {/* Danışmanlık teaser */}
      <section className="mx-auto max-w-6xl px-5 pb-24">
        <Reveal>
          <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-navy-600 bg-gradient-to-r from-navy-700 to-navy-800 p-10 md:flex-row">
            <div>
              <h2 className="text-2xl font-bold">İşini sisteme oturtmaya hazır mısın?</h2>
              <p className="mt-2 max-w-xl text-gray-400">
                FitSistem Birebir Danışmanlığı ile konumlanmadan funnel'a, içerikten CRM'e tüm yapıyı kur.
              </p>
            </div>
            <Link href="/danismanlik" className="btn-ghost whitespace-nowrap px-6 py-3">
              Danışmanlığı İncele
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
