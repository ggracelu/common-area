"use client";

import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Sticker } from "@/components/ui/Sticker";
import { demoData } from "@/lib/demo-data";
import { loadDemoState } from "@/lib/demo-state";
import { loadProfileLocation, saveProfileLocation } from "@/lib/profile-location";

export function ProfileHome() {
  const { user, isSignedIn } = useUser();
  const state = useMemo(() => loadDemoState(user?.id ?? null), [user?.id]);
  const [promptIndex, setPromptIndex] = useState(0);
  const [locationDraft, setLocationDraft] = useState("");
  const [locationSaved, setLocationSaved] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setLocationDraft(loadProfileLocation(user?.id ?? null));
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, [user?.id]);

  const displayName =
    user?.fullName ?? user?.firstName ?? user?.username ?? "Guest (demo)";
  const email = user?.primaryEmailAddress?.emailAddress ?? "—";
  const avatarUrl = user?.imageUrl ?? null;
  const locationMissing = hydrated && locationDraft.trim().length === 0;

  const promptDeck = [
    { q: "Choose your campus alter ego.", hint: "Be dramatic. It's allowed." },
    { q: "What would your fake student club be called?", hint: "The more niche, the better." },
    { q: "Which snack best represents your communication style?", hint: "This is serious research." },
    { q: "Pick your emergency side-quest role.", hint: "Navigator? Snack finder? Hype person?" },
  ];
  const prompt = promptDeck[promptIndex % promptDeck.length]!;

  function handleSaveLocation() {
    if (!isSignedIn || !user?.id) return;
    saveProfileLocation(locationDraft, user.id);
    setLocationSaved(true);
    window.setTimeout(() => setLocationSaved(false), 2000);
  }

  return (
    <div className="grid gap-6">
      <Card variant="scrapbook" className="max-w-4xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge variant="sky">Common room card</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">{displayName}</h2>
            <p className="mt-2 text-sm text-[color:rgba(37,34,30,0.62)]">
              {isSignedIn ? "Your profile for this season." : "Signed out — sign in to save your card."}
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

        <div className="mt-8 rounded-[1.5rem] border border-black/10 bg-white/80 p-5">
          <label htmlFor="profile-location" className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:rgba(37,34,30,0.65)]">
            Location
          </label>
          {locationMissing ? (
            <p className="mt-2 text-sm leading-6 text-[color:rgba(37,34,30,0.72)]">
              Add where you usually hang out in Chicago — neighborhood, campus area, or cross streets. We don't guess this for you.
            </p>
          ) : (
            <p className="mt-2 text-sm text-[color:rgba(37,34,30,0.62)]">
              Helps your cohort feel local. You can update this anytime.
            </p>
          )}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              id="profile-location"
              type="text"
              value={locationDraft}
              onChange={(event) => setLocationDraft(event.target.value)}
              placeholder="e.g. Logan Square, Hyde Park, South Loop"
              maxLength={80}
              disabled={!isSignedIn}
              className="flex-1 rounded-[1rem] border border-black/10 bg-white/90 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-60"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={!isSignedIn}
              onClick={handleSaveLocation}
            >
              {locationSaved ? "Saved" : "Save location"}
            </Button>
          </div>
          {locationMissing ? (
            <p className="mt-3 text-xs font-semibold text-amber-900/80" role="status">
              Missing info — add a location so your card feels complete.
            </p>
          ) : null}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[1.5rem] bg-white/80 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:rgba(37,34,30,0.65)]">Email</p>
            <p className="mt-3 text-base font-semibold">{email}</p>
          </div>
          <div className="rounded-[1.5rem] bg-white/80 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:rgba(37,34,30,0.65)]">Season status</p>
            <p className="mt-3 text-base font-semibold">
              Deposit: {state.depositStatus} • Picks: {state.selectedEventIds.length}/{demoData.season.requiredEventCount}
            </p>
            <p className="mt-2 text-sm text-[color:rgba(37,34,30,0.62)]">
              {isSignedIn ? "Synced with your season progress when Supabase is configured." : "Sign in to track season progress."}
            </p>
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
