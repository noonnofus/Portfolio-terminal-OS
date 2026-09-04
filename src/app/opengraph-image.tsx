import { ImageResponse } from "next/og";

export const alt = "Hyunho Kim, Frontend Developer Portfolio";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#07090d",
          color: "#f8fafc",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          letterSpacing: "-0.04em",
          padding: "72px",
          width: "100%",
        }}
      >
        <div style={{ color: "#86efac", display: "flex", fontSize: 30 }}>
          HYUNHO KIM
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 82,
            fontWeight: 700,
            marginTop: 22,
          }}
        >
          Frontend Developer
        </div>
        <div
          style={{
            color: "#94a3b8",
            display: "flex",
            fontSize: 32,
            letterSpacing: "-0.02em",
            marginTop: 28,
          }}
        >
          Next.js, TypeScript, and product-focused web applications
        </div>
      </div>
    ),
    size,
  );
}
