import { getPosts } from "@/sanity/lib/queries";
import { SearchClient } from "@/components/SearchClient";

export const metadata = {
  title: "Ara",
  description: "Fitness ve Pazarlama içeriklerinde ara.",
  alternates: { canonical: "/ara" },
  robots: { index: false },
};

export const revalidate = 60;

export default async function AraPage() {
  const posts = await getPosts();
  return <SearchClient posts={posts} />;
}
