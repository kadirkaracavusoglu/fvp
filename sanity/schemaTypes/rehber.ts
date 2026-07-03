import { defineField, defineType } from "sanity";

// Rehber = kalıcı/evergreen içerik (SEO/GEO odaklı, tarihsiz). Bülten'den ayrı.
export const rehber = defineType({
  name: "rehber",
  title: "Rehber",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Başlık (arama-şekilli/soru)", type: "string", description: 'Örn: "Online antrenör nasıl olunur?"', validation: (r) => r.required() }),
    defineField({ name: "slug", title: "URL (slug)", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "excerpt", title: "Kısa cevap / özet", type: "text", rows: 3, description: "İlk paragrafta doğrudan cevap (SEO+GEO)" }),
    defineField({ name: "category", title: "Kategori", type: "reference", to: [{ type: "category" }], validation: (r) => r.required() }),
    defineField({ name: "coverImage", title: "Kapak Görseli", type: "image", options: { hotspot: true } }),
    defineField({ name: "updatedAt", title: "Güncelleme Tarihi", type: "datetime", initialValue: () => new Date().toISOString() }),
    defineField({
      name: "body",
      title: "İçerik",
      type: "array",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "faq",
      title: "Sıkça Sorulan Sorular (GEO — AI cevaplarında kaynak olmak için)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "question", title: "Soru", type: "string" },
            { name: "answer", title: "Net cevap", type: "text", rows: 3 },
          ],
          preview: { select: { title: "question" } },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "category.title", media: "coverImage" },
  },
});
