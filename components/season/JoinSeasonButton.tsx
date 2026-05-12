"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { markMockDepositPaidAction } from "@/app/actions/onboarding";
import { Button } from "@/components/ui/Button";
import { ActionButton } from "@/components/ui/ActionButton";

export function JoinSeasonButton() {
  const { isSignedIn, isLoaded } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        if (response.status === 501) {
          const mock = await markMockDepositPaidAction();
          if (mock.ok) {
            window.location.reload();
            return;
          }
          throw new Error(mock.error || "Failed to record demo deposit");
        }
        throw new Error(data.error || "Failed to start checkout");
      }

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsLoading(false);
    }
  };

  if (!isLoaded) {
    return <ActionButton disabled>Loading…</ActionButton>;
  }

  if (!isSignedIn) {
    return <Button href="/sign-up">Join the Chicago season</Button>;
  }

  return (
    <div className="flex flex-col gap-2">
      <ActionButton onClick={handleJoin} disabled={isLoading} data-testid="join-season-deposit">
        {isLoading ? "Starting checkout…" : "Pay the $20 deposit"}
      </ActionButton>
      {error ? (
        <p className="text-sm text-[color:rgba(37,34,30,0.70)]">
          {error}
        </p>
      ) : null}
      <p className="text-xs text-[color:rgba(37,34,30,0.58)]">
        If Stripe isn’t configured in this environment, this will stay in demo mode.
      </p>
    </div>
  );
}

