// Marka renkleri — JS tarafı.
//
// Neden ayrı bir dosya: renklerin asıl yeri app/globals.css `:root`. Ama üç yer
// CSS değişkeni okuyamıyor, statik değer istiyor:
//   1. app/layout.tsx  → viewport.themeColor  (tarayıcı çubuğu rengi)
//   2. app/manifest.ts → theme_color          (PWA)
//   3. app/global-error.tsx → inline style    (kök layout'u değiştirir, globals.css yüklenmez)
//
// ⚠️ Bu dosya ile app/globals.css `:root` bloğu ELLE eşit tutulmalı.
// Marka değiştirirken ikisini birden güncelle.

export const THEME = {
  navy: "#0d204d",       // ANA RENK
  navyHover: "#14295c",
  navySoft: "#1d3670",
  accent: "#22d3ee",
  bg: "#ffffff",
  strip: "#f4f6f9",
  line: "#e6e8ea",
  text: "#0d204d",
  muted: "#5b6472",
} as const;
