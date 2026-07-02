import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  title: "Kategori",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Başlık", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "URL (slug)", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "emoji", title: "Emoji", type: "string" }),
    defineField({ name: "description", title: "Açıklama", type: "text", rows: 2 }),
  ],
  preview: {
    select: { title: "title", subtitle: "emoji" },
  },
});
