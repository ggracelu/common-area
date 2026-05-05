"use client";

import { useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Sticker } from "@/components/ui/Sticker";
import { demoData } from "@/lib/demo-data";
import { loadDemoState } from "@/lib/demo-state";

function fallbackNeighborhood(userId?: string | null) {
  if (!userId) return "Logan Square";
  const idx = Math.abs(
    userId.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0),
  );
  return demoData.users[idx % demoData.users.length]!.neighborhood;
}

export function ProfileHome() {
  const { user, isSignedIn } = useUser();
  const state = useMemo(() => loadDemoState(), []);
  const [promptIndex, setPromptIndex] = useState(0);

  const displayName =
    user?.fullName ?? user?.firstName ?? user?.username ?? "Guest (demo)";
  const email = user?.primaryEmailAddress?.emailAddress ?? "—";
  const avatarUrl = user?.imageUrl ?? null;
  const neighborhood = fallbackNeighborhood(user?.id);

  const promptDeck = [
    { q: "Choose your campus alter ego.", hint: "Be dramatic. It’s allowed." },
    { q: "What would your fake student club be called?", hint: "The more niche, the better." },
    { q: "Which snack best represents your communication style?", hint: "This is serious research." },
    { q: "Pick your emergency side-quest role.", hint: "Navigator? Snack finder? Hype person?" },
  ];
  const prompt = promptDeck[promptIndex % promptDeck.length]!;

  return (
    <div className="grid gap-6">
      <Card variant="scrapbook" className="max-w-4xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge variant="sky">Common room card</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">{displayName}</h2>
            <p className="mt-3 text-base leading-7 text-[color:rgba(37,34,30,0.72)]">
              Neighborhood: <span className="font-semibold">{neighborhood}</span>
            </p>
            <p className="mt-2 text-sm text-[color:rgba(37,34,30,0.62)]">
              {isSignedIn ? "Clerk client data loaded." : "Signed out — showing demo-safe placeholders."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt="Your profile avatar"
                className="h-14 w-14 rounded-full border border-black/10 object-cover"
              />
            ) : (
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-foreground)] text-sm font-black text-[var(--color-paper)]">
                CA
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[1.5rem] bg-white/80 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:rgba(37,34,30,0.65)]">Email</p>
            <p className="mt-3 text-base font-semibold">{email}</p>
          </div>
          <div className="rounded-[1.5rem] bg-white/80 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:rgba(37,34,30,0.65)]">Season status (demo)</p>
            <p className="mt-3 text-base font-semibold">
              Deposit: {state.depositStatus} • Picks: {state.selectedEventIds.length}/{demoData.season.requiredEventCount}
            </p>
            <p className="mt-2 text-sm text-[color:rgba(37,34,30,0.62)]">Stored locally on this device.</p>
          </div>
        </div>

        <div className="mt-6 rounded-[1.8rem] border border-black/10 bg-white/70 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">Prompt card</p>
          <p className="mt-3 text-xl font-semibold">{prompt.q}</p>
          <p className="mt-2 text-sm text-[color:rgba(37,34,30,0.68)]">{prompt.hint}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" onClick={() => setPromptIndex((i) => i + 1)}>
              Shuffle prompt
            </Button>
            <Button size="sm" variant="ghost" href="/bingo">
              Pick experiences
            </Button>
          </div>
        </div>

        <Sticker className="mt-6">Crumbs approves of gentle self-disclosure.</Sticker>
      </Card>
    </div>
  );
}

