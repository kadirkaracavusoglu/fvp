import { CATEGORIES } from "@/lib/site";

const BASE = "https://fitnessvepazarlama.com";
export const revalidate = 3600;

export async function GET() {
  const cats = CATEGORIES.map((c) => `- ${c.label}: ${BASE}/kategori/${c.slug}`).join("\n");
  const body = `# Fitness ve Pazarlama

> Fitness sektörünü pazarlama merceğinden okuyan bağımsız Türkçe medya. Koçlar ve salon sahipleri için haftalık analiz, haber, podcast ve bülten.

Fitness ve Pazarlama (fitnessvepazarlama.com), fitness işini büyütmek isteyen koçlara ve salon sahiplerine yönelik; pazarlama, satış ve teknoloji üzerine içerik üreten bağımsız bir medya ve topluluktur. Kurucu ve ses: Kadir Karaçavuşoğlu. Temel inanç: "Fitness işi şansa değil, sisteme dayanır."

## Ana Bölümler
- Bülten / Blog: ${BASE}/bulten — haftalık yazılar, tüm arşiv
- Podcast (Fitness Pazarlama Anatomisi): ${BASE}/podcast — her Çarşamba
- Ücretsiz Analiz: ${BASE}/analiz — online koçluk işini 5 dakikada tarayan test
- Manifesto: ${BASE}/manifesto
- Danışmanlık: ${BASE}/danismanlik
- İletişim: ${BASE}/iletisim

## İçerik Kategorileri
${cats}

## Diğer
- Tüm içerik listesi: ${BASE}/llms-full.txt
- RSS: ${BASE}/rss.xml
- Sitemap: ${BASE}/sitemap.xml
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
