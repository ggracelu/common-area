"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Crumbs } from "@/components/brand/Crumbs";
import { EnvelopeRevealShell, type EnvelopeRevealPhase } from "@/components/ui/EnvelopeRevealShell";
import { ConfettiBurst } from "@/components/visual/ConfettiBurst";

import "@/components/ui/envelope-reveal.css";

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
  const [phase, setPhase] = useState<EnvelopeRevealPhase>("envelope");
  const [confettiActive, setConfettiActive] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const r = mq.matches;
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
        <EnvelopeRevealShell
          phase={phase}
          reducedMotion={reducedMotion}
          kicker="Cohort reveal"
          title="You've got mail."
          hintClosed="Tap the envelope to unfold your cohort letter."
          onOpenEnvelope={openEnvelope}
          ariaLabel="Open your cohort assignment letter"
        />
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
    </div>
  );
}
