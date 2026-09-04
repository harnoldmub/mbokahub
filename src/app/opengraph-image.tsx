import { ImageResponse } from "next/og";

export const alt = "Nevent — découvre l’événement, organise toute ton expérience";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#090909",
        color: "#ffffff",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          background: "#ff1535",
          borderRadius: 999,
          filter: "blur(120px)",
          height: 330,
          opacity: 0.3,
          position: "absolute",
          right: -90,
          top: -100,
          width: 330,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 28,
          padding: "76px 86px",
          width: "100%",
        }}
      >
        <div style={{ alignItems: "center", display: "flex", gap: 22 }}>
          <div
            style={{
              alignItems: "center",
              background: "#ff1535",
              borderRadius: 22,
              display: "flex",
              fontSize: 64,
              fontWeight: 900,
              height: 92,
              justifyContent: "center",
              lineHeight: 1,
              width: 92,
            }}
          >
            N
          </div>
          <div style={{ fontSize: 66, fontWeight: 800, letterSpacing: -3 }}>
            Nevent
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 68,
            fontWeight: 800,
            letterSpacing: -3,
            lineHeight: 1.02,
            maxWidth: 950,
          }}
        >
          Découvre l’événement. Organise toute ton expérience.
        </div>
        <div style={{ color: "#c9c9c9", display: "flex", fontSize: 29 }}>
          Événements afro · Trajets · Beauté · Photo · Afters
        </div>
      </div>
    </div>,
    size,
  );
}
