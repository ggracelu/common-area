"use client";

import Link from "next/link";
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
      if (entry.isIntersecting) node.classList.add("v16-inview");
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

function PixelCrumbsFullBody({ reduced }: { reduced: boolean }) {
  // 3-pose loop: lick → curl → nap (CSS controlled)
  return (
    <div className={`v16-crumbs ${reduced ? "v16-crumbs-static" : ""}`} aria-label="Crumbs the Cat, pixel mascot">
      <svg
        className="v16-crumbs-svg"
        viewBox="0 0 64 48"
        role="img"
        aria-label="Pixel cat mascot"
      >
        <defs>
          <filter id="v16Shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.22)" />
          </filter>
          <pattern id="v16TabbyStripes" width="8" height="8" patternUnits="userSpaceOnUse">
            <rect width="8" height="8" fill="#cfcfcf" />
            <rect x="1" y="1" width="6" height="1.6" fill="#9b9b9b" opacity="0.85" />
            <rect x="0.8" y="4.2" width="6.4" height="1.6" fill="#8e8e8e" opacity="0.75" />
          </pattern>
        </defs>

        {/* Pose A: sitting / licking paw */}
        <g className="v16-pose v16-pose-lick" filter="url(#v16Shadow)">
          {/* Body */}
          <rect x="18" y="20" width="28" height="16" rx="3" fill="url(#v16TabbyStripes)" />
          <rect x="20" y="28" width="10" height="8" rx="2" fill="#e7e7e7" opacity="0.9" />
          {/* Head + ears */}
          <rect x="22" y="10" width="20" height="14" rx="3" fill="#d6d6d6" />
          <rect x="22" y="8" width="5" height="5" rx="1" fill="#d6d6d6" />
          <rect x="37" y="8" width="5" height="5" rx="1" fill="#d6d6d6" />
          <rect x="24" y="12" width="16" height="5" rx="2" fill="#b7b7b7" opacity="0.55" />
          {/* Face */}
          <rect x="26" y="15" width="3" height="3" fill="#0a0a0a" />
          <rect x="35" y="15" width="3" height="3" fill="#0a0a0a" />
          <rect x="31" y="18" width="2" height="2" fill="#0a0a0a" opacity="0.85" />
          <rect x="30" y="20" width="4" height="2" fill="#ff3b2e" opacity="0.9" />
          {/* Paw up (lick) */}
          <g className="v16-paw">
            <rect x="41" y="22" width="7" height="7" rx="2" fill="#dcdcdc" />
            <rect x="43" y="24" width="3" height="2" fill="#0a0a0a" opacity="0.16" />
          </g>
          {/* Feet */}
          <rect x="22" y="34" width="7" height="4" rx="1" fill="#dcdcdc" />
          <rect x="34" y="34" width="7" height="4" rx="1" fill="#dcdcdc" />
          {/* Tail (striped) */}
          <g className="v16-tail">
            <rect x="14" y="26" width="7" height="4" rx="1" fill="#bdbdbd" />
            <rect x="10" y="28" width="6" height="4" rx="1" fill="#b3b3b3" />
            <rect x="12" y="28" width="2" height="4" fill="#8f8f8f" opacity="0.55" />
            <rect x="17" y="26" width="2" height="4" fill="#8f8f8f" opacity="0.55" />
          </g>
        </g>

        {/* Pose B: curled up */}
        <g className="v16-pose v16-pose-curl" filter="url(#v16Shadow)">
          {/* Curled body */}
          <rect x="16" y="18" width="32" height="20" rx="10" fill="url(#v16TabbyStripes)" />
          <rect x="20" y="22" width="18" height="10" rx="6" fill="#e8e8e8" opacity="0.9" />
          {/* Head nestled */}
          <rect x="24" y="14" width="16" height="10" rx="5" fill="#d7d7d7" />
          <rect x="24" y="13" width="4" height="4" rx="1" fill="#d7d7d7" />
          <rect x="36" y="13" width="4" height="4" rx="1" fill="#d7d7d7" />
          {/* Face (sleepy) */}
          <rect x="27" y="18" width="3" height="1.6" fill="#0a0a0a" opacity="0.55" />
          <rect x="34" y="18" width="3" height="1.6" fill="#0a0a0a" opacity="0.55" />
          <rect x="31" y="20" width="2" height="2" fill="#0a0a0a" opacity="0.45" />
          {/* Tail wrap stripe */}
          <rect x="14" y="26" width="10" height="8" rx="4" fill="#bdbdbd" />
          <rect x="16" y="26" width="2" height="8" fill="#8f8f8f" opacity="0.55" />
        </g>

        {/* Pose C: nap (long loaf) */}
        <g className="v16-pose v16-pose-nap" filter="url(#v16Shadow)">
          {/* Loaf body */}
          <rect x="10" y="22" width="44" height="13" rx="7" fill="url(#v16TabbyStripes)" />
          <rect x="14" y="27" width="18" height="8" rx="4" fill="#e8e8e8" opacity="0.9" />
          {/* Head */}
          <rect x="20" y="15" width="18" height="11" rx="5" fill="#d7d7d7" />
          <rect x="20" y="13" width="5" height="5" rx="1" fill="#d7d7d7" />
          <rect x="33" y="13" width="5" height="5" rx="1" fill="#d7d7d7" />
          {/* Closed eyes */}
          <rect x="24" y="19" width="3" height="1.5" fill="#0a0a0a" opacity="0.5" />
          <rect x="31" y="19" width="3" height="1.5" fill="#0a0a0a" opacity="0.5" />
          <rect x="28" y="21.2" width="2" height="1.5" fill="#0a0a0a" opacity="0.42" />
          {/* Slow breathing indicator */}
          <circle className="v16-zzz" cx="50" cy="18" r="2" fill="var(--v16-lime)" opacity="0.85" />
          <circle className="v16-zzz" cx="54" cy="14" r="1.6" fill="var(--v16-lime)" opacity="0.65" />
          <circle className="v16-zzz" cx="58" cy="10" r="1.2" fill="var(--v16-lime)" opacity="0.45" />
        </g>
      </svg>
    </div>
  );
}

