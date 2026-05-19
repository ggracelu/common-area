type LogoMarkVariant =
  | "wrap"
  | "doorframe"
  | "bench"
  | "overlap"
  | "table"
  | "wrap-v2"
  | "overlap-v2"
  | "curl-a";

type CommonAreaLogoMarkProps = {
  variant: LogoMarkVariant;
  size?: number;
  className?: string;
  /** Single-ink body; use paper on dark surfaces */
  color?: string;
};

const LETTER_FONT =
  "var(--font-sans, ui-sans-serif), system-ui, -apple-system, 'Segoe UI', sans-serif";

const META: Record<
  LogoMarkVariant,
  { title: string; tagline: string; metaphor: string; bestFor: string; version: "v1" | "v2" }
> = {
  wrap: {
    title: "The wrap",
    tagline: "C embraces A",
    metaphor: "An open curve gathers around a steady center—like a cohort circling one shared table.",
    bestFor: "App icon, favicon, warm social tone",
    version: "v1",
  },
  doorframe: {
    title: "The threshold",
    tagline: "C as doorway",
    metaphor: "The arch is the common room entrance; A is the space you step into together.",
    bestFor: "Header mark, sign-in, “welcome in” moments",
    version: "v1",
  },
  bench: {
    title: "The crescent bench",
    tagline: "C as seating arc",
    metaphor: "A curved bench with A as the person-shaped peak—familiar faces in a half-circle.",
    bestFor: "Stickers, wayfinding, campus bulletin boards",
    version: "v1",
  },
  overlap: {
    title: "Common ground",
    tagline: "C meets A",
    metaphor: "C and A share the same vertical center—overlap as the slice where interests align.",
    bestFor: "Monochrome print, emboss, subtle brand moments",
    version: "v1",
  },
  table: {
    title: "The common table",
    tagline: "C as horseshoe",
    metaphor: "C wraps three sides like chairs around a table; A is the center everyone faces.",
    bestFor: "Season lockups, event posters, cohort metaphor",
    version: "v1",
  },
  "wrap-v2": {
    title: "The wrap · v2",
    tagline: "C embraces A",
    metaphor:
      "Cleaner embrace: a single-weight C opens toward a legible capital A—one ink, no ornament.",
    bestFor: "Favicon, app icon, header mark",
    version: "v2",
  },
  "overlap-v2": {
    title: "Common ground · v2",
    tagline: "C meets A",
    metaphor:
      "Capital C and A set in the same bold face, overlapping where the cohort’s interests meet.",
    bestFor: "Wordmark lockup, print, emboss",
    version: "v2",
  },
  "curl-a": {
    title: "The encircle",
    tagline: "C holds curled a",
    metaphor:
      "Capital C nearly rings a lowercase a; the a’s short tail lifts up to close the loop—shared space as one gesture.",
    bestFor: "Distinctive icon, social avatar, stamp",
    version: "v2",
  },
};

const V2_VARIANTS: LogoMarkVariant[] = ["wrap-v2", "overlap-v2", "curl-a"];
const V1_VARIANTS: LogoMarkVariant[] = ["wrap", "doorframe", "bench", "overlap", "table"];

export function getLogoMarkMeta(variant: LogoMarkVariant) {
  return META[variant];
}

export function CommonAreaLogoMark({
  variant,
  size = 72,
  className = "",
  color = "#0A0A0A",
}: CommonAreaLogoMarkProps) {
  const meta = META[variant];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={`Common Area logo concept: ${meta.title}`}
    >
      {variant === "wrap" ? <WrapMarkV1 color={color} /> : null}
      {variant === "doorframe" ? <DoorframeMarkV1 color={color} /> : null}
      {variant === "bench" ? <BenchMarkV1 color={color} /> : null}
      {variant === "overlap" ? <OverlapMarkV1 color={color} /> : null}
      {variant === "table" ? <TableMarkV1 color={color} /> : null}
      {variant === "wrap-v2" ? <WrapMarkV2 color={color} /> : null}
      {variant === "overlap-v2" ? <OverlapMarkV2 color={color} /> : null}
      {variant === "curl-a" ? <CurlAMark color={color} /> : null}
    </svg>
  );
}

function LetterA({
  x,
  y,
  size,
  color,
  weight = 800,
}: {
  x: number;
  y: number;
  size: number;
  color: string;
  weight?: number;
}) {
  return (
    <text
      x={x}
      y={y}
      fill={color}
      fontSize={size}
      fontWeight={weight}
      fontFamily={LETTER_FONT}
      textAnchor="middle"
      dominantBaseline="central"
    >
      A
    </text>
  );
}

function LetterC({
  x,
  y,
  size,
  color,
  weight = 800,
}: {
  x: number;
  y: number;
  size: number;
  color: string;
  weight?: number;
}) {
  return (
    <text
      x={x}
      y={y}
      fill={color}
      fontSize={size}
      fontWeight={weight}
      fontFamily={LETTER_FONT}
      textAnchor="middle"
      dominantBaseline="central"
    >
      C
    </text>
  );
}

/** v2 · C embraces A — open C + capital A, single ink */
function WrapMarkV2({ color }: { color: string }) {
  return (
    <>
      <path
        d="M31.5 11C19 8.5 8.5 16 8.5 24c0 9 10.5 16.5 23.5 16.5"
        stroke={color}
        strokeWidth="2.55"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <LetterA x={21.5} y={25.5} size={16} color={color} />
    </>
  );
}

