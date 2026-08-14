"use client";

// VSL funnel sarmalayıcı: OPT-IN KAPISI → VİDEO → CTA.
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
      setUnlocked(true);
    } catch {
      setErr("Bağlantı sorunu, tekrar deneyin.");
      setSending(false);
    }
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

  // KAPI — poster + opt-in formu
  return (
    <div className="relative overflow-hidden rounded-2xl bg-black shadow-2xl">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={posterUrl} alt="Video kapağı" className="aspect-video w-full scale-105 object-cover blur-sm" />
      <div className="absolute inset-0 flex items-center justify-center bg-[#071331]/80 px-4 py-8">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl sm:p-8">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#0d204d]">
            <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white"><path d="M8 5v14l11-7z" /></svg>
          </div>
          <h2 className="text-xl font-bold text-[#0d204d] sm:text-2xl">Videoyu izlemek için son bir adım</h2>
          <p className="mt-2 text-sm text-gray-400">Nereye göndereceğimizi bilelim — videoyu hemen açıyoruz.</p>
          <form onSubmit={submit} className="mt-5 space-y-3 text-left">
            {/* honeypot */}
            <input
              type="text" tabIndex={-1} autoComplete="off" value={website}
              onChange={(e) => setWebsite(e.target.value)}
              style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }}
              aria-hidden="true"
            />
            <div className="grid grid-cols-2 gap-3">
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
              {sending ? "Açılıyor…" : "🔓 Videoyu Aç"}
            </button>
          </form>
          <p className="mt-3 text-xs text-gray-400">Bilgileriniz güvende, istediğiniz an çıkabilirsiniz.</p>
        </div>
      </div>
    </div>
  );
}
