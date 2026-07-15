import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sayfa bulunamadı",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-5 py-24 text-center">
      <div className="text-sm font-semibold text-cyan">404</div>
      <h1 className="mt-3 text-3xl font-bold text-navy sm:text-4xl">
        Aradığın sayfa burada değil.
      </h1>
      <p className="mt-4 text-gray-400">
        Bağlantı taşınmış ya da hiç var olmamış olabilir. Aşağıdan devam edebilirsin.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Ana sayfaya dön
        </Link>
        <Link
          href="/bulten"
          className="rounded-full border border-[#e6e8ea] px-6 py-3 text-sm font-semibold text-navy transition hover:border-navy"
        >
          Bülteni oku
        </Link>
        <Link
          href="/podcast"
          className="rounded-full border border-[#e6e8ea] px-6 py-3 text-sm font-semibold text-navy transition hover:border-navy"
        >
          Podcast
        </Link>
      </div>
    </div>
  );
}
