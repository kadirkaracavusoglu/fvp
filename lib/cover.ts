import type { Post } from "./site";
import { urlFor } from "@/sanity/lib/image";

// Kapak görseli: varsa Sanity görseli, yoksa otomatik üretilen marka kapağı
export function coverUrl(post: Pick<Post, "title" | "category" | "coverImage">, w = 800): string {
  if (post.coverImage) {
    return urlFor(post.coverImage).width(w).height(Math.round((w * 630) / 1200)).url();
  }
  const params = new URLSearchParams({ title: post.title, cat: post.category });
  return `/api/cover?${params.toString()}`;
}
