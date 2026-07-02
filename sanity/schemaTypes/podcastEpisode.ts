import { defineField, defineType } from "sanity";

export const podcastEpisode = defineType({
  name: "podcastEpisode",
  title: "Podcast Bölümü",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Başlık", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "URL (slug)", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "episodeLabel", title: "Bölüm Etiketi", type: "string", description: "Örn: Bölüm 1" }),
    defineField({ name: "description", title: "Açıklama", type: "text", rows: 3, description: "Kartlarda ve SEO'da görünen kısa açıklama" }),
    defineField({ name: "coverImage", title: "Kapak Görseli", type: "image", options: { hotspot: true } }),
    defineField({ name: "duration", title: "Süre", type: "string", description: "Örn: 42:15" }),
    defineField({ name: "spotifyUrl", title: "Spotify Linki", type: "url" }),
    defineField({ name: "appleUrl", title: "Apple Podcasts Linki", type: "url" }),
    defineField({ name: "youtubeUrl", title: "YouTube Linki", type: "url" }),
    defineField({ name: "publishedAt", title: "Yayın Tarihi", type: "datetime", initialValue: () => new Date().toISOString() }),
    defineField({
      name: "showNotes",
      title: "Show Notes (Bölüm Notları)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "timestamps",
      title: "Zaman Damgaları (Timestamps)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "time", title: "Zaman", type: "string", description: "Örn: 07:00" },
            { name: "label", title: "Konu", type: "string" },
          ],
          preview: { select: { title: "label", subtitle: "time" } },
        },
      ],
    }),
    defineField({
      name: "transcript",
      title: "Transkript",
      type: "array",
      of: [{ type: "block" }],
      description: "Bölümün tam metni (SEO için değerli)",
    }),
  ],
  orderings: [
    { title: "Yeniden eskiye", name: "dateDesc", by: [{ field: "publishedAt", direction: "desc" }] },
  ],
  preview: { select: { title: "title", subtitle: "episodeLabel", media: "coverImage" } },
});
