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

// Limited palette + hard edges (no partial alpha / blur), per authentic pixel-art practice.
// https://runware.ai/blog/retro-diffusion-creating-authentic-pixel-art-with-ai-at-scale
const BASE_PALETTE: Record<string, string> = {
  ".": "transparent",
  G: "#121212", // outline
  K: "#c8c8c8", // light gray fur
  L: "#adadad", // mid fur (micro-shade / dither neighbor)
  W: "#f3ece4", // cream muzzle + belly
  P: "#5a5a5a", // tabby stripe
  R: "#3a3a3a", // darker stripe accent
  E: "#e8b9be", // inner ear / nose pink
  N: "#d9959c", // nose pad
  O: "#121212", // mouth interior (same as outline)
};

const SPRITES: Record<CrumbsPose, PixelSprite> = {
  sit: {
    w: 26,
    h: 25,
    rows: [
      "..........................",
      "........GGG....GGG........",
      ".......GEEKG..GEEKG.......",
      "......GKPPKGGGKPPKG.......",
      ".....GGKKPPKKKKPPKKGG.....",
      ".....GKWWWWPPPPWWWWKG.....",
      "....GKWWWKKKKKKWWWWKG.....",
      "....GKKKWNWWNWWKKKKKG.....",
      "....GKKKKNPPNKKKKKKG......",
      "....GKKKKKPPKKKKKKG.......",
      "....GKKKKKKKKKKKKKG.......",
      "....GKKKKWWWWWWKKKKG......",
      "....GKKKKKKKKKKKKKKG......",
      "....GKPKKKKKKKKKKPKG......",
      "....GKPKKKWWWWKKKPKG......",
      "....GKKKKKKKKKKKKKG.......",
      "....GKKRRPPKKPPRRKG.......",
      "....GKKKKKKKKKKKKKG.......",
      "....GKKG........GKKG......",
      ".....GG..........GG.......",
      ".....GKKKKGGGGGKKKKG......",
      "......GKKKKKKKKKKKG.......",
      "......GKKKKPPKKKG.........",
      ".......GKKKKKKKG..........",
      "........GGGGGG............",
    ],
    palette: BASE_PALETTE,
  },
  curl: {
    w: 26,
    h: 20,
    rows: [
      "..........................",
      "..........................",
      ".......GGGGGGGGGG.........",
      ".....GGKKPPKKKKPPKGG......",
      "....GKRRKKWWWWKKRRPKG.....",
      "...GKKKWWWWWWWWWWKKKG.....",
      "..GKKWWWWNNNNWWWWKKKKG....",
      "..GKKWWWWWWWWWWKKKKKKG....",
      "..GKKKKKKKKKKKKKKKKKKG....",
      "..GKKKKKKLLLLKKKKKKKKG....",
      "..GKKKKKKKKKKKKKKKKKKG....",
      "...GKKPPKKKKKKKKPPKKG.....",
      "....GKKKKKKKKKKKKKG.......",
      ".....GKPPKKKKKKPPKG.......",
      "......GGGGGGGGGGGG........",
      "..........................",
      "..........................",
      "..........................",
      "..........................",
      "..........................",
    ],
    palette: BASE_PALETTE,
  },
  nap: {
    w: 22,
    h: 17,
    rows: [
      "......................",
      "......................",
      "......GGGGGGGGGG......",
      ".....GKPPKKKKPPKG.....",
      "....GKKKKWWWWKKKKG....",
      "...GKKWWWWWWWWWWKKG...",
      "..GKKWWWKPPPKWWWKKKG..",
      "..GKKWWWWWWWWWWKKKKG..",
      "...GKKKKKKPPKKKKKKG...",
      "....GKKKKKKKKKKKG.....",
      ".....GGKKKKKKKKGG.....",
      "......GGGGGGGGGG......",
      "......................",
      "......................",
      "......................",
      "......................",
      "......................",
    ],
    palette: BASE_PALETTE,
  },
  stretch: {
    w: 22,
    h: 17,
    rows: [
      "......................",
      "..GGGGGGGGGGGGGGGG....",
      ".GKPPKKKKKKKKKKPPKG...",
      "GKKRRKKKKKKKKKKRRKKG..",
      "GKKKKWWWWWWWWWWKKKKG..",
      "GKKKKKKKKKKKKKKKKKKG..",
      "GKKKKKKLLLLLLKKKKKKG..",
      ".GKKKK........KKKKG...",
      ".GKKKK........KKKKG...",
      "..GKKK........KKKG....",
      "..GGGG........GGGG....",
      "......................",
      "......................",
      "......................",
      "......................",
      "......................",
      "......................",
    ],
    palette: BASE_PALETTE,
  },
  yawn: {
    w: 22,
    h: 17,
    rows: [
      "......................",
      "......GGG......GGG....",
      ".....GEEKG....GEEKG...",
      ".....GKPPKGGGGKPPKG...",
      "....GGKKPPKKKKPPKKGG..",
      "....GKWWWWPPPPWWWWKG..",
      "...GKWWGKKKKKKGWWWKG..",
      "...GKKWWKPPKKKWWKKKG..",
      "...GKKKWNWWNWWKKKKKG..",
      "...GKKKKKOOOOOKKKKKG..",
      "...GKKKKKKPPKKKKKKG...",
      "...GKKKKKKLLKKKKKKG...",
      "...GKRRPPKKKKPPRRKG...",
      "...GKPKKWWWWKKKPKKG...",
      "....GKKKKKKKKKKKKG....",
      ".....GGKKKKKKKKGG.....",
      "......GGGGGGGGGG......",
    ],
    palette: BASE_PALETTE,
  },
  play: {
    w: 22,
    h: 17,
    rows: [
      "......................",
      "........GGG...........",
      ".......GEEKG..........",
      "......GKPPKGGG........",
      ".....GKKKKKKKKG.......",
      "....GKWWWWWWKKKG......",
      "...GKKKPPKKPPKKKG.....",
      "..GKKKKKKKKKKKKKG.....",
      "..GKKKWWWWWWKKKKG.....",
      "...GKKKKLLKKKKKG......",
      "....GKKKKKKKKG........",
      ".....GKPPPPKG.........",
      "......GGGGGG..........",
      "......................",
      "......................",
      "......................",
      "......................",
    ],
    palette: BASE_PALETTE,
  },
  curious: {
    w: 22,
    h: 17,
    rows: [
      "......................",
      "......GGG.......GGG...",
      ".....GEEKGG...GEEKGG..",
      ".....GKPPKGGGGKPPKG...",
      "....GGKKPPKKKKPPKKGG..",
      "....GKWWWWPPPPWWWWKG..",
      "...GKWWGKKKKKKGWWWKG..",
      "...GKKWWKPPKKKWWKKKG..",
      "...GKKKWNWWNWWKKKKKG..",
      "...GKKKKKNPPNKKKKKG...",
      "...GKKKKKKPPKKKKKKG...",
      "...GKKKKKKLLKKKKKKG...",
      "...GKRRPPKKKKPPRRKG...",
      "...GKPKKWWWWKKKPKKG...",
      "....GKKKKKKKKKKKKG....",
      ".....GGKKKKKKKKGG.....",
      "......GGGGGGGGGG......",
    ],
    palette: BASE_PALETTE,
  },
  sleepy: {
    w: 22,
    h: 17,
    rows: [
      "......................",
      "......GGG......GGG....",
      ".....GEEKG....GEEKG...",
      ".....GKPPKGGGGKPPKG...",
      "....GGKKPPKKKKPPKKGG..",
      "....GKWWWWPPPPWWWWKG..",
      "...GKWWGKKKKKKGWWWKG..",
      "...GKKWWPPPPPPWWKKKG..",
      "...GKKKWNWWNWWKKKKKG..",
      "...GKKKKKNPPNKKKKKG...",
      "...GKKKKKKPPKKKKKKG...",
      "...GKKKKKKLLKKKKKKG...",
      "...GKRRPPKKKKPPRRKG...",
      "...GKPKKWWWWKKKPKKG...",
      "....GKKKKKKKKKKKKG....",
      ".....GGKKKKKKKKGG.....",
      "......GGGGGGGGGG......",
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
        style={{ width: "100%", height: "100%", imageRendering: "pixelated" }}
        shapeRendering="crispEdges"
      >
        {renderSprite(sprite, pixel)}
      </svg>
    </div>
  );
}

