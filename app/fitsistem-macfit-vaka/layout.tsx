import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "MACFit Vaka Analizi | Fitsistem",
  description: "Spor salonu sahipleri için MACFit vaka analizi ve Fitsistem.",
  alternates: { canonical: "/fitsistem-macfit-vaka" },
  robots: { index: false, follow: false },
};
export default function MacfitLayout({ children }: { children: React.ReactNode }) {
  return <main id="main" className="flex-1">{children}</main>;
}
