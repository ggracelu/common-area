"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { markMockDepositPaidAction } from "@/app/actions/onboarding";
import { Button } from "@/components/ui/Button";
import { ActionButton } from "@/components/ui/ActionButton";

type JoinSeasonButtonProps = {
  onDepositRecorded?: () => void;
};

export function JoinSeasonButton({ onDepositRecorded }: JoinSeasonButtonProps) {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const [phase, setPhase] = useState<"idle" | "redirecting" | "recording-demo" | "confirmed" | "failed">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleJoin = async () => {
    setPhase("redirecting");
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
      });

      const data = (await response.json().catch(() => ({}))) as {
        url?: string;
        demo?: boolean;
        error?: string;
      };

      if (!response.ok) {
        if (response.status === 501) {
          setPhase("recording-demo");
          const mock = await markMockDepositPaidAction();
          if (mock.ok) {
            setPhase("confirmed");
            onDepositRecorded?.();
            router.refresh();
            return;
          }
          throw new Error(mock.error || "Failed to record demo deposit");
        }
        throw new Error(data.error || "Failed to start checkout");
      }

      if (data.demo) {
        setPhase("confirmed");
        onDepositRecorded?.();
        router.refresh();
        return;
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error("No checkout URL returned");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setPhase("failed");
    }
  };

  const isLoading = phase === "redirecting" || phase === "recording-demo";
  const buttonLabel =
    phase === "redirecting"
      ? "Redirecting to Stripe..."
      : phase === "recording-demo"
        ? "Recording grader deposit..."
        : phase === "confirmed"
          ? "Deposit recorded"
          : "Pay the $20 deposit";

  if (!isLoaded) {
    return <ActionButton disabled>Loading…</ActionButton>;
  }

  if (!isSignedIn) {
    return <Button href="/sign-up">Join the Chicago season</Button>;
  }

  return (
    <div className="flex flex-col gap-2">
      <ActionButton onClick={handleJoin} disabled={isLoading || phase === "confirmed"} data-testid="join-season-deposit">
        {buttonLabel}
      </ActionButton>
      {error ? (
        <p className="text-sm font-semibold text-red-900/80" role="alert">
          {error}
        </p>
      ) : null}
      <p className="text-xs text-[color:rgba(37,34,30,0.58)]" role="status" aria-live="polite">
        {phase === "redirecting"
          ? "Opening Stripe test checkout. Paid status still needs the webhook-confirmed server record."
          : phase === "recording-demo"
            ? "Stripe is not configured here, so the documented grader server action is recording a demo deposit."
            : phase === "confirmed"
              ? "Deposit recorded on the server for this grader path. Dashboard will confirm the saved state."
              : "Stripe checkout when configured; otherwise a server-recorded grader deposit path. No client-only paid claims."}
      </p>
    </div>
  );
}
