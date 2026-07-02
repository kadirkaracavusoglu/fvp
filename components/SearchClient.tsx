"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CATEGORIES, readingTime, type Post } from "@/lib/site";
import { formatDate } from "@/lib/date";
import { coverUrl } from "@/lib/cover";

function norm(s: string) {
  return s
    .toLocaleLowerCase("tr")
    .replaceAll("ı", "i").replaceAll("ş", "s").replaceAll("ç", "c")
    .replaceAll("ğ", "g").replaceAll("ö", "o").replaceAll("ü", "u");
}
function catLabel(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}

export function SearchClient({ posts }: { posts: Post[] }) {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const term = norm(q.trim());
    if (!term) return [];
    return posts.filter(
      (p) => norm(p.title).includes(term) || norm(p.excerpt || "").includes(term)
    );
  }, [q, posts]);

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-[#0d204d] sm:text-4xl">Ara</h1>
      <input
        autoFocus
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Yazılarda ara… (örn. niş, reklam, fiyat)"
        className="mt-6 w-full rounded-xl border border-[#e6e8ea] bg-white px-5 py-4 text-base text-[#0d204d] outline-none transition-colors focus:border-[#0d204d]"
      />

      <div className="mt-8">
        {q.trim() === "" ? (
          <p className="text-sm text-gray-400">Aramak için yazmaya başla.</p>
        ) : results.length === 0 ? (
          <p className="text-sm text-gray-400">&quot;{q}&quot; için sonuç bulunamadı.</p>
        ) : (
          <>
            <p className="mb-4 text-sm text-gray-400">{results.length} sonuç</p>
            <div className="space-y-4">
              {results.map((p) => (
                <Link key={p.slug} href={`/yazi/${p.slug}`} className="card flex gap-4 overflow-hidden p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={coverUrl(p, 300)} alt={p.title} className="h-20 w-32 shrink-0 rounded-lg object-cover" loading="lazy" />
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-cyan">{catLabel(p.category)}</div>
                    <h3 className="truncate text-sm font-semibold text-[#0d204d]">{p.title}</h3>
                    <p className="mt-1 line-clamp-2 text-xs text-gray-400">{p.excerpt}</p>
                    <div className="mt-1 text-xs text-gray-400">{formatDate(p.date)} · {readingTime(p.chars)} dk</div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
