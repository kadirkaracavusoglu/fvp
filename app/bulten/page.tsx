import { Reveal } from "@/components/Reveal";
import { NewsletterForm } from "@/components/NewsletterForm";
import { ContentFeed } from "@/components/ContentFeed";
import { getPosts } from "@/sanity/lib/queries";

export const metadata = {
  title: "Bülten",
  description:
    "Fitness işini pazarlama merceğinden süzen bülten. Haftada 2 e-posta; isimler, rakamlar, örnekler. Tüm sayıları oku.",
  alternates: { canonical: "/bulten" },
};

export const revalidate = 60;

export default async function BultenPage() {
  const posts = await getPosts();

  return (
    <>
      {/* Kayıt + tanıtım */}
      <section className="glow-bg">
        <div className="mx-auto max-w-3xl px-5 py-20 text-center">
          <Reveal>
            <div className="text-xs font-medium text-cyan">📩 Bülten</div>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Haftada 2 e-posta. Boş laf yok.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-gray-400">
              Fitness sektörünü pazarlama merceğinden süzen bülten. Doğrudan gelen kutuna.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-8">
              <NewsletterForm />
              <p className="mt-4 text-xs text-gray-400">İstediğin an çıkabilirsin. Spam yok.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Tüm sayılar / arşiv */}
      <div className="border-t border-navy-600">
        <div className="mx-auto max-w-6xl px-5 pt-10">
          <h2 className="text-2xl font-bold sm:text-3xl">Tüm Sayılar</h2>
          <p className="mt-2 text-gray-400">Bugüne kadar yayınlanan tüm bülten içerikleri.</p>
        </div>
        <ContentFeed allPosts={posts} heading={null} />
      </div>
    </>
  );
}
