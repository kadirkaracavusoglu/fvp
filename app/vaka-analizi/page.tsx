"use client";

// A/B TESTİ — B VARYANTI (Hande vakası, yeni metin). A varyantı: /vaka-hande.
// Video, başvuru formu, takvim ve teşekkür sayfaları A ile aynı içerikte ama
// kendi /vaka-analizi/* adreslerinde → panelde "Hande Vaka Analizi" ayrı funnel.
// Video kilidi (localStorage) ve GHL akışları A ile ortak.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { VAKA_HANDE } from "@/lib/funnel";
import {
  captureAttribution,
  track,
  trackServer,
  getAttribution,
} from "@/lib/tracking";

export default function VakaAnaliziOptinPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [modalOpen, setModalOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");

  const posterUrl = `https://i.ytimg.com/vi/${VAKA_HANDE.videoId}/maxresdefault.jpg`;

  useEffect(() => {
    captureAttribution();
    try {
      const reset = new URLSearchParams(window.location.search).get("reset");
      if (reset === "1") {
        localStorage.removeItem(VAKA_HANDE.unlockKey);
        localStorage.removeItem(VAKA_HANDE.ctaKey);
      } else if (localStorage.getItem(VAKA_HANDE.unlockKey)) {
        router.replace("/vaka-analizi/izle");
        return;
      }
    } catch {}
    track("vsl_optin_view", { location: "vaka-analizi" });
    trackServer("vsl_optin_view");
  }, [router]);

  useEffect(() => {
    if (!modalOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setModalOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [modalOpen]);

  function openModal() {
    setErr("");
    setModalOpen(true);
    track("vsl_optin_cta_click", { location: "vaka-analizi" });
    trackServer("vsl_optin_cta_click");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!firstName.trim()) return setErr("Adınızı girin.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setErr("Geçerli bir e-posta girin.");
    setSending(true);
    try {
      captureAttribution();
      const attribution = getAttribution();
      const res = await fetch("/api/optin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName: "", email, website, attribution, funnel: "vaka-hande" }),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (!res.ok || !data.ok) {
        setErr(data.error || "Bir sorun oluştu, tekrar deneyin.");
        setSending(false);
        return;
      }
      try {
        localStorage.setItem(VAKA_HANDE.unlockKey, "1");
        localStorage.setItem(
          VAKA_HANDE.contactKey,
          JSON.stringify({
            firstName: firstName.trim(),
            lastName: "",
            email: email.toLowerCase().trim(),
          }),
        );
      } catch {}
      track("vsl_optin_submit", { location: "vaka-analizi" });
      trackServer("vsl_optin_submit", { video: VAKA_HANDE.videoId });
      router.push("/vaka-analizi/izle");
    } catch {
      setErr("Bağlantı sorunu, tekrar deneyin.");
      setSending(false);
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="glow-bg">
        <div className="mx-auto max-w-4xl px-5 pb-8 pt-16 text-center sm:pt-20">
          <span className="chip inline-block px-4 py-1 text-xs" data-active="true">
            ÜCRETSİZ VAKA ANALİZİ · ONLINE KOÇLUK İŞİNİ KURMAK VEYA BÜYÜTMEK
            İSTEYEN FITNESS KOÇLARI İÇİN
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-balance text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
            Hande Hoca ile Fitsistem&apos;i 1,5 ayda kurduk; ilk duyuruda 65
            başvuru geldi ve 7 online danışan kazandı. Şimdi bu sistemi nasıl
            kurduğumuzu adım adım gösteriyorum.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-400">
            Bu 27 dakikalık vaka analizinde Hande Hoca&apos;nın sıfırdan online
            koçluğa geçerken yaşadığı kafa karışıklığını, Fitsistem&apos;i hangi
            sırayla kurduğumuzu ve içerikten başvuruya, satıştan işin
            sistemleşmesine kadar nasıl ilerlediğimizi gerçek süreç üzerinden
            göreceksiniz.
          </p>
        </div>
      </section>

      {/* Kilitli video + aç butonu */}
      <section className="mx-auto max-w-4xl px-5 pb-40 sm:pb-16">
        <div className="relative overflow-hidden rounded-2xl bg-black shadow-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={posterUrl}
            alt="Video kapağı"
            className="aspect-video w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071331]/55 via-[#071331]/15 to-transparent" />
          <button
            type="button"
            onClick={openModal}
            className="absolute inset-0 flex items-center justify-center"
            aria-label="Videoyu aç"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-xl transition hover:scale-105 sm:h-20 sm:w-20">
              <svg viewBox="0 0 24 24" className="ml-1 h-8 w-8 fill-[#0d204d] sm:h-9 sm:w-9">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        </div>
        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={openModal}
            className="btn-primary w-full px-8 py-4 text-base sm:w-auto"
          >
            VAKA ANALİZİNİ ÜCRETSİZ İZLE →
          </button>
          <p className="mx-auto mt-3 max-w-lg text-sm text-gray-400">
            Vaka analizine erişmek için videoyu ücretsiz açın.
          </p>
        </div>
      </section>

      {/* Kapanış: marka satırı.
          "Bu vaka analizinde göreceğiniz 3 şey" bölümü (4 Eki) ve alttaki ikinci
          "Vaka analizini ücretsiz izle" butonu (12 Eki 2026) Kadir'in isteğiyle KALDIRILDI. */}
      <section className="mx-auto max-w-3xl px-5 pb-14">
        <p className="text-center text-xs text-gray-400">
          Fitness ve Pazarlama · Kadir Karaçavuşoğlu
        </p>
      </section>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#071331]/75 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="vh-optin-title"
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
            <h2 id="vh-optin-title" className="text-xl font-bold text-[#0d204d] sm:text-2xl">
              Vaka analizini hemen izle
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Adınızı ve e-posta adresinizi bırakın, video hemen açılsın.
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
                style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }}
                aria-hidden="true"
              />
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
                {sending ? "Açılıyor..." : "Vaka Analizini Aç →"}
              </button>
            </form>
            <p className="mt-3 text-xs text-gray-400">
              Bilgileriniz yalnızca vaka analizine erişim ve ilgili içerikler
              için kullanılacaktır.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
