import type { ReactNode } from "react";

type CSSVars = React.CSSProperties & Record<`--${string}`, string>;

const v16Vars: CSSVars = {
  "--v16-ink": "#0a0a0a",
  "--v16-paper": "#ffffff",
  "--v16-off": "#f7f7f7",
  "--v16-lime": "#E9FF6B",
  "--v16-red": "#FF3B2E",
  "--v16-blue": "#1A5CFF",
  "--v16-gold": "#FFB800",
  "--v16-magenta": "#FF2FB8",
  "--v16-display":
    'system-ui,-apple-system,"Segoe UI",Helvetica,Arial,"Arial Black",sans-serif',
  "--v16-body": 'system-ui,-apple-system,"Segoe UI",Helvetica,Arial,sans-serif',
  "--v16-mono":
    '"Lucida Console","Courier New","SFMono-Regular","SF Mono",Consolas,"Liberation Mono",monospace',

  /* Map existing app design tokens to v16 so primitives inherit the look. */
  "--background": "var(--v16-paper)",
  "--foreground": "var(--v16-ink)",
  "--paper": "var(--v16-paper)",
  "--paper-strong": "color-mix(in srgb, var(--v16-paper) 82%, var(--v16-lime) 18%)",
  "--panel": "color-mix(in srgb, var(--v16-paper) 88%, black 12%)",
  "--accent": "var(--v16-blue)",
  "--accent-dark": "color-mix(in srgb, var(--v16-blue) 78%, black 22%)",
  "--accent-soft": "color-mix(in srgb, var(--v16-magenta) 22%, var(--v16-paper) 78%)",
  "--butter": "var(--v16-lime)",
  "--moss": "color-mix(in srgb, var(--v16-ink) 58%, var(--v16-blue) 42%)",
  "--sky": "color-mix(in srgb, var(--v16-blue) 26%, var(--v16-paper) 74%)",
  "--line": "rgba(0,0,0,0.14)",
  "--shadow": "rgba(52,36,24,0.16)",
  "--font-display": "var(--v16-display)",
  "--font-sans": "var(--v16-body)",
  "--font-mono": "var(--v16-mono)",
  "--radius-button": "999px",
  "--radius-card": "1.8rem",
  "--radius-sticker": "999px",
  "--shadow-card": "0 28px 95px rgba(52, 36, 24, 0.12)",
  "--shadow-polaroid": "0 28px 95px rgba(52, 36, 24, 0.16)",
  "--shadow-button": "0 22px 70px rgba(52, 36, 24, 0.16)",
};

export function V16Theme({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`v16-root ${className}`} style={v16Vars}>
      {children}
    </div>
  );
}

