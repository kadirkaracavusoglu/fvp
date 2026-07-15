import { CATEGORIES } from "@/lib/site";

const BASE = "https://fitnessvepazarlama.com";
export const revalidate = 3600;

export async function GET() {
  const cats = CATEGORIES.map((c) => `- [${c.label}](${BASE}/kategori/${c.slug}): ${c.label} kategorisindeki içerikler`).join("\n");
  const body = `# Fitness ve Pazarlama

> Fitness sektörünün gündemini, işini ve geleceğini konuşan bağımsız Türkçe medya. Koçlar, salonlar ve markalar için haftalık haber, analiz, podcast ve bülten.

Fitness ve Pazarlama (fitnessvepazarlama.com), fitness sektörünün iş tarafına — koç, salon ve markalara — yönelik; gündem, pazarlama, satış ve teknoloji üzerine içerik üreten bağımsız bir medya ve topluluktur. Kurucu ve ses: Kadir Karaçavuşoğlu. Temel inanç: "Fitness işi şansa değil, sisteme dayanır."

## Ana Bölümler
- [Bülten / Blog](${BASE}/bulten): Haftalık yazılar ve tüm içerik arşivi
- [Rehberler](${BASE}/rehber): Kalıcı, aranan konularda derinlemesine rehberler
- [Podcast — Fitness Pazarlama Anatomisi](${BASE}/podcast): Her Çarşamba yayınlanan bölümler
- [Manifesto](${BASE}/manifesto): Markanın duruşu ve temel inancı
- [İletişim](${BASE}/iletisim): İletişim ve sponsorluk

## İçerik Kategorileri
${cats}

## Optional
- [Tüm içerik listesi](${BASE}/llms-full.txt): Tüm yazı ve bölümlerin tam dizini
- [RSS akışı](${BASE}/rss.xml): İçerik akışı
- [Site haritası](${BASE}/sitemap.xml): Tüm URL haritası
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
