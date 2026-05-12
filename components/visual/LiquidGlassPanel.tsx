import type { ReactNode } from "react";

type LiquidGlassPanelProps = {
  children: ReactNode;
  className?: string;
};

export function LiquidGlassPanel({ children, className = "" }: LiquidGlassPanelProps) {
  return (
    <div
      className={[
        "rounded-[1.8rem] border border-white/35 bg-white/55 shadow-[0_24px_80px_rgba(52,36,24,0.12)] backdrop-blur-xl",
        "supports-[backdrop-filter]:bg-white/35",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
