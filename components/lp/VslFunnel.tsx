"use client";

// VSL funnel sarmalayıcı: KİLİTLİ VİDEO → POPUP OPT-IN → VİDEO → CTA.
// Kişi videoyu açmak için ad+soyad+e-posta verir (erken lead), sonra video açılır.
// Opt-in localStorage'da tutulur → geri gelen kişi kapıyı tekrar görmez.

import { useEffect, useState } from "react";
import Link from "next/link";
import { VslPlayer } from "@/components/lp/VslPlayer";
import { VSL_OPTIN_CONTACT_KEY } from "@/lib/funnel";
import { track, trackServer, getAttribution } from "@/lib/tracking";

const UNLOCK_KEY = "fvp_vsl_unlocked";

export function VslFunnel({ videoId, poster }: { videoId: string; poster?: string }) {
  const [unlocked, setUnlocked] = useState(false);
  const [ready, setReady] = useState(false); // localStorage okundu mu (SSR flash önle)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [modalOpen, setModalOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");

  const posterUrl = poster || `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

  useEffect(() => {
    try {
      if (localStorage.getItem(UNLOCK_KEY)) setUnlocked(true);
    } catch {}
    setReady(true);
    trackServer("vsl_optin_view");
    track("vsl_optin_view", { location: "vsl" });
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!firstName.trim() || !lastName.trim()) return setErr("Ad ve soyadınızı girin.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setErr("Geçerli bir e-posta girin.");
    setSending(true);
    try {
      const res = await fetch("/api/optin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, website, attribution: getAttribution() }),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (!res.ok || !data.ok) {
        setErr(data.error || "Bir sorun oluştu, tekrar deneyin.");
        setSending(false);
        return;
      }
      try {
        localStorage.setItem(UNLOCK_KEY, "1");
        localStorage.setItem(
          VSL_OPTIN_CONTACT_KEY,
          JSON.stringify({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.toLowerCase().trim(),
          })
        );
      } catch {}
      track("vsl_optin_submit", { location: "vsl" });
      trackServer("vsl_optin_submit", { video: videoId });
      setSending(false);
      setModalOpen(false);
      setUnlocked(true);
    } catch {
      setErr("Bağlantı sorunu, tekrar deneyin.");
      setSending(false);
    }
  }

  function openModal() {
    setErr("");
    setModalOpen(true);
    track("vsl_optin_cta_click", { location: "vsl" });
    trackServer("vsl_optin_cta_click", { video: videoId });
  }

  // localStorage okunmadan render etme (kilitli↔açık flash olmasın)
  if (!ready) {
    return <div className="aspect-video w-full rounded-2xl bg-[#0b1a3a]" />;
  }

  if (unlocked) {
    return (
      <div>
        <VslPlayer videoId={videoId} poster={poster} autoplay />
        {/* CTA — video sonrası detaylı başvuru (adım 2) */}
        <div className="mt-8 text-center">
          <Link
            href="/vsl/basvuru"
            className="btn-primary inline-block px-8 py-4 text-base"
            onClick={() => {
              track("cta_click", { location: "vsl" });
              trackServer("cta_click", { video: videoId });
            }}
          >
            Yol haritanı birlikte konuşalım →
          </Link>
          <p className="mt-3 text-sm text-gray-400">Kısa bir başvuru + ücretsiz strateji görüşmesi.</p>
        </div>
      </div>
    );
  }

  // KAPI — video görünür, kilitli; form popup içinde açılır.
  return (
    <>
      <div className="relative overflow-hidden rounded-2xl bg-black shadow-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={posterUrl} alt="Video kapağı" className="aspect-video w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071331]/92 via-[#071331]/35 to-[#071331]/10" />
        <div className="absolute left-4 top-4 rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
          Kilitli video
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center text-white">
          <button
            type="button"
            onClick={openModal}
            className="relative mb-5 flex h-24 w-24 items-center justify-center rounded-full border border-white/35 bg-white/20 shadow-2xl shadow-black/30 backdrop-blur transition hover:scale-105 hover:bg-white/25"
            aria-label="Videoyu aç"
          >
            <span className="absolute inset-2 rounded-full border border-white/20" aria-hidden="true" />
            <svg viewBox="0 0 24 24" className="ml-1 h-10 w-10 fill-white drop-shadow" aria-hidden="true">
              <path d="M8.5 5.75v12.5c0 .62.68 1 1.2.67l9.7-6.25a.8.8 0 0 0 0-1.34l-9.7-6.25a.8.8 0 0 0-1.2.67Z" />
            </svg>
            <span className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#0d204d] shadow-lg" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-white stroke-[2.4]">
                <path d="M7 11V8a5 5 0 0 1 9.7-1.7" strokeLinecap="round" />
                <rect x="6" y="11" width="12" height="9" rx="2" />
              </svg>
            </span>
          </button>
          <h2 className="max-w-xl text-balance text-2xl font-bold leading-tight sm:text-3xl">
            Videoyu izlemek için kilidi aç
          </h2>
          <p className="mt-2 max-w-lg text-sm text-white/75 sm:text-base">
            Ad, soyad ve e-posta bilgisini bırak; video hemen açılır.
          </p>
          <button type="button" onClick={openModal} className="btn-primary mt-5 px-7 py-3 text-sm sm:text-base">
            Videoyu aç
          </button>
        </div>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#071331]/75 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="vsl-optin-title"
        >
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-[#e6e8ea] text-xl leading-none text-[#0d204d] hover:bg-[#f4f6f8]"
              aria-label="Popup'ı kapat"
            >
              ×
            </button>
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#0d204d]">
              <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <h2 id="vsl-optin-title" className="text-xl font-bold text-[#0d204d] sm:text-2xl">
              Videoyu hemen açalım
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Bilgilerini bırak, video bu sayfada açılacak.
            </p>
            <form onSubmit={submit} className="mt-5 space-y-3 text-left">
              {/* honeypot */}
              <input
                type="text" tabIndex={-1} autoComplete="off" value={website}
                onChange={(e) => setWebsite(e.target.value)}
                style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }}
                aria-hidden="true"
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  type="text" placeholder="Adınız" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-lg border border-[#e6e8ea] px-4 py-3 text-sm text-[#0d204d] outline-none focus:border-[#0d204d]"
                />
                <input
                  type="text" placeholder="Soyadınız" value={lastName} onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-lg border border-[#e6e8ea] px-4 py-3 text-sm text-[#0d204d] outline-none focus:border-[#0d204d]"
                />
              </div>
              <input
                type="email" placeholder="E-posta adresiniz" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-[#e6e8ea] px-4 py-3 text-sm text-[#0d204d] outline-none focus:border-[#0d204d]"
              />
              {err && <p className="text-sm text-red-600">{err}</p>}
              <button
                type="submit" disabled={sending}
                className="btn-primary w-full px-6 py-3 text-sm disabled:opacity-60"
              >
                {sending ? "Açılıyor..." : "Videoyu aç"}
              </button>
            </form>
            <p className="mt-3 text-xs text-gray-400">Bilgileriniz güvende, istediğiniz an çıkabilirsiniz.</p>
          </div>
        </div>
      )}
    </>
  );
}
