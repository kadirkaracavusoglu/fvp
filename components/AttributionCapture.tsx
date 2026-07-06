"use client";

import { useEffect } from "react";
import { captureAttribution, track } from "@/lib/tracking";

// Sayfa açılışında reklam ID'lerini yakalar + dış/CTA tıklamalarını event'e çevirir.
// layout.tsx içine bir kez render edilir (görünmez).
export function AttributionCapture() {
  useEffect(() => {
    captureAttribution();

    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      const a = target?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      if (!href) return;

      if (/spotify\.com|youtube\.com|youtu\.be|apple\.com/.test(href)) {
        track("podcast_click", { link_url: href });
      } else if (href.includes("/danismanlik")) {
        track("consulting_cta_click", { link_url: href });
      } else if (/^https?:\/\/(wa\.me|api\.whatsapp\.com)/.test(href)) {
        track("whatsapp_click", { link_url: href });
      }
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
