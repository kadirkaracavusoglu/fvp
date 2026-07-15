import type { MetadataRoute } from "next";
import { THEME } from "@/lib/theme";
import { SITE } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: "FvP",
    description:
      "Fitness sektörünün gündemini, işini ve geleceğini konuşan bağımsız medya. Koçlar, salonlar ve markalar için.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: THEME.navy,
    lang: "tr",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
