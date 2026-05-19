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

// 16×16 reference: #000 / #FFF / #BDBDBD / #757575; sleepy adds B (Zzz).
const BASE_PALETTE: Record<string, string> = {
  ".": "transparent",
  K: "#000000",
  W: "#FFFFFF",
  L: "#BDBDBD",
  D: "#757575",
};

const SLEEPY_PALETTE: Record<string, string> = {
  ...BASE_PALETTE,
  B: "#4a8fd9",
};

/** Tabby + shaded belly between the legs (D in the foot gap). */
const REFERENCE_CRUMBS: PixelSprite = {
  w: 16,
  h: 16,
  rows: [
    "..K.......K.....",
    ".KLK.....KLK....",
    ".LLLKKKKKLLL....",
    "KLLLLDDLLLLLK...",
    "KLLLLDDLLLLLK...",
    "KLDLLLLLLLDLK...",
    "KLDLKLKLKLDLK...",
    "KLDLLWWWLLDLK...",
    "KLLLWWWWWLLLK...",
    "KKKKKKKKKKKKK.K.",
    ".KLLLWLLLK...KDK",
    ".KLLLWLLLK..KDDK",
    ".KLLLWLLLK.KDDK.",
    ".KKKKDKKKKKDK...",
    ".KKKKDKKKK......",
    "................",
  ],
  palette: BASE_PALETTE,
};

/**
 * Sleeping loaf — head scaled up to 21 cols × 11 rows (~1.6× wider and
 * ~1.3× taller than the default sit pose) with a full K outline all
 * around: triangular ears, six-wide DDDDDD forehead crease across two
 * rows, side D cheek shadows that hug the full face, two-pixel closed
 * eyes positioned where the default eye dots sit, a three-row white
 * muzzle widening from five to seven pixels and ending with a single
 * K nose dot. A K column at col 20 separates head from body (the
 * "neck" line). The shorter body to the right carries three vertical
 * tabby back stripes. Below, the underbelly runs continuously across,
 * and a thick three-row tail (K outline + L interior) tucks under the
 * body curling to a tip below the front paws. NAP variant adds three
 * animated Zzz dots rendered separately so they can fade in as a
 * loading sequence.
 */
const CURL_CRUMBS: PixelSprite = {
  w: 30,
  h: 16,
  rows: [
    "....K............K............",
    "...KLK..........KLK...........",
    "...LLLKKKKKKKKKKLLL...........",
    "KLLLLLLDDDDDDLLLLLLLK.........",
    "KLLLLLLDDDDDDLLLLLLLKKKKKKKKKK",
    "KLDLLLLLLLLLLLLLLLDLKLLLLLLLLK",
    "KLDLLLKKLLLLLKKLLLDLKLWLLWLLWK",
    "KLDLLLLLLLLLLLLLLLDLKLWLLWLLWK",
    "KLDLLLLLWWWWWLLLLLDLKLLLLLLLLK",
    "KLLLLLLWWWWWWWLLLLLLKLLLLLLLLK",
    "KLLLLLLWWWKWWWLLLLLLKLLLLLLLLK",
    "KWWWWWWWWWWWWWWWWWWWWWWWWWWWWK",
    "KKKKKKKKKKKKKKKKKKKKKKKK...KKK",
    ".....KKKKKKKKKKKKKKKKKKKKKK...",
    ".....KLLLLLLLLLLLLLLLLLLLLK...",
    ".....KKKKKKKKKKKKKKKKKKKKKK...",
  ],
  palette: BASE_PALETTE,
};

