"use client";

import Link from "next/link";
import { CommonAreaLogoLink } from "@/components/brand/CommonAreaLogo";
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

function useScrollProgress() {
  const [p, setP] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => {
      if (raf.current != null) return;
      raf.current = window.requestAnimationFrame(() => {
        raf.current = null;
        const doc = document.documentElement;
        const top = window.scrollY || doc.scrollTop || 0;
        const max = Math.max(1, doc.scrollHeight - window.innerHeight);
        setP(Math.min(1, Math.max(0, top / max)));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf.current != null) window.cancelAnimationFrame(raf.current);
    };
  }, []);

  return p;
}

function useInViewClass(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) node.classList.add("v15-inview");
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

export function V15CampusArcadeSite() {
  const reduced = useReducedMotion();
  const cursor = useCursor();
  const progress = useScrollProgress();

  const palette = useMemo(
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
  const crumbsRef = useInViewClass({ threshold: 0.2 });
  const ctaRef = useInViewClass({ threshold: 0.2 });

  const cursorStyle = reduced
    ? undefined
    : ({
        "--cx": `${cursor.x}px`,
        "--cy": `${cursor.y}px`,
      } as React.CSSProperties);

  const scrollStyle = reduced
    ? undefined
    : ({
        "--sp": `${progress}`,
      } as React.CSSProperties);

  return (
    <main
      className="v15-root min-h-screen"
      style={
        {
          "--v15-ink": palette.ink,
          "--v15-paper": palette.paper,
          "--v15-off": palette.off,
          "--v15-lime": palette.lime,
          "--v15-red": palette.red,
          "--v15-blue": palette.blue,
          "--v15-gold": palette.gold,
          "--v15-magenta": palette.magenta,
          "--v15-display":
            'system-ui,-apple-system,"Segoe UI",Helvetica,Arial,"Arial Black",sans-serif',
          "--v15-body": 'system-ui,-apple-system,"Segoe UI",Helvetica,Arial,sans-serif',
          "--v15-mono":
            '"Lucida Console","Courier New","SFMono-Regular","SF Mono",Consolas,"Liberation Mono",monospace',
        } as React.CSSProperties
      }
    >
      <div className="v15-cursor" style={cursorStyle} aria-hidden="true" />

      <header className="sticky top-0 z-20 border-b border-black/10 bg-white/82 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1520px] items-center justify-between gap-6 px-5 py-4 md:px-10">
          <CommonAreaLogoLink href="/">
            <span className="v15-topline">Common Area</span>
          </CommonAreaLogoLink>

          <nav className="hidden items-center gap-7 md:flex">
            {[
              ["How it works", "#how"],
              ["Activities", "#activities"],
              ["Crumbs", "#crumbs"],
              ["Sign up", "#cta"],
            ].map(([label, href]) => (
              <a key={href} className="v15-navlink" href={href}>
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/sign-up" className="v15-btn v15-btn-solid text-xs">
              Sign up
            </Link>
          </div>
        </div>
      </header>

      <section ref={heroRef} className="px-5 pb-16 pt-10 md:px-10 md:pb-24 md:pt-14" style={scrollStyle}>
        <div className="mx-auto max-w-[1520px]">
          <div className="v15-hero-wrap">
            <div className="v15-hero-grid">
              <div className="v15-whoosh">
                <p className="v15-kicker">
                  CHICAGO SEASON <span aria-hidden="true">•</span> COHORTS <span aria-hidden="true">•</span> CAMPUS ENERGY
                </p>
                <h1 className="v15-h1">Turn your city into a campus.</h1>
                <p className="v15-lede">
                  Common Area creates recurring, interest-driven cohorts hosted by local businesses—so your neighborhood starts to feel like campus buildings again.
                </p>

                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                  <Link href="/sign-up" className="v15-btn v15-btn-solid">
                    Save me a spot
                  </Link>
                  <a href="#how" className="v15-btn v15-btn-outline">
                    See how it works
                  </a>
                </div>

                <div className="mt-12 grid gap-3 md:grid-cols-3">
                  {[
                    ["Deposit", "$20", "Keeps the room from being empty.", "var(--v15-lime)"],
                    ["Pick", "4 of 6", "Overlap makes recognition happen.", "var(--v15-blue)"],
                    ["Cohort", "15–20", "A room you can return to.", "var(--v15-red)"],
                  ].map(([k, v, note, accent]) => (
                    <div key={k} className="v15-metric" style={{ ["--v15-accent" as never]: accent }}>
                      <p className="v15-metric-k">{k}</p>
                      <p className="v15-metric-v">{v}</p>
                      <p className="v15-metric-n">{note}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="v15-marquee" aria-hidden="true">
                  <div className="v15-marquee-track">
                    <span>COMMON AREA</span>
                    <span>NO SWIPING</span>
                    <span>SHOW UP</span>
                    <span>CAMPUS FEELING</span>
                    <span>COMMON AREA</span>
                    <span>NO SWIPING</span>
                    <span>SHOW UP</span>
                    <span>CAMPUS FEELING</span>
                  </div>
                </div>

                <div className="v15-collage">
                  <figure className="v15-polaroid v15-p-a">
                    <img className="v15-img" src={u.vinyl} alt="A vinyl record on a record player under warm light." loading="lazy" decoding="async" />
                    <figcaption className="v15-cap">Photo via Unsplash.</figcaption>
                  </figure>
                  <figure className="v15-polaroid v15-p-b">
                    <img className="v15-img" src={u.bulletin} alt="A bulletin board packed with posters and flyers." loading="lazy" decoding="async" />
                    <figcaption className="v15-cap">Photo via Unsplash.</figcaption>
                  </figure>
                  <figure className="v15-polaroid v15-p-c">
                    <img className="v15-img" src={u.laughter} alt="Friends laughing together under warm string lights." loading="lazy" decoding="async" />
                    <figcaption className="v15-cap">Photo via Unsplash.</figcaption>
                  </figure>
                  <figure className="v15-polaroid v15-p-d">
                    <img className="v15-img" src={u.coffee} alt="Coffee and pastry on a table by a window." loading="lazy" decoding="async" />
                    <figcaption className="v15-cap">Photo via Unsplash.</figcaption>
                  </figure>

                  <aside className="v15-sticky v15-s-1">
                    <p className="v15-sticky-k">Crumbs note</p>
                    <p className="v15-sticky-t">“No swiping. Just show up.”</p>
                  </aside>

                  <div className="v15-icon-row" aria-label="Icons">
                    <img src="/streamline/pixel/calendar.svg" alt="" className="v15-icon" aria-hidden="true" />
                    <img src="/streamline/pixel/compass.svg" alt="" className="v15-icon" aria-hidden="true" />
                    <img src="/streamline/pixel/pin.svg" alt="" className="v15-icon" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </div>

            <div className="v15-scanlines" aria-hidden="true" />
          </div>
        </div>
      </section>

      <section id="how" ref={howRef} className="border-t border-black/10 bg-[var(--v15-off)] px-5 py-16 md:px-10 md:py-24" style={scrollStyle}>
        <div className="mx-auto max-w-[1520px]">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="v15-panel v15-whoosh">
              <p className="v15-kicker">How it works</p>
              <h2 className="v15-h2">A season gives the city a schedule.</h2>
              <p className="v15-small">
                No swiping, no surveys. The structure does the awkward part; you just show up.
              </p>
            </div>

            <ol className="grid gap-4">
              {[
                ["Sign up", "Join the Chicago season and claim a spot."],
                ["Pick 4 activities", "Choose four plans built around neighborhoods and local businesses."],
                ["Come back to familiar faces", "Overlap makes recognition happen on purpose."],
              ].map(([title, body], index) => (
                <li key={title} className="v15-step" style={{ animationDelay: `${index * 90}ms` }}>
                  <p className="v15-step-k">Step {index + 1}</p>
                  <p className="v15-step-t">{title}</p>
                  <p className="v15-step-b">{body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="activities" ref={actRef} className="border-t border-black/10 px-5 py-16 md:px-10 md:py-24" style={scrollStyle}>
        <div className="mx-auto max-w-[1520px]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="v15-whoosh">
              <p className="v15-kicker">Activity preview</p>
              <h2 className="v15-h2">Connection through play.</h2>
              <p className="v15-small">Pottery. Cooking. Comedy. City walks. A reason to leave the house that isn’t networking.</p>
            </div>
            <p className="v15-micro">Photos via Unsplash • Design-only exploration</p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["Pottery night", "Logan Square", u.pottery, "var(--v15-gold)"],
              ["Coffee crawl", "Wicker Park", u.coffee, "var(--v15-magenta)"],
              ["Mural walk", "Pilsen", u.mural, "var(--v15-blue)"],
              ["Record player night", "Common room", u.vinyl, "var(--v15-lime)"],
            ].map(([title, place, img, accent]) => (
              <article key={title} className="v15-mini" style={{ ["--v15-accent" as never]: accent }}>
                <div className="v15-mini-top">
                  <p className="v15-mini-k">{place}</p>
                  <p className="v15-mini-t">{title}</p>
                </div>
                <div className="v15-mini-img">
                  <img className="v15-img" src={img} alt={`${title} in ${place}.`} loading="lazy" decoding="async" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="crumbs" ref={crumbsRef} className="border-t border-black/10 bg-[var(--v15-off)] px-5 py-16 md:px-10 md:py-24" style={scrollStyle}>
        <div className="mx-auto max-w-[1520px]">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="v15-panel v15-whoosh">
              <p className="v15-kicker">Meet Crumbs</p>
              <h2 className="v15-h2">Your resident lounge cat.</h2>
              <p className="v15-small">
                Crumbs is here to guide you through onboarding and answer questions. He also catches mice (sometimes).
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {["Ask a question.", "Find your cohort.", "Show up counts."].map((line) => (
                  <span key={line} className="v15-pill">
                    {line}
                  </span>
                ))}
              </div>
            </div>

            <div className="v15-crumbs-board">
              <div className="v15-pixel-cat" aria-hidden="true">
                <img src="/streamline/pixel/cat.svg" alt="" className="v15-pixel-cat-img" aria-hidden="true" />
              </div>
              <div className="v15-mice">
                <div className="v15-mouse-card">
                  <img src="/streamline/pixel/mouse.svg" alt="" className="v15-mouse-icon" aria-hidden="true" />
                  <div>
                    <p className="v15-mouse-k">Mice caught</p>
                    <p className="v15-mouse-v">3</p>
                  </div>
                </div>
                <div className="v15-mouse-card">
                  <img src="/streamline/pixel/mouse.svg" alt="" className="v15-mouse-icon" aria-hidden="true" />
                  <div>
                    <p className="v15-mouse-k">Fun fact</p>
                    <p className="v15-mouse-v">Cats nap ~16h/day</p>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-xs font-black uppercase tracking-[0.22em] text-black/55" style={{ fontFamily: "var(--v15-mono)" }}>
                Pixel icons via Streamline Pixel (CC BY 4.0).
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="cta" ref={ctaRef} className="border-t border-black/10 px-5 pb-20 pt-14 md:px-10 md:pb-28" style={scrollStyle}>
        <div className="mx-auto max-w-[1520px]">
          <div className="v15-cta v15-whoosh">
            <p className="v15-kicker">Ready?</p>
            <h2 className="v15-h2">No swiping, no surveys. Just sign up and show up.</h2>
            <p className="v15-small">Design exploration only — no backend logic added. Photos via Unsplash.</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/sign-up" className="v15-btn v15-btn-solid v15-btn-dark">
                Create an account
              </Link>
              <Link href="/sign-in" className="v15-btn v15-btn-outline v15-btn-dark-outline">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

