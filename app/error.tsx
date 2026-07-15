"use client";

import { useEffect } from "react";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error); // DSN yoksa no-op
    console.error("Sayfa hatası:", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-5 py-24 text-center">
      <div className="text-sm font-semibold text-cyan">Bir şeyler ters gitti</div>
      <h1 className="mt-3 text-3xl font-bold text-navy sm:text-4xl">Bu sayfa yüklenemedi.</h1>
      <p className="mt-4 text-gray-400">
        Geçici bir sorun olabilir. Tekrar deneyebilir ya da ana sayfaya dönebilirsin.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={reset}
          className="rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Tekrar dene
        </button>
        <Link
          href="/"
          className="rounded-full border border-[#e6e8ea] px-6 py-3 text-sm font-semibold text-navy transition hover:border-navy"
        >
          Ana sayfaya dön
        </Link>
      </div>
    </div>
  );
}
