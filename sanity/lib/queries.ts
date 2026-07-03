import { client } from "./client";
import type { Post } from "@/lib/site";
import { POSTS as FALLBACK_POSTS } from "@/lib/site";

const postFields = `
  "slug": slug.current,
  title,
  excerpt,
  "category": category->slug.current,
  "date": coalesce(publishedAt, _createdAt),
  featured,
  coverImage,
  "chars": length(pt::text(body))
`;

// Sanity bağlıysa oradan çek, değilse placeholder POSTS döner
export async function getPosts(): Promise<Post[]> {
  if (!client) return FALLBACK_POSTS;
  try {
    const data = await client.fetch<Post[]>(
      `*[_type == "post"] | order(publishedAt desc){${postFields}}`
    );
    return data.length ? data : FALLBACK_POSTS;
  } catch {
    return FALLBACK_POSTS;
  }
}

export async function getPostsByCategory(cat: string): Promise<Post[]> {
  const all = await getPosts();
  return all.filter((p) => p.category === cat);
}

// Tekil yazı (tam içerik)
export type FullPost = Post & {
  body?: unknown;
  coverImage?: unknown;
  categoryLabel?: string;
  categoryEmoji?: string;
  seoDescription?: string;
};

export async function getPost(slug: string): Promise<FullPost | null> {
  if (!client) return null;
  try {
    const data = await client.fetch<FullPost | null>(
      `*[_type == "post" && slug.current == $slug][0]{
        "slug": slug.current, title, excerpt,
        "category": category->slug.current,
        "categoryLabel": category->title,
        "categoryEmoji": category->emoji,
        "date": coalesce(publishedAt, _createdAt),
        featured, body, coverImage,
        "chars": length(pt::text(body))
      }`,
      { slug }
    );
    return data;
  } catch {
    return null;
  }
}

export async function getAllSlugs(): Promise<string[]> {
  if (!client) return [];
  try {
    return await client.fetch<string[]>(`*[_type == "post" && defined(slug.current)].slug.current`);
  } catch {
    return [];
  }
}

// ---- Podcast ----
export type Episode = {
  slug: string;
  title: string;
  episodeLabel?: string;
  description?: string;
  duration?: string;
  spotifyUrl?: string;
  appleUrl?: string;
  youtubeUrl?: string;
  date?: string;
  coverImage?: unknown;
  showNotes?: unknown;
  timestamps?: { time?: string; label?: string }[];
  transcript?: unknown;
};

const epFields = `
  "slug": slug.current, title, episodeLabel, description, duration,
  spotifyUrl, appleUrl, youtubeUrl, coverImage,
  "date": coalesce(publishedAt, _createdAt)
`;

export async function getEpisodes(): Promise<Episode[]> {
  if (!client) return [];
  try {
    return await client.fetch<Episode[]>(`*[_type == "podcastEpisode"] | order(publishedAt desc){${epFields}}`);
  } catch {
    return [];
  }
}

export async function getEpisode(slug: string): Promise<Episode | null> {
  if (!client) return null;
  try {
    return await client.fetch<Episode | null>(
      `*[_type == "podcastEpisode" && slug.current == $slug][0]{${epFields}, showNotes, timestamps, transcript}`,
      { slug }
    );
  } catch {
    return null;
  }
}

export async function getEpisodeSlugs(): Promise<string[]> {
  if (!client) return [];
  try {
    return await client.fetch<string[]>(`*[_type == "podcastEpisode" && defined(slug.current)].slug.current`);
  } catch {
    return [];
  }
}

// ---- Rehber (kalıcı/evergreen — SEO/GEO) ----
import { GUIDES as FALLBACK_GUIDES, type Guide } from "@/lib/site";

const guideFields = `
  "slug": slug.current, title, excerpt,
  "category": category->slug.current,
  "updatedAt": coalesce(updatedAt, _updatedAt),
  coverImage, faq,
  "chars": length(pt::text(body))
`;

export async function getGuides(): Promise<Guide[]> {
  if (!client) return FALLBACK_GUIDES;
  try {
    const data = await client.fetch<Guide[]>(`*[_type == "rehber"] | order(title asc){${guideFields}}`);
    return data.length ? data : FALLBACK_GUIDES;
  } catch {
    return FALLBACK_GUIDES;
  }
}

export type FullGuide = Guide & { body?: unknown; categoryLabel?: string; categoryEmoji?: string };

export async function getGuide(slug: string): Promise<FullGuide | null> {
  const fallback = FALLBACK_GUIDES.find((g) => g.slug === slug) ?? null;
  if (!client) return fallback;
  try {
    const data = await client.fetch<FullGuide | null>(
      `*[_type == "rehber" && slug.current == $slug][0]{
        "slug": slug.current, title, excerpt,
        "category": category->slug.current,
        "categoryLabel": category->title,
        "categoryEmoji": category->emoji,
        "updatedAt": coalesce(updatedAt, _updatedAt),
        coverImage, faq, body,
        "chars": length(pt::text(body))
      }`,
      { slug }
    );
    return data ?? fallback;
  } catch {
    return fallback;
  }
}

export async function getGuideSlugs(): Promise<string[]> {
  const fb = FALLBACK_GUIDES.map((g) => g.slug);
  if (!client) return fb;
  try {
    const data = await client.fetch<string[]>(`*[_type == "rehber" && defined(slug.current)].slug.current`);
    return data.length ? data : fb;
  } catch {
    return fb;
  }
}