/** v2 · C meets A — overlapping capitals, single ink */
function OverlapMarkV2({ color }: { color: string }) {
  return (
    <>
      <LetterC x={19} y={26.5} size={22} color={color} />
      <LetterA x={28.5} y={26.5} size={22} color={color} />
    </>
  );
}

/**
 * v2 · Capital C nearly encircles lowercase a; a’s tail closes the ring (short @-like gesture).
 */
function CurlAMark({ color }: { color: string }) {
  const stroke = 2.65;
  return (
    <>
      {/* C — open at upper-right; tail of a completes the loop */}
      <path
        d="M34 12.5
           C24.5 9 14 15 14 24
           C14 32.5 20.5 38 28.5 38
           C31.2 38 33.2 36.6 34 34.8"
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x={21.5}
        y={27.5}
        fill={color}
        fontSize={14.5}
        fontWeight={700}
        fontFamily={LETTER_FONT}
        textAnchor="middle"
        dominantBaseline="central"
      >
        a
      </text>
      {/* short tail: out and up from a to meet C */}
      <path
        d="M26.5 20.5 C28.2 15.8 31 13 34.2 12.2"
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
      />
    </>
  );
}

/* —— Round 1 (archive) —— */

function WrapMarkV1({ color }: { color: string }) {
  return (
    <>
      <path
        d="M34 14.5C34 9.3 29.2 5 23 5 14.5 5 8.5 12.8 8.5 20v8c0 7.2 6.5 13 14.5 13"
        stroke={color}
        strokeWidth="3.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M23 16 29.5 28H16.5L23 16Z" fill={color} />
    </>
  );
}

function DoorframeMarkV1({ color }: { color: string }) {
  return (
    <>
      <path
        d="M10 38V22c0-6.6 5.4-12 12-12h4c6.6 0 12 5.4 12 12v16"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10 38h28" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <path
        d="M23 20 28.5 30H17.5L23 20Z"
        fill={color}
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M17.5 25.5h11" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </>
  );
}

function BenchMarkV1({ color }: { color: string }) {
  return (
    <>
      <path
        d="M8 30c0-10 7.2-18 16-18s16 8 16 18"
        stroke={color}
        strokeWidth="3.25"
        strokeLinecap="round"
      />
      <path d="M8 30h32" stroke={color} strokeWidth="3.25" strokeLinecap="round" />
      <path d="M24 14 30 26H18L24 14Z" fill={color} />
    </>
  );
}

function OverlapMarkV1({ color }: { color: string }) {
  return (
    <>
      <path
        d="M26 10c-7.2 0-13 5.8-13 13v2c0 7.2 5.8 13 13 13"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M22 14 30 34H26l-2-6-2 6h-4L22 14Z" fill={color} />
    </>
  );
}

function TableMarkV1({ color }: { color: string }) {
  return (
    <>
      <path
        d="M10 20c0-6.6 5.4-12 14-12s14 5.4 14 12v4"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M10 36h28" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <path d="M10 36v4M38 36v4" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <path d="M24 14 29.5 24H18.5L24 14Z" fill={color} />
    </>
  );
}

function LogoMarkCard({ variant }: { variant: LogoMarkVariant }) {
  const meta = META[variant];
  const isV2 = meta.version === "v2";

  return (
    <article className="paper-surface rounded-[1.75rem] p-8 shadow-[var(--shadow-card)]">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-black/55">
            {isV2 ? "v2 · " : "v1 · "}
            {meta.tagline}
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight">{meta.title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-black/70">{meta.metaphor}</p>
          <p className="mt-2 text-xs font-semibold text-black/50">Best for: {meta.bestFor}</p>
          {isV2 ? (
            <p className="mt-2 text-xs font-semibold text-black/45">Single ink only — no accent bars</p>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-4 rounded-[1.25rem] border border-black/10 bg-white/80 p-5">
          <CommonAreaLogoMark variant={variant} size={80} />
          <CommonAreaLogoMark variant={variant} size={48} />
          <CommonAreaLogoMark variant={variant} size={28} />
        </div>
      </div>
      {isV2 ? (
        <div className="mt-6 flex flex-wrap items-center gap-6 rounded-[1.25rem] bg-[#0A0A0A] p-5">
          <CommonAreaLogoMark variant={variant} size={56} color="#F7F0E4" />
          <span className="text-xs text-white/60">Reversed on ink — still one color</span>
        </div>
      ) : null}
    </article>
  );
}

export function CommonAreaLogoLabGrid() {
  return (
    <div className="mt-10 space-y-14">
      <div>
        <h3 className="text-lg font-black tracking-tight">Round 2 · refining favorites</h3>
        <p className="mt-2 max-w-2xl text-sm text-black/65">
          Based on <strong className="font-semibold">C embraces A</strong> and{" "}
          <strong className="font-semibold">C meets A</strong>, plus a new{" "}
          <strong className="font-semibold">C + curled a</strong> direction. All v2 marks use real
          letterforms and a single ink.
        </p>
        <div className="mt-8 grid gap-8">
          {V2_VARIANTS.map((variant) => (
            <LogoMarkCard key={variant} variant={variant} />
          ))}
        </div>
      </div>

      <details className="group rounded-[1.75rem] border border-black/10 bg-white/50 p-6">
        <summary className="cursor-pointer text-sm font-black uppercase tracking-[0.18em] text-black/55">
          Round 1 archive (five initial concepts)
        </summary>
        <div className="mt-8 grid gap-8">
          {V1_VARIANTS.map((variant) => (
            <LogoMarkCard key={variant} variant={variant} />
          ))}
        </div>
      </details>
    </div>
  );
}
