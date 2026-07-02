import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// widmind sitesinin fontu — Inter Tight (tek yerden değiştirilir)
const heading = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const body = heading;

export const metadata: Metadata = {
  metadataBase: new URL("https://fitnessvepazarlama.com"),
  title: {
    default: "Fitness ve Pazarlama — Fitness işini sisteme oturt",
    template: "%s — Fitness ve Pazarlama",
  },
  description:
    "Fitness sektörünü pazarlama merceğinden süzen medya ve topluluk. Gerçek stratejiler, gerçek örnekler.",
  keywords: [
    "fitness pazarlama", "online koçluk", "fitness girişimcisi",
    "antrenör pazarlama", "fitness işi", "spor salonu pazarlama",
  ],
  authors: [{ name: "Kadir Karaçavuşoğlu" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Fitness ve Pazarlama",
    url: "https://fitnessvepazarlama.com",
    title: "Fitness ve Pazarlama",
    description: "Fitness sektörünü pazarlama merceğinden süzen medya ve topluluk.",
  },
  twitter: { card: "summary_large_image", title: "Fitness ve Pazarlama" },
  icons: { icon: "/favicon.png", apple: "/apple-touch-icon.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${heading.variable} ${body.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
