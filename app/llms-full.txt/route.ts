import { getPosts, getEpisodes } from "@/sanity/lib/queries";

const BASE = "https://fitnessvepazarlama.com";
export const revalidate = 3600;

export async function GET() {
  const [posts, episodes] = await Promise.all([getPosts(), getEpisodes()]);

  const postList = posts
    .map((p) => `### ${p.title}\n${BASE}/yazi/${p.slug}\n${p.excerpt || ""}`)
    .join("\n\n");

  const epList = episodes
    .map((e) => `### ${e.episodeLabel ? e.episodeLabel + " — " : ""}${e.title}\n${BASE}/podcast/${e.slug}\n${e.description || ""}`)
    .join("\n\n");

  const body = `# Fitness ve Pazarlama — Tüm İçerik

> Fitness sektörünün gündemini, işini ve geleceğini konuşan bağımsız Türkçe medya. Koçlar, salonlar ve markalar için.

Kurucu: Kadir Karaçavuşoğlu. Site: ${BASE}

## Yazılar (${posts.length})

${postList}

## Podcast Bölümleri (${episodes.length})

${epList}
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
