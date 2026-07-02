import type { MetadataRoute } from "next";
import { getPosts } from "@/sanity/lib/queries";

const BASE = "https://fitnessvepazarlama.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    "", "/gundem", "/bulten", "/podcast", "/danismanlik",
    "/topluluk", "/sponsorluk", "/manifesto", "/iletisim",
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const posts = await getPosts();
  const postPages = posts.map((p) => ({
    url: `${BASE}/yazi/${p.slug}`,
    lastModified: p.date ? new Date(p.date) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...postPages];
}
