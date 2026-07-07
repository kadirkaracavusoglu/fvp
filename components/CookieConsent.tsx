"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

const KEY = "fvp_cookie_ack";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (!localStorage.getItem(KEY)) {
        const t = setTimeout(() => setShow(true), 800);
        return () => clearTimeout(t);
      }
    } catch {
      /* localStorage yoksa göstermeyi dene */
      setShow(true);
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(KEY, "1");
    } catch {}
    setShow(false);
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="fixed inset-x-3 bottom-3 z-[90] sm:inset-x-auto sm:left-4 sm:bottom-4 sm:max-w-md"
          role="dialog"
          aria-live="polite"
          aria-label="Çerez bilgilendirmesi"
        >
          <div className="rounded-2xl border border-[#e6e8ea] bg-white p-5 shadow-2xl">
            <p className="text-sm leading-relaxed text-[#33405c]">
              Bu sitede deneyiminizi iyileştirmek, kullanımı analiz etmek ve reklam performansını ölçmek için çerezler
              kullanıyoruz. Kullanmaya devam ederek çerez kullanımını kabul etmiş olursunuz.{" "}
              <Link href="/cerez" className="font-medium text-cyan underline">
                Detaylar
              </Link>
            </p>
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={accept}
                className="rounded-full bg-[#0d204d] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Kabul Et
              </button>
              <Link
                href="/gizlilik"
                className="text-sm font-medium text-gray-400 hover:text-[#0d204d]"
              >
                Gizlilik Politikası
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
