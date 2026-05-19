"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EnvelopeRevealShell, type EnvelopeRevealPhase } from "@/components/ui/EnvelopeRevealShell";
import { PartnerBusinessGallery } from "@/components/bingo/PartnerBusinessGallery";
import { ConfettiBurst } from "@/components/visual/ConfettiBurst";
import { getOrCreateBingoCouponCode, markBingoPrizeRevealed } from "@/lib/bingo-prize";

import "@/components/ui/envelope-reveal.css";

type BingoPrizeRevealProps = {
  open: boolean;
  userId: string | null;
  onClose: () => void;
};

export function BingoPrizeReveal({ open, userId, onClose }: BingoPrizeRevealProps) {
  const [phase, setPhase] = useState<EnvelopeRevealPhase>("envelope");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = mq.matches;
    setReducedMotion(reduced);
    setPhase(reduced ? "letter" : "envelope");
    setConfettiActive(!reduced);
    setCouponCode(getOrCreateBingoCouponCode(userId));
  }, [open, userId]);

  useEffect(() => {
    if (phase !== "opening" || reducedMotion) return;
    const timer = window.setTimeout(() => setPhase("letter"), 900);
    return () => window.clearTimeout(timer);
  }, [phase, reducedMotion]);

  if (!open) return null;

  function openEnvelope() {
    if (phase !== "envelope") return;
    if (reducedMotion) {
      setPhase("letter");
      return;
    }
    setConfettiActive(true);
    setPhase("opening");
  }

  function handleDone() {
    markBingoPrizeRevealed(userId);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bingo-prize-title"
      data-testid="bingo-prize-reveal"
    >
      <ConfettiBurst active={confettiActive} originX={0.5} originY={0.45} />

      {phase !== "letter" ? (
        <div className="relative z-10 w-full max-w-md">
          <EnvelopeRevealShell
            phase={phase}
            reducedMotion={reducedMotion}
            kicker="Season bingo"
            title="You did it!"
            hintClosed="Click to reveal your prize"
            onOpenEnvelope={openEnvelope}
            ariaLabel="Reveal your bingo prize"
          />
        </div>
      ) : (
        <div
          className={[
            "relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-black/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(247,240,228,0.96))] p-6 shadow-[0_28px_95px_rgba(52,36,24,0.2)] md:p-8",
            reducedMotion ? "" : "cohort-letter-panel-in",
          ].join(" ")}
        >
          <Badge variant="butter">Bingo winner</Badge>
          <h2 id="bingo-prize-title" className="mt-4 text-3xl font-black tracking-tight text-black">
            Your $5 partner coupon
          </h2>
          <p className="mt-3 text-sm leading-6 text-black/70">
            Redeem at any Common Area partner business this season. Show this code at checkout.
          </p>

          <div className="mt-6 rounded-[1.5rem] border-2 border-dashed border-black/20 bg-[color:rgba(233,255,107,0.35)] px-5 py-6 text-center">
            <p className="text-[0.65rem] font-black uppercase tracking-[0.24em] text-black/55">Your code</p>
            <p
              className="mt-2 font-mono text-3xl font-black tracking-[0.2em] text-black"
              data-testid="bingo-prize-coupon-code"
            >
              {couponCode}
            </p>
            <p className="mt-2 text-xs text-black/55">$5 off · one-time use · Summer 2026 cohort perk</p>
          </div>

          <PartnerBusinessGallery />

          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="primary" onClick={handleDone} data-testid="bingo-prize-done">
              Save &amp; keep playing
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
