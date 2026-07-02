"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Status = "idle" | "loading" | "success" | "error";

export function NewsletterForm({
  variant = "light",
  socialProof = false,
}: {
  variant?: "light" | "onNavy";
  socialProof?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Bir sorun oluştu.");
      }
    } catch {
      setStatus("error");
      setMessage("Bağlantı hatası. Tekrar dene.");
    }
  }

  const onNavy = variant === "onNavy";

  return (
    <div className="mx-auto w-full max-w-md">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`flex items-center justify-center gap-3 rounded-2xl border px-5 py-4 text-sm font-medium ${
              onNavy ? "border-white/25 bg-white/10 text-white" : "border-[#0d204d]/15 bg-[#f4f6f9] text-[#0d204d]"
            }`}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0d204d] text-xs text-white">✓</span>
            Kaydın alındı! Gelen kutunu (ve spam'i) kontrol et.
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={onSubmit}
          >
            {/* Birleşik pill: input + buton */}
            <div
              className={`group flex items-center gap-2 rounded-full border p-1.5 shadow-sm transition-all focus-within:shadow-md ${
                onNavy
                  ? "border-white/25 bg-white/10 focus-within:border-white"
                  : "border-[#e6e8ea] bg-white focus-within:border-[#0d204d]"
              }`}
            >
              <span className={`hidden pl-3 sm:block ${onNavy ? "text-white/60" : "text-[#9ba4b0]"}`} aria-hidden>
                ✉️
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-posta adresin"
                className={`min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm outline-none ${
                  onNavy ? "text-white placeholder:text-white/60" : "text-[#0d204d] placeholder:text-[#9ba4b0]"
                }`}
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-transform hover:-translate-y-0.5 disabled:opacity-70 ${
                  onNavy ? "bg-white text-[#0d204d]" : "bg-[#0d204d] text-white"
                }`}
              >
                {status === "loading" ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Bekle…
                  </>
                ) : (
                  <>
                    Kayıt Ol
                    <span aria-hidden>→</span>
                  </>
                )}
              </button>
            </div>

            {status === "error" && (
              <p className={`mt-2 text-center text-xs ${onNavy ? "text-white/80" : "text-red-600"}`}>{message}</p>
            )}

            {socialProof && (
              <div className={`mt-3 flex items-center justify-center gap-2 text-xs ${onNavy ? "text-white/70" : "text-gray-400"}`}>
                <span className="flex -space-x-1.5">
                  {["#0d204d", "#1d3670", "#22d3ee"].map((c) => (
                    <span key={c} className="h-4 w-4 rounded-full border-2 border-white" style={{ background: c }} />
                  ))}
                </span>
                500+ fitness profesyoneli okuyor · Ücretsiz
              </div>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
