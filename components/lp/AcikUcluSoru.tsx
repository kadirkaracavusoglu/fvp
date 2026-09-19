"use client";

// Başvuru formunda açık uçlu (serbest metin) soru ekranı.
// - Örnekler placeholder'da kaybolmak yerine dokunulabilir öneri olarak durur;
//   dokununca metin kutuya eklenir, kişi kendi cümlesiyle devam eder.
// - Kutu açılışta seçili gelir, yazdıkça büyür.
// - Ne kadar yazılacağı baştan görünür; hata ancak gerekirse, sen diliyle.
// - Masaüstünde Ctrl/⌘ + Enter ile devam.

import { useEffect, useRef } from "react";

export function AcikUcluSoru({
  name,
  label,
  value,
  onChange,
  onNext,
  ornekler = [],
  minLength = 1,
  error,
  fieldClass,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
  ornekler?: string[];
  minLength?: number;
  error?: string;
  fieldClass: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const valid = value.trim().length >= minLength;

  // Açılışta odak + yazdıkça yükseklik.
  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
  }, [name]);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(el.scrollHeight, 132)}px`;
  }, [value]);

  function ekle(metin: string) {
    const bas = value.trim();
    onChange(bas ? `${bas} ${metin}` : metin);
    ref.current?.focus();
  }

  return (
    <div className="mt-6">
      <textarea
        ref={ref}
        name={name}
        aria-label={label}
        placeholder="Kendi cümlelerinle yaz…"
        value={value}
        rows={4}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            onNext();
          }
        }}
        className={`${fieldClass} min-h-[132px] resize-none text-base leading-relaxed`}
      />

      {ornekler.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Aklına gelmiyorsa bunlardan biriyle başla
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {ornekler.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => ekle(o)}
                className="rounded-full border border-[#e6e8ea] bg-white px-3 py-1.5 text-left text-sm text-[#0d204d] transition hover:border-[#0d204d] focus-visible:border-[#0d204d] focus-visible:outline-none"
              >
                + {o}
              </button>
            ))}
          </div>
        </div>
      )}

      <p
        className={`mt-4 text-sm ${error ? "text-red-600" : valid ? "text-emerald-700" : "text-gray-400"}`}
        aria-live="polite"
      >
        {error
          ? error
          : valid
            ? "✓ Teşekkürler, devam edebilirsin."
            : "Birkaç cümle yeterli; görüşmede bunun üzerinden konuşacağız."}
      </p>

      <div className="mt-4 flex items-center gap-4">
        <button
          type="button"
          onClick={onNext}
          aria-disabled={!valid}
          className={`btn-primary w-full px-6 py-4 text-base sm:w-auto ${valid ? "" : "opacity-60"}`}
        >
          Devam et →
        </button>
        <span className="hidden text-xs text-gray-400 sm:inline">
          veya Ctrl / ⌘ + Enter
        </span>
      </div>
    </div>
  );
}
