import { defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "Yazı",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Başlık", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "URL (slug)", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "excerpt", title: "Özet", type: "text", rows: 3, description: "Kartlarda ve SEO'da görünen kısa açıklama" }),
    defineField({ name: "category", title: "Kategori", type: "reference", to: [{ type: "category" }], validation: (r) => r.required() }),
    defineField({ name: "coverImage", title: "Kapak Görseli", type: "image", options: { hotspot: true } }),
    defineField({ name: "publishedAt", title: "Yayın Tarihi", type: "datetime", initialValue: () => new Date().toISOString() }),
    defineField({ name: "featured", title: "Öne Çıkan (ana sayfada büyük kart)", type: "boolean", initialValue: false }),
    defineField({
      name: "body",
      title: "İçerik",
      type: "array",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
    }),
  ],
  orderings: [
    { title: "Yeniden eskiye", name: "dateDesc", by: [{ field: "publishedAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", subtitle: "category.title", media: "coverImage" },
  },
});
