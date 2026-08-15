"use client";

// VSL detaylı başvuru — Typeform tarzı: tek ekran tek soru, seçince otomatik ilerle.
// Sonunda iletişim → /api/basvuru → GHL takvim sayfasına yönlendir.

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BASVURU_SORULARI,
  VSL_OPTIN_CONTACT_KEY,
  type BasvuruCevaplar,
  type BasvuruSoru,
} from "@/lib/funnel";
import {
  captureAttribution,
  track,
  trackServer,
  getAttribution,
} from "@/lib/tracking";

const TOTAL = BASVURU_SORULARI.length + 1; // sorular + iletişim ekranı
const fieldClass =
  "w-full rounded-lg border border-[#e6e8ea] bg-white px-4 py-3 text-[#0d204d] outline-none transition focus:border-[#0d204d]";

export default function BasvuruPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<BasvuruCevaplar>({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [instagram, setInstagram] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");
  const started = useRef(false);

  useEffect(() => {
    captureAttribution();
    if (!started.current) {
      started.current = true;
      track("vsl_basvuru_start", { location: "vsl" });
      trackServer("vsl_basvuru_start");
    }
    try {
      const contact = JSON.parse(
        localStorage.getItem(VSL_OPTIN_CONTACT_KEY) || "{}",
      ) as {
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
    const question =
      step < BASVURU_SORULARI.length ? BASVURU_SORULARI[step]?.key : "iletisim";
    track(`vsl_basvuru_s${n}`, { location: "vsl", question });
    trackServer(`vsl_basvuru_s${n}`, { meta: { step: n, question } });
    if (question === "iletisim") {
      track("vsl_basvuru_contact_view", { location: "vsl" });
      trackServer("vsl_basvuru_contact_view");
    }
    window.scrollTo({ top: 0 });
  }, [step]);

  function answerValid(q: BasvuruSoru): boolean {
    const value = answers[q.key];
    if (q.tip === "coklu") return Array.isArray(value) && value.length > 0;
    if (q.tip === "metin")
      return (
        typeof value === "string" && value.trim().length >= (q.minLength || 1)
      );
    return typeof value === "string" && Boolean(value);
  }

  function recordAnswer(q: BasvuruSoru) {
    track("vsl_basvuru_answer", {
      location: "vsl",
      question: q.key,
      type: q.tip,
    });
    trackServer("vsl_basvuru_answer", {
      meta: { question: q.key, type: q.tip },
    });
  }

  function choose(q: BasvuruSoru, value: string) {
    setErr("");
    setAnswers((a) => ({ ...a, [q.key]: value }));
    recordAnswer(q);
    setTimeout(() => setStep((s) => Math.min(s + 1, TOTAL - 1)), 180);
  }

  function toggle(q: BasvuruSoru, value: string) {
    setErr("");
    setAnswers((a) => {
      const current = Array.isArray(a[q.key]) ? (a[q.key] as string[]) : [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...a, [q.key]: next };
    });
  }

  function updateText(q: BasvuruSoru, value: string) {
    setErr("");
    setAnswers((a) => ({ ...a, [q.key]: value }));
  }

  function next(q: BasvuruSoru) {
    if (!answerValid(q)) {
      setErr(
        q.tip === "coklu"
          ? "En az bir seçenek seçin."
          : "Kısa bir cevap yazın.",
      );
      return;
    }
    recordAnswer(q);
    setStep((s) => Math.min(s + 1, TOTAL - 1));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!firstName.trim() || !lastName.trim())
      return setErr("Ad ve soyadınızı girin.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setErr("Geçerli bir e-posta girin.");
    if (phone.trim().length < 7) return setErr("Telefon numaranızı girin.");
    if (!instagram.trim()) return setErr("Instagram adresinizi girin.");
    setSending(true);
    try {
      captureAttribution();
      const attribution = getAttribution();
      const res = await fetch("/api/basvuru", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          instagram,
          businessName,
          websiteUrl,
          cevaplar: answers,
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
      track("vsl_basvuru_submit", { location: "vsl" });
      trackServer("vsl_basvuru_submit");
      router.push("/vsl/randevu");
    } catch {
      setErr("Bağlantı sorunu, tekrar deneyin.");
      setSending(false);
    }
  }

  const isContact = step === BASVURU_SORULARI.length;
  const soru = isContact ? undefined : BASVURU_SORULARI[step];
  const pct = Math.round(((step + 1) / TOTAL) * 100);

  return (
    <div className="glow-bg min-h-screen">
      {/* İlerleme */}
      <div className="fixed inset-x-0 top-0 z-10 h-1.5 bg-[#e6e8ea]">
        <div
          className="h-full bg-[#0d204d] transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-5 py-16">
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-400">
          3. Adım — Formu doldurun
        </p>
        <div className="mb-4 flex items-center justify-between gap-3 text-xs font-medium text-gray-400">
          <div className="flex items-center gap-3">
            {step > 0 && (
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="hover:text-[#0d204d]"
              >
                ← Geri
              </button>
            )}
            <span>
              {step + 1} / {TOTAL}
            </span>
          </div>
          <span>Yaklaşık 3 dk</span>
        </div>

        {!isContact && soru ? (
          <div>
            <h1 className="text-balance text-2xl font-bold leading-tight text-[#0d204d] sm:text-3xl">
              {soru.soru}
            </h1>
            {soru.aciklama && (
              <p className="mt-2 text-sm text-gray-400">{soru.aciklama}</p>
            )}
            {soru.tip === "metin" ? (
              <div className="mt-6">
                <textarea
                  rows={5}
                  name={soru.key}
                  aria-label={soru.soru}
                  placeholder={soru.placeholder}
                  value={
                    typeof answers[soru.key] === "string"
                      ? (answers[soru.key] as string)
                      : ""
                  }
                  onChange={(e) => updateText(soru, e.target.value)}
                  className={`${fieldClass} resize-none`}
                />
                {err && <p className="mt-3 text-sm text-red-600">{err}</p>}
                <button
                  type="button"
                  onClick={() => next(soru)}
                  className="btn-primary mt-5 w-full px-6 py-4 text-base sm:w-auto"
                >
                  Devam et →
                </button>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {(soru.secenekler || []).map((opt) => {
                  const value = answers[soru.key];
                  const active =
                    soru.tip === "coklu"
                      ? Array.isArray(value) && value.includes(opt.deger)
                      : value === opt.deger;
                  return (
                    <button
                      key={opt.deger}
                      type="button"
                      onClick={() =>
                        soru.tip === "coklu"
                          ? toggle(soru, opt.deger)
                          : choose(soru, opt.deger)
                      }
                      className={`card flex w-full items-start gap-3 px-5 py-4 text-left ${active ? "!border-[#0d204d] ring-2 ring-[#0d204d]" : ""}`}
                    >
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${active ? "border-[#0d204d] bg-[#0d204d] text-white" : "border-[#cfd5dc] text-transparent"}`}
                      >
                        ✓
                      </span>
                      <span>
                        <span className="font-semibold text-[#0d204d]">
                          {opt.deger}
                        </span>
                        {opt.alt && (
                          <span className="mt-1 block text-sm text-gray-400">
                            {opt.alt}
                          </span>
                        )}
                      </span>
                    </button>
                  );
                })}
                {soru.tip === "coklu" && (
                  <>
                    {err && <p className="text-sm text-red-600">{err}</p>}
                    <button
                      type="button"
                      onClick={() => next(soru)}
                      className="btn-primary mt-2 w-full px-6 py-4 text-base sm:w-auto"
                    >
                      Devam et →
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={submit}>
            <h1 className="text-2xl font-bold leading-tight text-[#0d204d] sm:text-3xl">
              Son bir şey — size nasıl ulaşalım?
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Görüşme bağlantısını buraya göndereceğiz. Bittiğinde görüşme
              saatinizi seçeceksiniz. Marka/site alanları opsiyonel.
            </p>
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              name="website"
              style={{
                position: "absolute",
                left: "-9999px",
                width: 1,
                height: 1,
              }}
              aria-hidden="true"
            />
            <div className="mt-6 space-y-3">
              <input
                type="text"
                name="firstName"
                aria-label="Adınız"
                placeholder="Adınız"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={fieldClass}
                autoComplete="given-name"
                required
              />
              <input
                type="text"
                name="lastName"
                aria-label="Soyadınız"
                placeholder="Soyadınız"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={fieldClass}
                autoComplete="family-name"
                required
              />
              <input
                type="email"
                name="email"
                aria-label="E-posta"
                placeholder="E-posta"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={fieldClass}
                autoComplete="email"
                required
              />
              <input
                type="tel"
                name="phone"
                aria-label="Telefon"
                placeholder="Telefon"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={fieldClass}
                autoComplete="tel"
                required
              />
              <input
                type="text"
                name="instagram"
                aria-label="Instagram adresiniz"
                placeholder="Instagram adresiniz"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className={fieldClass}
                autoComplete="url"
                required
              />
              <input
                type="text"
                name="businessName"
                aria-label="Marka veya işletme adı"
                placeholder="Marka / işletme adı (opsiyonel)"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className={fieldClass}
                autoComplete="organization"
              />
              <input
                type="url"
                name="websiteUrl"
                aria-label="Web site veya profil linki"
                placeholder="Web site veya profil linki (opsiyonel)"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className={fieldClass}
                autoComplete="url"
              />
              {err && <p className="text-sm text-red-600">{err}</p>}
              <button
                type="submit"
                disabled={sending}
                className="btn-primary w-full px-6 py-4 text-base disabled:opacity-60"
              >
                {sending ? "Gönderiliyor…" : "Formu bitir, saat seçmeye geç →"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
