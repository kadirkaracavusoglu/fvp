import type { Metadata } from "next";
import { vakaMeta } from "@/lib/vaka-meta";

// A/B testi B varyantı (Hande vakası) — arama motorlarına kapalı, header/footer YOK.
// (site) route group'unun dışında olduğu için chrome almaz; kendi main'ini verir.
// Meta etiketleri: lib/vaka-meta.ts (alt sayfalar kendi başlığını kendi layout'unda verir).
export const metadata: Metadata = vakaMeta({
  title: "Ücretsiz Vaka Analizi: Fitsistem'i 1,5 ayda nasıl kurduk?",
  path: "/vaka-analizi",
  absolute: true,
});

export default function VakaAnaliziLayout({ children }: { children: React.ReactNode }) {
  return <main id="main" className="flex-1">{children}</main>;
}
