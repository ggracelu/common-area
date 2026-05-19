"use client";

import { useEffect, useRef } from "react";

const CONFETTI_COLORS = ["#E9FF6B", "#FF3B2E", "#1A5CFF", "#FFB800", "#FF2FB8", "#ffffff"];

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  w: number;
  h: number;
  color: string;
  life: number;
};

type ConfettiBurstProps = {
  active: boolean;
  /** Viewport-relative origin (0–1). Defaults to envelope center. */
  originX?: number;
  originY?: number;
  className?: string;
};

export function ConfettiBurst({
  active,
  originX = 0.5,
  originY = 0.38,
  className = "",
}: ConfettiBurstProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hasFiredRef = useRef(false);

  useEffect(() => {
    if (!active || hasFiredRef.current) return;
    hasFiredRef.current = true;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const cx = window.innerWidth * originX;
    const cy = window.innerHeight * originY;

    const particles: Particle[] = Array.from({ length: 130 }, () => ({
      x: cx + (Math.random() - 0.5) * 100,
      y: cy + (Math.random() - 0.5) * 50,
      vx: (Math.random() - 0.5) * 16,
      vy: -10 - Math.random() * 14,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.4,
      w: 5 + Math.random() * 9,
      h: 3 + Math.random() * 7,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]!,
      life: 1,
    }));

    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let alive = 0;
      for (const particle of particles) {
        particle.vy += 0.38;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.99;
        particle.rot += particle.vr;
        particle.life = Math.max(0, 1 - elapsed / 3000);

        if (particle.life <= 0) continue;
        alive += 1;

        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rot);
        ctx.globalAlpha = particle.life;
        ctx.fillStyle = particle.color;
        ctx.fillRect(-particle.w / 2, -particle.h / 2, particle.w, particle.h);
        ctx.restore();
      }

      if (alive > 0 && elapsed < 3400) {
        raf = window.requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    raf = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(raf);
    };
  }, [active, originX, originY]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none fixed inset-0 z-[60] ${className}`.trim()}
      aria-hidden="true"
      data-testid="confetti-burst"
    />
  );
}
