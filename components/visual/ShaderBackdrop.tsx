"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore, type ReactNode } from "react";

const ShaderScene = dynamic(() => import("./ShaderScene").then((mod) => mod.ShaderScene), {
  ssr: false,
});

function subscribeToReducedMotion(onStoreChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return true;
}

type ShaderBackdropProps = {
  children?: ReactNode;
  className?: string;
};

export function ShaderBackdrop({ children, className = "" }: ShaderBackdropProps) {
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!reducedMotion ? (
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-70">
          <ShaderScene />
        </div>
      ) : (
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(233,255,107,0.35),rgba(26,92,255,0.18),rgba(255,47,184,0.12))]"
          aria-hidden
        />
      )}
      {children}
    </div>
  );
}
