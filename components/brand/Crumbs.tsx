"use client";

import { useEffect, useState } from "react";

type CrumbsPose = "sit" | "curl" | "nap" | "stretch" | "yawn" | "play" | "curious" | "sleepy";
type CrumbsExpression = "neutral" | "happy" | "curious" | "sleepy" | "playful" | "yawn";

interface CrumbsProps {
  size?: "sm" | "md" | "lg" | "xl";
  pose?: CrumbsPose;
  expression?: CrumbsExpression;
  animated?: boolean;
  reducedMotion?: boolean;
  className?: string;
}

const POSE_CYCLE: CrumbsPose[] = ["sit", "curl", "nap", "stretch", "yawn"];
const EXPRESSION_CYCLE: CrumbsExpression[] = ["neutral", "curious", "happy", "sleepy"];

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

function usePoseCycle(enabled: boolean, interval: number = 4000) {
  const [poseIndex, setPoseIndex] = useState(0);
  const [expressionIndex, setExpressionIndex] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const poseTimer = setInterval(() => {
      setPoseIndex((prev) => (prev + 1) % POSE_CYCLE.length);
    }, interval);

    const expressionTimer = setInterval(() => {
      setExpressionIndex((prev) => (prev + 1) % EXPRESSION_CYCLE.length);
    }, interval * 1.5);

    return () => {
      clearInterval(poseTimer);
      clearInterval(expressionTimer);
    };
  }, [enabled, interval]);

  return {
    pose: POSE_CYCLE[poseIndex],
    expression: EXPRESSION_CYCLE[expressionIndex],
  };
}

const SIZE_MAP = {
  sm: { width: 32, height: 24 },
  md: { width: 48, height: 36 },
  lg: { width: 64, height: 48 },
  xl: { width: 96, height: 72 },
};

