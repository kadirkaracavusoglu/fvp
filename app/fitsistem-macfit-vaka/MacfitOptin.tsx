"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MACFIT, MACFIT_EMAIL_RE, MACFIT_QUESTIONS, normalizeMacfitInstagram, normalizeMacfitPhone, type MacfitAnswers } from "@/lib/macfit-funnel";
import { captureAttribution, getAttribution, track, trackServer } from "@/lib/tracking";

const inputClass = "w-full rounded-lg border border-[#e6e8ea] bg-white px-4 py-3 text-base text-[#0d204d] outline-none focus:border-[#0d204d] focus:ring-1 focus:ring-[#0d204d]";
const emptyAnswers: MacfitAnswers = { activeMembers: "", capacity: "", advertising: "", problem: "", goal: "", problemOther: "", goalOther: "" };

export function MacfitOptin() {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const [step, setStep] = useState(1);
  const [contact, setContact] = useState({ firstName: "", lastName: "", email: "", phone: "", instagram: "" });
  const [answers, setAnswers] = useState(emptyAnswers);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [website, setWebsite] = useState("");
  const [open, setOpen] = useState(false);
  useEffect(() => {
    captureAttribution();
    track("vsl_optin_view", { location: "fitsistem-macfit-vaka" });
    trackServer("vsl_optin_view");
  }, []);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);
  function showForm() {
    setError(""); setOpen(true); dialog.current?.showModal();
    track("vsl_optin_cta_click", { location: "fitsistem-macfit-vaka" });
    trackServer("vsl_optin_cta_click");
  }
  function closeForm() { if (!sending) { dialog.current?.close(); setOpen(false); } }
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError("");
    // SIRA (14 Eyl): önce 5 salon sorusu, EN SONDA iletişim bilgileri.
    // Eski sırada (iletişim önce) formu açan 37 kişiden yalnız 3'ü 2. adıma geçti ama
    // 2. adıma geçenlerin hepsi gönderdi → kayıp iletişim ekranındaydı.
    if (step === 1) {
      // Seçimler tarayıcıda "required" ile zorunlu; "Başka" metin kutuları da öyle.
      for (const q of MACFIT_QUESTIONS) {
        if (!answers[q.key]) { setError(`Lütfen yanıtla: ${q.label}`); return; }
      }
      setStep(2); dialog.current?.scrollTo(0, 0);
      // Yeni ad: eski "form_macfit_step2" (= salon sorularına geçti) ile anlamı karışmasın.
      // /api/track yalnız vsl_|cta_|form_|quiz_|page_ öneklerini kabul eder.
      trackServer("form_macfit_contact");
      return;
    }
    if (!contact.firstName.trim() || !contact.lastName.trim()) { setError("Adını ve soyadını gir."); return; }
    if (!MACFIT_EMAIL_RE.test(contact.email.trim())) { setError("Geçerli bir e-posta adresi gir."); return; }
    if (!normalizeMacfitPhone(contact.phone)) { setError("Telefonunu 05XX XXX XX XX biçiminde gir."); return; }
    if (!normalizeMacfitInstagram(contact.instagram)) { setError("Salonunun Instagram kullanıcı adını gir (ör. @salonadi)."); return; }
    setSending(true);
    try {
      captureAttribution();
      const res = await fetch("/api/macfit/optin", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...contact, answers, website, attribution: getAttribution() }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) { setError(data.error || "Bir sorun oluştu. Tekrar dene."); setSending(false); return; }
      track("vsl_optin_submit", { location: "fitsistem-macfit-vaka" });
      trackServer("vsl_optin_submit");
      dialog.current?.close(); setOpen(false);
      router.push(`${MACFIT.path}/izle`);
      router.refresh();
    } catch { setError("Bağlantı sorunu oluştu. Tekrar dene."); setSending(false); }
  }
  return <>
    <section className="glow-bg">
      <div className="mx-auto max-w-4xl px-5 pb-8 pt-16 text-center sm:pt-20">
        <span className="chip inline-block px-4 py-1 text-xs" data-active="true">SPOR SALONUNU BÜYÜTMEK İSTEYEN SALON SAHİPLERİ İÇİN</span>
        <h1 className="mx-auto mt-6 max-w-3xl text-balance text-3xl font-bold leading-tight tracking-tight sm:text-5xl">MACFit neden başarılı? Arkasındaki sistemi ve kendi spor salonun için çıkarabileceğin dersleri anlatıyorum.</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-400">Bu videoda MACFit’in büyüme sistemini inceleyeceğiz. Ardından bu yaklaşımdan kendi salonun için neler öğrenebileceğini konuşacağız.</p>
      </div>
    </section>
    <section className="mx-auto max-w-4xl px-5 pb-16">
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-[#0d204d] shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,#334e7e,transparent_65%)]" />
        <div className="absolute inset-x-0 top-5 text-center text-[10px] tracking-[0.22em] text-white/70 sm:top-9 sm:text-xs">FİTSİSTEM · VAKA ANALİZİ</div>
        <div className="absolute inset-x-0 bottom-5 text-center sm:bottom-10"><p className="text-2xl font-bold tracking-tight text-white sm:text-5xl">MACFit</p><p className="mt-1 text-xs text-white/70 sm:mt-2 sm:text-base">Büyümenin arkasındaki sistem</p></div>
        <button type="button" onClick={showForm} className="absolute inset-0 flex items-center justify-center" aria-label="Videoyu aç">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-xl transition hover:scale-105 sm:h-20 sm:w-20"><svg viewBox="0 0 24 24" className="h-7 w-7 fill-none stroke-[#0d204d]" strokeWidth="1.8" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V6a4 4 0 018 0v4M12 14v3"/></svg></span>
        </button>
      </div>
      <div className="mt-5 text-center"><button type="button" onClick={showForm} className="btn-primary w-full px-8 py-4 text-base sm:w-auto">MACFit’in Büyüme Sistemini Keşfet →</button><p className="mx-auto mt-3 max-w-lg text-sm text-gray-400">Kısa formu doldur, video sayfasına eriş.</p></div>
    </section>
    <dialog ref={dialog} onClose={() => setOpen(false)} onCancel={e => { if (sending) e.preventDefault(); }} className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-2xl border-0 bg-white p-6 text-[#0d204d] shadow-2xl backdrop:bg-[#071331]/75 backdrop:backdrop-blur-sm sm:p-8" aria-labelledby="macfit-form-title">
      <button type="button" onClick={closeForm} disabled={sending} className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-[#e6e8ea] text-2xl disabled:opacity-50" aria-label="Formu kapat">×</button>
      <div className="pr-7"><p className="text-xs font-medium text-gray-400">ADIM {step} / 2 · {step === 1 ? "Salonun hakkında" : "İletişim bilgilerin"}</p><h2 id="macfit-form-title" className="mt-2 text-xl font-bold sm:text-2xl">MACFit’in büyüme sistemini keşfet</h2><p className="mt-2 text-sm text-gray-400">{step === 1 ? "Salonunla ilgili 5 kısa soruyu yanıtla." : "Son adım: bilgilerini gir, videoya ücretsiz eriş."}</p></div>
      <div className="mb-5 mt-4 flex gap-2" aria-hidden="true"><span className="h-1 flex-1 rounded-full bg-[#0d204d]"/><span className={`h-1 flex-1 rounded-full ${step === 2 ? "bg-[#0d204d]" : "bg-[#e6e8ea]"}`}/></div>
      <form onSubmit={submit} className="space-y-4">
        <input name="website" value={website} onChange={e => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-px w-px" />
        {step === 1 ? <>
          {MACFIT_QUESTIONS.map(q => <div key={q.key}><label className="block text-sm font-medium" htmlFor={q.key}>{q.label}</label><select id={q.key} name={q.key} value={answers[q.key]} required onChange={e => setAnswers({ ...answers, [q.key]: e.target.value })} className={`${inputClass} mt-1.5`}><option value="" disabled>Seçimini yap</option>{q.options.map(option => <option key={option} value={option}>{option}</option>)}</select>
            {q.key === "problem" && answers.problem === "Başka bir sorun yaşıyorum." && <label className="mt-3 block text-sm">Sorununu kısaca anlat<textarea value={answers.problemOther} onChange={e => setAnswers({ ...answers, problemOther: e.target.value })} required maxLength={500} rows={2} className={`${inputClass} mt-1.5`} /></label>}
            {q.key === "goal" && answers.goal === "Başka bir hedefim var." && <label className="mt-3 block text-sm">Hedefini kısaca anlat<textarea value={answers.goalOther} onChange={e => setAnswers({ ...answers, goalOther: e.target.value })} required maxLength={500} rows={2} className={`${inputClass} mt-1.5`} /></label>}
          </div>)}
        </> : <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{([['firstName','Adın','given-name'],['lastName','Soyadın','family-name']] as const).map(([key,label,auto]) => <label key={key} className="block text-sm font-medium">{label}<input name={key} autoComplete={auto} value={contact[key]} onChange={e => setContact({ ...contact, [key]: e.target.value })} required maxLength={80} className={`${inputClass} mt-1.5`} /></label>)}</div>
          <label className="block text-sm font-medium">E-posta adresin<input name="email" type="email" autoComplete="email" value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })} required maxLength={254} className={`${inputClass} mt-1.5`} /></label>
          <label className="block text-sm font-medium">Telefon numaran<input name="phone" type="tel" autoComplete="tel" placeholder="05XX XXX XX XX" value={contact.phone} onChange={e => setContact({ ...contact, phone: e.target.value })} required maxLength={40} className={`${inputClass} mt-1.5`} /></label>
          <label className="block text-sm font-medium">Salonunun Instagram hesabı<input name="instagram" placeholder="@salonadi" value={contact.instagram} onChange={e => setContact({ ...contact, instagram: e.target.value })} required maxLength={150} autoCapitalize="none" className={`${inputClass} mt-1.5`} /></label>
        </>}
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-3">{step === 2 && <button type="button" onClick={() => { setStep(1); setError(""); }} disabled={sending} className="rounded-lg border border-[#e6e8ea] px-4 py-3 text-sm">Geri</button>}<button type="submit" disabled={sending} className="btn-primary flex-1 px-6 py-3 text-sm disabled:opacity-60">{sending ? "Kaydediliyor..." : step === 1 ? "Devam Et →" : "Videoya Eriş →"}</button></div>
      </form>
      <p className="mt-4 text-xs leading-relaxed text-gray-400">Bilgilerini gönderdiğinde video sayfasına yönlendirileceksin. Ekibimiz salonunun ihtiyaçlarını konuşmak ve uygun bir görüşme planlamak için seni arayabilir. <a href="/kvkk" target="_blank" rel="noopener noreferrer" className="underline">Aydınlatma metni</a></p>
    </dialog>
  </>;
}
