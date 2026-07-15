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
};

export default nextConfig;
