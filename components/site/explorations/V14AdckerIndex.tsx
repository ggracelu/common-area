"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

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

function useScrollPercent() {
  const [percent, setPercent] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => {
      if (raf.current != null) return;
      raf.current = window.requestAnimationFrame(() => {
        raf.current = null;
        const doc = document.documentElement;
        const scrollTop = window.scrollY || doc.scrollTop || 0;
        const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
        const p = (scrollTop / maxScroll) * 100;
        setPercent(Math.round(clamp(p, 0, 100)));
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf.current != null) window.cancelAnimationFrame(raf.current);
    };
  }, []);

  return percent;
}

function useInViewClass(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) node.classList.add("v14-inview");
    }, options);
    observer.observe(node);
    return () => observer.disconnect();
  }, [options]);

  return ref;
}

const u = {
  laughter:
    "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=2200&q=80",
  bulletin:
    "https://images.unsplash.com/photo-1741636174602-252cd7bb233c?auto=format&fit=crop&w=2200&q=80",
  coffee:
    "https://images.unsplash.com/photo-1766981934909-278a54cc1efd?auto=format&fit=crop&w=2200&q=80",
} as const;

export function V14AdckerIndexSite() {
  const reduced = useReducedMotion();
  const percent = useScrollPercent();

  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<0 | 1 | 2>(0);

  const heroRef = useInViewClass({ threshold: 0.25 });
  const cardsRef = useInViewClass({ threshold: 0.2 });
  const aboutRef = useInViewClass({ threshold: 0.2 });
  const ctaRef = useInViewClass({ threshold: 0.2 });

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const accents = useMemo(
    () => ["#E9FF6B", "#FF3B2E", "#1A5CFF", "#FFB800", "#FF2FB8"],
    [],
  );

  return (
    <main
      className={`v14-root min-h-screen ${menuOpen ? "v14-no-scroll" : ""}`}
      style={
        {
          "--v14-ink": "#0b0b0b",
          "--v14-paper": "#ffffff",
          "--v14-line": "rgba(0,0,0,0.12)",
          "--v14-muted": "rgba(0,0,0,0.62)",
          "--v14-mono":
            '"SFMono-Regular","SF Mono","Lucida Console",Consolas,"Liberation Mono",monospace',
          "--v14-sans": 'system-ui,-apple-system,"Segoe UI",Helvetica,Arial,sans-serif',
          "--v14-serif":
            '"Iowan Old Style","Palatino Linotype","Book Antiqua",Georgia,serif',
          "--v14-a": accents[0],
          "--v14-b": accents[1],
          "--v14-c": accents[2],
          "--v14-d": accents[3],
          "--v14-e": accents[4],
        } as React.CSSProperties
      }
    >
      <header className="v14-top">
        <div className="v14-top-left" aria-hidden="true">
          <span className="v14-paren">(</span>
          <span className="v14-paren">)</span>
        </div>

        <div className="v14-top-center">
          <span className="v14-percent">{percent} %</span>
        </div>

        <div className="v14-top-right">
          <button
            type="button"
            className="v14-menu"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="v14-menu-panel"
          >
            {menuOpen ? "Close" : "Menu"} {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      <div
        id="v14-menu-panel"
        className={`v14-panel ${menuOpen ? "v14-panel-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="v14-panel-inner">
          <div className="v14-panel-top">
            <span className="v14-paren">( Menu )</span>
            <button type="button" className="v14-panel-close" onClick={() => setMenuOpen(false)}>
              Close
            </button>
          </div>

          <nav className="v14-panel-nav">
            <Link href="/" className="v14-panel-link">
              ( Gallery )
            </Link>
            <a href="#services" className="v14-panel-link" onClick={() => setMenuOpen(false)}>
              ( What we do )
            </a>
            <a href="#about" className="v14-panel-link" onClick={() => setMenuOpen(false)}>
              ( Who we are )
            </a>
            <a href="#cta" className="v14-panel-link" onClick={() => setMenuOpen(false)}>
              ( Get in touch )
            </a>
          </nav>

          <div className="v14-panel-footer">
            <Link href="/sign-up" className="v14-panel-cta">
              Reach out →
            </Link>
            <p className="v14-panel-note">Press Escape to close.</p>
          </div>
        </div>
      </div>

      <section ref={heroRef} className="v14-hero">
        <div className="v14-container">
          <div className="v14-hero-grid">
            <div>
              <p className="v14-crumb">
                Index <span className="v14-dot" aria-hidden="true" /> Home
              </p>
              <h1 className="v14-h1">
                The art <span className="v14-italic">of</span> showing up.
              </h1>
              <p className="v14-lede">
                Common Area turns your city into a campus through recurring, interest-driven cohorts hosted by local
                businesses. It’s built for community that feels real, not performative.
              </p>

              <div className="v14-hero-actions">
                <Link href="/sign-up" className="v14-btn v14-btn-solid">
                  Save me a spot →
                </Link>
                <a href="#services" className="v14-btn v14-btn-outline">
                  See the system →
                </a>
              </div>
            </div>

            <aside className="v14-aside" aria-label="Highlights">
              <div className="v14-tag" style={{ ["--v14-accent" as never]: "var(--v14-a)" }}>
                ( community )
              </div>
              <div className="v14-tag" style={{ ["--v14-accent" as never]: "var(--v14-c)" }}>
                ( authenticity )
              </div>
              <div className="v14-tag" style={{ ["--v14-accent" as never]: "var(--v14-b)" }}>
                ( connection through play )
              </div>
              <p className="v14-meta">
                Crumbs says: “You can leave after an hour.” <span className="v14-muted">(He means it.)</span>
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section id="services" ref={cardsRef} className="v14-section">
        <div className="v14-container">
          <div className="v14-services">
            <div className="v14-services-head">
              <p className="v14-small">For</p>
              <h2 className="v14-h2">Our pillars</h2>
              <p className="v14-note">
                Adcker-style interaction, but Common Area content. Tap a card to focus; hover for micro motion.
              </p>
            </div>

            <div className="v14-cards" role="tablist" aria-label="Pillars">
              {[
                {
                  title: "Community",
                  kicker: "← Click me",
                  accent: "var(--v14-a)",
                  body:
                    "Community is mostly repeated presence. A season gives you a shared timeframe and local spots that become campus buildings.",
                  img: u.bulletin,
                },
                {
                  title: "Authenticity",
                  kicker: "Click me →",
                  accent: "var(--v14-b)",
                  body:
                    "No swiping, no bio theater. The structure gives you something real to return to — and permission to be normal.",
                  img: u.coffee,
                },
                {
                  title: "Play",
                  kicker: "← Click me",
                  accent: "var(--v14-c)",
                  body:
                    "Connection through play: pottery, cooking, comedy, city walks. The activity does the awkward part for you.",
                  img: u.laughter,
                },
              ].map((card, index) => {
                const isActive = active === index;
                return (
                  <button
                    key={card.title}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`v14-card ${isActive ? "v14-card-active" : ""}`}
                    onClick={() => setActive(index as 0 | 1 | 2)}
                    style={{ ["--v14-accent" as never]: card.accent }}
                  >
                    <div className="v14-card-top">
                      <p className="v14-card-k">{card.title}</p>
                      <p className="v14-card-cta">{card.kicker}</p>
                    </div>
                    <div className="v14-card-img" aria-hidden="true">
                      <img
                        src={card.img}
                        alt=""
                        className="v14-img"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <p className="v14-card-b">{card.body}</p>
                    <span className="v14-card-more">Read more →</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="about" ref={aboutRef} className="v14-section v14-section-alt">
        <div className="v14-container">
          <h3 className="v14-h3">
            In a world where everyone is trying to do everything, we choose to build a social rhythm people can actually keep.
          </h3>
          <p className="v14-lede v14-lede-tight">
            Common Area is a season. A deposit. Four picks. A cohort. Then you return. That’s it. That’s the trick.
          </p>

          <div className="v14-steps">
            {["( 01 )", "( 02 )", "( 03 )", "( 04 )", "( 05 )"].map((step, index) => (
              <div key={step} className="v14-step" style={{ animationDelay: reduced ? "0ms" : `${index * 80}ms` }}>
                {step}
              </div>
            ))}
          </div>

          <div className="v14-about-actions">
            <Link href="/sign-up" className="v14-btn v14-btn-solid">
              Join the Chicago season →
            </Link>
            <Link href="/sign-in" className="v14-btn v14-btn-outline">
              Sign in →
            </Link>
          </div>
        </div>
      </section>

      <section id="cta" ref={ctaRef} className="v14-section v14-section-cta">
        <div className="v14-container">
          <h2 className="v14-h2">Don’t be shy. Join the season.</h2>
          <p className="v14-lede v14-lede-tight">
            Design exploration only — no backend logic added. Photos via Unsplash.
          </p>
          <div className="v14-hero-actions">
            <Link href="/sign-up" className="v14-btn v14-btn-solid">
              Create an account →
            </Link>
            <Link href="/sign-in" className="v14-btn v14-btn-outline">
              Sign in →
            </Link>
          </div>
        </div>
      </section>

      <footer className="v14-footer">
        <div className="v14-container v14-footer-inner">
          <p className="v14-footer-left">© {new Date().getFullYear()} Common Area</p>
          <p className="v14-footer-right">
            By ( you ) <span aria-hidden="true">•</span> Crumbs saved you a spot.
          </p>
        </div>
      </footer>
    </main>
  );
}

