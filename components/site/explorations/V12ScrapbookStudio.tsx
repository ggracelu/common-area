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

function useInViewClass(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) node.classList.add("v12-inview");
    }, options);
    observer.observe(node);
    return () => observer.disconnect();
  }, [options]);

  return ref;
}

const u = {
  bulletin: "https://images.unsplash.com/photo-1741636174602-252cd7bb233c?auto=format&fit=crop&w=2200&q=80",
  laughter: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=2200&q=80",
  coffee: "https://images.unsplash.com/photo-1766981934909-278a54cc1efd?auto=format&fit=crop&w=2200&q=80",
  pottery: "https://images.unsplash.com/photo-1760018861921-43af85ea6c4f?auto=format&fit=crop&w=2200&q=80",
  vinyl: "https://images.unsplash.com/photo-1709649246219-220dfca6f75a?auto=format&fit=crop&w=2200&q=80",
  mural: "https://images.unsplash.com/photo-1754079132860-5b37dab49daa?auto=format&fit=crop&w=2200&q=80",
} as const;

export function V12ScrapbookStudioSite() {
  const reduced = useReducedMotion();
  const cursor = useCursor();

  const accents = useMemo(() => {
    return {
      ink: "#151211",
      paper: "#ffffff",
      warm: "#f6efe6",
      lime: "#E9FF6B",
      rust: "#bd623f",
      sky: "#1A5CFF",
      butter: "#f2cb71",
      blush: "#e8c2b8",
      moss: "#677255",
    };
  }, []);

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
      className="v12-root min-h-screen"
      style={
        {
          "--v12-ink": accents.ink,
          "--v12-paper": accents.paper,
          "--v12-warm": accents.warm,
          "--v12-lime": accents.lime,
          "--v12-rust": accents.rust,
          "--v12-sky": accents.sky,
          "--v12-butter": accents.butter,
          "--v12-blush": accents.blush,
          "--v12-moss": accents.moss,
          "--v12-display":
            '"Iowan Old Style","Palatino Linotype","Book Antiqua",Georgia,serif',
          "--v12-body":
            '"Avenir Next","Helvetica Neue","Segoe UI",system-ui,-apple-system,Arial,sans-serif',
          "--v12-mono":
            '"SFMono-Regular","SF Mono",Consolas,"Liberation Mono",monospace',
        } as React.CSSProperties
      }
    >
      <div className="v12-cursor" style={cursorStyle} aria-hidden="true" />

      <header className="sticky top-0 z-20 border-b border-black/10 bg-white/78 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-6 px-5 py-4 md:px-10">
          <div className="flex items-center gap-4">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--v12-rust)] text-sm font-black text-white shadow-[0_18px_54px_rgba(189,98,63,0.24)]">
              🐈
            </span>
            <div className="leading-tight">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--v12-ink)]">Common Area</p>
              <p className="text-xs text-black/55">Scrapbook studio exploration</p>
            </div>
          </div>

          <nav className="hidden items-center gap-7 text-xs font-black uppercase tracking-[0.22em] text-black/60 md:flex">
            <a href="#how" className="v12-link">
              How it works
            </a>
            <a href="#activities" className="v12-link">
              Activities
            </a>
            <a href="#cohort" className="v12-link">
              Cohort
            </a>
            <a href="#crumbs" className="v12-link">
              Crumbs
            </a>
            <a href="#cta" className="v12-link">
              Join
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/" className="v12-btn v12-btn-ghost text-xs">
              Gallery
            </Link>
            <Link href="/sign-up" className="v12-btn v12-btn-solid text-xs">
              Save me a spot
            </Link>
          </div>
        </div>
      </header>

      <section ref={heroRef} className="px-5 pb-14 pt-10 md:px-10 md:pb-20 md:pt-14">
        <div className="mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <p className="v12-kicker">
              Chicago season preview <span aria-hidden="true">•</span> cohorts <span aria-hidden="true">•</span> repeat visits
            </p>
            <h1 className="v12-h1">
              Turn your city into a campus
              <span className="v12-italic"> again</span>.
            </h1>
            <p className="v12-lede">
              Common Area is a seasonal, cohort-based social platform. Pick a few plans. See the same people twice. Let the city feel familiar.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/sign-up" className="v12-btn v12-btn-solid">
                Join the season
              </Link>
              <a href="#how" className="v12-btn v12-btn-outline">
                See how it works
              </a>
            </div>

            <div className="mt-12 grid gap-3 md:grid-cols-3">
              {[
                ["Deposit", "$20", "Keeps the room from being empty."],
                ["Choose", "4 of 6", "Overlap makes recognition happen."],
                ["Cohort", "15–20", "A room you can return to."],
              ].map(([k, v, note]) => (
                <div key={k} className="v12-metric">
                  <p className="v12-metric-k">{k}</p>
                  <p className="v12-metric-v">{v}</p>
                  <p className="v12-metric-n">{note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="v12-banner" aria-hidden="true">
              <div className="v12-banner-track">
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

            <div className="v12-collage mt-10">
              <figure className="v12-polaroid v12-polaroid-a">
                <img className="v12-img" src={u.bulletin} alt="A bulletin board packed with posters and flyers." loading="lazy" decoding="async" />
                <figcaption className="v12-caption">Photo via Unsplash.</figcaption>
              </figure>
              <figure className="v12-polaroid v12-polaroid-b">
                <img className="v12-img" src={u.laughter} alt="Friends laughing together under warm string lights." loading="lazy" decoding="async" />
                <figcaption className="v12-caption">Photo via Unsplash.</figcaption>
              </figure>
              <figure className="v12-polaroid v12-polaroid-c">
                <img className="v12-img" src={u.coffee} alt="Coffee and pastry on a table by a window." loading="lazy" decoding="async" />
                <figcaption className="v12-caption">Photo via Unsplash.</figcaption>
              </figure>

              <aside className="v12-postit v12-postit-1">
                <p className="v12-postit-k">Crumbs note</p>
                <p className="v12-postit-t">
                  “Showing up counts.”
                  <span className="v12-postit-italic"> Especially the second time.</span>
                </p>
              </aside>
              <aside className="v12-postit v12-postit-2">
                <p className="v12-postit-k">Promise</p>
                <p className="v12-postit-t">
                  Familiar faces over first-impression theater.
                </p>
              </aside>
            </div>
          </div>
        </div>
      </section>

      <section id="how" ref={howRef} className="border-t border-black/10 bg-[color:rgba(246,239,230,0.6)] px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="v12-panel">
              <p className="v12-kicker">How it works</p>
              <h2 className="v12-h2">
                Three steps.
                <span className="v12-italic"> Then repetition.</span>
              </h2>
              <p className="v12-small">
                This exploration leans into a scrapbook studio: big serif statements, small calm body, and tactile “notes” that never cover core reading content.
              </p>
            </div>

            <ol className="grid gap-4">
              {[
                ["Join the Chicago season", "Create an account and claim a spot."],
                ["Pick four activities", "Choose four plans built around real neighborhoods."],
                ["Come back to familiar faces", "Overlap makes recognition happen on purpose."],
              ].map(([title, body], index) => (
                <li key={title} className="v12-step" style={{ animationDelay: `${index * 80}ms` }}>
                  <p className="v12-step-k">Step {index + 1}</p>
                  <p className="v12-step-t">{title}</p>
                  <p className="v12-step-b">{body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="activities" ref={actRef} className="border-t border-black/10 px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1500px]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="v12-kicker">Activity preview</p>
              <h2 className="v12-h2">
                Connection through play,
                <span className="v12-italic"> not performance.</span>
              </h2>
              <p className="v12-small">
                Hover the collage. The photos “zoom” like you’re leaning closer to a bulletin board.
              </p>
            </div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-black/55" style={{ fontFamily: "var(--v12-mono)" }}>
              Photos via Unsplash
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["Pottery night", "Logan Square", u.pottery, "var(--v12-blush)"],
              ["Record player night", "Common room", u.vinyl, "var(--v12-butter)"],
              ["Mural walk", "Pilsen", u.mural, "var(--v12-sky)"],
              ["Coffee crawl", "Wicker Park", u.coffee, "var(--v12-warm)"],
            ].map(([title, place, img, tint]) => (
              <article key={title} className="v12-mini" style={{ ["--v12-tint" as never]: tint }}>
                <div className="v12-mini-top">
                  <p className="v12-mini-k">{place}</p>
                  <p className="v12-mini-t">{title}</p>
                </div>
                <div className="v12-mini-img">
                  <img className="v12-img" src={img} alt={`${title} in ${place}.`} loading="lazy" decoding="async" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="cohort" ref={cohortRef} className="border-t border-black/10 bg-[color:rgba(255,255,255,0.9)] px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div className="v12-panel">
              <p className="v12-kicker">Cohort/community</p>
              <h2 className="v12-h2">
                A city with classmates
                <span className="v12-italic"> again.</span>
              </h2>
              <p className="v12-small">
                Cohorts are about familiarity, not exclusivity: 15–20 people with overlapping picks so the city stops feeling random.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  ["Repeated presence", "The second time is easier."],
                  ["Local businesses", "They become the campus buildings."],
                  ["Playful structure", "Activity gives the conversation a shape."],
                ].map(([k, v]) => (
                  <div key={k} className="v12-chip">
                    <p className="v12-chip-k">{k}</p>
                    <p className="v12-chip-v">{v}</p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="v12-postit-board">
              <div className="v12-postit v12-postit-wide">
                <p className="v12-postit-k">Cohort logic</p>
                <p className="v12-postit-t">
                  About 15–20 people. Shared overlap. Enough consistency to feel real.
                </p>
              </div>
              <div className="v12-postit v12-postit-wide v12-postit-alt">
                <p className="v12-postit-k">Low pressure rule</p>
                <p className="v12-postit-t">
                  You don’t have to “crush” social life. You just have to return.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section id="crumbs" ref={crumbsRef} className="border-t border-black/10 bg-[color:rgba(246,239,230,0.6)] px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="v12-panel">
              <p className="v12-kicker">Meet Crumbs</p>
              <h2 className="v12-h2">
                Dry, cozy, observant.
                <span className="v12-italic"> Never trying too hard.</span>
              </h2>
              <p className="v12-small">
                Crumbs shows up as a note in the margins — comfort-copy, not mascot overload.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {["Crumbs saved you a spot.", "You can leave after an hour.", "Your couch will forgive you."].map((line) => (
                  <span key={line} className="v12-pill">
                    {line}
                  </span>
                ))}
              </div>
            </div>

            <div className="v12-polaroid-wall">
              <figure className="v12-polaroid v12-polaroid-d">
                <img className="v12-img" src={u.pottery} alt="Hands shaping clay on a pottery wheel." loading="lazy" decoding="async" />
                <figcaption className="v12-caption">Photo via Unsplash.</figcaption>
              </figure>
              <figure className="v12-polaroid v12-polaroid-e">
                <img className="v12-img" src={u.vinyl} alt="A vinyl record on a record player under warm light." loading="lazy" decoding="async" />
                <figcaption className="v12-caption">Photo via Unsplash.</figcaption>
              </figure>
              <aside className="v12-postit v12-postit-crumbs">
                <p className="v12-postit-k">Crumbs says</p>
                <p className="v12-postit-t">
                  “Repeated presence beats first‑impression theater.”
                </p>
              </aside>
            </div>
          </div>
        </div>
      </section>

      <section id="cta" ref={ctaRef} className="border-t border-black/10 px-5 pb-20 pt-14 md:px-10 md:pb-28">
        <div className="mx-auto max-w-[1500px]">
          <div className="v12-cta">
            <p className="v12-kicker">Join</p>
            <h2 className="v12-h2">
              Join the season.
              <span className="v12-italic"> Show up twice.</span>
            </h2>
            <p className="v12-small">
              This is a design exploration page. No backend logic is added. Photos via Unsplash.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/sign-up" className="v12-btn v12-btn-solid v12-btn-dark">
                Create an account
              </Link>
              <Link href="/sign-in" className="v12-btn v12-btn-outline v12-btn-dark-outline">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

