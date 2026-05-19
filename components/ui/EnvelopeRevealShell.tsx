"use client";

import { CommonAreaLogo } from "@/components/brand/CommonAreaLogo";

import "@/components/ui/envelope-reveal.css";

export type EnvelopeRevealPhase = "envelope" | "opening" | "letter";

type EnvelopeRevealShellProps = {
  phase: EnvelopeRevealPhase;
  reducedMotion: boolean;
  kicker: string;
  title: string;
  hintClosed: string;
  hintOpening?: string;
  onOpenEnvelope: () => void;
  ariaLabel?: string;
  className?: string;
};

export function EnvelopeRevealShell({
  phase,
  reducedMotion,
  kicker,
  title,
  hintClosed,
  hintOpening = "Unfolding…",
  onOpenEnvelope,
  ariaLabel = "Open envelope",
  className = "",
}: EnvelopeRevealShellProps) {
  return (
    <div className={["cohort-env-wrap mx-auto flex w-full max-w-[420px] flex-col items-center gap-4", className].join(" ")}>
      <p
        className="text-center text-[0.72rem] font-black uppercase tracking-[0.2em] text-black/50"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {kicker}
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
        aria-label={ariaLabel}
        data-testid="envelope-reveal-shell"
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
          <div className="flex items-center gap-2.5">
            <CommonAreaLogo size={28} />
            <p
              className="text-[0.7rem] font-black uppercase tracking-[0.22em] text-black/55"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Common Area
            </p>
          </div>
          <p className="mt-3 text-lg font-semibold text-black">{title}</p>
          <p className="mt-2 text-sm leading-6 text-[color:rgba(37,34,30,0.72)]">
            {phase === "envelope" ? hintClosed : hintOpening}
          </p>
        </div>
      </button>
    </div>
  );
}
