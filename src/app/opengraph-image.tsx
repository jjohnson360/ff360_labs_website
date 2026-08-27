import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brand social-share card. Every element carries an explicit `display` value
// and single-child text nodes — the CSS subset `satori` (next/og) supports.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(ellipse 80% 60% at 50% 35%, #17140d 0%, #0a0a0b 70%)",
          padding: "80px",
          color: "#f2efe9",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 24,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#c9a15a",
          }}
        >
          {SITE_TAGLINE}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 120,
            fontWeight: 700,
            lineHeight: 1.05,
          }}
        >
          <div style={{ display: "flex" }}>Always building</div>
          <div style={{ display: "flex", color: "#c9a15a" }}>something new.</div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 28,
            color: "#a7a49c",
          }}
        >
          <span style={{ color: "#f2efe9", fontWeight: 600 }}>{SITE_NAME}</span>
          <span>Conway, Arkansas · working globally</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
