import { ImageResponse } from "next/og";

// 링크 공유 시 노출되는 대표 이미지 (카카오톡/슬랙/트위터 등)
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "CDL — Colorist";

export default function OpengraphImage() {
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
          backgroundColor: "#0a0a0b",
          backgroundImage:
            "radial-gradient(60% 80% at 22% 8%, rgba(111,184,179,0.20), transparent), radial-gradient(60% 80% at 100% 100%, rgba(224,168,106,0.16), transparent)",
          color: "#ededee",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 150, fontWeight: 700, letterSpacing: 28 }}>
          CDL
        </div>
        <div
          style={{
            display: "flex",
            width: 90,
            height: 3,
            marginTop: 16,
            background: "#e0a86a",
          }}
        />
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 28,
            letterSpacing: 10,
            color: "#a1a1aa",
          }}
        >
          REMOTE COLORIST · COLOR GRADING
        </div>
      </div>
    ),
    { ...size }
  );
}
