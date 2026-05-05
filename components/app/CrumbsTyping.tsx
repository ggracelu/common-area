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

// Same limited palette + grid as `Crumbs` (hard edges, readable tabby read).
const palette = {
  ".": "transparent",
  G: "#121212",
  K: "#c8c8c8",
  L: "#adadad",
  W: "#f3ece4",
  P: "#5a5a5a",
  R: "#3a3a3a",
  E: "#e8b9be",
  N: "#d9959c",
  B: "#1A5CFF",
  Y: "#E9FF6B",
} satisfies Record<string, string>;

// 22×15 frames: tabby M + cheek stripes, blackout shades, laptop; B-frame adds key highlight.
const frameA = [
  "......................",
  "......GGG......GGG....",
  ".....GEEKG....GEEKG...",
  ".....GKPPKGGGGKPPKG...",
  "....GGKKPPKKKKPPKKGG..",
  "....GGGGGGGGGGGGGG....",
  "...GKKKKWNWWNWKKKKKG..",
  "...GKKKKKNPPNKKKKKKG..",
  "....GKKKKKKLLKKKKG....",
  ".....GGKKKKKKKKGG.....",
  ".........GG...........",
  "..GGGGGGGGGGGG........",
  ".GWWWWWWWWWWWWG.......",
  ".GWWBBBBBBBBWWG.......",
  "..GGGGGGGGGGGG........",
];

const frameB = [
  "......................",
  "......GGG......GGG....",
  ".....GEEKG....GEEKG...",
  ".....GKPPKGGGGKPPKG...",
  "....GGKKPPKKKKPPKKGG..",
  "....GGGGGGGGGGGGGG....",
  "...GKKKKWNWWNWKKKKKG..",
  "...GKKKKKNPPNKKKKKKG..",
  "....GKKKKKKLLKKKKG....",
  ".....GGKKKKKKKKGG.....",
  ".........GG...........",
  "..GGGGGGGGGGGG........",
  ".GWWWWWWWWWWWWG.......",
  ".GWWBBBBBBBBWWG.......",
  "..GGGGGGYGGGGG........",
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

