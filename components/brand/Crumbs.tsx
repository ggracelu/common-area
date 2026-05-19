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

/** Blue pixel letters for nap Zzz overlay (B = sleep blue). */
const ZZZ_PALETTE: Record<string, string> = {
  ".": "transparent",
  B: "#4a8fd9",
};

/** Pixel lowercase z — small / medium / large for diagonal Zzz stack. */
const Z_LETTER_SMALL: PixelSprite = {
  w: 3,
  h: 4,
  rows: ["BBB", "..B", "B..", "BBB"],
  palette: ZZZ_PALETTE,
};

const Z_LETTER_MED: PixelSprite = {
  w: 4,
  h: 5,
  rows: ["BBBB", "...B", "..B.", ".B..", "BBBB"],
  palette: ZZZ_PALETTE,
};

const Z_LETTER_LARGE: PixelSprite = {
  w: 5,
  h: 6,
  rows: ["BBBBB", "....B", "...B.", "..B..", ".B...", "BBBBB"],
  palette: ZZZ_PALETTE,
};

/**
 * Sleeping loaf — head ~17 cols wide × 14 rows tall (~1.3× wider and
 * ~1.6× taller than the default sit pose) with a full K outline all
 * around: triangular ears, crown row, six-wide DDDDDD forehead crease,
 * side D cheek shadows, two-pixel closed eyes, four-row white muzzle
 * ending with a K nose dot. A K column near col 16 separates head from
 * body. NAP adds three pixelated blue z letters in a loading sequence.
 */
const CURL_CRUMBS: PixelSprite = {
  w: 26,
  h: 19,
  rows: [
    "...K.........K............",
    "..KLK.......KLK...........",
    "..LLLKKKKKKKKKLLL.........",
    "..LLLLLLLLLLLLLLL.........",
    "KLLLLLDDDDDDLLLLLK........",
    "KLLLLLDDDDDDLLLLLKKKKKKKKK",
    "KLDLLLLLLLLLLLDLKLLLLLLLLK",
    "KLDLLLLLLLLLLLDLKLLLLLLLLK",
    "KLDLLKKLLLKKLDLKLWLLWLLWK.",
    "KLDLLLLLLLLLLDLKLWLLWLLWK.",
    "KLDLLWWWWWLLLDLKLLLLLLLLK.",
    "KLDLLWWWWWLLLDLKLLLLLLLLK.",
    "KLLLWWWWWWWLLLLKLLLLLLLLK.",
    "KLLLWWWKWWWLLLLKLLLLLLLLK.",
    "KWWWWWWWWWWWWWWWWWWWWWWWK.",
    "KKKKKKKKKKKKKKKKKKKK...KKK",
    "....KKKKKKKKKKKKKKKKKKKKK.",
    "....KLLLLLLLLLLLLLLLLLLK..",
    "....KKKKKKKKKKKKKKKKKKKK..",
  ],
  palette: BASE_PALETTE,
};

/** Loaf nap: same sleeping pose; pixel z letters rendered as animated overlay. */
const NAP_CRUMBS: PixelSprite = {
  w: 26,
  h: 19,
  rows: CURL_CRUMBS.rows,
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

function renderSprite(sprite: PixelSprite, pixel: number, originX = 0, originY = 0) {
  const rects: React.ReactNode[] = [];
  for (let y = 0; y < sprite.h; y++) {
    const row = sprite.rows[y] ?? "";
    for (let x = 0; x < sprite.w; x++) {
      const ch = row[x] ?? ".";
      const fill = sprite.palette[ch] ?? "transparent";
      if (fill === "transparent") continue;
      rects.push(
        <rect
          key={`${originX}-${originY}-${x}-${y}`}
          x={(originX + x) * pixel}
          y={(originY + y) * pixel}
          width={pixel}
          height={pixel}
          fill={fill}
        />,
      );
    }
  }
  return rects;
}

function renderZLetter(sprite: PixelSprite, pixel: number, originX: number, originY: number, className: string) {
  return (
    <g className={className} transform={`translate(${originX * pixel}, ${originY * pixel})`} aria-hidden="true">
      {renderSprite(sprite, pixel)}
    </g>
  );
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
            {renderZLetter(Z_LETTER_SMALL, pixel, 17, 2, "crumbs-zzz crumbs-zzz-1")}
            {renderZLetter(Z_LETTER_MED, pixel, 19, 0, "crumbs-zzz crumbs-zzz-2")}
            {renderZLetter(Z_LETTER_LARGE, pixel, 21, 0, "crumbs-zzz crumbs-zzz-3")}
          </g>
        )}
      </svg>
    </div>
  );
}

