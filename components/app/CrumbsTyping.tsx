"use client";

import { useEffect, useState } from "react";

function pixelRects(rows: string[], pixel: number, palette: Record<string, string>) {
  const rects: React.ReactNode[] = [];
  for (let y = 0; y < rows.length; y++) {
    const row = rows[y] ?? "";
    for (let x = 0; x < row.length; x++) {
      const ch = row[x] ?? ".";
      const fill = palette[ch] ?? "transparent";
      if (fill === "transparent") continue;
      rects.push(<rect key={`${x}-${y}`} x={x * pixel} y={y * pixel} width={pixel} height={pixel} fill={fill} />);
    }
  }
  return rects;
}

const palette = {
  ".": "transparent",
  G: "#0a0a0a",
  K: "#c7c7c7",
  W: "#f5f1ea",
  P: "#8d8d8d",
  B: "#1A5CFF", // screen glow
  Y: "#E9FF6B", // highlight
} satisfies Record<string, string>;

// 20x14 frames. Glasses + laptop, subtle paw movement.
const frameA = [
  "....................",
  ".....GGGGGGGG.......",
  "....GKKKKKKKKG......",
  "...GKKPPKKPPKKG.....",
  "...GKKGGGGGGKKG.....",
  "...GKKGWWWWGKKG.....",
  "....GKKGGGGKKG......",
  ".....GGKKKKGG.......",
  "........GG..........",
  "...GGGGGGGGGGGG.....",
  "..GWWWWWWWWWWWWG....",
  "..GWWBBBBBBBBWWG....",
  "...GGGGGGGGGGGG.....",
  "....................",
];

const frameB = [
  "....................",
  ".....GGGGGGGG.......",
  "....GKKKKKKKKG......",
  "...GKKPPKKPPKKG.....",
  "...GKKGGGGGGKKG.....",
  "...GKKGWWWWGKKG.....",
  "....GKKGGGGKKG......",
  ".....GGKKKKGG.......",
  "........GG..........",
  "...GGGGGGGGGGGG.....",
  "..GWWWWWWWWWWWWG....",
  "..GWWBBBBBBBBWWG....",
  "...GGGGGGGGGGGG.....",
  "........Y...........",
];

export function CrumbsTyping({ size = 80 }: { size?: number }) {
  const [t, setT] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setT((n) => n + 1), 500);
    return () => window.clearInterval(id);
  }, []);

  const pixel = 3;
  const rows = t % 2 === 0 ? frameA : frameB;
  const viewW = rows[0]!.length * pixel;
  const viewH = rows.length * pixel;

  return (
    <svg
      viewBox={`0 0 ${viewW} ${viewH}`}
      width={size}
      height={size}
      style={{ imageRendering: "pixelated" }}
      shapeRendering="crispEdges"
      aria-label="Crumbs typing"
      role="img"
    >
      {pixelRects(rows, pixel, palette)}
    </svg>
  );
}

