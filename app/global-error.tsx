"use client";

import { useEffect } from "react";

// Kök layout'ta oluşan hataları yakalar; kendi <html>/<body>'sini içermek zorundadır.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Kritik hata:", error);
  }, [error]);

  return (
    <html lang="tr">
      <body
        style={{
          fontFamily: "system-ui, -apple-system, sans-serif",
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          margin: 0,
          background: "#f4f6f9",
          color: "#0d204d",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, margin: 0 }}>Beklenmeyen bir hata oluştu</h1>
          <p style={{ color: "#5b6472", marginTop: "12px" }}>
            Sayfayı yenilemeyi deneyin.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: "20px",
              background: "#0d204d",
              color: "#fff",
              border: "none",
              borderRadius: "999px",
              padding: "12px 26px",
              fontSize: "15px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Tekrar dene
          </button>
        </div>
      </body>
    </html>
  );
}
