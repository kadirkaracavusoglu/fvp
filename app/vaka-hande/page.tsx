"use client";

// VSL OPT-IN SAYFASI (Hande vakası) — funnel'ın İLK sayfası. Video kilitli; açmak için form.
// Form dolunca /vaka-hande/izle açılır. Reklam trafiği buraya gelir.
// Kendi localStorage anahtarları (VAKA_HANDE) — /fitsistem funnel'ıyla karışmaz.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { VAKA_HANDE } from "@/lib/funnel";
import {
  captureAttribution,
  track,
  trackServer,
  getAttribution,
} from "@/lib/tracking";

export default function VakaHandeOptinPage() {
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
        router.replace("/vaka-hande/izle");
        return;
      }
    } catch {}
    track("vsl_optin_view", { location: "vaka-hande" });
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
    track("vsl_optin_cta_click", { location: "vaka-hande" });
    trackServer("vsl_optin_cta_click");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!firstName.trim()) return setErr("Adını gir.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setErr("Geçerli bir e-posta gir.");
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
        setErr(data.error || "Bir sorun oluştu, tekrar dene.");
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
      track("vsl_optin_submit", { location: "vaka-hande" });
      trackServer("vsl_optin_submit", { video: VAKA_HANDE.videoId });
      router.push("/vaka-hande/izle");
    } catch {
      setErr("Bağlantı sorunu, tekrar dene.");
      setSending(false);
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="glow-bg">
        <div className="mx-auto max-w-4xl px-5 pb-8 pt-16 text-center sm:pt-20">
          <span className="chip inline-block px-4 py-1 text-xs" data-active="true">
            ONLINE KOÇLUK İŞİNİ KURMAK VEYA BÜYÜTMEK İSTEYEN FITNESS KOÇLARI İÇİN
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-balance text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
            Hande Hoca ile 1,5 ayda ilk 7 online danışanına ulaştık ve ilk
            duyuruda 60 başvuru aldık. Şimdi bu sistemi nasıl kurduğumuzu adım
            adım gösteriyorum.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-400">
            Bu ücretsiz vaka analizinde Hande Hoca ile nereden başladığımızı,
            hangi problemleri tespit ettiğimizi, online koçluk işini nasıl
            kurduğumuzu ve içerikten başvuruya kadar bütün süreci nasıl
            birbirine bağladığımızı gerçek çalışmalar üzerinden göreceksin.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            İster online koçluğa yeni başlıyor ol ister başlamış fakat düzenli
            danışan kazanacak bir yapı kuramamış ol, videonun sonunda kendi
            işinde hangi parçaların eksik olduğunu, neye öncelik vermen
            gerektiğini ve FitSistem&apos;in sana nasıl yardımcı olabileceğini
            çok daha net anlayacaksın.
          </p>
        </div>
      </section>

      {/* Kilitli video + aç butonu */}
      <section className="mx-auto max-w-4xl px-5 pb-16">
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
            Tüm Süreci Ücretsiz İzle →
          </button>
          <p className="mx-auto mt-3 max-w-lg text-sm text-gray-400">
            Vaka analizine erişmek için videoyu ücretsiz aç.
          </p>
        </div>
      </section>

      {/* Ortak düşman — "onlar vs biz" konumlandırması. Metinler Hande'nin
          video içindeki kendi sözlerinden çıkarıldı; uydurma iddia yok. */}
      <section className="mx-auto max-w-3xl px-5 pb-14">
        <div className="rounded-2xl border border-[#e6e8ea] bg-white/70 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-[#0d204d] sm:text-2xl">
            Online koçluğa başlamanı engelleyen üç şey
          </h2>
          <div className="mt-5 space-y-4 text-base text-gray-500">
            <p>
              <b className="text-[#0d204d]">Doğru zamanı beklemek.</b> &quot;Şu iş
              bitsin, şartlar düzelsin, sonra başlarım.&quot; Hande de tam böyle
              düşünüyordu. Beklenen o gün hiç gelmiyor.
            </p>
            <p>
              <b className="text-[#0d204d]">Önce her şeyi öğrenmeye çalışmak.</b>{" "}
              Hande aylarca web sitesi ve funnel araştırdı, tek bir adım atmadı.
              Bilginin ucu bucağı yok; araştırmak eylem değil.
            </p>
            <p>
              <b className="text-[#0d204d]">Kendinden daha iyisi var sanmak.</b>{" "}
              Her zaman daha iyisi olacak. Ama senden duymak isteyen, seninle
              çalışmak isteyen insanlar var.
            </p>
          </div>
          <p className="mt-5 text-base text-gray-500">
            Hande bu üçünü de aştı. Nasıl yaptığını videoda kendisi anlatıyor.
          </p>
          <button
            type="button"
            onClick={openModal}
            className="btn-primary mt-6 w-full px-8 py-4 text-base sm:w-auto"
          >
            Tüm Süreci Ücretsiz İzle →
          </button>
        </div>
        <p className="mt-8 text-center text-xs text-gray-400">
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
              Adını ve e-posta adresini bırak, video hemen açılsın.
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
                aria-label="Adın"
                placeholder="Adın"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                autoComplete="given-name"
                required
                className="w-full rounded-lg border border-[#e6e8ea] px-4 py-3 text-sm text-[#0d204d] outline-none focus:border-[#0d204d]"
              />
              <input
                type="email"
                name="email"
                aria-label="E-posta adresin"
                placeholder="E-posta adresin"
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
              Bilgilerin yalnızca vaka analizine erişim ve ilgili içerikler
              için kullanılacaktır.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
