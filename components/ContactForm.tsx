"use client";

import { useState } from "react";
import { track, getAttribution } from "@/lib/tracking";

type Status = "idle" | "loading" | "success" | "error";

const SUBJECTS = [
  "Genel Soru",
  "Sponsorluk & Reklam",
  "İş Birliği / Partnerlik",
  "Konuk / Röportaj",
  "Basın & Medya",
  "Geri Bildirim / Öneri",
];

// Çoklu seçim (sponsorluk) için kanal seçenekleri
const SPONSOR_OPTIONS = [
  "Bülten Sponsorluğu",
  "Podcast Sponsorluğu",
  "Topluluk & Sosyal",
  "İş Birliği / Ortak İçerik",
  "Etkinlik / Atölye",
];

export function ContactForm({
  defaultSubject = "Genel Soru",
  lockSubject = false,
  multi = false,
  multiTitle = "İlgilendiğin alanlar (birden fazla seçebilirsin)",
  multiOptions = SPONSOR_OPTIONS,
}: {
  defaultSubject?: string;
  lockSubject?: boolean;
  multi?: boolean;
  multiTitle?: string;
  multiOptions?: string[];
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: defaultSubject,
    message: "",
  });
  const [website, setWebsite] = useState(""); // honeypot
  const [selected, setSelected] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function toggle(option: string) {
    setSelected((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (multi && selected.length === 0) {
      setStatus("error");
      setMessage("Lütfen en az bir alan seç.");
      return;
    }
    setStatus("loading");
    setMessage("");
    const payload = {
      ...form,
      website,
      subject: multi ? selected.join(", ") : form.subject,
      attribution: getAttribution(),
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.ok) {
        track(multi ? "sponsorship_submit" : "contact_submit", { subject: payload.subject });
        setStatus("success");
        setForm({ name: "", email: "", phone: "", subject: defaultSubject, message: "" });
        setSelected([]);
      } else {
        setStatus("error");
        setMessage(data.error || "Bir sorun oluştu.");
      }
    } catch {
      setStatus("error");
      setMessage("Bağlantı hatası. Tekrar dene.");
    }
  }

  const field =
    "w-full rounded-xl border border-[#e6e8ea] bg-white px-4 py-3 text-sm text-navy outline-none transition-colors placeholder:text-[#9ba4b0] focus:border-navy";
  const label = "mb-1.5 block text-sm font-medium text-navy";

  if (status === "success") {
    return (
      <div className="card mx-auto max-w-xl p-8 text-center">
        <div className="text-3xl">✓</div>
        <h3 className="mt-3 text-xl font-semibold text-navy">Mesajın ulaştı!</h3>
        <p className="mt-2 text-sm text-gray-400">
          En kısa sürede sana <strong>{form.email || "e-posta"}</strong> üzerinden dönüş yapacağız.
        </p>
        <button onClick={() => setStatus("idle")} className="btn-ghost mt-6 px-5 py-2 text-sm">
          Yeni mesaj gönder
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card mx-auto max-w-xl space-y-4 p-6 sm:p-8 text-left">
      {/* Honeypot — görünmez, botlar doldurur */}
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="name">Ad Soyad *</label>
          <input id="name" required value={form.name} onChange={(e) => update("name", e.target.value)} className={field} placeholder="Adın soyadın" />
        </div>
        <div>
          <label className={label} htmlFor="email">E-posta *</label>
          <input id="email" type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} className={field} placeholder="ornek@mail.com" />
        </div>
      </div>

      <div className={`grid gap-4 ${multi ? "" : "sm:grid-cols-2"}`}>
        <div>
          <label className={label} htmlFor="phone">Telefon *</label>
          <input id="phone" type="tel" required value={form.phone} onChange={(e) => update("phone", e.target.value)} className={field} placeholder="05XX XXX XX XX" />
        </div>
        {!multi && (
          <div>
            <label className={label} htmlFor="subject">Konu</label>
            {lockSubject ? (
              <input id="subject" value={form.subject} readOnly className={`${field} cursor-default opacity-80`} />
            ) : (
              <select id="subject" value={form.subject} onChange={(e) => update("subject", e.target.value)} className={field}>
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            )}
          </div>
        )}
      </div>

      {multi && (
        <div>
          <label className={label}>{multiTitle}</label>
          <div className="flex flex-wrap gap-2">
            {multiOptions.map((opt) => {
              const on = selected.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggle(opt)}
                  aria-pressed={on}
                  className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                    on
                      ? "border-navy bg-navy text-white"
                      : "border-[#e6e8ea] text-[#5b6472] hover:border-navy"
                  }`}
                >
                  {on ? "✓ " : ""}{opt}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <label className={label} htmlFor="message">Mesajın *</label>
        <textarea id="message" required rows={5} value={form.message} onChange={(e) => update("message", e.target.value)} className={`${field} resize-none`} placeholder="Bize nasıl yardımcı olabiliriz?" />
      </div>

      {status === "error" && <p className="text-sm text-red-600">{message}</p>}

      <button type="submit" disabled={status === "loading"} className="btn-primary w-full px-6 py-3 text-sm disabled:opacity-60">
        {status === "loading" ? "Gönderiliyor…" : "Mesajı Gönder"}
      </button>
      <p className="text-center text-xs text-gray-400">Genellikle 1-2 iş günü içinde dönüş yapıyoruz.</p>
    </form>
  );
}
