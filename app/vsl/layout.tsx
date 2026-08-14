import type { Metadata } from "next";

// VSL funnel sayfası — arama motorlarına kapalı (reklam/organik/e-posta linkiyle gelinir).
// Görünüm sitenin açık teması + header/footer ile native; ayrı stil yok.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function VslLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
