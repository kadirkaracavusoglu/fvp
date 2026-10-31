import type { Metadata } from "next";

// kadirkaracavusoglu.com/fitstarterkit — sade sayfa: başlık, alt metin, buton. Ödeme Stripe'ta.
// Header/footer YOK (vaka-analizi gibi). Renkler globals.css'ten gelir.
const STRIPE_URL = "https://buy.stripe.com/00wbIT48sgTs22KdWN8g004";

const TITLE = "Fit Starter Kit — Fitness ve Pazarlama";
const DESCRIPTION =
  "Online koçluk işini Fitsistem yapısı ile kur, 21 günde nasıl para kazanacağını öğren ve uygulamaya başla.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/fitstarterkit" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/fitstarterkit", type: "website" },
};

export default function FitStarterKitPage() {
  return (
    <main id="main" className="glow-bg flex min-h-screen flex-1 items-center">
      <div className="mx-auto max-w-3xl px-5 py-16 text-center">
        <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
          Fit Starter Kit ile online koçluk işini Fitsistem yapısı ile kurmaya başla ve 21 günde
          nasıl para kazanacağını öğrenip uygulamaya başla.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-gray-400">
          Fitsistem&apos;i adım adım kurmayı, ilk 21 günde ne yapacağını ve bunu kendi işine nasıl
          uygulayacağını bu kit ile öğrenirsin.
        </p>
        <a href={STRIPE_URL} className="btn-primary mt-8 inline-block w-full px-8 py-4 text-base sm:w-auto">
          FİT STARTER KİT&apos;İ AL →
        </a>
      </div>
    </main>
  );
}
