import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

/** Imagen Open Graph propia de NEXO (1200×630) con el título de cada página. */
export function renderOg({ eyebrow, title, footer = "nexo · Agencia de marketing digital · Medellín" }: { eyebrow: string; title: string; footer?: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #03201a 0%, #085042 60%, #1f3a52 100%)",
          color: "#e6f2ed",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="72" height="72" viewBox="0 0 124 124">
            <g stroke="#e6f2ed" strokeWidth="7">
              <line x1="26" y1="26" x2="98" y2="26" />
              <line x1="26" y1="26" x2="62" y2="98" />
              <line x1="98" y1="26" x2="62" y2="98" />
            </g>
            <circle cx="26" cy="26" r="24" fill="#e6f2ed" />
            <circle cx="98" cy="26" r="24" fill="#1f9e75" />
            <circle cx="62" cy="98" r="24" fill="#7f77dc" />
          </svg>
          <div style={{ fontSize: 30, letterSpacing: 6, textTransform: "uppercase", color: "#3dd9a4" }}>{eyebrow}</div>
        </div>
        <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, maxWidth: 1000 }}>{title}</div>
        <div style={{ fontSize: 26, color: "#a3bfb4" }}>{footer}</div>
      </div>
    ),
    ogSize,
  );
}
