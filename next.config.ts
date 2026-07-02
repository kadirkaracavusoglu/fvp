import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
  async rewrites() {
    return [
      { source: "/analiz", destination: "/analiz.html" },
    ];
  },
};

export default nextConfig;
