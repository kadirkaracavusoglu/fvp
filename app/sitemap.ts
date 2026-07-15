import type { MetadataRoute } from "next";
import { getPosts, getGuides } from "@/sanity/lib/queries";
import { CATEGORIES } from "@/lib/site";

const BASE = "https://fitnessvepazarlama.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    "", "/bulten", "/rehber", "/podcast",
    "/topluluk", "/sponsorluk", "/manifesto", "/iletisim",
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const legalPages = ["/gizlilik", "/kvkk", "/cerez", "/kosullar"].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.3,
  }));

  const categoryPages = CATEGORIES.map((c) => ({
    url: `${BASE}/kategori/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const posts = await getPosts();
  const postPages = posts.map((p) => ({
    url: `${BASE}/yazi/${p.slug}`,
    lastModified: p.date ? new Date(p.date) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const guides = await getGuides();
  const guidePages = guides.map((g) => ({
    url: `${BASE}/rehber/${g.slug}`,
    lastModified: g.updatedAt ? new Date(g.updatedAt) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8, // evergreen — SEO değeri yüksek
  }));

  return [...staticPages, ...legalPages, ...categoryPages, ...postPages, ...guidePages];
}
