"use client";

// VSL detaylı başvuru — Typeform tarzı: tek ekran tek soru, seçince otomatik ilerle.
// Sonunda iletişim → /api/basvuru → GHL takvim sayfasına yönlendir.

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BASVURU_SORULARI, VSL_OPTIN_CONTACT_KEY } from "@/lib/funnel";
import { track, trackServer, getAttribution } from "@/lib/tracking";

const TOTAL = BASVURU_SORULARI.length + 1; // sorular + iletişim ekranı

export default function BasvuruPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");
  const started = useRef(false);

  useEffect(() => {
    if (!started.current) {
      started.current = true;
      track("vsl_basvuru_start", { location: "vsl" });
      trackServer("vsl_basvuru_start");
    }
    try {
      const contact = JSON.parse(localStorage.getItem(VSL_OPTIN_CONTACT_KEY) || "{}") as {
        firstName?: string;
        lastName?: string;
        email?: string;
      };
      if (contact.firstName) setFirstName(contact.firstName);
      if (contact.lastName) setLastName(contact.lastName);
      if (contact.email) setEmail(contact.email);
    } catch {}
  }, []);

  useEffect(() => {
    const n = step + 1;
    track(`vsl_basvuru_s${n}`, { location: "vsl" });
    trackServer(`vsl_basvuru_s${n}`);
    window.scrollTo({ top: 0 });
  }, [step]);

  function choose(key: string, value: string) {
    setAnswers((a) => ({ ...a, [key]: value }));
    setTimeout(() => setStep((s) => Math.min(s + 1, TOTAL - 1)), 180);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!firstName.trim() || !lastName.trim()) return setErr("Ad ve soyadınızı girin.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setErr("Geçerli bir e-posta girin.");
    if (phone.trim().length < 7) return setErr("Telefon numaranızı girin.");
    setSending(true);
    try {
      const res = await fetch("/api/basvuru", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, phone, cevaplar: answers, website, attribution: getAttribution() }),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (!res.ok || !data.ok) {
        setErr(data.error || "Bir sorun oluştu, tekrar deneyin.");
        setSending(false);
        return;
      }
      track("vsl_basvuru_submit", { location: "vsl" });
      trackServer("vsl_basvuru_submit");
      router.push("/vsl/randevu");
    } catch {
      setErr("Bağlantı sorunu, tekrar deneyin.");
      setSending(false);
    }
  }

  const isContact = step === BASVURU_SORULARI.length;
  const soru = BASVURU_SORULARI[step];
  const pct = Math.round(((step + 1) / TOTAL) * 100);

  return (
    <div className="glow-bg min-h-screen">
      {/* İlerleme */}
      <div className="fixed inset-x-0 top-0 z-10 h-1.5 bg-[#e6e8ea]">
        <div className="h-full bg-[#0d204d] transition-all" style={{ width: `${pct}%` }} />
      </div>

      <div className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-5 py-16">
        <div className="mb-4 flex items-center gap-3 text-xs font-medium text-gray-400">
          {step > 0 && (
            <button onClick={() => setStep((s) => Math.max(0, s - 1))} className="hover:text-[#0d204d]">← Geri</button>
          )}
          <span>{step + 1} / {TOTAL}</span>
        </div>

        {!isContact ? (
          <div>
            <h1 className="text-balance text-2xl font-bold leading-tight text-[#0d204d] sm:text-3xl">{soru.soru}</h1>
            {soru.aciklama && <p className="mt-2 text-sm text-gray-400">{soru.aciklama}</p>}
            <div className="mt-6 space-y-3">
              {soru.secenekler.map((opt) => {
                const active = answers[soru.key] === opt.deger;
                return (
                  <button
                    key={opt.deger}
                    onClick={() => choose(soru.key, opt.deger)}
                    className={`card block w-full px-5 py-4 text-left ${active ? "!border-[#0d204d] ring-2 ring-[#0d204d]" : ""}`}
                  >
                    <span className="font-semibold text-[#0d204d]">{opt.deger}</span>
                    {opt.alt && <span className="mt-1 block text-sm text-gray-400">{opt.alt}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <form onSubmit={submit}>
            <h1 className="text-2xl font-bold leading-tight text-[#0d204d] sm:text-3xl">Son adım — size nasıl ulaşalım?</h1>
            <p className="mt-2 text-sm text-gray-400">Görüşme detaylarını buraya göndereceğiz.</p>
            <input
              type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)}
              style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }} aria-hidden="true"
            />
            <div className="mt-6 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Adınız" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-lg border border-[#e6e8ea] px-4 py-3 text-[#0d204d] outline-none focus:border-[#0d204d]" />
                <input type="text" placeholder="Soyadınız" value={lastName} onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-lg border border-[#e6e8ea] px-4 py-3 text-[#0d204d] outline-none focus:border-[#0d204d]" />
              </div>
              <input type="email" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-[#e6e8ea] px-4 py-3 text-[#0d204d] outline-none focus:border-[#0d204d]" />
              <input type="tel" placeholder="Telefon" value={phone} onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-[#e6e8ea] px-4 py-3 text-[#0d204d] outline-none focus:border-[#0d204d]" />
              {err && <p className="text-sm text-red-600">{err}</p>}
              <button type="submit" disabled={sending} className="btn-primary w-full px-6 py-4 text-base disabled:opacity-60">
                {sending ? "Gönderiliyor…" : "Başvuruyu Gönder →"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
