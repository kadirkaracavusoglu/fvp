import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fitness ve Pazarlama",
    short_name: "FvP",
    description:
      "Fitness sektörünü pazarlama merceğinden okuyan bağımsız medya. Koçlar ve salon sahipleri için.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0d204d",
    lang: "tr",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
