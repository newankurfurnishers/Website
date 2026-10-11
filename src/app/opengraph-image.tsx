import { ImageResponse } from "next/og";
import { getSettings } from "@/lib/content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "New Ankur Furnishers — home furnishings in Patna since 1984";

export default async function OpengraphImage() {
  const s = await getSettings();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "90px",
          background: "#292d28",
          color: "#d0b495",
        }}
      >
        <div style={{ fontSize: 34, color: "#90894b", letterSpacing: 2 }}>
          {`Patna · Since ${s.established_year}`}
        </div>
        <div style={{ fontSize: 92, lineHeight: 1.05, marginTop: 24, color: "#e6d9c6" }}>
          {s.business_name}
        </div>
        <div style={{ fontSize: 40, marginTop: 28, color: "#d0b495" }}>{s.tagline}</div>
      </div>
    ),
    size,
  );
}
