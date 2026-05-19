"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Crumbs } from "@/components/brand/Crumbs";
import { ConfettiBurst } from "@/components/visual/ConfettiBurst";

type RevealPhase = "envelope" | "opening" | "letter";

type CohortRevealLetterProps = {
  cohortId: string;
  cohortName: string;
  eventTitleA: string;
  eventTitleB: string;
  peopleAdjective: string;
  onComplete: () => void;
};

export function CohortRevealLetter({
  cohortId: _cohortId,
  cohortName,
  eventTitleA,
  eventTitleB,
  peopleAdjective,
  onComplete,
}: CohortRevealLetterProps) {
  void _cohortId;
  const [reducedMotion, setReducedMotion] = useState(false);
  const [phase, setPhase] = useState<RevealPhase>("envelope");
  const [confettiActive, setConfettiActive] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const r = mq.matches;
    // Match SSR (no window) to client: read motion preference once after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional hydration-safe preference sync
    setReducedMotion(r);
    if (r) {
      queueMicrotask(() => setPhase("letter"));
    }
  }, []);

  useEffect(() => {
    if (phase !== "opening" || reducedMotion) return;
    const t = window.setTimeout(() => setPhase("letter"), 900);
    return () => window.clearTimeout(t);
  }, [phase, reducedMotion]);

  function openEnvelope() {
    if (phase !== "envelope") return;
    if (reducedMotion) {
      setPhase("letter");
      return;
    }
    setConfettiActive(true);
    setPhase("opening");
  }

  return (
    <div className="grid gap-8" data-testid="cohort-reveal-letter">
      <ConfettiBurst active={confettiActive} originX={0.5} originY={0.42} />
      {phase !== "letter" ? (
        <CardLetterShell phase={phase} reducedMotion={reducedMotion} onOpenEnvelope={openEnvelope} />
      ) : null}

      {phase === "letter" ? (
        <div
          className={[
            "cohort-letter-reveal-panel mx-auto w-full max-w-[560px] rounded-[2rem] border border-black/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(247,240,228,0.96))] p-8 shadow-[0_28px_95px_rgba(52,36,24,0.14)]",
            reducedMotion ? "" : "cohort-letter-panel-in",
          ].join(" ")}
        >
          <Badge variant="butter">Your cohort</Badge>
          <p className="cohort-reveal-line-1 mt-6 font-[family-name:var(--font-serif,Georgia,serif)] text-2xl font-semibold leading-snug tracking-tight text-black">
            Welcome to {cohortName}!
          </p>
          <p className="cohort-reveal-line-2 mt-5 text-base leading-8 text-[color:rgba(37,34,30,0.78)]">
            Based on your interest in <span className="font-semibold text-black">{eventTitleA}</span> and{" "}
            <span className="font-semibold text-black">{eventTitleB}</span>, we&apos;ve put you in a class with{" "}
            <span className="font-semibold text-black">19</span> other{" "}
            <span className="font-semibold text-black">{peopleAdjective}</span> people.
          </p>
          <div className="cohort-reveal-line-3 mt-8 flex flex-wrap items-center gap-4">
            <Button variant="primary" onClick={onComplete}>
              Enter your common room
            </Button>
            <Crumbs size="md" pose="sit" expression="happy" animated={!reducedMotion} reducedMotion={reducedMotion} />
          </div>
        </div>
      ) : null}

      <style>{`
        @keyframes cohort-env-idle {
          0%, 100% { transform: translateY(0) rotate(-0.4deg); }
          50% { transform: translateY(-3px) rotate(0.4deg); }
        }
        @keyframes cohort-flap-open {
          0% { transform: rotateX(0deg); }
          100% { transform: rotateX(155deg); }
        }
        @keyframes cohort-letter-rise {
          0% { transform: translateY(18px) scale(0.96); opacity: 0.35; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes cohort-letter-panel-in {
          0% { transform: translateY(14px) scale(0.985); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes cohort-reveal-fade-up {
          0% { transform: translateY(10px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .cohort-env-wrap {
          perspective: 1200px;
        }
        .cohort-env-inner {
          transform-style: preserve-3d;
        }
        .cohort-env-idle {
          animation: cohort-env-idle 4.2s ease-in-out infinite;
        }
        .cohort-flap {
          transform-origin: top center;
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }
        .cohort-flap-opening {
          animation: cohort-flap-open 0.85s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .cohort-letter-sheet-opening {
          animation: cohort-letter-rise 0.75s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;
        }
        .cohort-letter-panel-in {
          animation: cohort-letter-panel-in 0.65s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .cohort-letter-panel-in .cohort-reveal-line-1 {
          animation: cohort-reveal-fade-up 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.12s both;
        }
        .cohort-letter-panel-in .cohort-reveal-line-2 {
          animation: cohort-reveal-fade-up 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.28s both;
        }
        .cohort-letter-panel-in .cohort-reveal-line-3 {
          animation: cohort-reveal-fade-up 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.44s both;
        }
        @media (prefers-reduced-motion: reduce) {
          .cohort-env-idle, .cohort-flap-opening, .cohort-letter-sheet-opening,
          .cohort-letter-panel-in, .cohort-letter-panel-in .cohort-reveal-line-1,
          .cohort-letter-panel-in .cohort-reveal-line-2, .cohort-letter-panel-in .cohort-reveal-line-3 {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

function CardLetterShell({
  phase,
  reducedMotion,
  onOpenEnvelope,
}: {
  phase: RevealPhase;
  reducedMotion: boolean;
  onOpenEnvelope: () => void;
}) {
  return (
    <div className="cohort-env-wrap mx-auto flex w-full max-w-[420px] flex-col items-center gap-4">
      <p className="text-center text-[0.72rem] font-black uppercase tracking-[0.2em] text-black/50" style={{ fontFamily: "var(--font-mono)" }}>
        Cohort reveal
      </p>
      <button
        type="button"
        onClick={onOpenEnvelope}
        disabled={phase === "opening"}
        className={[
          "cohort-env-inner group relative w-full rounded-[1.5rem] border border-black/14 bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(232,224,208,0.95))] p-6 text-left shadow-[0_24px_80px_rgba(52,36,24,0.16)] transition-transform",
          phase === "envelope" && !reducedMotion ? "cohort-env-idle hover:shadow-[0_28px_90px_rgba(52,36,24,0.2)]" : "",
          phase === "envelope" && reducedMotion ? "hover:shadow-[0_24px_80px_rgba(52,36,24,0.18)]" : "",
          phase === "opening" ? "pointer-events-none" : "",
        ].join(" ")}
        aria-label="Open your cohort assignment letter"
      >
        <div
          className={[
            "cohort-flap absolute left-3 right-3 top-3 h-[46%] rounded-t-[1.25rem] border border-black/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(247,240,228,0.75))] shadow-[0_8px_24px_rgba(0,0,0,0.08)]",
            phase === "opening" && !reducedMotion ? "cohort-flap-opening" : "",
            phase === "opening" && reducedMotion ? "opacity-40" : "",
          ].join(" ")}
          aria-hidden
        />
        <div
          className={[
            "relative z-10 mt-16 rounded-[1.25rem] border border-dashed border-black/18 bg-white/80 px-5 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]",
            phase === "opening" && !reducedMotion ? "cohort-letter-sheet-opening" : "",
          ].join(" ")}
        >
          <p className="text-[0.7rem] font-black uppercase tracking-[0.22em] text-black/55" style={{ fontFamily: "var(--font-mono)" }}>
            Common Area
          </p>
          <p className="mt-3 text-lg font-semibold text-black">You’ve got mail.</p>
          <p className="mt-2 text-sm leading-6 text-[color:rgba(37,34,30,0.72)]">
            {phase === "envelope"
              ? "Tap the envelope to unfold your cohort letter."
              : "Unfolding…"}
          </p>
        </div>
      </button>
    </div>
  );
}
