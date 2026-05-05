"use client";

import { useEffect, useState } from "react";

export type CrumbsPose = "sit" | "curl" | "nap" | "stretch" | "yawn" | "play" | "curious" | "sleepy";
export type CrumbsExpression = "neutral" | "happy" | "curious" | "sleepy" | "playful" | "yawn";

type CrumbsProps = {
  size?: "sm" | "md" | "lg" | "xl";
  pose?: CrumbsPose;
  expression?: CrumbsExpression;
  animated?: boolean;
  reducedMotion?: boolean;
  className?: string;
};

export function CrumbsLine({ children }: { children: string }) {
  return (
    <span className="crumbs-copy">
      {children}
    </span>
  );
}

const POSE_CYCLE: CrumbsPose[] = ["sit", "curl", "nap", "stretch", "yawn"];

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

function usePoseCycle(enabled: boolean, interval: number = 4200) {
  const [poseIndex, setPoseIndex] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    const timer = window.setInterval(() => {
      setPoseIndex((prev) => (prev + 1) % POSE_CYCLE.length);
    }, interval);
    return () => window.clearInterval(timer);
  }, [enabled, interval]);

  return { pose: POSE_CYCLE[poseIndex] };
}

const SIZE_MAP = {
  sm: { width: 22, height: 22 },
  md: { width: 32, height: 32 },
  lg: { width: 44, height: 44 },
  xl: { width: 66, height: 66 },
} as const;

type PixelSprite = {
  w: number;
  h: number;
  rows: string[];
  palette: Record<string, string>;
};

const BASE_PALETTE: Record<string, string> = {
  ".": "transparent",
  G: "#0a0a0a", // outline
  K: "#c7c7c7", // fur
  W: "#f5f1ea", // belly/cheek
  P: "#8d8d8d", // stripes
  O: "#0a0a0a", // mouth
};

const SPRITES: Record<CrumbsPose, PixelSprite> = {
  sit: {
    w: 16,
    h: 12,
    rows: [
      "................",
      "....GGG..GGG....",
      "...GKKKGGKKKG...",
      "...GKKKKKKKKG...",
      "..GGKWWKKWWKGG..",
      "..GKKKKKKKKKKG..",
      "..GKKKPPPPKKKG..",
      "...GGKKKKKKGG...",
      ".....GGGGGG.....",
      "....GKK..KKG....",
      "....GKK..KKG....",
      ".....GG..GG.....",
    ],
    palette: BASE_PALETTE,
  },
  curl: {
    w: 16,
    h: 12,
    rows: [
      "................",
      ".....GGGGGG.....",
      "...GGKKKKKKGG...",
      "..GKKPPKKPPKKG..",
      "..GKKKKKKKKKKG..",
      "..GKKWWKKWWKKG..",
      "...GKKKKKKKKG...",
      "....GKKKKKKG....",
      ".....GGGGGG.....",
      "................",
      "................",
      "................",
    ],
    palette: BASE_PALETTE,
  },
  nap: {
    w: 16,
    h: 12,
    rows: [
      "................",
      "................",
      "....GGGGGGGG....",
      "..GGKKKKKKKKGG..",
      ".GKKPPKKKKPPKKG.",
      ".GKKKKWWWWKKKKG.",
      "..GKKKKKKKKKKG..",
      "...GGKKKKKKGG...",
      ".....GGGGGG.....",
      "................",
      "................",
      "................",
    ],
    palette: BASE_PALETTE,
  },
  stretch: {
    w: 16,
    h: 12,
    rows: [
      "................",
      "...GGGGGGGGGG...",
      "..GKKKKKKKKKKG..",
      ".GKKPPKKKKPPKKG.",
      ".GKKKKWWWWKKKKG.",
      ".GKKKKKKKKKKKKG.",
      "..GKKK....KKKG..",
      "...GGG....GGG...",
      "................",
      "................",
      "................",
      "................",
    ],
    palette: BASE_PALETTE,
  },
  yawn: {
    w: 16,
    h: 12,
    rows: [
      "................",
      "....GGG..GGG....",
      "...GKKKGGKKKG...",
      "...GKKKKKKKKG...",
      "..GGKWWKKWWKGG..",
      "..GKKKKOOOOKKG..",
      "..GKKKPPPPKKKG..",
      "...GGKKKKKKGG...",
      ".....GGGGGG.....",
      "................",
      "................",
      "................",
    ],
    palette: BASE_PALETTE,
  },
  play: {
    w: 16,
    h: 12,
    rows: [
      "................",
      "...GGGGGGGG.....",
      "..GKKKKKKKKG....",
      ".GKKPPKKPPKKG...",
      ".GKKKKKKKKKKG...",
      "..GKKWWKKWWKG....",
      "...GKKKKKKKG.....",
      "....GGGGGG.......",
      "................",
      "................",
      "................",
      "................",
    ],
    palette: BASE_PALETTE,
  },
  curious: {
    w: 16,
    h: 12,
    rows: [
      "................",
      "...GGG..GGG.....",
      "..GKKKGGKKKG....",
      "..GKKKKKKKKG....",
      "..GGKWWKKWWKGG..",
      "...GKKKKKKKKKG..",
      "...GKKKPPPPKKG..",
      "....GGKKKKKKGG..",
      "......GGGGGG....",
      "................",
      "................",
      "................",
    ],
    palette: BASE_PALETTE,
  },
  sleepy: {
    w: 16,
    h: 12,
    rows: [
      "................",
      "....GGG..GGG....",
      "...GKKKGGKKKG...",
      "...GKKKKKKKKG...",
      "..GGKWWKKWWKGG..",
      "..GKKKKKKKKKKG..",
      "..GKKKPPPPKKKG..",
      "...GGKKKKKKGG...",
      ".....GGGGGG.....",
      "................",
      "................",
      "................",
    ],
    palette: BASE_PALETTE,
  },
};

function renderSprite(sprite: PixelSprite, pixel: number) {
  const rects: React.ReactNode[] = [];
  for (let y = 0; y < sprite.h; y++) {
    const row = sprite.rows[y] ?? "";
    for (let x = 0; x < sprite.w; x++) {
      const ch = row[x] ?? ".";
      const fill = sprite.palette[ch] ?? "transparent";
      if (fill === "transparent") continue;
      rects.push(
        <rect
          key={`${x}-${y}`}
          x={x * pixel}
          y={y * pixel}
          width={pixel}
          height={pixel}
          fill={fill}
        />,
      );
    }
  }
  return rects;
}

export function Crumbs({
  size = "md",
  pose: propPose,
  expression,
  animated = true,
  reducedMotion: propReducedMotion,
  className = "",
}: CrumbsProps) {
  const reducedFromMedia = useReducedMotion();
  const reduced = propReducedMotion ?? reducedFromMedia;
  const { pose: cyclePose } = usePoseCycle(animated && !reduced);
  const pose = propPose ?? cyclePose;
  void expression;

  const sprite = SPRITES[pose] ?? SPRITES.sit;
  const pixel = 4;
  const viewW = sprite.w * pixel;
  const viewH = sprite.h * pixel;
  const { width, height } = SIZE_MAP[size];

  return (
    <div
      className={`crumbs-mascot ${reduced ? "crumbs-static" : ""} ${className}`}
      style={{ width, height }}
      aria-label="Crumbs the Cat"
      role="img"
    >
      <svg
        viewBox={`0 0 ${viewW} ${viewH}`}
        style={{ width: "100%", height: "100%" }}
        shapeRendering="crispEdges"
      >
        {renderSprite(sprite, pixel)}
      </svg>
    </div>
  );
}

