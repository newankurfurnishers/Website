import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Brand favicon: a sand "N" monogram on forest. Replace with the exact sprout
// mark when a square/SVG version of the logo is available.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#292d28",
          color: "#d0b495",
          fontSize: 44,
          fontWeight: 700,
          borderRadius: 12,
        }}
      >
        N
      </div>
    ),
    size,
  );
}
