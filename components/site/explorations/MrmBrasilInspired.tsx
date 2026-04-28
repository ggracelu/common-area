"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

type Cursor = { x: number; y: number };

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

function useCursor() {
  const [cursor, setCursor] = useState<Cursor>({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);
  const next = useRef<Cursor>({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      next.current = { x: event.clientX, y: event.clientY };
      if (raf.current != null) return;
      raf.current = window.requestAnimationFrame(() => {
        raf.current = null;
        setCursor(next.current);
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf.current != null) window.cancelAnimationFrame(raf.current);
    };
  }, []);

  return cursor;
}

function useInViewClass(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        node.classList.add("mrm-inview");
      }
    }, options);

    observer.observe(node);
    return () => observer.disconnect();
  }, [options]);

  return ref;
}

export function MrmBrasilInspiredSite() {
  const reducedMotion = useReducedMotion();
  const cursor = useCursor();

  const accent = useMemo(() => {
    // punchy rotating accents, close to MRM's bold pops
    return ["#E9FF6B", "#FF3B2E", "#1A5CFF", "#FFB800"];
  }, []);

  const a = accent[0];
  const b = accent[1];
  const c = accent[2];
  const d = accent[3];

  const heroRef = useInViewClass({ threshold: 0.25 });
  const worksRef = useInViewClass({ threshold: 0.2 });
  const howRef = useInViewClass({ threshold: 0.2 });
  const crumbsRef = useInViewClass({ threshold: 0.2 });
  const ctaRef = useInViewClass({ threshold: 0.2 });

  const cursorStyle = reducedMotion
    ? undefined
    : ({
        "--cx": `${cursor.x}px`,
        "--cy": `${cursor.y}px`,
      } as React.CSSProperties);

  return (
    <main
      className="mrm-root min-h-screen bg-[#0a0a0a] text-white"
      style={
        {
          "--mrm-ink": "#0a0a0a",
          "--mrm-paper": "#ffffff",
          "--mrm-white": "#f7f7f7",
          "--mrm-line": "rgba(255,255,255,0.14)",
          "--mrm-muted": "rgba(255,255,255,0.70)",
          "--mrm-mute2": "rgba(255,255,255,0.55)",
          "--mrm-a": a,
          "--mrm-b": b,
          "--mrm-c": c,
          "--mrm-d": d,
          "--mrm-display":
            'system-ui,-apple-system,"Segoe UI",Helvetica,Arial,"Arial Black",sans-serif',
          "--mrm-body": 'system-ui,-apple-system,"Segoe UI",Helvetica,Arial,sans-serif',
          "--mrm-mono": '"SFMono-Regular","SF Mono",Consolas,"Liberation Mono",monospace',
        } as React.CSSProperties
      }
    >
      <div className="mrm-cursor-layer" style={cursorStyle} aria-hidden="true" />

      <header className="sticky top-0 z-20 border-b border-white/10 bg-black/55 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-6 px-5 py-4 md:px-10">
          <div className="flex items-center gap-4">
            <span className="mrm-mark grid h-10 w-10 place-items-center rounded-full border border-white/12 bg-white/5 text-sm font-black">
              CA
            </span>
            <div className="leading-tight">
              <p className="text-xs font-black uppercase tracking-[0.22em]">Common Area</p>
              <p className="text-xs text-white/60">MRM-inspired exploration</p>
            </div>
          </div>

          <nav className="hidden items-center gap-7 text-xs font-black uppercase tracking-[0.22em] text-white/70 md:flex">
            <a href="#promise" className="mrm-link">
              Promise
            </a>
            <a href="#how" className="mrm-link">
              How
            </a>
            <a href="#activities" className="mrm-link">
              Activities
            </a>
            <a href="#crumbs" className="mrm-link">
              Crumbs
            </a>
            <a href="#cta" className="mrm-link">
              Join
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/" className="mrm-btn mrm-btn-ghost text-xs">
              Gallery
            </Link>
            <Link href="/sign-up" className="mrm-btn mrm-btn-solid text-xs">
              Get a spot
            </Link>
          </div>
        </div>
      </header>

      <section ref={heroRef} className="mrm-hero px-5 pb-14 pt-10 md:px-10 md:pb-20 md:pt-14">
        <div className="mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[1.12fr_0.88fr] lg:items-start">
          <div>
            <p className="mrm-kicker">
              Meaningful relationship for post-grad social life
              <span className="mrm-dot" aria-hidden="true" />
              Chicago season
            </p>
            <h1 className="mrm-h1">
              Turn your city into a campus
              <span className="mrm-h1-pop"> again</span>.
            </h1>
            <p className="mrm-lede">
              Black &amp; white structure. Bold accent pops. A landing page that behaves like a living
              poster wall — with just enough rules to stay readable.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/sign-up" className="mrm-btn mrm-btn-solid">
                Join the season
              </Link>
              <a href="#how" className="mrm-btn mrm-btn-outline">
                See how it works
              </a>
            </div>

            <div className="mt-10 grid gap-3 md:grid-cols-3">
              {[
                ["Deposit", "$20", "Commitment, not a subscription."],
                ["Choose", "4 of 6", "Overlap creates recognition."],
                ["Cohort", "15–20", "A room you can return to."],
              ].map(([label, value, note], index) => (
                <div
                  key={label}
                  className="mrm-metric"
                  style={{
                    ["--mrm-accent" as never]:
                      index === 0 ? "var(--mrm-a)" : index === 1 ? "var(--mrm-c)" : "var(--mrm-b)",
                  }}
                >
                  <p className="mrm-metric-k">{label}</p>
                  <p className="mrm-metric-v">{value}</p>
                  <p className="mrm-metric-n">{note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="mrm-ticker-wrap" aria-hidden="true">
              <div className="mrm-ticker">
                <span>COMMON AREA</span>
                <span>COMMUNITY</span>
                <span>AUTHENTICITY</span>
                <span>PLAY</span>
                <span>COMMON AREA</span>
                <span>COMMUNITY</span>
                <span>AUTHENTICITY</span>
                <span>PLAY</span>
              </div>
            </div>

            <div className="mrm-stack mt-10">
              <div className="mrm-card mrm-card-photo">
                <img
                  src="https://images.unsplash.com/photo-1741636174602-252cd7bb233c?auto=format&fit=crop&w=2200&q=80"
                  alt="A bulletin board packed with posters and flyers."
                  className="mrm-img"
                  loading="lazy"
                  decoding="async"
                />
                <p className="mrm-caption">Photo via Unsplash.</p>
              </div>
              <div className="mrm-card mrm-card-photo mrm-tilt2">
                <img
                  src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=2200&q=80"
                  alt="Friends laughing together under warm string lights."
                  className="mrm-img"
                  loading="lazy"
                  decoding="async"
                />
                <p className="mrm-caption">Photo via Unsplash.</p>
              </div>
              <div className="mrm-card mrm-card-note mrm-tilt3">
                <p className="mrm-note-k">Crumbs note</p>
                <p className="mrm-note-t">“Your couch will forgive you.”</p>
                <p className="mrm-note-b">
                  A season makes the city feel familiar. You just need a room that exists again next week.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="promise" ref={worksRef} className="mrm-section border-t border-white/10 px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1500px]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mrm-kicker">Works</p>
              <h2 className="mrm-h2">
                Make the city feel like
                <span className="mrm-underline"> campus buildings</span>.
              </h2>
            </div>
            <p className="max-w-[34rem] text-sm leading-7 text-white/70">
              A “common room” is mostly a routine. The product promise stays Common Area; this is a
              visual experiment inspired by [MRM Brasil](https://www.mrmbrasil.com.br/en).
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {[
              ["Pottery night", "Logan Square", "var(--mrm-a)", "https://images.unsplash.com/photo-1760018861921-43af85ea6c4f?auto=format&fit=crop&w=2200&q=80"],
              ["Coffee crawl", "Wicker Park", "var(--mrm-c)", "https://images.unsplash.com/photo-1766981934909-278a54cc1efd?auto=format&fit=crop&w=2200&q=80"],
              ["Comedy show", "Old Town", "var(--mrm-b)", "https://images.unsplash.com/photo-1731007733979-6f3d7b8632ae?auto=format&fit=crop&w=2200&q=80"],
            ].map(([title, place, color, img]) => (
              <article key={title} className="mrm-work">
                <div className="mrm-work-top" style={{ ["--mrm-accent" as never]: color }}>
                  <p className="mrm-work-k">{place}</p>
                  <p className="mrm-work-t">{title}</p>
                </div>
                <div className="mrm-work-img">
                  <img src={img} alt={`${title} in ${place}.`} className="mrm-img" loading="lazy" decoding="async" />
                </div>
                <div className="mrm-work-bottom">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-white/60">Photo via Unsplash</p>
                  <a className="mrm-mini-link" href="#cta">
                    Open the season →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how" ref={howRef} className="mrm-section mrm-invert px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="mrm-panel">
              <p className="mrm-kicker text-black">How it works</p>
              <h2 className="mrm-h2 text-black">
                Three steps.
                <br />
                Then repetition.
              </h2>
              <p className="mt-6 text-sm leading-7 text-black/70">
                We keep the hierarchy brutal and the motion playful. The intent is to replicate the “tons of overlapping animations”
                feel while staying dependency-free and readable.
              </p>
            </div>

            <ol className="grid gap-4">
              {[
                ["Join the season", "Sign up for the Chicago season."],
                ["Pick 4 activities", "Choose four plans you’d actually attend."],
                ["Return to familiar faces", "Overlap creates recognition on purpose."],
              ].map(([title, body], index) => (
                <li key={title} className="mrm-step" style={{ ["--mrm-accent" as never]: index === 0 ? "var(--mrm-b)" : index === 1 ? "var(--mrm-d)" : "var(--mrm-c)" }}>
                  <p className="mrm-step-k">Step {index + 1}</p>
                  <p className="mrm-step-t">{title}</p>
                  <p className="mrm-step-b">{body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="activities" className="mrm-section border-t border-white/10 px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1500px]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mrm-kicker">Activity preview</p>
              <h2 className="mrm-h2">
                Connection through play,
                <span className="mrm-underline"> not performance</span>.
              </h2>
            </div>
            <p className="max-w-[34rem] text-sm leading-7 text-white/70">
              Hover everything. The page is intentionally “busy,” but the primary CTA and reading hierarchy should stay intact.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["Record player night", "Common Room", "var(--mrm-d)", "https://images.unsplash.com/photo-1709649246219-220dfca6f75a?auto=format&fit=crop&w=2200&q=80"],
              ["Mural walk", "Pilsen-ish", "var(--mrm-c)", "https://images.unsplash.com/photo-1754079132860-5b37dab49daa?auto=format&fit=crop&w=2200&q=80"],
              ["Bulletin board hunt", "Café wall", "var(--mrm-a)", "https://images.unsplash.com/photo-1741636174602-252cd7bb233c?auto=format&fit=crop&w=2200&q=80"],
              ["Kitchen table cooking", "West Loop-ish", "var(--mrm-b)", "https://images.unsplash.com/photo-1766981934909-278a54cc1efd?auto=format&fit=crop&w=2200&q=80"],
            ].map(([title, place, color, img]) => (
              <article key={title} className="mrm-mini" style={{ ["--mrm-accent" as never]: color }}>
                <div className="mrm-mini-top">
                  <p className="mrm-mini-k">{place}</p>
                  <p className="mrm-mini-t">{title}</p>
                </div>
                <div className="mrm-mini-img">
                  <img src={img} alt={title} className="mrm-img" loading="lazy" decoding="async" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="crumbs" ref={crumbsRef} className="mrm-section border-t border-white/10 px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="mrm-panel">
              <p className="mrm-kicker">Crumbs</p>
              <h2 className="mrm-h2">
                Dry, cozy, observant.
                <span className="mrm-underline"> Never trying too hard.</span>
              </h2>
              <p className="mt-6 text-sm leading-7 text-white/70">
                Crumbs exists as a side-note, not a mascot takeover. In this aesthetic, he’s a stamp in the corner of a poster wall.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {["Showing up counts.", "Crumbs saved you a spot.", "You can leave after an hour."].map((line, index) => (
                  <span key={line} className="mrm-chip" style={{ ["--mrm-accent" as never]: index === 0 ? "var(--mrm-a)" : index === 1 ? "var(--mrm-b)" : "var(--mrm-c)" }}>
                    {line}
                  </span>
                ))}
              </div>
            </div>

            <div className="mrm-crumbs-board">
              <div className="mrm-stamp" aria-hidden="true">
                🐈
              </div>
              <div className="mrm-crumbs-grid">
                <div className="mrm-crumbs-cell">
                  <p className="mrm-crumbs-k">Vibe</p>
                  <p className="mrm-crumbs-v">Common room</p>
                </div>
                <div className="mrm-crumbs-cell">
                  <p className="mrm-crumbs-k">Tone</p>
                  <p className="mrm-crumbs-v">Warm, dry</p>
                </div>
                <div className="mrm-crumbs-cell">
                  <p className="mrm-crumbs-k">Rule</p>
                  <p className="mrm-crumbs-v">Repeat visits</p>
                </div>
                <div className="mrm-crumbs-cell">
                  <p className="mrm-crumbs-k">Energy</p>
                  <p className="mrm-crumbs-v">Poster wall</p>
                </div>
              </div>
              <p className="mt-4 text-xs font-black uppercase tracking-[0.22em] text-white/55">
                Photo credits: Unsplash. Motion: CSS + tiny React.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="cta" ref={ctaRef} className="mrm-section px-5 pb-20 pt-14 md:px-10 md:pb-28">
        <div className="mx-auto max-w-[1500px]">
          <div className="mrm-cta">
            <p className="mrm-kicker text-black">Join</p>
            <h2 className="mrm-h2 text-black">
              Join the season.
              <br />
              Show up twice.
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-black/70">
              This is an exploration page only — no backend logic is added. The main landing page remains on `http://localhost:3000`.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/sign-up" className="mrm-btn mrm-btn-solid mrm-btn-solid-dark">
                Create an account
              </Link>
              <Link href="/sign-in" className="mrm-btn mrm-btn-outline mrm-btn-outline-dark">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

