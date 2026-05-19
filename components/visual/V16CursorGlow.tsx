"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

type Cursor = { x: number; y: number };

function usePrefersReducedMotion() {
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

function usePointerCursor() {
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

type V16CursorGlowProps = {
  className?: string;
};

/** Colorful pointer glow from the V16 landing page (`v16-cursor` in globals.css). */
export function V16CursorGlow({ className = "" }: V16CursorGlowProps) {
  const reduced = usePrefersReducedMotion();
  const cursor = usePointerCursor();

  if (reduced) return null;

  const style = {
    "--cx": `${cursor.x}px`,
    "--cy": `${cursor.y}px`,
  } as CSSProperties;

  return <div className={["v16-cursor", className].filter(Boolean).join(" ")} style={style} aria-hidden="true" />;
}
