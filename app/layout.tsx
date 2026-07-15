import type { Metadata, Viewport } from "next";
import { Inter_Tight } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NewsletterPopup } from "@/components/NewsletterPopup";
import { ServiceWorker } from "@/components/ServiceWorker";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AttributionCapture } from "@/components/AttributionCapture";
import { CookieConsent } from "@/components/CookieConsent";

export const viewport: Viewport = {
  themeColor: "#0d204d",
};

const GA_ID = "G-59D2THYMTM";
const GOOGLE_ADS_ID = "AW-18306666790";
const META_PIXEL_ID = "1334125068260935";
const CLARITY_ID = "xiyos1sqbm";

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
    "Fitness sektörünün gündemini, işini ve geleceğini konuşan bağımsız medya ve topluluk. Gerçek stratejiler, gerçek örnekler.",
  keywords: [
    "fitness pazarlama", "online koçluk", "fitness girişimcisi",
    "antrenör pazarlama", "fitness işi", "spor salonu pazarlama",
  ],
  authors: [{ name: "Kadir Karaçavuşoğlu" }],
  alternates: { canonical: "/", types: { "application/rss+xml": "/rss.xml" } },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Fitness ve Pazarlama",
    url: "https://fitnessvepazarlama.com",
    title: "Fitness ve Pazarlama",
    description: "Fitness sektörünün gündemini, işini ve geleceğini konuşan bağımsız medya ve topluluk.",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Fitness ve Pazarlama" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fitness ve Pazarlama",
    images: ["/og-default.png"],
  },
  icons: { icon: "/favicon.png", apple: "/apple-touch-icon.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://fitnessvepazarlama.com/#kadir",
        name: "Kadir Karaçavuşoğlu",
        url: "https://fitnessvepazarlama.com/manifesto",
        jobTitle: "Fitness Pazarlama Uzmanı & Kurucu",
        worksFor: { "@id": "https://fitnessvepazarlama.com/#org" },
        sameAs: [
          "https://linkedin.com/in/kadirkaracavusoglu",
          "https://instagram.com/fitnessvepazarlama",
        ],
      },
      {
        "@type": "Organization",
        "@id": "https://fitnessvepazarlama.com/#org",
        name: "Fitness ve Pazarlama",
        url: "https://fitnessvepazarlama.com",
        logo: "https://fitnessvepazarlama.com/favicon.png",
        founder: { "@id": "https://fitnessvepazarlama.com/#kadir" },
        sameAs: [
          "https://instagram.com/fitnessvepazarlama",
          "https://youtube.com/@fitnessvepazarlama",
          "https://linkedin.com/in/kadirkaracavusoglu",
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://fitnessvepazarlama.com/#website",
        url: "https://fitnessvepazarlama.com",
        name: "Fitness ve Pazarlama",
        inLanguage: "tr-TR",
        publisher: { "@id": "https://fitnessvepazarlama.com/#org" },
      },
    ],
  };

  return (
    <html lang="tr" className={`${heading.variable} ${body.variable} h-full antialiased`}>
      <head>
        <meta property="fb:app_id" content="1467973188448472" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
gtag('config', '${GA_ID}');
gtag('config', '${GOOGLE_ADS_ID}');`}
        </Script>
        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`}
        </Script>
        {/* Microsoft Clarity (davranış/oturum kaydı) */}
        <Script id="ms-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${CLARITY_ID}");`}
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
        {/* Meta Pixel (noscript) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        <a href="#main" className="skip-link">İçeriğe geç</a>
        <Header />
        <main id="main" className="flex-1">{children}</main>
        <Footer />
        <NewsletterPopup />
        <CookieConsent />
        <ServiceWorker />
        <AttributionCapture />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
