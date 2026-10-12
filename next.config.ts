import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // Tarayıcı bu siteye 2 yıl boyunca yalnız https ile bağlansın (http'ye düşme yok).
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Clickjacking: X-Frame-Options'ın modern karşılığı. Yalnız frame-ancestors kullanıyoruz —
  // tam CSP, GTM/GA/Pixel/Clarity inline script enjekte ettiği için 'unsafe-inline' gerektirir;
  // o da CSP'nin asıl faydasını götürür. Değeri düşük, kırılma riski yüksek.
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
  // Diğer siteler bu sayfayı kendi tarayıcı bağlamına açamasın
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Statik görsel/font varlıkları → 1 yıl immutable cache (CWV: verimli önbellek)
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|ico|woff|woff2)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
  // VSL funnel /vsl → /fitsistem'e taşındı; eski linkler (reklam/paylaşım) kırılmasın.
  async redirects() {
    return [
      // Alan adı taşındı (12 Eki 2026): eski adres ve www → kadirkaracavusoglu.com.
      // Eski adresin DNS'i Vercel'e çevrilince devreye girer; o zamana kadar zararsız.
      {
        source: "/:path*",
        has: [{ type: "host", value: "fitnessvepazarlama.com" }],
        destination: "https://kadirkaracavusoglu.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.fitnessvepazarlama.com" }],
        destination: "https://kadirkaracavusoglu.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.kadirkaracavusoglu.com" }],
        destination: "https://kadirkaracavusoglu.com/:path*",
        permanent: true,
      },
      { source: "/vsl/optin", destination: "/fitsistem", permanent: false },
      { source: "/vsl/basvuru", destination: "/fitsistem/basvuru", permanent: false },
      { source: "/vsl/randevu", destination: "/fitsistem/randevu", permanent: false },
      { source: "/vsl/tesekkurler", destination: "/fitsistem/tesekkurler", permanent: false },
      { source: "/vsl/panel", destination: "/fitsistem/panel", permanent: false },
      { source: "/vsl", destination: "/fitsistem/izle", permanent: false },
      // Vaka-Hande (A) kaldırıldı; GHL e-postalarındaki eski bağlantılar B varyantına düşer.
      { source: "/vaka-hande", destination: "/vaka-analizi", permanent: false },
      { source: "/vaka-hande/:path*", destination: "/vaka-analizi/:path*", permanent: false },
    ];
  },
};

export default nextConfig;
