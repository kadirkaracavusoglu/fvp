import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { getEpisode, getEpisodes, getEpisodeSlugs } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { formatDate } from "@/lib/date";
import { NewsletterForm } from "@/components/NewsletterForm";
import { SITE } from "@/lib/site";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getEpisodeSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const ep = await getEpisode(slug);
  if (!ep) return { title: "Bölüm bulunamadı" };
  return {
    title: ep.title,
    description: ep.description || "",
    alternates: { canonical: `/podcast/${slug}` },
    openGraph: {
      title: ep.title,
      description: ep.description || "",
      type: "article",
      url: `${SITE.url}/podcast/${slug}`,
      images: ep.coverImage ? [urlFor(ep.coverImage).width(1200).height(630).url()] : ["/og-default.png"],
    },
  };
}

function spotifyEmbed(url?: string) {
  if (!url) return null;
  const ep = url.match(/episode\/([a-zA-Z0-9]+)/);
  if (ep) return `https://open.spotify.com/embed/episode/${ep[1]}`;
  const show = url.match(/show\/([a-zA-Z0-9]+)/);
  return show ? `https://open.spotify.com/embed/show/${show[1]}` : null;
}

const notesComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mt-3 leading-relaxed text-[#33405c]">{children}</p>,
    h3: ({ children }) => <h3 className="mt-6 text-lg font-semibold text-navy">{children}</h3>,
  },
  list: { bullet: ({ children }) => <ul className="mt-3 list-disc space-y-1.5 pl-6 text-[#33405c]">{children}</ul> },
  marks: {
    link: ({ children, value }) => <a href={value?.href} target="_blank" rel="noreferrer" className="text-cyan underline">{children}</a>,
  },
};

export default async function EpisodePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [ep, all] = await Promise.all([getEpisode(slug), getEpisodes()]);
  if (!ep) notFound();

  const embed = spotifyEmbed(ep.spotifyUrl);
  const others = all.filter((e) => e.slug !== slug).slice(0, 3);

  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <Link href="/podcast" className="text-sm text-gray-400 hover:text-cyan">← Tüm bölümler</Link>

      {/* Başlık + kapak */}
      {ep.coverImage ? (
        <div className="mt-6 overflow-hidden rounded-2xl">
          <Image src={urlFor(ep.coverImage).width(1200).height(675).url()} alt={ep.title} width={1200} height={675} priority className="h-auto w-full" />
        </div>
      ) : null}

      <div className="mt-6">
        <div className="text-xs font-medium text-cyan">
          🎙️ {ep.episodeLabel ? `${ep.episodeLabel} · ` : ""}{formatDate(ep.date)}{ep.duration ? ` · ${ep.duration}` : ""}
        </div>
        <h1 className="mt-2 text-3xl font-bold leading-tight text-navy sm:text-4xl">{ep.title}</h1>
        {ep.description && <p className="mt-4 text-lg text-gray-400">{ep.description}</p>}
      </div>

      {/* Dinle butonları */}
      <div className="mt-6 flex flex-wrap gap-3">
        {ep.spotifyUrl && <a href={ep.spotifyUrl} target="_blank" rel="noreferrer" className="btn-primary px-5 py-2.5 text-sm">Spotify'da Dinle</a>}
        {ep.appleUrl && <a href={ep.appleUrl} target="_blank" rel="noreferrer" className="btn-ghost px-5 py-2.5 text-sm">Apple Podcasts</a>}
        {ep.youtubeUrl && <a href={ep.youtubeUrl} target="_blank" rel="noreferrer" className="btn-ghost px-5 py-2.5 text-sm">YouTube</a>}
      </div>

      {/* Player */}
      {embed && (
        <div className="mt-8 overflow-hidden rounded-xl border border-[#e6e8ea]">
          <iframe title={ep.title} src={embed} width="100%" height="232" frameBorder="0" allow="encrypted-media" loading="lazy" />
        </div>
      )}

      {/* Show notes */}
      {ep.showNotes ? (
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-navy">Show Notes</h2>
          <div className="mt-3"><PortableText value={ep.showNotes as never} components={notesComponents} /></div>
        </section>
      ) : null}

      {/* Timestamps */}
      {ep.timestamps && ep.timestamps.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-navy">Zaman Damgaları</h2>
          <ul className="mt-4 space-y-2">
            {ep.timestamps.map((t, i) => (
              <li key={i} className="flex gap-3 text-[#33405c]">
                <span className="shrink-0 rounded-md bg-[#f4f6f9] px-2 py-0.5 font-mono text-xs text-navy">{t.time}</span>
                <span className="text-sm">{t.label}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Transkript (açılır) */}
      {ep.transcript ? (
        <section className="mt-10">
          <details className="group rounded-xl border border-[#e6e8ea] p-5">
            <summary className="cursor-pointer text-lg font-semibold text-navy">Transkript <span className="text-sm font-normal text-gray-400">(aç/kapat)</span></summary>
            <div className="mt-4 text-sm"><PortableText value={ep.transcript as never} components={notesComponents} /></div>
          </details>
        </section>
      ) : null}

      {/* Bülten CTA */}
      <div className="mt-14 rounded-2xl border border-[#e6e8ea] bg-[#f4f6f9] p-8 text-center">
        <h3 className="text-xl font-bold text-navy">Her bölümü kaçırma.</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-gray-400">Yeni bölümler ve haftalık bülten doğrudan gelen kutunda.</p>
        <div className="mt-5"><NewsletterForm /></div>
      </div>

      {/* Diğer bölümler */}
      {others.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-5 text-2xl font-bold text-navy">Diğer Bölümler</h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {others.map((e) => (
              <Link key={e.slug} href={`/podcast/${e.slug}`} className="card block h-full p-5">
                <div className="text-xs text-gray-400">{e.episodeLabel}</div>
                <h3 className="mt-1 text-sm font-semibold leading-snug text-navy">{e.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
