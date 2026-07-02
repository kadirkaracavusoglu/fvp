import { ImageResponse } from "next/og";

// nodejs runtime — dev'de edge'e göre daha kararlı; sonuç cache'lenir
export const revalidate = 31536000;

const CAT_LABEL: Record<string, string> = {
  gundem: "📰 Gündem",
  pazarlama: "💰 Pazarlama",
  satis: "🤝 Satış",
  teknoloji: "🤖 Teknoloji",
  icgoruler: "💬 Ekipten İçgörüler",
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") || "Fitness ve Pazarlama").slice(0, 120);
  const cat = searchParams.get("cat") || "";
  const catLabel = CAT_LABEL[cat] || "Fitness ve Pazarlama";

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
          background:
            "radial-gradient(1200px 500px at 100% 0%, #14295c 0%, #071331 60%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", color: "#22d3ee", fontSize: 34, fontWeight: 600 }}>
          {catLabel}
        </div>

        <div style={{ display: "flex", fontSize: title.length > 70 ? 60 : 76, fontWeight: 800, lineHeight: 1.1, letterSpacing: -1 }}>
          {title}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700 }}>
            Fitness<span style={{ color: "#22d3ee" }}>ve</span>Pazarlama
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "#9ba4b0" }}>
            fitnessvepazarlama.com
          </div>
        </div>
      </div>
    ),
      { width: 1200, height: 630 }
    );
  } catch {
    // ImageResponse başarısız olursa (nadir cold-start) statik yedek kapağa yönlendir
    return Response.redirect(new URL("/og-default.png", req.url), 307);
  }
}
