"use client";

import Link from "next/link";
import { CommonAreaLogo } from "@/components/brand/CommonAreaLogo";
import { useEffect, useMemo, useRef, useState } from "react";

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
      if (entry.isIntersecting) node.classList.add("v13-inview");
    }, options);
    observer.observe(node);
    return () => observer.disconnect();
  }, [options]);

  return ref;
}

const u = {
  bulletin:
    "https://images.unsplash.com/photo-1741636174602-252cd7bb233c?auto=format&fit=crop&w=2200&q=80",
  laughter:
    "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=2200&q=80",
  coffee:
    "https://images.unsplash.com/photo-1766981934909-278a54cc1efd?auto=format&fit=crop&w=2200&q=80",
  pottery:
    "https://images.unsplash.com/photo-1760018861921-43af85ea6c4f?auto=format&fit=crop&w=2200&q=80",
  vinyl:
    "https://images.unsplash.com/photo-1709649246219-220dfca6f75a?auto=format&fit=crop&w=2200&q=80",
  mural:
    "https://images.unsplash.com/photo-1754079132860-5b37dab49daa?auto=format&fit=crop&w=2200&q=80",
} as const;

export function V13KitschComputerClubSite() {
  const reduced = useReducedMotion();
  const cursor = useCursor();

  const colors = useMemo(
    () => ({
      ink: "#0a0a0a",
      paper: "#ffffff",
      off: "#f7f7f7",
      lime: "#E9FF6B",
      red: "#FF3B2E",
      blue: "#1A5CFF",
      gold: "#FFB800",
      magenta: "#FF2FB8",
    }),
    [],
  );

  const heroRef = useInViewClass({ threshold: 0.25 });
  const howRef = useInViewClass({ threshold: 0.2 });
  const actRef = useInViewClass({ threshold: 0.2 });
  const cohortRef = useInViewClass({ threshold: 0.2 });
  const crumbsRef = useInViewClass({ threshold: 0.2 });
  const ctaRef = useInViewClass({ threshold: 0.2 });

  const cursorStyle = reduced
    ? undefined
    : ({
        "--cx": `${cursor.x}px`,
        "--cy": `${cursor.y}px`,
      } as React.CSSProperties);

  return (
    <main
      className="v13-root min-h-screen"
      style={
        {
          "--v13-ink": colors.ink,
          "--v13-paper": colors.paper,
          "--v13-off": colors.off,
          "--v13-lime": colors.lime,
          "--v13-red": colors.red,
          "--v13-blue": colors.blue,
          "--v13-gold": colors.gold,
          "--v13-magenta": colors.magenta,
          "--v13-display":
            'system-ui,-apple-system,"Segoe UI",Helvetica,Arial,"Arial Black",sans-serif',
          "--v13-body": 'system-ui,-apple-system,"Segoe UI",Helvetica,Arial,sans-serif',
          "--v13-mono":
            '"Lucida Console","Courier New","SFMono-Regular","SF Mono",Consolas,"Liberation Mono",monospace',
        } as React.CSSProperties
      }
    >
      <div className="v13-cursor" style={cursorStyle} aria-hidden="true" />

      <header className="sticky top-0 z-20 border-b border-black/10 bg-white/82 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1520px] items-center justify-between gap-6 px-5 py-4 md:px-10">
          <div className="flex items-center gap-4">
            <CommonAreaLogo size={40} />
            <div className="leading-tight">
              <p className="v13-topline">Common Area</p>
              <p className="v13-subline">V13 Kitschy Computer Club</p>
            </div>
          </div>

          <nav className="hidden items-center gap-7 md:flex">
            {[
              ["How", "#how"],
              ["Activities", "#activities"],
              ["Cohort", "#cohort"],
              ["Crumbs", "#crumbs"],
              ["Join", "#cta"],
            ].map(([label, href]) => (
              <a key={href} className="v13-navlink" href={href}>
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/" className="v13-btn v13-btn-ghost text-xs">
              Gallery
            </Link>
            <Link href="/sign-up" className="v13-btn v13-btn-solid text-xs">
              Start season
            </Link>
          </div>
        </div>
      </header>

      <section ref={heroRef} className="px-5 pb-16 pt-10 md:px-10 md:pb-24 md:pt-14">
        <div className="mx-auto max-w-[1520px]">
          <div className="v13-hero-wrap">
            <div className="v13-hero-grid">
              <div>
                <p className="v13-kicker">
                  CHICAGO.SEASON.EXE <span aria-hidden="true">•</span> COHORTS <span aria-hidden="true">•</span> PLAY
                </p>
                <h1 className="v13-h1">
                  Turn your city into a campus
                  <span className="v13-h1-pop"> again</span>.
                </h1>
                <p className="v13-lede">
                  A little early‑computer kitsch. A lot of real-life routine. Common Area builds recurring cohorts so local spots start to feel familiar.
                </p>

                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                  <Link href="/sign-up" className="v13-btn v13-btn-solid">
                    Join the season
                  </Link>
                  <a href="#how" className="v13-btn v13-btn-outline">
                    How it works
                  </a>
                </div>

                <div className="mt-12 grid gap-3 md:grid-cols-3">
                  {[
                    ["Deposit", "$20", "Keeps the room from being empty.", "var(--v13-lime)"],
                    ["Pick", "4 of 6", "Overlap makes recognition happen.", "var(--v13-blue)"],
                    ["Cohort", "15–20", "A room you can return to.", "var(--v13-red)"],
                  ].map(([k, v, note, accent]) => (
                    <div key={k} className="v13-metric" style={{ ["--v13-accent" as never]: accent }}>
                      <p className="v13-metric-k">{k}</p>
                      <p className="v13-metric-v">{v}</p>
                      <p className="v13-metric-n">{note}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="v13-marquee" aria-hidden="true">
                  <div className="v13-marquee-track">
                    <span>COMMON AREA</span>
                    <span>NO SWIPING</span>
                    <span>SHOW UP TWICE</span>
                    <span>LOCAL SPOTS = CAMPUS BUILDINGS</span>
                    <span>COMMON AREA</span>
                    <span>NO SWIPING</span>
                    <span>SHOW UP TWICE</span>
                    <span>LOCAL SPOTS = CAMPUS BUILDINGS</span>
                  </div>
                </div>

                <div className="v13-collage">
                  <figure className="v13-polaroid v13-p-a">
                    <img className="v13-img" src={u.vinyl} alt="A vinyl record on a record player under warm light." loading="lazy" decoding="async" />
                    <figcaption className="v13-cap">Photo via Unsplash.</figcaption>
                  </figure>
                  <figure className="v13-polaroid v13-p-b">
                    <img className="v13-img" src={u.bulletin} alt="A bulletin board packed with posters and flyers." loading="lazy" decoding="async" />
                    <figcaption className="v13-cap">Photo via Unsplash.</figcaption>
                  </figure>
                  <figure className="v13-polaroid v13-p-c">
                    <img className="v13-img" src={u.laughter} alt="Friends laughing together under warm string lights." loading="lazy" decoding="async" />
                    <figcaption className="v13-cap">Photo via Unsplash.</figcaption>
                  </figure>

                  <aside className="v13-sticky v13-s-1">
                    <p className="v13-sticky-k">SYSTEM NOTE</p>
                    <p className="v13-sticky-t">
                      “Showing up counts.”
                      <span className="v13-sticky-i"> (Your couch will forgive you.)</span>
                    </p>
                  </aside>
                  <aside className="v13-sticky v13-s-2">
                    <p className="v13-sticky-k">TO DO</p>
                    <p className="v13-sticky-t">See the same people twice.</p>
                  </aside>

                  <div className="v13-float v13-f-1" aria-hidden="true" />
                  <div className="v13-float v13-f-2" aria-hidden="true" />
                  <div className="v13-float v13-f-3" aria-hidden="true" />
                </div>
              </div>
            </div>

            <div className="v13-scanlines" aria-hidden="true" />
          </div>
        </div>
      </section>

      <section id="how" ref={howRef} className="border-t border-black/10 bg-[var(--v13-off)] px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1520px]">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="v13-panel">
              <p className="v13-kicker">HOW.IT.WORKS</p>
              <h2 className="v13-h2">Three steps. Then repetition.</h2>
              <p className="v13-small">
                Retro UI energy, calm product rules. Motion is layered, but the hierarchy stays obvious.
              </p>
            </div>

            <ol className="grid gap-4">
              {[
                ["Join the Chicago season", "Create an account and claim a spot."],
                ["Pick 4 activities", "Choose four neighborhood plans you’d actually do."],
                ["Get a cohort", "15–20 people with overlapping picks — on purpose."],
              ].map(([title, body], index) => (
                <li key={title} className="v13-step" style={{ animationDelay: `${index * 90}ms` }}>
                  <p className="v13-step-k">STEP {index + 1}</p>
                  <p className="v13-step-t">{title}</p>
                  <p className="v13-step-b">{body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="activities" ref={actRef} className="border-t border-black/10 px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1520px]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="v13-kicker">ACTIVITY.PREVIEW</p>
              <h2 className="v13-h2">Connection through play.</h2>
              <p className="v13-small">Hover: zoom, glow, and tiny “pixel wiggle” movement.</p>
            </div>
            <p className="v13-micro">Photos via Unsplash • design exploration only</p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["Pottery night", "Logan Square", u.pottery, "var(--v13-gold)"],
              ["Coffee crawl", "Wicker Park", u.coffee, "var(--v13-magenta)"],
              ["Mural walk", "Pilsen", u.mural, "var(--v13-blue)"],
              ["Record player night", "Common room", u.vinyl, "var(--v13-lime)"],
            ].map(([title, place, img, accent]) => (
              <article key={title} className="v13-mini" style={{ ["--v13-accent" as never]: accent }}>
                <div className="v13-mini-top">
                  <p className="v13-mini-k">{place}</p>
                  <p className="v13-mini-t">{title}</p>
                </div>
                <div className="v13-mini-img">
                  <img className="v13-img" src={img} alt={`${title} in ${place}.`} loading="lazy" decoding="async" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="cohort" ref={cohortRef} className="border-t border-black/10 bg-[var(--v13-off)] px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1520px]">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
            <div className="v13-panel">
              <p className="v13-kicker">COHORT.LOGIC</p>
              <h2 className="v13-h2">A city with classmates again.</h2>
              <p className="v13-small">
                Cohorts are designed for recognition. Local businesses become campus buildings. The structure does the awkward part.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  ["Repeated presence", "The second time is easier."],
                  ["Overlap by design", "You share picks with others."],
                  ["Low pressure", "You can leave after an hour."],
                ].map(([k, v]) => (
                  <div key={k} className="v13-chip">
                    <p className="v13-chip-k">{k}</p>
                    <p className="v13-chip-v">{v}</p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="v13-sticky-board">
              {[
                ["CRUMBS NOTE", "“Repeated presence beats first‑impression theater.”", "var(--v13-lime)", "-1.2deg"],
                ["RULE", "You don’t need a perfect bio. You need a room that exists again next week.", "var(--v13-gold)", "1.4deg"],
                ["STATUS", "Your couch will forgive you. Probably.", "var(--v13-magenta)", "-0.8deg"],
              ].map(([k, v, bg, rot]) => (
                <div key={k} className="v13-sticky v13-sticky-wide" style={{ ["--v13-sticky" as never]: bg, transform: `rotate(${rot})` }}>
                  <p className="v13-sticky-k">{k}</p>
                  <p className="v13-sticky-t">{v}</p>
                </div>
              ))}
            </aside>
          </div>
        </div>
      </section>

      <section id="crumbs" ref={crumbsRef} className="border-t border-black/10 px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1520px]">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="v13-panel">
              <p className="v13-kicker">MEET.CRUMBS</p>
              <h2 className="v13-h2">Dry, cozy, observant.</h2>
              <p className="v13-small">Crumbs is a lounge-cat witness. He appears as margin notes and “system messages.”</p>
              <div className="mt-8 flex flex-wrap gap-3">
                {["Crumbs saved you a spot.", "Showing up counts.", "You can leave after an hour."].map((line) => (
                  <span key={line} className="v13-pill">
                    {line}
                  </span>
                ))}
              </div>
            </div>

            <div className="v13-polaroid-wall">
              <figure className="v13-polaroid v13-p-d">
                <img className="v13-img" src={u.pottery} alt="Hands shaping clay on a pottery wheel." loading="lazy" decoding="async" />
                <figcaption className="v13-cap">Photo via Unsplash.</figcaption>
              </figure>
              <figure className="v13-polaroid v13-p-e">
                <img className="v13-img" src={u.coffee} alt="Coffee and pastry on a table by a window." loading="lazy" decoding="async" />
                <figcaption className="v13-cap">Photo via Unsplash.</figcaption>
              </figure>
              <figure className="v13-polaroid v13-p-f">
                <img className="v13-img" src={u.mural} alt="A sunny street scene featuring a dragon mural." loading="lazy" decoding="async" />
                <figcaption className="v13-cap">Photo via Unsplash.</figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      <section id="cta" ref={ctaRef} className="border-t border-black/10 bg-[var(--v13-off)] px-5 pb-20 pt-14 md:px-10 md:pb-28">
        <div className="mx-auto max-w-[1520px]">
          <div className="v13-cta">
            <p className="v13-kicker">JOIN.SEASON</p>
            <h2 className="v13-h2">Join the season. Show up twice.</h2>
            <p className="v13-small">
              This is a design exploration page. No backend logic is added. Motion respects reduced-motion preferences.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/sign-up" className="v13-btn v13-btn-solid v13-btn-dark">
                Create an account
              </Link>
              <Link href="/sign-in" className="v13-btn v13-btn-outline v13-btn-dark-outline">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

