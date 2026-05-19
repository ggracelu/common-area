"use client";

import { useEffect, useState, type ReactNode } from "react";

/** Cat + desk (M = desk edge). */
const WORK_PALETTE: Record<string, string> = {
  ".": "transparent",
  K: "#000000",
  W: "#FFFFFF",
  L: "#BDBDBD",
  D: "#757575",
  T: "#6a4c2a",
  M: "#4a351c",
  H: "#252525",
  S: "#1a5cff",
  Y: "#e9ff6b",
  U: "#3d3d3d",
  V: "#5a5a5a",
  I: "#7a7a7a",
};

const PAD = 10;
const CAT_H = 16;
const COL_L = new Set([1, 2, 3, 4]);
const COL_R = new Set([6, 7, 8, 9]);

const REFERENCE_CAT_ROWS = [
  "..K.......K.....",
  ".KLK.....KLK....",
  ".LLLKKKKKLLL....",
  "KLLLLDDLLLLLK...",
  "KLLLLDDLLLLLK...",
  "KLDKKLLKKLLDLK..",
  "KLKKLKLKLKLKKK..",
  "KLDLLWWWLLDLK...",
  "KLLLWWWWWLLLK...",
  "KKKKKKKKKKKKK.K.",
  ".KLLLWLLLK...KDK",
  ".KLLLWLLLK..KDDK",
  ".KLLLWLLLK.KDDK.",
  ".KKKKDKKKKKDK...",
  ".KKKKDKKKK......",
  "................",
] as const;

const LAPTOP_ROWS = [
  "........WWWWWWWWWWWWWW..............",
  ".......WSSSSSSSSSSSSWW..............",
  ".......WSSSSSSSSSSSSWW..............",
  ".......WWWWWWWWWWWWWW...............",
  ".......UUUUUUUUUUUUUUU..............",
  ".......UWVVVVVYVVVVVU...............",
  "......TTTTTTTTTTTTTTTT..............",
  `......T${"M".repeat(16)}T.............`,
] as const;

const LAPTOP_B_KEYS = [
  ".......UWVVIVYVVIVVU................",
] as const;

function padRow(r: string) {
  return `${".".repeat(PAD)}${r}${".".repeat(PAD)}`;
}

function renderCatWithTypingLegs(catRows: readonly string[], frame: 0 | 1, pixel: number): ReactNode[] {
  const out: ReactNode[] = [];
  const left: ReactNode[] = [];
  const right: ReactNode[] = [];
  const footY0 = CAT_H - 2;

  for (let y = 0; y < catRows.length; y++) {
    const padded = padRow(catRows[y] ?? "");
    for (let x = 0; x < padded.length; x++) {
      const ch = padded[x] ?? ".";
      const fill = WORK_PALETTE[ch] ?? "transparent";
      if (fill === "transparent") continue;

      const catX = x - PAD;
      const isFootPlane = y >= footY0;
      const isLeftFoot = isFootPlane && ch === "K" && COL_L.has(catX);
      const isRightFoot = isFootPlane && ch === "K" && COL_R.has(catX);

      const el = (
        <rect key={`c-${x}-${y}`} x={x * pixel} y={y * pixel} width={pixel} height={pixel} fill={fill} />
      );

      if (isLeftFoot) left.push(el);
      else if (isRightFoot) right.push(el);
      else out.push(el);
    }
  }

  const nudge = pixel / 2;
  const leftDy = frame === 0 ? -nudge : nudge;
  const rightDy = frame === 0 ? nudge : -nudge;

  return [
    ...out,
    <g key="leg-l" transform={`translate(0 ${leftDy})`}>
      {left}
    </g>,
    <g key="leg-r" transform={`translate(0 ${rightDy})`}>
      {right}
    </g>,
  ];
}

function renderLaptopRows(startY: number, frame: 0 | 1, pixel: number): ReactNode[] {
  const rows =
    frame === 0 ? [...LAPTOP_ROWS] : [...LAPTOP_ROWS.slice(0, 5), ...LAPTOP_B_KEYS, ...LAPTOP_ROWS.slice(6)];

  const out: ReactNode[] = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i] ?? "";
    const y = startY + i;
    for (let x = 0; x < row.length; x++) {
      const ch = row[x] ?? ".";
      const fill = WORK_PALETTE[ch] ?? "transparent";
      if (fill === "transparent") continue;
      out.push(
        <rect key={`l-${x}-${y}`} x={x * pixel} y={y * pixel} width={pixel} height={pixel} fill={fill} />,
      );
    }
  }
  return out;
}

export function CrumbsWorking({
  size = 200,
  reducedMotion: propReducedMotion,
}: {
  size?: number;
  reducedMotion?: boolean;
}) {
  const [reduced, setReduced] = useState(false);
  const [frame, setFrame] = useState<0 | 1>(0);

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
    const id = window.setInterval(() => setFrame((n) => (n === 0 ? 1 : 0)), 200);
    return () => window.clearInterval(id);
  }, [motionReduced]);

  const pixel = 4;
  const viewW = 36 * pixel;
  const totalRows = CAT_H + LAPTOP_ROWS.length;
  const viewH = totalRows * pixel;

  const catNodes = renderCatWithTypingLegs(REFERENCE_CAT_ROWS, motionReduced ? 0 : frame, pixel);
  const laptopNodes = renderLaptopRows(CAT_H, motionReduced ? 0 : frame, pixel);

  return (
    <svg
      viewBox={`0 0 ${viewW} ${viewH}`}
      width={size}
      height={(size * viewH) / viewW}
      style={{ imageRendering: "pixelated" }}
      shapeRendering="crispEdges"
      aria-label="Crumbs typing on a laptop"
      role="img"
      data-testid="crumbs-working"
    >
      {catNodes}
      {laptopNodes}
    </svg>
  );
}
