"use client";

// VSL funnel sarmalayıcı: KİLİTLİ VİDEO → POPUP OPT-IN → VİDEO → CTA.
// Kişi videoyu açmak için ad+soyad+e-posta verir (erken lead), sonra video açılır.
// Opt-in localStorage'da tutulur → geri gelen kişi kapıyı tekrar görmez.

import { useEffect, useState } from "react";
import Link from "next/link";
import { VslPlayer } from "@/components/lp/VslPlayer";
import { VSL_OPTIN_CONTACT_KEY } from "@/lib/funnel";
import {
  captureAttribution,
  track,
  trackServer,
  getAttribution,
} from "@/lib/tracking";

const UNLOCK_KEY = "fvp_vsl_unlocked";
const CTA_KEY = "fvp_vsl_cta"; // 5 dk izleyip CTA'yı hak edince → geri gelince tekrar bekletme

export function VslFunnel({
  videoId,
  poster,
}: {
  videoId: string;
  poster?: string;
}) {
  const [unlocked, setUnlocked] = useState(false);
  const [ctaReady, setCtaReady] = useState(false); // CTA yalnız 5 dk izlenince açılır
  const [ready, setReady] = useState(false); // localStorage okundu mu (SSR flash önle)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [modalOpen, setModalOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");

  const posterUrl =
    poster || `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

  useEffect(() => {
    captureAttribution();
    try {
      if (localStorage.getItem(UNLOCK_KEY)) setUnlocked(true);
      if (localStorage.getItem(CTA_KEY)) setCtaReady(true); // daha önce 5 dk izlemiş
    } catch {}
    setReady(true);
    trackServer("vsl_optin_view");
    track("vsl_optin_view", { location: "vsl" });
  }, []);

  useEffect(() => {
    if (!modalOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setModalOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [modalOpen]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!firstName.trim() || !lastName.trim())
      return setErr("Ad ve soyadınızı girin.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setErr("Geçerli bir e-posta girin.");
    setSending(true);
    try {
      captureAttribution();
      const attribution = getAttribution();
      const res = await fetch("/api/optin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          website,
          attribution,
        }),
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
          }),
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
        <VslPlayer
          videoId={videoId}
          poster={poster}
          autoplay
          onMilestone={(name) => {
            // CTA yalnız 5 dakika izlendikten sonra açılır (Kadir: time-on-brand).
            if (name === "vsl_min5") {
              setCtaReady(true);
              try {
                localStorage.setItem(CTA_KEY, "1");
              } catch {}
            }
          }}
        />
        {/* CTA — yalnız 5 dk izlendikten sonra görünür (adım 2: detaylı başvuru) */}
        {ctaReady && (
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
            <p className="mt-3 text-sm text-gray-400">
              Kısa bir başvuru + ücretsiz strateji görüşmesi.
            </p>
          </div>
        )}
      </div>
    );
  }

  // KAPI — video görünür, kilitli; form popup içinde açılır.
  return (
    <>
      <div className="relative overflow-hidden rounded-2xl bg-black shadow-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={posterUrl}
          alt="Video kapağı"
          className="aspect-video w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071331]/45 via-[#071331]/10 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center px-5 text-white">
          <button
            type="button"
            onClick={openModal}
            className="relative flex h-12 w-12 translate-y-7 items-center justify-center rounded-full border border-white/30 bg-gradient-to-br from-white/25 to-white/10 shadow-xl shadow-black/20 backdrop-blur-sm transition hover:scale-105 hover:from-white/30 hover:to-white/15 sm:h-14 sm:w-14 sm:translate-y-8"
            aria-label="Videoyu aç"
          >
            <svg
              viewBox="0 0 24 24"
              className="ml-0.5 h-5 w-5 fill-white drop-shadow sm:h-6 sm:w-6"
              aria-hidden="true"
            >
              <path d="M8.5 5.75v12.5c0 .62.68 1 1.2.67l9.7-6.25a.8.8 0 0 0 0-1.34l-9.7-6.25a.8.8 0 0 0-1.2.67Z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="mt-5 text-center">
        <button
          type="button"
          onClick={openModal}
          className="btn-primary w-full px-8 py-4 text-base sm:w-auto"
        >
          Videoyu aç
        </button>
        <p className="mx-auto mt-3 max-w-lg text-sm text-gray-400">
          Ad, soyad ve e-posta bilgisini bırak; video hemen açılır.
        </p>
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
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6 fill-white"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <h2
              id="vsl-optin-title"
              className="text-xl font-bold text-[#0d204d] sm:text-2xl"
            >
              Videoyu hemen açalım
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Bilgilerini bırak, video bu sayfada açılacak.
            </p>
            <form onSubmit={submit} className="mt-5 space-y-3 text-left">
              {/* honeypot */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                name="website"
                onChange={(e) => setWebsite(e.target.value)}
                style={{
                  position: "absolute",
                  left: "-9999px",
                  width: 1,
                  height: 1,
                }}
                aria-hidden="true"
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  name="firstName"
                  aria-label="Adınız"
                  placeholder="Adınız"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  autoComplete="given-name"
                  required
                  className="w-full rounded-lg border border-[#e6e8ea] px-4 py-3 text-sm text-[#0d204d] outline-none focus:border-[#0d204d]"
                />
                <input
                  type="text"
                  name="lastName"
                  aria-label="Soyadınız"
                  placeholder="Soyadınız"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  autoComplete="family-name"
                  required
                  className="w-full rounded-lg border border-[#e6e8ea] px-4 py-3 text-sm text-[#0d204d] outline-none focus:border-[#0d204d]"
                />
              </div>
              <input
                type="email"
                name="email"
                aria-label="E-posta adresiniz"
                placeholder="E-posta adresiniz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="w-full rounded-lg border border-[#e6e8ea] px-4 py-3 text-sm text-[#0d204d] outline-none focus:border-[#0d204d]"
              />
              {err && <p className="text-sm text-red-600">{err}</p>}
              <button
                type="submit"
                disabled={sending}
                className="btn-primary w-full px-6 py-3 text-sm disabled:opacity-60"
              >
                {sending ? "Açılıyor..." : "Videoyu aç"}
              </button>
            </form>
            <p className="mt-3 text-xs text-gray-400">
              Bilgileriniz güvende, istediğiniz an çıkabilirsiniz.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
