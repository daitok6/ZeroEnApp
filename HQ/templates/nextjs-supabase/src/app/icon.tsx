import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// TODO per-client: replace with the client's real favicon. If they have a
// brand mark, drop it in /public/favicon.ico and delete this file.
export default function Icon() {
  const initial = (process.env.NEXT_PUBLIC_APP_NAME ?? "A")
    .trim()
    .charAt(0)
    .toUpperCase();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0D0D0D",
          color: "#00E87A",
          fontSize: 22,
          fontWeight: 700,
          fontFamily: "sans-serif",
          borderRadius: 6,
        }}
      >
        {initial}
      </div>
    ),
    size
  );
}
