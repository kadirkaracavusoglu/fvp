import { Reveal } from "@/components/Reveal";
import { NewsletterForm } from "@/components/NewsletterForm";
import { ContentFeed } from "@/components/ContentFeed";
import { getPosts } from "@/sanity/lib/queries";

export const metadata = {
  title: "Bülten",
  description:
    "Fitness işinin gündemini ve büyümesini konuşan bülten ve blog. Gerçek stratejiler, gerçek örnekler. Tüm yazıları oku.",
  alternates: { canonical: "/bulten" },
};

export const revalidate = 60;

export default async function BultenPage() {
  const posts = await getPosts();

  return (
    <>
      {/* Hero — açıklama */}
      <section className="glow-bg">
        <div className="mx-auto max-w-3xl px-5 py-20 text-center">
          <Reveal>
            <div className="text-xs font-medium text-cyan">📩 Bülten</div>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Fitness işinin gündemini ve büyümesini konuşanların yeri.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-gray-400">
              Sektörün nabzı, talep yaratma, satış ve teknoloji üzerine gerçek örneklerle
              yazılar. Haftada 2 kez gelen kutuna; istediğin an burada da oku.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Yazılar (blog) */}
      <div className="border-t border-navy-600">
        <div className="mx-auto max-w-6xl px-5 pt-10">
          <h2 className="text-2xl font-bold sm:text-3xl">Tüm Yazılar</h2>
          <p className="mt-2 text-gray-400">Bugüne kadar yayınlanan tüm içerikler.</p>
        </div>
        <ContentFeed allPosts={posts} heading={null} />
      </div>

      {/* Abone ol CTA — aşağıda */}
      <section className="mx-auto max-w-4xl px-5 pb-20">
        <Reveal>
          <div className="card p-10 text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">Bülteni kaçırma.</h2>
            <p className="mx-auto mt-3 mb-6 max-w-xl text-gray-400">
              Her yeni yazı ve haftalık bülten doğrudan gelen kutuna. Ücretsiz, istediğin an çık.
            </p>
            <NewsletterForm />
          </div>
        </Reveal>
      </section>
    </>
  );
}
