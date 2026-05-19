"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { SeasonStatusChecklist } from "@/components/app/SeasonStatusChecklist";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Sticker } from "@/components/ui/Sticker";
import { icebreakerLabel, loadChatIcebreaker } from "@/lib/chat-icebreaker";
import { getDefaultDemoState, loadDemoState, type DemoAppState } from "@/lib/demo-state";
import { loadProfileLocation, saveProfileLocation } from "@/lib/profile-location";
import { buildSeasonChecklist } from "@/lib/season-checklist";

export function ProfileHome() {
  const { user, isSignedIn } = useUser();
  const storageUserId = user?.id ?? null;
  const [state, setState] = useState<DemoAppState>(getDefaultDemoState);
  const [promptIndex, setPromptIndex] = useState(0);
  const [locationDraft, setLocationDraft] = useState("");
  const [locationSaved, setLocationSaved] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [chatIcebreaker, setChatIcebreaker] = useState<ReturnType<typeof loadChatIcebreaker>>(null);

  const refreshProgress = useCallback(() => {
    setState(loadDemoState(storageUserId));
    setChatIcebreaker(loadChatIcebreaker(storageUserId));
  }, [storageUserId]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setLocationDraft(loadProfileLocation(storageUserId));
      refreshProgress();
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, [storageUserId, refreshProgress]);

  useEffect(() => {
    const onFocus = () => refreshProgress();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refreshProgress]);

  const checklist = useMemo(
    () => buildSeasonChecklist({ state, isSignedIn: Boolean(isSignedIn), chatIcebreaker }),
    [state, isSignedIn, chatIcebreaker],
  );

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
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] lg:items-start">
      <Card variant="scrapbook" data-testid="profile-common-room-card">
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

        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="primary" href="/bingo" data-testid="profile-my-bingo-card">
            My bingo card
          </Button>
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

        {chatIcebreaker ? (
          <div className="mt-4 rounded-[1.5rem] border border-black/10 bg-[color:rgba(233,255,107,0.35)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/60">Chatroom icebreaker</p>
            <p className="mt-2 text-sm font-semibold text-black">{icebreakerLabel(chatIcebreaker.kind)}</p>
            <p className="mt-2 text-base leading-6 text-black/78">{chatIcebreaker.answer}</p>
            <p className="mt-2 text-xs text-black/55">Shown on your profile and in the cohort chatroom.</p>
          </div>
        ) : (
          <p className="mt-4 text-sm text-black/60">
            Complete the one-time icebreaker in the{" "}
            <a href="/chat" className="font-semibold text-[var(--color-accent)] underline-offset-2 hover:underline">
              chatroom
            </a>{" "}
            to add your anti-networking answer here.
          </p>
        )}

        <div className="mt-4 rounded-[1.5rem] bg-white/80 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:rgba(37,34,30,0.65)]">Email</p>
          <p className="mt-3 text-base font-semibold">{email}</p>
        </div>

        <div className="mt-6 rounded-[1.8rem] border border-black/10 bg-white/70 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">Prompt card</p>
          <p className="mt-3 text-xl font-semibold">{prompt.q}</p>
          <p className="mt-2 text-sm text-[color:rgba(37,34,30,0.68)]">{prompt.hint}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" onClick={() => setPromptIndex((i) => i + 1)}>
              Shuffle prompt
            </Button>
          </div>
        </div>

        <Sticker className="mt-6">Crumbs approves of gentle self-disclosure.</Sticker>
      </Card>

      <SeasonStatusChecklist
        checklist={checklist}
        depositStatus={state.depositStatus}
        isSignedIn={Boolean(isSignedIn)}
      />
    </div>
  );
}
