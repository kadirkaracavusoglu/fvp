import { getPosts } from "@/sanity/lib/queries";
import { SITE } from "@/lib/site";

const BASE = SITE.url;

export const revalidate = 300;

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export async function GET() {
  const posts = await getPosts();
  const items = posts
    .map(
      (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${BASE}/yazi/${p.slug}</link>
      <guid>${BASE}/yazi/${p.slug}</guid>
      <pubDate>${p.date ? new Date(p.date).toUTCString() : new Date().toUTCString()}</pubDate>
      <description>${esc(p.excerpt || "")}</description>
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${SITE.name}</title>
    <link>${BASE}</link>
    <description>Fitness sektörünün gündemini, işini ve geleceğini konuşan bağımsız medya ve topluluk.</description>
    <language>tr</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}
