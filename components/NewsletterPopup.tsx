"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NewsletterForm } from "./NewsletterForm";

const STORAGE_KEY = "fvp_popup_seen";

export function NewsletterPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY)) return;
    const timer = setTimeout(() => setOpen(true), 18000); // 18 sn sonra
    return () => clearTimeout(timer);
  }, []);

  function close() {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-[100] p-4 md:inset-0 md:flex md:items-center md:justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Karartma yalnızca masaüstünde — mobilde içeriği kapatmaz (Google engelleyici interstitial kuralı) */}
          <div className="absolute inset-0 hidden bg-navy/50 backdrop-blur-sm md:block" onClick={close} />
          <motion.div
            className="relative mx-auto w-full max-w-md rounded-2xl border border-[#e6e8ea] bg-white p-6 text-center shadow-2xl sm:p-8"
            initial={{ scale: 0.95, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.97, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
          >
            <button
              onClick={close}
              aria-label="Kapat"
              className="absolute right-4 top-4 text-xl leading-none text-[#9ba4b0] hover:text-navy"
            >
              ✕
            </button>
            <div className="text-xs font-medium text-cyan">📩 Bülten</div>
            <h3 className="mt-2 text-2xl font-bold text-navy">Fitness işini sisteme oturt.</h3>
            <p className="mx-auto mt-2 max-w-xs text-sm text-gray-400">
              Haftada 2 e-posta; gerçek stratejiler, gerçek örnekler. Boş laf yok.
            </p>
            <div className="mt-5">
              <NewsletterForm />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
