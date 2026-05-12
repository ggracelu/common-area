"use client";

import { useClerk, useAuth } from "@clerk/nextjs";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

type PartnerAuthFreshSessionProps = {
  children: ReactNode;
};

export function PartnerAuthFreshSession({ children }: PartnerAuthFreshSessionProps) {
  const { signOut } = useClerk();
  const { isLoaded, isSignedIn } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      setReady(true);
      return;
    }

    let cancelled = false;
    void signOut({ redirectUrl: window.location.href })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) {
          setReady(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, signOut]);

  if (!isLoaded || !ready) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-6 py-16 text-sm text-black/65">
        Preparing partner sign-in…
      </div>
    );
  }

  return children;
}
