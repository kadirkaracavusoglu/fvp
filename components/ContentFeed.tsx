"use client";

import { useState } from "react";
import Link from "next/link";
import { SITE, CATEGORIES, readingTime, type Post } from "@/lib/site";
import { formatDate } from "@/lib/date";
import { coverUrl } from "@/lib/cover";

const PAGE = 9;

export function ContentFeed({ allPosts, heading = "İçerik Akışı" }: { allPosts: Post[]; heading?: string | null }) {
  const [active, setActive] = useState<string | null>(null);
  const [limit, setLimit] = useState(PAGE);
  const filtered = active ? allPosts.filter((p) => p.category === active) : allPosts;
  const posts = filtered.slice(0, limit);

  function setCat(c: string | null) {
    setActive(c);
    setLimit(PAGE);
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        {heading ? <h2 className="text-2xl font-bold sm:text-3xl">{heading}</h2> : <span />}
        <div className="flex flex-wrap gap-2">
          <button className="chip px-3 py-1 text-xs" data-active={active === null} onClick={() => setCat(null)}>
            Tümü
          </button>
          {CATEGORIES.map((c) => (
            <button key={c.slug} className="chip px-3 py-1 text-xs" data-active={active === c.slug} onClick={() => setCat(c.slug)}>
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <Link key={p.slug} href={`/yazi/${p.slug}`} className="card block h-full overflow-hidden transition-transform hover:-translate-y-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={coverUrl(p, 700)} alt={`${p.title} | ${SITE.name}`} className="aspect-[1200/630] w-full object-cover" loading="lazy" />
            <div className="p-6">
              <h3 className="text-lg font-semibold leading-snug">{p.title}</h3>
              <p className="mt-2 text-sm text-gray-400">{p.excerpt}</p>
              <div className="mt-4 text-xs text-gray-400">
                {formatDate(p.date)} · {readingTime(p.chars)} dk okuma
              </div>
            </div>
          </Link>
        ))}
      </div>

      {limit < filtered.length && (
        <div className="mt-10 text-center">
          <button onClick={() => setLimit((l) => l + PAGE)} className="btn-ghost px-6 py-3 text-sm">
            Daha fazla yükle ({filtered.length - limit})
          </button>
        </div>
      )}
    </section>
  );
}
