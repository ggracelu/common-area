"use client";

import { useEffect, useState } from "react";

type PostcardMatchAnimationProps = {
  status: "not_started" | "mailing" | "pending" | "assigned";
};

export function PostcardMatchAnimation({ status }: PostcardMatchAnimationProps) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => setTick((t) => t + 1), 1200);
    return () => window.clearInterval(interval);
  }, []);

  const label =
    status === "assigned"
      ? "Delivered"
      : status === "pending"
        ? "Sorting"
        : status === "mailing"
          ? "In flight"
          : "Unsent";

  const sub =
    status === "assigned"
      ? "Cohort reveal ready."
      : status === "pending"
        ? "We’re sorting the match pile."
        : status === "mailing"
          ? "Postcard is leaving your desk."
          : "Pick events, then mail it.";

  const dots = ".".repeat((tick % 3) + 1);

  return (
    <div className="relative overflow-hidden rounded-[1.8rem] border border-black/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.82),rgba(247,240,228,0.82))] p-6 shadow-[0_18px_55px_rgba(52,36,24,0.10)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[color:rgba(37,34,30,0.65)]">Matching mailroom</p>
          <p className="mt-3 text-2xl font-semibold tracking-tight">
            {label}
            {status === "pending" || status === "mailing" ? dots : ""}
          </p>
          <p className="mt-3 text-base leading-7 text-[color:rgba(37,34,30,0.72)]">{sub}</p>
        </div>
        <div className="hidden sm:block">
          <div
            className={`relative h-28 w-40 rounded-[1.25rem] border border-black/15 bg-white/85 shadow-[0_18px_55px_rgba(52,36,24,0.10)] ${
              status === "mailing"
                ? "animate-[postcardFly_1.2s_ease-in-out_infinite]"
                : status === "pending"
                  ? "animate-[postcardWiggle_2.4s_ease-in-out_infinite]"
                  : ""
            }`}
          >
            <div className="absolute left-3 top-3 h-4 w-16 rounded-full bg-black/8" />
            <div className="absolute left-3 top-10 h-3 w-24 rounded-full bg-black/8" />
            <div className="absolute left-3 top-16 h-3 w-20 rounded-full bg-black/8" />
            <div className="absolute right-3 top-3 h-10 w-10 rounded-[0.9rem] bg-[color:rgba(191,90,54,0.18)]" />
          </div>
        </div>
      </div>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .animate-\\[postcardFly_1\\.2s_ease-in-out_infinite\\],
          .animate-\\[postcardWiggle_2\\.4s_ease-in-out_infinite\\] {
            animation: none !important;
          }
        }
        @keyframes postcardFly {
          0%, 100% { transform: translateX(0) translateY(0) rotate(-1deg); }
          50% { transform: translateX(-10px) translateY(-6px) rotate(1.5deg); }
        }
        @keyframes postcardWiggle {
          0%, 100% { transform: rotate(-1deg); }
          50% { transform: rotate(1deg); }
        }
      `}</style>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(242,203,113,0.30),transparent_60%)]"
      />
    </div>
  );
}

