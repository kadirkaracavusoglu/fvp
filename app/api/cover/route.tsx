import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

// nodejs runtime — dev'de edge'e göre daha kararlı; sonuç cache'lenir
export const revalidate = 31536000;

// Kategoriye göre kimlik: emoji + etiket + accent + derin arka plan tonu
const CAT: Record<string, { label: string; emoji: string; accent: string; glow: string }> = {
  gundem: { label: "Gündem", emoji: "📰", accent: "#22d3ee", glow: "#0b4a5c" },
  pazarlama: { label: "Pazarlama", emoji: "💰", accent: "#fbbf24", glow: "#5c4410" },
  satis: { label: "Satış", emoji: "🤝", accent: "#34d399", glow: "#0b4a37" },
  teknoloji: { label: "Teknoloji", emoji: "🤖", accent: "#818cf8", glow: "#2a2f6b" },
  icgoruler: { label: "Ekipten İçgörüler", emoji: "💬", accent: "#fb7185", glow: "#5c1f33" },
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cat = searchParams.get("cat") || "";
  const c = CAT[cat] || { label: SITE.name, emoji: "⚡", accent: "#22d3ee", glow: "#14295c" };

  try {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "70px",
            background: `radial-gradient(1100px 560px at 82% 14%, ${c.glow} 0%, #061024 62%)`,
            color: "white",
            fontFamily: "sans-serif",
          }}
        >
          {/* Dev watermark emoji */}
          <div
            style={{
              position: "absolute",
              right: "-40px",
              bottom: "-90px",
              fontSize: 460,
              opacity: 0.1,
              display: "flex",
            }}
          >
            {c.emoji}
          </div>

          {/* Üst: kategori etiketi */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", fontSize: 56 }}>{c.emoji}</div>
            <div style={{ display: "flex", color: c.accent, fontSize: 40, fontWeight: 700, letterSpacing: -0.5 }}>
              {c.label}
            </div>
          </div>

          {/* Orta: marka duruşu */}
          <div style={{ display: "flex", fontSize: 68, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, maxWidth: "80%" }}>
            Fitness işi şansa değil, sisteme dayanır.
          </div>

          {/* Alt: marka + url */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", fontSize: 32, fontWeight: 700 }}>
              Fitness<span style={{ color: c.accent }}>ve</span>Pazarlama
            </div>
            <div style={{ display: "flex", fontSize: 24, color: "#9ba4b0" }}>{SITE.domain}</div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch {
    return Response.redirect(new URL("/og-default.png", req.url), 307);
  }
}
