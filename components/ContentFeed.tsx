"use client";

import { useState } from "react";
import Link from "next/link";
import { CATEGORIES, type Post } from "@/lib/site";
import { Reveal } from "./Reveal";
import { formatDate } from "@/lib/date";
import { coverUrl } from "@/lib/cover";

function catLabel(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}
function catEmoji(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug)?.emoji ?? "•";
}

export function ContentFeed({ allPosts, heading = "İçerik Akışı" }: { allPosts: Post[]; heading?: string | null }) {
  const [active, setActive] = useState<string | null>(null);
  const posts = active ? allPosts.filter((p) => p.category === active) : allPosts;

  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        {heading ? <h2 className="text-2xl font-bold sm:text-3xl">{heading}</h2> : <span />}
        <div className="flex flex-wrap gap-2">
          <button
            className="chip px-3 py-1 text-xs"
            data-active={active === null}
            onClick={() => setActive(null)}
          >
            Tümü
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.slug}
              className="chip px-3 py-1 text-xs"
              data-active={active === c.slug}
              onClick={() => setActive(c.slug)}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 3) * 0.08}>
            <Link href={`/yazi/${p.slug}`} className="card block h-full overflow-hidden">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={coverUrl(p, 700)} alt={p.title} className="aspect-[1200/630] w-full object-cover" loading="lazy" />
                <span className="absolute left-3 top-3 rounded-full bg-[#0d204d] px-3 py-1 text-xs font-medium text-white">
                  {catEmoji(p.category)} {catLabel(p.category)}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold leading-snug">{p.title}</h3>
                <p className="mt-2 text-sm text-gray-400">{p.excerpt}</p>
                <div className="mt-4 text-xs text-gray-400">{formatDate(p.date)}</div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