/** Loaf nap: same sleeping pose; Zzz dots are rendered as animated overlay rects in the Crumbs component. */
const NAP_CRUMBS: PixelSprite = {
  w: 30,
  h: 16,
  rows: [
    "....K............K............",
    "...KLK..........KLK...........",
    "...LLLKKKKKKKKKKLLL...........",
    "KLLLLLLDDDDDDLLLLLLLK.........",
    "KLLLLLLDDDDDDLLLLLLLKKKKKKKKKK",
    "KLDLLLLLLLLLLLLLLLDLKLLLLLLLLK",
    "KLDLLLKKLLLLLKKLLLDLKLWLLWLLWK",
    "KLDLLLLLLLLLLLLLLLDLKLWLLWLLWK",
    "KLDLLLLLWWWWWLLLLLDLKLLLLLLLLK",
    "KLLLLLLWWWWWWWLLLLLLKLLLLLLLLK",
    "KLLLLLLWWWKWWWLLLLLLKLLLLLLLLK",
    "KWWWWWWWWWWWWWWWWWWWWWWWWWWWWK",
    "KKKKKKKKKKKKKKKKKKKKKKKK...KKK",
    ".....KKKKKKKKKKKKKKKKKKKKKK...",
    ".....KLLLLLLLLLLLLLLLLLLLLK...",
    ".....KKKKKKKKKKKKKKKKKKKKKK...",
  ],
  palette: BASE_PALETTE,
};

/** Closed eyes (wide dashes) + three blue pixels Zzz on a diagonal. */
const SLEEPY_CRUMBS: PixelSprite = {
  w: 16,
  h: 16,
  rows: [
    "..K.......K....B",
    ".KLK.....KLK..B.",
    ".LLLKKKKKLLL.B..",
    "KLLLLDDLLLLLK...",
    "KLLLLDDLLLLLK...",
    "KLDLLLLLLLDLK...",
    "KLDLKKKLLKKKLDLK",
    "KLDLLWWWLLDLK...",
    "KLLLWWWWWLLLK...",
    "KKKKKKKKKKKKK.K.",
    ".KLLLWLLLK...KDK",
    ".KLLLWLLLK..KDDK",
    ".KLLLWLLLK.KDDK.",
    ".KKKKDKKKKKDK...",
    ".KKKKDKKKK......",
    "................",
  ],
  palette: SLEEPY_PALETTE,
};

const SPRITES: Record<CrumbsPose, PixelSprite> = {
  sit: REFERENCE_CRUMBS,
  curl: CURL_CRUMBS,
  nap: NAP_CRUMBS,
  stretch: REFERENCE_CRUMBS,
  yawn: REFERENCE_CRUMBS,
  play: REFERENCE_CRUMBS,
  curious: REFERENCE_CRUMBS,
  sleepy: SLEEPY_CRUMBS,
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
  const box = SIZE_MAP[size].width;
  const isWide = sprite.w > sprite.h;
  const width = isWide ? box : box;
  const height = isWide ? Math.max(Math.round(box * (viewH / viewW)), box * 0.45) : box;
  const breathe =
    animated && !reduced && (pose === "sit" || pose === "curl" || pose === "nap");
  const breatheClass =
    pose === "sit" ? "crumbs-breathe" : pose === "curl" || pose === "nap" ? "crumbs-breathe-slow" : "";

  return (
    <div
      className={[
        "crumbs-mascot",
        reduced ? "crumbs-static" : "",
        breathe ? breatheClass : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ width, height }}
      aria-label="Crumbs the Cat"
      role="img"
    >
      <svg
        className="crumbs-sprite"
        viewBox={`0 0 ${viewW} ${viewH}`}
        style={{ width: "100%", height: "100%", imageRendering: "pixelated" }}
        shapeRendering="crispEdges"
      >
        {renderSprite(sprite, pixel)}
        {pose === "nap" && (
          <g className="crumbs-zzz-group" aria-hidden="true">
            <rect
              className="crumbs-zzz crumbs-zzz-1"
              x={22 * pixel}
              y={2 * pixel}
              width={pixel}
              height={pixel}
              fill="#4a8fd9"
            />
            <rect
              className="crumbs-zzz crumbs-zzz-2"
              x={24 * pixel}
              y={1 * pixel}
              width={pixel * 2}
              height={pixel * 2}
              fill="#4a8fd9"
            />
            <rect
              className="crumbs-zzz crumbs-zzz-3"
              x={26 * pixel}
              y={0 * pixel}
              width={pixel * 3}
              height={pixel * 3}
              fill="#4a8fd9"
            />
          </g>
        )}
      </svg>
    </div>
  );
}

