import type { Metadata } from "next";
import { StarterKitThanks } from "./Takip";

// Stripe Payment Link ödeme sonrası yönlendirmesi buraya ayarlanır.
export const metadata: Metadata = {
  title: { absolute: "Teşekkürler — Fit Starter Kit" },
  robots: { index: false, follow: false },
};

export default function FitStarterKitTesekkurlerPage() {
  return (
    <main id="main" className="glow-bg flex min-h-screen flex-1 items-center">
      <StarterKitThanks />
      <div className="mx-auto max-w-2xl px-5 py-16 text-center">
        <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          Teşekkürler, ödemeniz alındı.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-gray-400">
          Stripe&apos;ın e-posta adresinize gönderdiği makbuzu kontrol edin. Gelmezse spam ve
          promosyonlar klasörüne bakın.
        </p>
      </div>
    </main>
  );
}
