import type { Metadata } from "next";

// Bio sayfası — Instagram, YouTube, podcast gibi tüm platformların profil linki.
// Site başlığı/menüsü YOK: tek amaç, gelen kişiyi doğru yere göndermek.
export const metadata: Metadata = {
  title: "Bağlantılar",
  description:
    "Fitness ve Pazarlama — bülten, vaka analizleri, podcast ve topluluk. Aradığın her şey tek sayfada.",
  alternates: { canonical: "/bio" },
};

export default function BioLayout({ children }: { children: React.ReactNode }) {
  return <main id="main" className="flex-1">{children}</main>;
}