export function Crumbs({
  size = "md",
  pose: propPose,
  expression: propExpression,
  animated = true,
  reducedMotion: propReducedMotion,
  className = "",
}: CrumbsProps) {
  const reducedFromMedia = useReducedMotion();
  const reduced = propReducedMotion ?? reducedFromMedia;
  const { pose: cyclePose, expression: cycleExpression } = usePoseCycle(animated && !reduced);

  const pose = propPose ?? cyclePose;
  const expression = propExpression ?? cycleExpression;
  const { width, height } = SIZE_MAP[size];

  return (
    <div
      className={`crumbs-mascot ${reduced ? "crumbs-static" : ""} ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
      aria-label="Crumbs the Cat, Common Area's resident lounge cat mascot"
      role="img"
    >
      <svg
        className="crumbs-svg"
        viewBox="0 0 64 48"
        style={{ width: "100%", height: "100%" }}
      >
        <defs>
          {/* Tabby stripe pattern */}
          <pattern id="crumbsTabby" width="8" height="8" patternUnits="userSpaceOnUse">
            <rect width="8" height="8" fill="#cfcfcf" />
            <rect x="1" y="1" width="6" height="1.6" fill="#9b9b9b" opacity="0.85" />
            <rect x="0.8" y="4.2" width="6.4" height="1.6" fill="#8e8e8e" opacity="0.75" />
          </pattern>

          {/* Shadow filter */}
          <filter id="crumbsShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.22)" />
          </filter>

          {/* Glow filter for happy expression */}
          <filter id="crumbsGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Body base - shared across poses */}
        <g filter="url(#crumbsShadow)">
          {/* Sitting pose */}
          {pose === "sit" && (
            <g className="crumbs-pose crumbs-pose-sit">
              {/* Body */}
              <rect x="18" y="20" width="28" height="16" rx="3" fill="url(#crumbsTabby)" />
              <rect x="20" y="28" width="10" height="8" rx="2" fill="#e7e7e7" opacity="0.9" />
              {/* Head */}
              <CrumbsHead expression={expression} x={22} y={10} />
              {/* Front paws */}
              <rect x="22" y="34" width="7" height="4" rx="1" fill="#dcdcdc" />
              <rect x="34" y="34" width="7" height="4" rx="1" fill="#dcdcdc" />
              {/* Tail */}
              <CrumbsTail x={14} y={26} animated={!reduced} />
            </g>
          )}

          {/* Curled pose */}
          {pose === "curl" && (
            <g className="crumbs-pose crumbs-pose-curl">
              {/* Curled body */}
              <rect x="16" y="18" width="32" height="20" rx="10" fill="url(#crumbsTabby)" />
              <rect x="20" y="22" width="18" height="10" rx="6" fill="#e8e8e8" opacity="0.9" />
              {/* Head nestled */}
              <CrumbsHead expression="sleepy" x={24} y={14} />
              {/* Tail wrap */}
              <rect x="14" y="26" width="10" height="8" rx="4" fill="#bdbdbd" />
              <rect x="16" y="26" width="2" height="8" fill="#8f8f8f" opacity="0.55" />
            </g>
          )}

          {/* Nap pose */}
          {pose === "nap" && (
            <g className="crumbs-pose crumbs-pose-nap">
              {/* Loaf body */}
              <rect x="10" y="22" width="44" height="13" rx="7" fill="url(#crumbsTabby)" />
              <rect x="14" y="27" width="18" height="8" rx="4" fill="#e8e8e8" opacity="0.9" />
              {/* Head */}
              <CrumbsHead expression="sleepy" x={20} y={15} />
              {/* Zzz animation */}
              {!reduced && <CrumbsZzz />}
            </g>
          )}

          {/* Stretch pose */}
          {pose === "stretch" && (
            <g className="crumbs-pose crumbs-pose-stretch">
              {/* Stretched body */}
              <rect x="8" y="20" width="48" height="12" rx="6" fill="url(#crumbsTabby)" />
              <rect x="12" y="24" width="16" height="6" rx="3" fill="#e8e8e8" opacity="0.9" />
              {/* Head up */}
              <CrumbsHead expression="happy" x={18} y={8} />
              {/* Front paws stretched */}
              <rect x="8" y="30" width="8" height="4" rx="2" fill="#dcdcdc" />
              <rect x="48" y="30" width="8" height="4" rx="2" fill="#dcdcdc" />
              {/* Tail stretched */}
              <rect x="4" y="24" width="6" height="4" rx="2" fill="#bdbdbd" />
            </g>
          )}

          {/* Yawn pose */}
          {pose === "yawn" && (
            <g className="crumbs-pose crumbs-pose-yawn">
              {/* Body */}
              <rect x="18" y="20" width="28" height="16" rx="3" fill="url(#crumbsTabby)" />
              <rect x="20" y="28" width="10" height="8" rx="2" fill="#e7e7e7" opacity="0.9" />
              {/* Head with yawn */}
              <CrumbsHead expression="yawn" x={22} y={10} />
              {/* Paws */}
              <rect x="22" y="34" width="7" height="4" rx="1" fill="#dcdcdc" />
              <rect x="34" y="34" width="7" height="4" rx="1" fill="#dcdcdc" />
              {/* Tail */}
              <CrumbsTail x={14} y={26} animated={!reduced} />
            </g>
          )}

          {/* Play pose */}
          {pose === "play" && (
            <g className="crumbs-pose crumbs-pose-play">
              {/* Crouching body */}
              <rect x="16" y="22" width="32" height="14" rx="7" fill="url(#crumbsTabby)" />
              <rect x="20" y="26" width="16" height="8" rx="4" fill="#e8e8e8" opacity="0.9" />
              {/* Head alert */}
              <CrumbsHead expression="playful" x={24} y={12} />
              {/* Front paws ready */}
              <rect x="20" y="34" width="6" height="4" rx="1" fill="#dcdcdc" />
              <rect x="38" y="34" width="6" height="4" rx="1" fill="#dcdcdc" />
              {/* Tail twitching */}
              <CrumbsTail x={12} y={26} animated={!reduced} fast />
            </g>
          )}

          {/* Curious pose */}
          {pose === "curious" && (
            <g className="crumbs-pose crumbs-pose-curious">
              {/* Body */}
              <rect x="18" y="20" width="28" height="16" rx="3" fill="url(#crumbsTabby)" />
              <rect x="20" y="28" width="10" height="8" rx="2" fill="#e7e7e7" opacity="0.9" />
              {/* Head tilted */}
              <CrumbsHead expression="curious" x={22} y={10} tilted />
              {/* Paws */}
              <rect x="22" y="34" width="7" height="4" rx="1" fill="#dcdcdc" />
              <rect x="34" y="34" width="7" height="4" rx="1" fill="#dcdcdc" />
              {/* Tail */}
              <CrumbsTail x={14} y={26} animated={!reduced} />
            </g>
          )}

          {/* Sleepy pose */}
          {pose === "sleepy" && (
            <g className="crumbs-pose crumbs-pose-sleepy">
              {/* Loaf body */}
              <rect x="12" y="22" width="40" height="12" rx="6" fill="url(#crumbsTabby)" />
              <rect x="16" y="26" width="16" height="6" rx="3" fill="#e8e8e8" opacity="0.9" />
              {/* Head down */}
              <CrumbsHead expression="sleepy" x={20} y={16} />
              {/* Half-closed eyes */}
              <rect x="24" y="19" width="3" height="1.5" fill="#0a0a0a" opacity="0.5" />
              <rect x="31" y="19" width="3" height="1.5" fill="#0a0a0a" opacity="0.5" />
              {/* Slow Zzz */}
              {!reduced && <CrumbsZzz slow />}
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}

function CrumbsHead({
  expression = "neutral",
  x = 22,
  y = 10,
  tilted = false,
}: {
  expression?: CrumbsExpression;
  x?: number;
  y?: number;
  tilted?: boolean;
}) {
  const transform = tilted ? "rotate(-8, 32, 17)" : "";

  return (
    <g transform={transform}>
      {/* Head base */}
      <rect x={x} y={y} width="20" height="14" rx="3" fill="#d6d6d6" />
      {/* Ears */}
      <rect x={x} y={y - 2} width="5" height="5" rx="1" fill="#d6d6d6" />
      <rect x={x + 15} y={y - 2} width="5" height="5" rx="1" fill="#d6d6d6" />
      {/* Forehead stripe */}
      <rect x={x + 2} y={y + 2} width="16" height="5" rx="2" fill="#b7b7b7" opacity="0.55" />

      {/* Face based on expression */}
      <CrumbsFace expression={expression} x={x} y={y} />
    </g>
  );
}

function CrumbsFace({ expression = "neutral", x = 22, y = 10 }: { expression?: CrumbsExpression; x?: number; y?: number }) {
  return (
    <>
      {/* Eyes */}
      {expression === "sleepy" || expression === "yawn" ? (
        <>
          {/* Closed/squinting eyes */}
          <rect x={x + 5} y={y + 5} width="3" height="1.6" fill="#0a0a0a" opacity="0.55" />
          <rect x={x + 12} y={y + 5} width="3" height="1.6" fill="#0a0a0a" opacity="0.55" />
        </>
      ) : (
        <>
          {/* Open eyes */}
          <rect x={x + 4} y={y + 5} width="3" height="3" fill="#0a0a0a" />
          <rect x={x + 13} y={y + 5} width="3" height="3" fill="#0a0a0a" />
          {/* Eye shine for curious/happy */}
          {(expression === "curious" || expression === "happy" || expression === "playful") && (
            <>
              <rect x={x + 5} y={y + 6} width="1" height="1" fill="white" opacity="0.9" />
              <rect x={x + 14} y={y + 6} width="1" height="1" fill="white" opacity="0.9" />
            </>
          )}
        </>
      )}

      {/* Nose */}
      <rect x={x + 9} y={y + 8} width="2" height="2" fill="#0a0a0a" opacity="0.85" />

      {/* Mouth based on expression */}
      {expression === "yawn" ? (
        <>
          {/* Yawning mouth */}
          <rect x={x + 8} y={y + 10} width="4" height="3" rx="1" fill="#ff6b5b" opacity="0.9" />
          <rect x={x + 9} y={y + 11} width="2" height="1" fill="#0a0a0a" opacity="0.6" />
        </>
      ) : expression === "happy" || expression === "playful" ? (
        <>
          {/* Happy mouth - slight smile */}
          <rect x={x + 8} y={y + 10} width="4" height="1.5" rx="0.75" fill="#ff3b2e" opacity="0.8" />
        </>
      ) : (
        <>
          {/* Neutral mouth */}
          <rect x={x + 8} y={y + 10} width="4" height="1.5" fill="#0a0a0a" opacity="0.7" />
        </>
      )}

      {/* Whiskers */}
      <g opacity="0.4">
        <rect x={x - 2} y={y + 7} width="3" height="0.5" fill="#0a0a0a" />
        <rect x={x - 2} y={y + 9} width="3" height="0.5" fill="#0a0a0a" />
        <rect x={x + 19} y={y + 7} width="3" height="0.5" fill="#0a0a0a" />
        <rect x={x + 19} y={y + 9} width="3" height="0.5" fill="#0a0a0a" />
      </g>
    </>
  );
}

function CrumbsTail({ x = 14, y = 26, animated = false, fast = false }: { x?: number; y?: number; animated?: boolean; fast?: boolean }) {
  const animationClass = animated ? (fast ? "crumbs-tail-fast" : "crumbs-tail-slow") : "";

  return (
    <g className={`crumbs-tail ${animationClass}`}>
      <rect x={x} y={y} width="7" height="4" rx="1" fill="#bdbdbd" />
      <rect x={x - 4} y={y + 2} width="6" height="4" rx="1" fill="#b3b3b3" />
      <rect x={x - 2} y={y + 2} width="2" height="4" fill="#8f8f8f" opacity="0.55" />
      <rect x={x + 3} y={y} width="2" height="4" fill="#8f8f8f" opacity="0.55" />
    </g>
  );
}

function CrumbsZzz({ slow = false }: { slow?: boolean }) {
  const animationClass = slow ? "crumbs-zzz-slow" : "crumbs-zzz";

  return (
    <g className={animationClass}>
      <circle className="crumbs-z-1" cx="50" cy="18" r="2" fill="#E9FF6B" opacity="0.85" />
      <circle className="crumbs-z-2" cx="54" cy="14" r="1.6" fill="#E9FF6B" opacity="0.65" />
      <circle className="crumbs-z-3" cx="58" cy="10" r="1.2" fill="#E9FF6B" opacity="0.45" />
    </g>
  );
}

// Crumbs copy lines for different contexts
export const CRUMBS_COPY = {
  greeting: [
    "Crumbs saved you a spot.",
    "Showing up counts.",
    "Your couch will forgive you.",
    "You can leave after an hour.",
    "Community is mostly showing up and knowing where the snacks are.",
  ],
  encouragement: [
    "No swiping. Just show up.",
    "Overlap makes recognition happen.",
    "A room you can return to.",
    "Familiar faces, familiar places.",
  ],
  onboarding: [
    "Ask a question.",
    "Find your cohort.",
    "Pick your activities.",
    "You're doing great.",
  ],
  empty: [
    "Nothing here yet. Crumbs is napping.",
    "Crumbs is observing. Check back soon.",
    "The room is quiet. Crumbs approves.",
  ],
  error: [
    "Crumbs is confused. Try again?",
    "Something went wrong. Crumbs is investigating.",
    "Crumbs suggests refreshing the page.",
  ],
  success: [
    "Crumbs approves!",
    "You did it! Crumbs is proud.",
    "Crumbs saved your spot.",
  ],
} as const;

export type CrumbsCopyContext = keyof typeof CRUMBS_COPY;

export function CrumbsLine({ context = "greeting", index = 0 }: { context?: CrumbsCopyContext; index?: number }) {
  const lines = CRUMBS_COPY[context];
  const line = lines[index % lines.length];

  return <span className="crumbs-copy">{line}</span>;
}
