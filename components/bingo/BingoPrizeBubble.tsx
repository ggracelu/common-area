"use client";

type BingoPrizeBubbleProps = {
  couponCode: string;
};

export function BingoPrizeBubble({ couponCode }: BingoPrizeBubbleProps) {
  return (
    <aside
      className="bingo-prize-bubble relative mx-auto mt-6 w-full max-w-[280px] shrink-0 lg:mt-12 lg:w-[260px]"
      data-testid="bingo-prize-bubble"
      aria-label={`Your bingo prize: ${couponCode}`}
    >
      <div className="bingo-prize-bubble-card relative rounded-[1.75rem] border-2 border-black/12 bg-[linear-gradient(145deg,rgba(255,47,184,0.92),rgba(233,255,107,0.88),rgba(26,92,255,0.75))] p-5 text-black shadow-[0_22px_70px_rgba(255,47,184,0.28),0_12px_40px_rgba(233,255,107,0.2)]">
        <p
          className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-black/70"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Bingo winner
        </p>
        <p className="mt-2 text-sm font-semibold leading-snug text-black">
          Your prize: $5 coupon at any of our partner businesses
        </p>
        <p
          className="mt-4 rounded-xl border-2 border-dashed border-black/25 bg-white/90 px-3 py-2.5 text-center font-mono text-lg font-black tracking-[0.18em] text-black"
          data-testid="bingo-prize-bubble-code"
        >
          {couponCode}
        </p>
      </div>
      <span
        className="bingo-prize-bubble-tail pointer-events-none absolute -left-3 top-14 hidden h-6 w-6 rotate-45 border-2 border-black/12 bg-[color:rgba(233,255,107,0.88)] shadow-[-4px_4px_12px_rgba(52,36,24,0.08)] lg:block"
        aria-hidden
      />
    </aside>
  );
}
