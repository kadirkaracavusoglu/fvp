import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const GA_ID = "G-59D2THYMTM";

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
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NKKQN688');`}
        </Script>
        {/* Google Analytics (gtag.js) */}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
        </Script>
      </head>
      <body className="flex min-h-full flex-col">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NKKQN688"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
