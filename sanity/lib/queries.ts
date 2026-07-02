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
  coverImage
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
        featured, body, coverImage
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
