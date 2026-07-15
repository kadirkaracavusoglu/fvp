import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { Metadata } from "next";
import { getGuide, getGuideSlugs } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { NewsletterForm } from "@/components/NewsletterForm";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getGuideSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = await getGuide(slug);
  if (!g) return { title: "Rehber bulunamadı" };
  return {
    title: g.title,
    description: g.excerpt || "",
    alternates: { canonical: `/rehber/${slug}` },
    openGraph: {
      title: g.title,
      description: g.excerpt || "",
      type: "article",
      url: `https://fitnessvepazarlama.com/rehber/${slug}`,
      images: g.coverImage ? [urlFor(g.coverImage).width(1200).height(630).url()] : [],
    },
  };
}

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2 className="mt-10 text-2xl font-bold text-navy">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-8 text-xl font-semibold text-navy">{children}</h3>,
    normal: ({ children }) => <p className="mt-4 leading-relaxed text-[#33405c]">{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="mt-4 list-disc space-y-2 pl-6 text-[#33405c]">{children}</ul>,
    number: ({ children }) => <ol className="mt-4 list-decimal space-y-2 pl-6 text-[#33405c]">{children}</ol>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-navy">{children}</strong>,
    link: ({ children, value }) => (
      <a href={value?.href} target="_blank" rel="noreferrer" className="text-cyan underline">{children}</a>
    ),
  },
};

export default async function RehberDetayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = await getGuide(slug);
  if (!g) redirect("/rehber");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: g.title,
        description: g.excerpt || "",
        ...(g.updatedAt ? { dateModified: g.updatedAt } : {}),
        author: { "@id": "https://fitnessvepazarlama.com/#kadir" },
        publisher: { "@id": "https://fitnessvepazarlama.com/#org" },
        mainEntityOfPage: `https://fitnessvepazarlama.com/rehber/${slug}`,
        ...(g.categoryLabel ? { articleSection: g.categoryLabel } : {}),
      },
      ...(g.faq && g.faq.length
        ? [{
            "@type": "FAQPage",
            mainEntity: g.faq.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          }]
        : []),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://fitnessvepazarlama.com" },
          { "@type": "ListItem", position: 2, name: "Rehberler", item: "https://fitnessvepazarlama.com/rehber" },
          { "@type": "ListItem", position: 3, name: g.title, item: `https://fitnessvepazarlama.com/rehber/${slug}` },
        ],
      },
    ],
  };

  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/rehber" className="text-sm text-gray-400 hover:text-cyan">← Tüm rehberler</Link>

      <div className="mt-6">
        {g.categoryLabel && g.category && (
          <Link href={`/kategori/${g.category}`} className="text-xs font-medium text-cyan hover:underline">
            {g.categoryEmoji} {g.categoryLabel}
          </Link>
        )}
        <h1 className="mt-2 text-3xl font-bold leading-tight text-navy sm:text-4xl">{g.title}</h1>
        {/* Kısa cevap — SEO+GEO: ilk paragrafta net cevap */}
        {g.excerpt && (
          <p className="mt-5 rounded-xl border-l-4 border-navy bg-[#f4f6f9] p-4 text-lg leading-relaxed text-[#33405c]">
            {g.excerpt}
          </p>
        )}
      </div>

      {g.coverImage ? (
        <div className="mt-8 overflow-hidden rounded-2xl">
          <Image src={urlFor(g.coverImage).width(1400).height(800).url()} alt={g.title} width={1400} height={800} priority className="h-auto w-full" />
        </div>
      ) : null}

      <div className="mt-8">
        {g.body ? (
          <PortableText value={g.body as never} components={components} />
        ) : g.sections && g.sections.length ? (
          g.sections.map((s) => (
            <section key={s.h}>
              <h2 className="mt-10 text-2xl font-bold text-navy">{s.h}</h2>
              {s.p.map((para, i) => (
                <p key={i} className="mt-4 leading-relaxed text-[#33405c]">{para}</p>
              ))}
            </section>
          ))
        ) : (
          <p className="leading-relaxed text-[#33405c]">Bu rehberin tam içeriği hazırlanıyor. Aşağıdaki sık sorulan sorular temel cevapları veriyor.</p>
        )}
      </div>

      {/* SSS — görünür + FAQPage şeması (GEO) */}
      {g.faq && g.faq.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-navy">Sık Sorulan Sorular</h2>
          <div className="mt-5 space-y-4">
            {g.faq.map((f) => (
              <div key={f.question} className="rounded-xl border border-[#e6e8ea] p-5">
                <h3 className="font-semibold text-navy">{f.question}</h3>
                <p className="mt-2 leading-relaxed text-[#33405c]">{f.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mt-14 rounded-2xl border border-[#e6e8ea] bg-[#f4f6f9] p-8 text-center">
        <h3 className="text-xl font-bold text-navy">Sektörün nabzını her hafta yakalayın.</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-gray-400">Rehberler kalıcı, bülten güncel. İkisiyle bir adım öndesiniz.</p>
        <div className="mt-5"><NewsletterForm /></div>
      </div>
    </article>
  );
}
