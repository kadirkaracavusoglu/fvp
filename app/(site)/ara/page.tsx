import { getPosts } from "@/sanity/lib/queries";
import { SearchClient } from "@/components/SearchClient";
import { SITE } from "@/lib/site";

export const metadata = {
  title: "Ara",
  description: `${SITE.name} içeriklerinde ara.`,
  alternates: { canonical: "/ara" },
  robots: { index: false },
};

export const revalidate = 60;

export default async function AraPage() {
  const posts = await getPosts();
  return <SearchClient posts={posts} />;
}
