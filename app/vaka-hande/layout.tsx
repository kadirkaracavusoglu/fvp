import type { Metadata } from "next";

// VSL funnel (Hande vakası) — arama motorlarına kapalı, header/footer YOK.
// (site) route group'unun dışında olduğu için chrome almaz; kendi main'ini verir.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function VakaHandeLayout({ children }: { children: React.ReactNode }) {
  return <main id="main" className="flex-1">{children}</main>;
}
