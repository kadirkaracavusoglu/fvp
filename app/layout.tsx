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
import { ANALYTICS } from "@/lib/analytics";
import { THEME } from "@/lib/theme";
import { SITE } from "@/lib/site";

export const viewport: Viewport = {
  themeColor: THEME.navy,
};

// widmind sitesinin fontu — Inter Tight (tek yerden değiştirilir)
const heading = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const body = heading;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.titleSuffix}`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [...SITE.keywords],
  authors: [{ name: SITE.author.name }],
  alternates: { canonical: "/", types: { "application/rss+xml": "/rss.xml" } },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    siteName: SITE.name,
    url: SITE.url,
    title: SITE.name,
    description: SITE.description,
    images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    images: [SITE.ogImage],
  },
  icons: { icon: SITE.logo.icon, apple: "/apple-touch-icon.png" },
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
        "@id": `${SITE.url}/#author`,
        name: SITE.author.name,
        url: `${SITE.url}${SITE.author.page}`,
        jobTitle: SITE.author.jobTitle,
        worksFor: { "@id": `${SITE.url}/#org` },
        sameAs: [SITE.social.linkedin, SITE.social.instagram],
      },
      {
        "@type": "Organization",
        "@id": `${SITE.url}/#org`,
        name: SITE.name,
        url: SITE.url,
        logo: `${SITE.url}${SITE.logo.icon}`,
        founder: { "@id": `${SITE.url}/#author` },
        sameAs: [SITE.social.instagram, SITE.social.youtube, SITE.social.linkedin],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        url: SITE.url,
        name: SITE.name,
        inLanguage: "tr-TR",
        publisher: { "@id": `${SITE.url}/#org` },
      },
    ],
  };

  return (
    <html lang="tr" className={`${heading.variable} ${body.variable} h-full antialiased`}>
      <head>
        {ANALYTICS.fbAppId && <meta property="fb:app_id" content={ANALYTICS.fbAppId} />}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Google Tag Manager */}
        {ANALYTICS.gtm && (
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${ANALYTICS.gtm}');`}
          </Script>
        )}
        {/* Google Analytics (gtag.js) — Google Ads dönüşümleri de aynı gtag üzerinden */}
        {(ANALYTICS.ga || ANALYTICS.googleAds) && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${ANALYTICS.ga || ANALYTICS.googleAds}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
${ANALYTICS.ga ? `gtag('config', '${ANALYTICS.ga}');` : ""}
${ANALYTICS.googleAds ? `gtag('config', '${ANALYTICS.googleAds}');` : ""}`}
            </Script>
          </>
        )}
        {/* Meta Pixel */}
        {ANALYTICS.metaPixel && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${ANALYTICS.metaPixel}');
fbq('track', 'PageView');`}
          </Script>
        )}
        {/* TikTok Pixel */}
        {ANALYTICS.tiktokPixel && (
          <Script id="tiktok-pixel" strategy="afterInteractive">
            {`!function (w, d, t) {
w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=d.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=d.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
ttq.load('${ANALYTICS.tiktokPixel}');
ttq.page();
}(window, document, 'ttq');`}
          </Script>
        )}
        {/* Microsoft Clarity (davranış/oturum kaydı) */}
        {ANALYTICS.clarity && (
          <Script id="ms-clarity" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${ANALYTICS.clarity}");`}
          </Script>
        )}
      </head>
      <body className="flex min-h-full flex-col">
        {/* Google Tag Manager (noscript) */}
        {ANALYTICS.gtm && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${ANALYTICS.gtm}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        {/* Meta Pixel (noscript) */}
        {ANALYTICS.metaPixel && (
          // eslint-disable-next-line @next/next/no-img-element
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${ANALYTICS.metaPixel}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        )}
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
