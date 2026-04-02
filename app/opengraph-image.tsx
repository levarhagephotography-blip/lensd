import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "LENSD — Your AI Creative Shoot Companion";
export const size = {
  width: 1200,
  height: 630
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          position: "relative",
          background:
            "radial-gradient(circle at top left, rgba(255, 179, 71, 0.22), transparent 28%), radial-gradient(circle at bottom right, rgba(255, 179, 71, 0.14), transparent 24%), linear-gradient(180deg, #050505 0%, #0d0d0d 100%)",
          color: "#ffffff",
          fontFamily: "Arial, sans-serif",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 36,
            borderRadius: 32,
            border: "1px solid rgba(255, 179, 71, 0.28)",
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.015))",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "54px 56px",
            boxShadow: "0 24px 72px rgba(0, 0, 0, 0.45)"
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                color: "#ffb347",
                fontSize: 24,
                letterSpacing: "0.22em",
                textTransform: "uppercase"
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 2,
                  background: "#ffb347"
                }}
              />
              Creative Shoot Planner
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 170,
                lineHeight: 0.85,
                fontWeight: 900,
                letterSpacing: "0.05em",
                textTransform: "uppercase"
              }}
            >
              LENSD
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18
            }}
          >
            <div
              style={{
                display: "flex",
                maxWidth: 860,
                fontSize: 44,
                lineHeight: 1.15,
                color: "#f3f3f3"
              }}
            >
              Your AI Creative Shoot Companion
            </div>

            <div
              style={{
                display: "flex",
                maxWidth: 880,
                fontSize: 28,
                lineHeight: 1.35,
                color: "rgba(255, 255, 255, 0.72)"
              }}
            >
              Stop showing up with no plan. AI-powered shoot planner for photographers and content
              creators.
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
