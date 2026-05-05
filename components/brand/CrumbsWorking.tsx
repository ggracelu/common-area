"use client";

import { useEffect, useState, type ReactNode } from "react";

/** Extra colors for desk + laptop + glasses (solid fills, crisp grid). */
const WORK_PALETTE: Record<string, string> = {
  ".": "transparent",
  G: "#121212",
  K: "#c8c8c8",
  L: "#adadad",
  W: "#f3ece4",
  P: "#5a5a5a",
  R: "#3a3a3a",
  E: "#e8b9be",
  N: "#d9959c",
  F: "#1f1f1f", // glasses rim
  C: "#8ec0ff", // lens
  T: "#6a4c2a", // desk
  D: "#4a351c", // desk edge
  H: "#252525", // laptop shell
  S: "#1a5cff", // screen glow
  Y: "#e9ff6b", // key / paw highlight
  U: "#3d3d3d", // keyboard deck
  V: "#5a5a5a", // key cap
  X: "#7a7a7a", // key cap lit (typing frame)
};

function rectsFromRows(rows: string[], pixel: number, palette: Record<string, string>) {
  const out: ReactNode[] = [];
  for (let y = 0; y < rows.length; y++) {
    const row = rows[y] ?? "";
    for (let x = 0; x < row.length; x++) {
      const ch = row[x] ?? ".";
      const fill = palette[ch] ?? "transparent";
      if (fill === "transparent") continue;
      out.push(
        <rect key={`${x}-${y}`} x={x * pixel} y={y * pixel} width={pixel} height={pixel} fill={fill} />,
      );
    }
  }
  return out;
}

/** 36×26: full cat + round glasses + paws on keyboard + open laptop. */
const WORK_A = [
  "....................................",
  "..........GGG............GGG........",
  ".........GEEKG..........GEEKG.......",
  ".........GKPPKGGGGGGGGGKPPKG........",
  "........GGKKPPKKKKKKKKPPKKGG........",
  "........GKWWWWPPPPPPPPWWWWKG........",
  ".......GKWFFCFFCCFFCCFFWWKG.........",
  ".......GKKWWCNNCWWWWWWWKKKG.........",
  ".......GKKKKKNPPNWWKKKKKKG..........",
  ".......GKKKKKKPPPPKKKKKKG...........",
  ".......GKKKKKKKKKKKKKKKKG...........",
  ".......GKKKKKWWWWWWKKKKG............",
  ".......GKKKKKKKKKKKKKKKG............",
  ".......GKPKKKKKKKKKKKPKG............",
  ".......GKPKKKWWWWKKKKPKG............",
  "........GKKKKKKKKKKKKG..............",
  ".........GGKKKKKKKKGG...............",
  "..........GGGGGGGGGG................",
  "........WWWWWWWWWWWWWW..............",
  ".......WSSSSSSSSSSSSWW..............",
  ".......WSSSSSSSSSSSSWW..............",
  ".......WWWWWWWWWWWWWW...............",
  ".......UUUUUUUUUUUUUUU..............",
  ".......UWVVVVVYVVVVWU...............",
  "......TTTTTTTTTTTTTTTT..............",
  "......TDDDDDDDDDDDDDDDT.............",
];

const WORK_B = [
  "....................................",
  "..........GGG............GGG........",
  ".........GEEKG..........GEEKG.......",
  ".........GKPPKGGGGGGGGGKPPKG........",
  "........GGKKPPKKKKKKKKPPKKGG........",
  "........GKWWWWPPPPPPPPWWWWKG........",
  ".......GKWFFCFFCCFFCCFFWWKG.........",
  ".......GKKWWCNNCWWWWWWWKKKG.........",
  ".......GKKKKKNPPNWWKKKKKKG..........",
  ".......GKKKKKKPPPPKKKKKKG...........",
  ".......GKKKKKKKKKKKKKKKKG...........",
  ".......GKKKKKWWWWWWKKKKG............",
  ".......GKKKKKKKKKKKKKKKG............",
  ".......GKPKKKKKKKKKKKPKG............",
  ".......GKPKKKWWWWKKKKPKG............",
  "........GKKKKKKKKKKKKG..............",
  ".........GGKKKKKKKKGG...............",
  "..........GGGGGGGGGG................",
  "........WWWWWWWWWWWWWW..............",
  ".......WSSSSSSSSSSSSWW..............",
  ".......WSSSSSSSSSSSSWW..............",
  ".......WWWWWWWWWWWWWW...............",
  ".......UUUUUUUUUUUUUUU..............",
  ".......UWVVVXVYVVXVU................",
  "......TTTTTTTTTTTTTTTT..............",
  "......TDDDDDDDDDDDDDDDT.............",
];

export function CrumbsWorking({
  size = 200,
  reducedMotion: propReducedMotion,
}: {
  size?: number;
  reducedMotion?: boolean;
}) {
  const [reduced, setReduced] = useState(false);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const motionReduced = propReducedMotion ?? reduced;

  useEffect(() => {
    if (motionReduced) return;
    const id = window.setInterval(() => setFrame((n) => (n + 1) % 2), 480);
    return () => window.clearInterval(id);
  }, [motionReduced]);

  const rows = frame === 0 ? WORK_A : WORK_B;
  const pixel = 4;
  const viewW = 36 * pixel;
  const viewH = rows.length * pixel;

  return (
    <svg
      viewBox={`0 0 ${viewW} ${viewH}`}
      width={size}
      height={(size * viewH) / viewW}
      style={{ imageRendering: "pixelated" }}
      shapeRendering="crispEdges"
      aria-label="Crumbs typing on a laptop"
      role="img"
    >
      {rectsFromRows(rows, pixel, WORK_PALETTE)}
    </svg>
  );
}
