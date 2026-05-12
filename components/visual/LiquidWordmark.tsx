type LiquidWordmarkProps = {
  label?: string;
  className?: string;
};

export function LiquidWordmark({ label = "Common Area", className = "" }: LiquidWordmarkProps) {
  return (
    <div
      className={[
        "inline-flex rounded-full border border-black/10 bg-[linear-gradient(120deg,rgba(233,255,107,0.55),rgba(26,92,255,0.18),rgba(255,47,184,0.22))] px-4 py-2",
        className,
      ].join(" ")}
      data-testid="liquid-wordmark"
    >
      <span className="text-sm font-black uppercase tracking-[0.24em] text-black/80">{label}</span>
    </div>
  );
}
