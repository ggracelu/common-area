import type { ReactNode } from "react";

type LiquidGlassPanelProps = {
  children: ReactNode;
  className?: string;
};

export function LiquidGlassPanel({ children, className = "" }: LiquidGlassPanelProps) {
  return (
    <div
      className={[
        "rounded-[1.8rem] border border-[rgba(247,240,228,0.85)] bg-[linear-gradient(135deg,rgba(255,255,255,0.62),rgba(247,240,228,0.48))] shadow-[0_24px_80px_rgba(52,36,24,0.12)] backdrop-blur-xl",
        "supports-[backdrop-filter]:bg-white/35",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
