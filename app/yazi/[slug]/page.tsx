import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { Metadata } from "next";
import { getPost, getAllSlugs } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { NewsletterForm } from "@/components/NewsletterForm";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Yazı bulunamadı" };
  const desc = post.excerpt || "";
  return {
    title: post.title,
    description: desc,
    alternates: { canonical: `/yazi/${slug}` },
    openGraph: {
      title: post.title,
      description: desc,
      type: "article",
      url: `https://fitnessvepazarlama.com/yazi/${slug}`,
      publishedTime: post.date,
      images: post.coverImage ? [urlFor(post.coverImage).width(1200).height(630).url()] : [],
    },
  };
}

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => (
      <span className="my-6 block overflow-hidden rounded-xl">
        <Image
          src={urlFor(value).width(1400).url()}
          alt={(value as { alt?: string }).alt || ""}
          width={1400}
          height={900}
          className="h-auto w-full"
        />
      </span>
    ),
  },
  block: {
    h2: ({ children }) => <h2 className="mt-10 text-2xl font-bold text-[#0d204d]">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-8 text-xl font-semibold text-[#0d204d]">{children}</h3>,
    normal: ({ children }) => <p className="mt-4 leading-relaxed text-[#33405c]">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-[#0d204d] pl-4 italic text-[#5b6472]">{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mt-4 list-disc space-y-2 pl-6 text-[#33405c]">{children}</ul>,
    number: ({ children }) => <ol className="mt-4 list-decimal space-y-2 pl-6 text-[#33405c]">{children}</ol>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-[#0d204d]">{children}</strong>,
    link: ({ children, value }) => (
      <a href={value?.href} target="_blank" rel="noreferrer" className="text-cyan underline">{children}</a>
    ),
  },
};

export default async function YaziPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) redirect("/");

  const dateStr = post.date
    ? new Date(post.date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })
    : "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || "",
    datePublished: post.date,
    author: { "@type": "Person", name: "Kadir Karaçavuşoğlu" },
    publisher: {
      "@type": "Organization",
      name: "Fitness ve Pazarlama",
      logo: { "@type": "ImageObject", url: "https://fitnessvepazarlama.com/fvp-logo.png" },
    },
    mainEntityOfPage: `https://fitnessvepazarlama.com/yazi/${slug}`,
    ...(post.coverImage ? { image: urlFor(post.coverImage).width(1200).url() } : {}),
  };

  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/" className="text-sm text-gray-400 hover:text-cyan">← Tüm içerikler</Link>

      <div className="mt-6">
        {post.categoryLabel && (
          <span className="text-xs font-medium text-cyan">
            {post.categoryEmoji} {post.categoryLabel}
          </span>
        )}
        <h1 className="mt-2 text-3xl font-bold leading-tight text-[#0d204d] sm:text-4xl">{post.title}</h1>
        {post.excerpt && <p className="mt-4 text-lg text-gray-400">{post.excerpt}</p>}
        {dateStr && <div className="mt-4 text-sm text-gray-400">{dateStr}</div>}
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl">
        {post.coverImage ? (
          <Image
            src={urlFor(post.coverImage).width(1400).height(800).url()}
            alt={post.title}
            width={1400}
            height={800}
            priority
            className="h-auto w-full"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/api/cover?title=${encodeURIComponent(post.title)}&cat=${post.category}`}
            alt={post.title}
            className="aspect-[1200/630] w-full object-cover"
          />
        )}
      </div>

      <div className="mt-8">
        {post.body ? (
          <PortableText value={post.body as never} components={components} />
        ) : (
          <p className="text-gray-400">İçerik yakında.</p>
        )}
      </div>

      {/* Yazı sonu bülten CTA */}
      <div className="mt-14 rounded-2xl border border-[#e6e8ea] bg-[#f4f6f9] p-8 text-center">
        <h3 className="text-xl font-bold text-[#0d204d]">Bunun gibi içerikler her hafta gelen kutunda.</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-gray-400">Fitness işini pazarlama merceğinden süzen bülten.</p>
        <div className="mt-5">
          <NewsletterForm />
        </div>
      </div>
    </article>
  );
}
