"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Sticker } from "@/components/ui/Sticker";
import { GraderControlPanel } from "@/components/app/GraderControlPanel";
import { CohortRevealLetter } from "@/components/cohort/CohortRevealLetter";
import { PostcardMatchAnimation } from "@/components/cohort/PostcardMatchAnimation";
import { CrumbsTyping } from "@/components/app/CrumbsTyping";
import { demoData, getDemoEvent, getDemoUser } from "@/lib/demo-data";
import { ACTIVITY_SLUG_TO_DEMO_EVENT } from "@/lib/demo-activity-slug-map";
import { cohortPeopleAdjective } from "@/lib/cohort-reveal-copy";
import {
  loadDemoState,
  mailPostcardForMatching,
  markCohortRevealSeen,
  tickMatchingForward,
} from "@/lib/demo-state";
import type { OnboardingSnapshot } from "@/types/onboarding";

function chunk<T>(arr: T[], size: number) {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

type CohortHomeProps = {
  serverOnboarding?: OnboardingSnapshot | null;
};

export function CohortHome({ serverOnboarding = null }: CohortHomeProps) {
  const { userId } = useAuth();
  const storageUserId = userId ?? null;

  const [state, setState] = useState(() => loadDemoState(storageUserId));

  useEffect(() => {
    const id = window.setTimeout(() => {
      setState(loadDemoState(storageUserId));
    }, 0);
    return () => window.clearTimeout(id);
  }, [storageUserId]);

  useEffect(() => {
    if (serverOnboarding?.configured) return;
    const interval = window.setInterval(() => setState(tickMatchingForward(storageUserId)), 750);
    return () => window.clearInterval(interval);
  }, [storageUserId, serverOnboarding?.configured]);

  const serverAuthoritative = Boolean(serverOnboarding?.configured);
  const cohort = serverAuthoritative
    ? serverOnboarding?.cohortDemoId
      ? demoData.cohorts.find((c) => c.id === serverOnboarding.cohortDemoId) ?? null
      : null
    : state.matching.cohortId
      ? demoData.cohorts.find((c) => c.id === state.matching.cohortId) ?? null
      : null;

  const matchingInProgress = serverAuthoritative
    ? serverOnboarding?.assignmentStatus === "pending"
    : !cohort && (state.matching.status === "mailing" || state.matching.status === "pending");

  const cohortRevealUnlocked = serverAuthoritative
    ? Boolean(serverOnboarding?.cohortRevealSeen)
    : state.futureCohortLetterPreviewDone;

  const showCohortLetter =
    cohort &&
    (serverAuthoritative
      ? serverOnboarding?.assignmentStatus === "assigned"
      : state.matching.status === "assigned") &&
    (serverAuthoritative
      ? !serverOnboarding?.cohortRevealSeen
      : !state.seenCohortRevealIds.includes(cohort.id));

  const letterEvents = useMemo(() => {
    if (!cohort) return { a: "", b: "" };
    const serverPickIds =
      serverAuthoritative && (serverOnboarding?.selectedActivitySlugs.length ?? 0) > 0
        ? serverOnboarding!.selectedActivitySlugs
            .map((slug) => ACTIVITY_SLUG_TO_DEMO_EVENT[slug])
            .filter((id): id is string => Boolean(id))
        : [];
    const fromPicks = (serverPickIds.length > 0 ? serverPickIds : state.selectedEventIds)
      .map((id) => getDemoEvent(id))
      .filter(Boolean)
      .slice(0, 2);
    if (fromPicks.length >= 2) {
      return { a: fromPicks[0]!.title, b: fromPicks[1]!.title };
    }
    const featured = cohort.featuredEventIds
      .map((id) => getDemoEvent(id))
      .filter(Boolean)
      .slice(0, 2);
    return {
      a: featured[0]?.title ?? "your picks",
      b: featured[1]?.title ?? "shared plans",
    };
  }, [cohort, serverAuthoritative, serverOnboarding, state.selectedEventIds]);

  const peopleAdjective = cohort ? cohortPeopleAdjective(cohort.vibeTags) : "great";

  const members = useMemo(() => {
    if (serverAuthoritative && (serverOnboarding?.roster.length ?? 0) > 0) {
      return serverOnboarding!.roster.map((member) => ({
        id: member.profileId,
        displayName: member.displayName ?? (member.isSelf ? "You" : "Cohort member"),
        neighborhood: member.isSeed ? "Chicago" : "Your cohort",
        avatar: { value: (member.displayName ?? "?").slice(0, 1).toUpperCase() },
        commonRoomFact: member.isSelf ? "This is your row in the live roster." : "Seeded cohort member for the prototype.",
      }));
    }
    if (!cohort) return [];
    return cohort.memberIds.map((id) => getDemoUser(id)).filter(Boolean);
  }, [cohort, serverAuthoritative, serverOnboarding]);

  const featuredEvents = useMemo(() => {
    if (!cohort) return [];
    return cohort.featuredEventIds.map((id) => getDemoEvent(id)).filter(Boolean);
  }, [cohort]);

  const readyToMail = serverAuthoritative
    ? serverOnboarding?.depositStatus === "paid" &&
      (serverOnboarding?.selectionCount ?? 0) >= demoData.season.requiredEventCount
    : state.depositStatus === "paid" && state.selectedEventIds.length >= demoData.season.requiredEventCount;

  const matchingAnimationStatus = serverAuthoritative
    ? serverOnboarding?.assignmentStatus === "pending"
      ? "pending"
      : "not_started"
    : state.matching.status;

  if (cohort && (serverAuthoritative ? serverOnboarding?.assignmentStatus === "assigned" : state.matching.status === "assigned") && !cohortRevealUnlocked) {
    return (
      <div className="grid gap-6">
        <Card variant="paper">
          <Badge variant="neutral">Matching</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight">Cohort matching is in progress.</h2>
          <p className="mt-4 text-base leading-7 text-[color:rgba(37,34,30,0.72)]">
            {serverAuthoritative
              ? "Your cohort letter unlocks after you open it under Dashboard → Future. Then you can come back here for your full roster."
              : "In this demo, your cohort letter only unlocks after you open it under Dashboard → Future. Then you can come back here for your full roster."}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button href="/dashboard" variant="primary">
              Open dashboard (Future tab)
            </Button>
            <Button href="/bingo" variant="secondary">
              View your selections
            </Button>
          </div>
          <Sticker className="mt-6">Crumbs is holding the envelope until you peek in Future.</Sticker>
          <div className="mt-6 flex items-center gap-3 rounded-[1.25rem] border border-black/10 bg-white/70 p-4">
            <CrumbsTyping size={56} />
            <p className="text-sm font-medium text-black/70">Sorting duty continues in the mailroom.</p>
          </div>
        </Card>

        <PostcardMatchAnimation status="pending" />
      </div>
    );
  }

  if (!cohort) {
    if (matchingInProgress) {
      return (
        <div className="grid gap-6">
          <Card variant="paper">
            <Badge variant="neutral">Matching</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">Cohort matching is in progress.</h2>
            <p className="mt-4 text-base leading-7 text-[color:rgba(37,34,30,0.72)]">
              We’re grouping people using overlapping picks. You’ll get your cohort letter as soon as your match is
              ready—no need to send anything again.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button href="/bingo" variant="secondary">
                View your selections
              </Button>
              <Button href="/dashboard" variant="ghost">
                Back to dashboard
              </Button>
            </div>
            <Sticker className="mt-6">Crumbs is “sorting.” (He’s napping nearby.)</Sticker>
          </Card>

          <PostcardMatchAnimation status={matchingAnimationStatus} />
        </div>
      );
    }

    return (
      <div className="grid gap-6">
        <Card variant="paper">
          <Badge variant="neutral">Not assigned yet</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight">Your cohort reveal happens after signups close.</h2>
          <p className="mt-4 text-base leading-7 text-[color:rgba(37,34,30,0.72)]">
            {serverAuthoritative
              ? "Finish your deposit and four picks on the bingo card. Matching runs from your saved account state—no postcard button needed."
              : "In this demo, you can mail a postcard to start the matching animation. Real matching runs server-side from overlapping picks."}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button href="/bingo" variant="secondary">
              Pick experiences
            </Button>
            <Button
              variant="primary"
              disabled={!readyToMail || serverAuthoritative}
              onClick={() => setState(mailPostcardForMatching(storageUserId))}
            >
              Send postcard to matching
            </Button>
          </div>
          {!readyToMail ? (
            <p className="mt-4 text-sm text-[color:rgba(37,34,30,0.62)]">
              To mail it: mark deposit paid (demo) + pick four events.
            </p>
          ) : null}
          <Sticker className="mt-6">Crumbs is “sorting.” (He’s napping nearby.)</Sticker>
        </Card>

        <PostcardMatchAnimation status={matchingAnimationStatus} />
      </div>
    );
  }

  if (showCohortLetter) {
    return (
      <div className="grid gap-6">
        <CohortRevealLetter
          cohortId={cohort.id}
          cohortName={cohort.name}
          eventTitleA={letterEvents.a}
          eventTitleB={letterEvents.b}
          peopleAdjective={peopleAdjective}
          onComplete={() => setState(markCohortRevealSeen(cohort.id, storageUserId))}
        />
      </div>
    );
  }

  return (
    <div className="grid gap-6" data-testid="cohort-home">
      <GraderControlPanel storageUserId={storageUserId} showWhenConfigured={serverAuthoritative} />
      <Card variant="scrapbook">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge variant="butter">Cohort reveal</Badge>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight">{cohort.name}</h2>
            <p className="mt-4 text-base leading-7 text-[color:rgba(37,34,30,0.72)]">{cohort.theme}</p>
          </div>
          <Sticker>20 people. Familiar faces.</Sticker>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-[1.5rem] bg-white/80 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:rgba(37,34,30,0.65)]">Members</p>
            <p className="mt-3 text-2xl font-semibold">{members.length || cohort.memberIds.length}</p>
            <p className="mt-2 text-sm text-[color:rgba(37,34,30,0.66)]">A real common room size.</p>
          </div>
          <div className="rounded-[1.5rem] bg-white/80 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:rgba(37,34,30,0.65)]">Overlap</p>
            <p className="mt-3 text-2xl font-semibold">{cohort.sharedEventTypeOverlap.length} types</p>
            <p className="mt-2 text-sm text-[color:rgba(37,34,30,0.66)]">
              {cohort.sharedEventTypeOverlap.join(" • ")}
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-white/80 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:rgba(37,34,30,0.65)]">Next</p>
            <div className="mt-4 flex flex-col gap-2">
              <Button href="/cohort/chat" variant="secondary" size="sm">
                Open chat (demo)
              </Button>
              <Button href="/bingo" variant="ghost" size="sm">
                Open bingo
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card variant="paper">
          <Badge variant="rust">Why you were matched</Badge>
          <h3 className="mt-4 text-2xl font-semibold tracking-tight">A legible overlap story (demo).</h3>
          <ul className="mt-5 grid gap-3">
            {cohort.whyThisCohortWorks.map((line) => (
              <li
                key={line}
                className="rounded-[1.25rem] border border-black/10 bg-white/75 px-4 py-3 text-sm font-medium text-[color:rgba(37,34,30,0.78)]"
              >
                {line}
              </li>
            ))}
          </ul>
          <Sticker className="mt-6">No bios. No swiping. Just overlap + repetition.</Sticker>
        </Card>

        <Card variant="paper">
          <Badge variant="sky">Icebreakers</Badge>
          <h3 className="mt-4 text-2xl font-semibold tracking-tight">Anti-networking prompts</h3>
          <div className="mt-5 grid gap-3">
            {[
              "Choose your campus alter ego.",
              "Pick your emergency side-quest role: navigator, snack finder, hype person, documentarian.",
              "What would your fake student club be called?",
              "Which snack best represents your communication style?",
              "What useless talent are you bringing to the cohort?",
            ].map((prompt) => (
              <div key={prompt} className="rounded-[1.25rem] border border-black/10 bg-white/75 p-4">
                <p className="text-sm font-semibold">{prompt}</p>
                <p className="mt-2 text-sm text-[color:rgba(37,34,30,0.68)]">
                  (Demo) In the real app, answers would persist and appear in your cohort yearbook.
                </p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <Card variant="scrapbook" data-testid="cohort-roster">
        <Badge variant="neutral">Roster</Badge>
        <h3 className="mt-4 text-2xl font-semibold tracking-tight">20 familiar faces-in-progress</h3>
        <p className="mt-3 text-base leading-7 text-[color:rgba(37,34,30,0.72)]">
          {serverAuthoritative
            ? "Your cohort roster from Supabase, including seeded members for a full common-room size."
            : "These are generated demo profiles. In the real product, these are your cohort members (same idea, real people)."}
        </p>
        <div className="mt-6 grid gap-4">
          {chunk(members, 10).map((row, idx) => (
            <div key={idx} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {row.map((m) => (
                <div
                  key={m!.id}
                  className="rounded-[1.4rem] border border-black/10 bg-white/75 p-4 transition-transform hover:-translate-y-[1px]"
                >
                  <div className="flex items-center gap-3">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-foreground)] text-sm font-black text-[var(--color-paper)]">
                      {m!.avatar.value}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{m!.displayName}</p>
                      <p className="text-xs text-[color:rgba(37,34,30,0.62)]">{m!.neighborhood}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs leading-5 text-[color:rgba(37,34,30,0.72)]">{m!.commonRoomFact}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Card>

      <Card variant="paper">
        <Badge variant="butter">Featured overlaps</Badge>
        <h3 className="mt-4 text-2xl font-semibold tracking-tight">A shared schedule vibe</h3>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {featuredEvents.map((evt) => (
            <div key={evt!.id} className="rounded-[1.5rem] border border-black/10 bg-white/75 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                {evt!.neighborhood}
              </p>
              <p className="mt-3 text-xl font-semibold">{evt!.title}</p>
              <p className="mt-2 text-sm text-[color:rgba(37,34,30,0.68)]">{evt!.vibe}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

