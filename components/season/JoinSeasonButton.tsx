"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
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
        const data = await response.json();
        throw new Error(data.error || "Failed to create checkout session");
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
    return <ActionButton disabled>Loading...</ActionButton>;
  }

  if (!isSignedIn) {
    return <Button href="/sign-up">Join the Chicago season</Button>;
  }

  return (
    <div className="flex flex-col gap-2">
      <ActionButton onClick={handleJoin} disabled={isLoading}>
        {isLoading ? "Starting checkout..." : "Join the Chicago season"}
      </ActionButton>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
