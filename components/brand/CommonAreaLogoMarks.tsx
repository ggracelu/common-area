type LogoMarkVariant = "wrap" | "doorframe" | "bench" | "overlap" | "table";

type CommonAreaLogoMarkProps = {
  variant: LogoMarkVariant;
  size?: number;
  className?: string;
  /** Ink body; pass paper on dark surfaces */
  color?: string;
  accent?: string;
};

const META: Record<
  LogoMarkVariant,
  { title: string; tagline: string; metaphor: string; bestFor: string }
> = {
  wrap: {
    title: "The wrap",
    tagline: "C embraces A",
    metaphor: "An open curve gathers around a steady center—like a cohort circling one shared table.",
    bestFor: "App icon, favicon, warm social tone",
  },
  doorframe: {
    title: "The threshold",
    tagline: "C as doorway",
    metaphor: "The arch is the common room entrance; A is the space you step into together.",
    bestFor: "Header mark, sign-in, “welcome in” moments",
  },
  bench: {
    title: "The crescent bench",
    tagline: "C as seating arc",
    metaphor: "A curved bench with A as the person-shaped peak—familiar faces in a half-circle.",
    bestFor: "Stickers, wayfinding, campus bulletin boards",
  },
  overlap: {
    title: "Common ground",
    tagline: "C meets A",
    metaphor: "C and A share the same vertical center—overlap as the slice where interests align.",
    bestFor: "Monochrome print, emboss, subtle brand moments",
  },
  table: {
    title: "The common table",
    tagline: "C as horseshoe",
    metaphor: "C wraps three sides like chairs around a table; A is the center everyone faces.",
    bestFor: "Season lockups, event posters, cohort metaphor",
  },
};

export function getLogoMarkMeta(variant: LogoMarkVariant) {
  return META[variant];
}

export function CommonAreaLogoMark({
  variant,
  size = 72,
  className = "",
  color = "#0A0A0A",
  accent = "#E9FF6B",
}: CommonAreaLogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={`Common Area logo concept: ${META[variant].title}`}
    >
      {variant === "wrap" ? <WrapMark color={color} accent={accent} /> : null}
      {variant === "doorframe" ? <DoorframeMark color={color} accent={accent} /> : null}
      {variant === "bench" ? <BenchMark color={color} accent={accent} /> : null}
      {variant === "overlap" ? <OverlapMark color={color} accent={accent} /> : null}
      {variant === "table" ? <TableMark color={color} accent={accent} /> : null}
    </svg>
  );
}

function WrapMark({ color, accent }: { color: string; accent: string }) {
  return (
    <>
      <path
        d="M34 14.5C34 9.3 29.2 5 23 5 14.5 5 8.5 12.8 8.5 20v8c0 7.2 6.5 13 14.5 13"
        stroke={color}
        strokeWidth="3.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23 16 29.5 28H16.5L23 16Z"
        fill={color}
      />
      <path d="M16.5 23.5h13" stroke={accent} strokeWidth="2.25" strokeLinecap="round" />
    </>
  );
}

function DoorframeMark({ color, accent }: { color: string; accent: string }) {
  return (
    <>
      <path
        d="M10 38V22c0-6.6 5.4-12 12-12h4c6.6 0 12 5.4 12 12v16"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 38h28"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M23 20 28.5 30H17.5L23 20Z"
        fill={accent}
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M17.5 25.5h11" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </>
  );
}

function BenchMark({ color, accent }: { color: string; accent: string }) {
  return (
    <>
      <path
        d="M8 30c0-10 7.2-18 16-18s16 8 16 18"
        stroke={color}
        strokeWidth="3.25"
        strokeLinecap="round"
      />
      <path d="M8 30h32" stroke={color} strokeWidth="3.25" strokeLinecap="round" />
      <path
        d="M24 14 30 26H18L24 14Z"
        fill={color}
      />
      <circle cx="24" cy="30" r="2.25" fill={accent} />
    </>
  );
}

function OverlapMark({ color, accent }: { color: string; accent: string }) {
  return (
    <>
      <path
        d="M26 10c-7.2 0-13 5.8-13 13v2c0 7.2 5.8 13 13 13"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M22 14 30 34H26l-2-6-2 6h-4L22 14Z"
        fill={color}
      />
      <path
        d="M20 24h12"
        stroke={accent}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </>
  );
}

function TableMark({ color, accent }: { color: string; accent: string }) {
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
      <path
        d="M24 14 29.5 24H18.5L24 14Z"
        fill={color}
      />
      <path d="M18.5 19.5h11" stroke={accent} strokeWidth="2" strokeLinecap="round" />
    </>
  );
}

const ALL_VARIANTS: LogoMarkVariant[] = ["wrap", "doorframe", "bench", "overlap", "table"];

export function CommonAreaLogoLabGrid() {
  return (
    <div className="mt-10 grid gap-8">
      {ALL_VARIANTS.map((variant) => {
        const meta = META[variant];
        return (
          <article
            key={variant}
            className="paper-surface rounded-[1.75rem] p-8 shadow-[var(--shadow-card)]"
          >
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-black/55">
                  {meta.tagline}
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight">{meta.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-black/70">{meta.metaphor}</p>
                <p className="mt-2 text-xs font-semibold text-black/50">Best for: {meta.bestFor}</p>
              </div>
              <div className="flex shrink-0 items-center gap-4 rounded-[1.25rem] border border-black/10 bg-white/80 p-5">
                <CommonAreaLogoMark variant={variant} size={80} />
                <CommonAreaLogoMark variant={variant} size={48} />
                <CommonAreaLogoMark variant={variant} size={28} />
              </div>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-6 rounded-[1.25rem] bg-[color:rgba(247,240,228,0.65)] p-5">
              <CommonAreaLogoMark variant={variant} size={56} color="#0A0A0A" accent="#1A5CFF" />
              <CommonAreaLogoMark variant={variant} size={56} color="#0A0A0A" accent="#FF2FB8" />
              <span className="text-xs text-black/55">Ink + blue or magenta accent on crossbar / dot</span>
            </div>
          </article>
        );
      })}
    </div>
  );
}
