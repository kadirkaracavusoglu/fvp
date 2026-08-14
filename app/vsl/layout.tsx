import type { Metadata } from "next";

// VSL funnel sayfası — arama motorlarına kapalı (reklam/organik link ile gelinir),
// site chrome'u components/Chrome.tsx tarafından gizlenir.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

export default function VslLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#071331] text-white">{children}</div>;
}