export function V16CampusCrumbsSite() {
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
      className="v16-root min-h-screen"
      style={
        {
          "--v16-ink": palette.ink,
          "--v16-paper": palette.paper,
          "--v16-off": palette.off,
          "--v16-lime": palette.lime,
          "--v16-red": palette.red,
          "--v16-blue": palette.blue,
          "--v16-gold": palette.gold,
          "--v16-magenta": palette.magenta,
          "--v16-display":
            'system-ui,-apple-system,"Segoe UI",Helvetica,Arial,"Arial Black",sans-serif',
          "--v16-body": 'system-ui,-apple-system,"Segoe UI",Helvetica,Arial,sans-serif',
          "--v16-mono":
            '"Lucida Console","Courier New","SFMono-Regular","SF Mono",Consolas,"Liberation Mono",monospace',
        } as React.CSSProperties
      }
    >
      <div className="v16-cursor" style={cursorStyle} aria-hidden="true" />

      <header className="sticky top-0 z-20 border-b border-black/10 bg-white/82 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1520px] items-center justify-between gap-6 px-5 py-4 md:px-10">
          <Link href="/" className="flex items-center gap-4">
            <span className="v16-mark" aria-hidden="true">
              CA
            </span>
            <span className="v16-topline">Common Area</span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {[
              ["How it works", "#how"],
              ["Activities", "#activities"],
              ["Crumbs", "#crumbs"],
              ["Sign up", "#cta"],
            ].map(([label, href]) => (
              <a key={href} className="v16-navlink" href={href}>
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/sign-up" className="v16-btn v16-btn-solid text-xs">
              Sign up
            </Link>
          </div>
        </div>
      </header>

      <section ref={heroRef} className="px-5 pb-16 pt-10 md:px-10 md:pb-24 md:pt-14" style={scrollStyle}>
        <div className="mx-auto max-w-[1520px]">
          <div className="v16-hero-wrap">
            <div className="v16-hero-grid">
              <div className="v16-whoosh">
                <p className="v16-kicker">
                  CHICAGO SEASON <span aria-hidden="true">•</span> COHORTS <span aria-hidden="true">•</span> CAMPUS ENERGY
                </p>
                <h1 className="v16-h1">Turn your city into a campus.</h1>
                <p className="v16-lede">
                  Common Area creates recurring, interest-driven cohorts hosted by local businesses—so your neighborhood starts to feel like campus buildings.
                </p>

                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                  <Link href="/sign-up" className="v16-btn v16-btn-solid">
                    Save me a spot
                  </Link>
                  <a href="#how" className="v16-btn v16-btn-outline">
                    See how it works
                  </a>
                </div>

                <div className="mt-12 grid gap-3 md:grid-cols-3">
                  {[
                    ["Deposit", "$20", "Keeps the room from being empty.", "var(--v16-lime)"],
                    ["Pick", "4 of 6", "Overlap makes recognition happen.", "var(--v16-blue)"],
                    ["Cohort", "15–20", "A room you can return to.", "var(--v16-red)"],
                  ].map(([k, v, note, accent]) => (
                    <div key={k} className="v16-metric" style={{ ["--v16-accent" as never]: accent }}>
                      <p className="v16-metric-k">{k}</p>
                      <p className="v16-metric-v">{v}</p>
                      <p className="v16-metric-n">{note}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="v16-marquee" aria-hidden="true">
                  <div className="v16-marquee-track">
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

                {/* 3 photos total */}
                <div className="v16-collage">
                  <figure className="v16-polaroid v16-p-a">
                    <img className="v16-img" src={u.vinyl} alt="A vinyl record on a record player under warm light." loading="lazy" decoding="async" />
                    <figcaption className="v16-cap">Photo via Unsplash.</figcaption>
                  </figure>
                  <figure className="v16-polaroid v16-p-b">
                    <img className="v16-img" src={u.bulletin} alt="A bulletin board packed with posters and flyers." loading="lazy" decoding="async" />
                    <figcaption className="v16-cap">Photo via Unsplash.</figcaption>
                  </figure>
                  <figure className="v16-polaroid v16-p-c">
                    <img className="v16-img" src={u.laughter} alt="Friends laughing together under warm string lights." loading="lazy" decoding="async" />
                    <figcaption className="v16-cap">Photo via Unsplash.</figcaption>
                  </figure>

                  <aside className="v16-sticky v16-s-1">
                    <p className="v16-sticky-k">Crumbs note</p>
                    <p className="v16-sticky-t">“No swiping. Just show up.”</p>
                  </aside>

                  <div className="v16-icon-row" aria-label="Icons">
                    <img src="/streamline/pixel/calendar.svg" alt="" className="v16-icon" aria-hidden="true" />
                    <img src="/streamline/pixel/compass.svg" alt="" className="v16-icon" aria-hidden="true" />
                    <img src="/streamline/pixel/pin.svg" alt="" className="v16-icon" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </div>

            <div className="v16-scanlines" aria-hidden="true" />
          </div>
        </div>
      </section>

      <section id="how" ref={howRef} className="border-t border-black/10 bg-[var(--v16-off)] px-5 py-16 md:px-10 md:py-24" style={scrollStyle}>
        <div className="mx-auto max-w-[1520px]">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="v16-panel v16-whoosh">
              <p className="v16-kicker">How it works</p>
              <h2 className="v16-h2">A season gives the city a schedule.</h2>
              <p className="v16-small">No swiping, no surveys. Just sign up and show up.</p>
            </div>

            <ol className="grid gap-4">
              {[
                ["Sign up", "Join the Chicago season and claim a spot."],
                ["Pick 4 activities", "Choose four plans built around neighborhoods and local businesses."],
                ["Come back to familiar faces", "Overlap makes recognition happen on purpose."],
              ].map(([title, body], index) => (
                <li key={title} className="v16-step" style={{ animationDelay: `${index * 90}ms` }}>
                  <p className="v16-step-k">Step {index + 1}</p>
                  <p className="v16-step-t">{title}</p>
                  <p className="v16-step-b">{body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="activities" ref={actRef} className="border-t border-black/10 px-5 py-16 md:px-10 md:py-24" style={scrollStyle}>
        <div className="mx-auto max-w-[1520px]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="v16-whoosh">
              <p className="v16-kicker">Activity preview</p>
              <h2 className="v16-h2">Connection through play.</h2>
              <p className="v16-small">Pottery. Cooking. Comedy. City walks. A reason to leave the house that isn’t networking.</p>
            </div>
            <p className="v16-micro">Photos via Unsplash • Design-only exploration</p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["Pottery night", "Logan Square", u.pottery, "var(--v16-gold)"],
              ["Coffee crawl", "Wicker Park", u.coffee, "var(--v16-magenta)"],
              ["Mural walk", "Pilsen", u.mural, "var(--v16-blue)"],
              ["Record player night", "Common room", u.vinyl, "var(--v16-lime)"],
            ].map(([title, place, img, accent]) => (
              <article key={title} className="v16-mini" style={{ ["--v16-accent" as never]: accent }}>
                <div className="v16-mini-top">
                  <p className="v16-mini-k">{place}</p>
                  <p className="v16-mini-t">{title}</p>
                </div>
                <div className="v16-mini-img">
                  <img className="v16-img" src={img} alt={`${title} in ${place}.`} loading="lazy" decoding="async" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="crumbs" ref={crumbsRef} className="border-t border-black/10 bg-[var(--v16-off)] px-5 py-16 md:px-10 md:py-24" style={scrollStyle}>
        <div className="mx-auto max-w-[1520px]">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="v16-panel v16-whoosh">
              <p className="v16-kicker">Meet Crumbs</p>
              <h2 className="v16-h2">Your resident lounge cat.</h2>
              <p className="v16-small">Here to guide you through onboarding and any questions you have.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                {["Ask a question.", "Find your cohort.", "Showing up counts."].map((line) => (
                  <span key={line} className="v16-pill">
                    {line}
                  </span>
                ))}
              </div>
            </div>

            <div className="v16-crumbs-board">
              <PixelCrumbsFullBody reduced={reduced} />
              <div className="v16-mice">
                <div className="v16-mouse-card">
                  <img src="/streamline/pixel/mouse.svg" alt="" className="v16-mouse-icon" aria-hidden="true" />
                  <div>
                    <p className="v16-mouse-k">Mice caught</p>
                    <p className="v16-mouse-v">3</p>
                  </div>
                </div>
                <div className="v16-mouse-card">
                  <img src="/streamline/pixel/mouse.svg" alt="" className="v16-mouse-icon" aria-hidden="true" />
                  <div>
                    <p className="v16-mouse-k">Fun fact</p>
                    <p className="v16-mouse-v">Cats nap ~16h/day</p>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-xs font-black uppercase tracking-[0.22em] text-black/55" style={{ fontFamily: "var(--v16-mono)" }}>
                Pixel icons via Streamline Pixel (CC BY 4.0).
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="cta" ref={ctaRef} className="border-t border-black/10 px-5 pb-20 pt-14 md:px-10 md:pb-28" style={scrollStyle}>
        <div className="mx-auto max-w-[1520px]">
          <div className="v16-cta v16-whoosh">
            <p className="v16-kicker">Ready?</p>
            <h2 className="v16-h2">No swiping, no surveys. Just sign up and show up.</h2>
            <p className="v16-small">Design exploration only — no backend logic added. Photos via Unsplash.</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/sign-up" className="v16-btn v16-btn-solid v16-btn-dark">
                Create an account
              </Link>
              <Link href="/sign-in" className="v16-btn v16-btn-outline v16-btn-dark-outline">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

