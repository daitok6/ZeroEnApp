import { ImageResponse } from "next/og";

export const alt = "OpenGraph image";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// TODO per-client: replace with branded artwork. Use the client's colors,
// logo, and hero copy. Consider fetching a logo from /public or embedding
// SVG inline. See https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image
export default function OpenGraphImage() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "App";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0D0D0D 0%, #1a1a1a 100%)",
          color: "#F4F4F2",
          fontFamily: "sans-serif",
          padding: "80px",
        }}
      >
        <div
          style={{
            fontSize: 84,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            textAlign: "center",
          }}
        >
          {appName}
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#9CA3AF",
            marginTop: 24,
            fontFamily: "monospace",
          }}
        >
          Built by ZeroEn
        </div>
      </div>
    ),
    size
  );
}
