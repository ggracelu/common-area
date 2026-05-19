/* eslint-disable @next/next/no-img-element -- cohort roster and activity preview photos */
"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Sticker } from "@/components/ui/Sticker";
import { GraderControlPanel } from "@/components/app/GraderControlPanel";
import { CohortRevealLetter } from "@/components/cohort/CohortRevealLetter";
import { CohortWelcomeSpotlights } from "@/components/cohort/CohortWelcomeSpotlights";
import {
  hasSeenCohortCommonRoomWelcome,
  markCohortCommonRoomWelcomeSeen,
} from "@/lib/cohort-common-room-welcome";
import { PostcardMatchAnimation } from "@/components/cohort/PostcardMatchAnimation";
import { CrumbsTyping } from "@/components/app/CrumbsTyping";
import { demoMemberAvatarUrl, demoUserAvatarUrl } from "@/lib/cohort-avatars";
import { demoData, getDemoEvent, getDemoUser } from "@/lib/demo-data";
import { ACTIVITY_SLUG_TO_DEMO_EVENT } from "@/lib/demo-activity-slug-map";
import { cohortPeopleAdjective } from "@/lib/cohort-reveal-copy";
import {
  assignDemoCohortFromSelections,
  getDefaultDemoState,
  loadDemoState,
  markCohortRevealSeen,
} from "@/lib/demo-state";
import type { OnboardingSnapshot } from "@/types/onboarding";

function chunk<T>(arr: T[], size: number) {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

const cohortPaperColors = [
  "bg-[color:rgba(233,255,107,0.88)]",
  "bg-[color:rgba(255,184,0,0.28)]",
  "bg-[color:rgba(26,92,255,0.18)]",
  "bg-[color:rgba(255,47,184,0.16)]",
  "bg-[color:rgba(191,212,223,0.55)]",
] as const;

function cohortPaperColor(index: number) {
  return cohortPaperColors[index % cohortPaperColors.length]!;
}

type CohortHomeProps = {
  serverOnboarding?: OnboardingSnapshot | null;
};

export function CohortHome({ serverOnboarding = null }: CohortHomeProps) {
  const { userId } = useAuth();
  const storageUserId = userId ?? null;

  const [state, setState] = useState(() => getDefaultDemoState());
  const [showWelcomeSpotlights, setShowWelcomeSpotlights] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setState(loadDemoState(storageUserId));
    }, 0);
    return () => window.clearTimeout(id);
  }, [storageUserId]);

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
    : !cohort && state.matching.status === "pending";

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

  const cohortHomeReady =
    Boolean(cohort) &&
    !showCohortLetter &&
    (serverAuthoritative
      ? serverOnboarding?.assignmentStatus === "assigned"
      : state.matching.status === "assigned");

  useEffect(() => {
    if (!cohortHomeReady || !cohort) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (hasSeenCohortCommonRoomWelcome(storageUserId, cohort.id)) return;

    markCohortCommonRoomWelcomeSeen(storageUserId, cohort.id);
    setShowWelcomeSpotlights(true);
  }, [cohort, cohortHomeReady, storageUserId]);

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
    if (serverAuthoritative) {
      return (serverOnboarding?.roster ?? []).map((member) => ({
        id: member.profileId,
        displayName: member.displayName ?? (member.isSelf ? "You" : "Cohort member"),
        neighborhood: member.isSeed ? "Chicago" : "Your cohort",
        avatar: { value: (member.displayName ?? "?").slice(0, 1).toUpperCase() },
        avatarImageUrl: demoMemberAvatarUrl(member.profileId),
        commonRoomFact: member.isSelf ? "This is your row in the server roster." : "Seeded cohort member in your assigned cohort.",
      }));
    }
    if (!cohort) return [];
    return cohort.memberIds
      .map((id) => {
        const user = getDemoUser(id);
        if (!user) return null;
        return {
          ...user,
          avatarImageUrl: demoUserAvatarUrl(user),
        };
      })
      .filter(Boolean);
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
    : state.matching.status === "assigned"
      ? "assigned"
      : state.matching.status === "pending"
        ? "pending"
        : readyToMail
          ? "ready"
          : "not_started";

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

  if (serverAuthoritative && serverOnboarding?.assignmentStatus === "assigned" && !cohort) {
    return (
      <div className="grid gap-6">
        <Card variant="paper">
          <Badge variant="rust">Cohort assigned</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight">Your server assignment exists, but this prototype cannot display it yet.</h2>
          <p className="mt-4 text-base leading-7 text-[color:rgba(37,34,30,0.72)]">
            The cohort slug from Supabase is not mapped to a demo display cohort. No demo roster is substituted.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button href="/dashboard" variant="primary">
              Back to dashboard
            </Button>
            <Button href="/chat" variant="secondary">
              Join the conversation
            </Button>
          </div>
        </Card>
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
              ? "Finish your deposit and 4 of 6 picks on the season card. Matching runs from your saved account state."
              : "This is local demo state. You can run a clearly labeled demo assignment; production matching stays server-side from overlapping picks."}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button href="/bingo" variant="secondary">
              Pick experiences
            </Button>
            <Button
              variant="primary"
              disabled={!readyToMail || serverAuthoritative}
              onClick={() => setState(assignDemoCohortFromSelections(storageUserId))}
            >
              Run local demo assignment
            </Button>
          </div>
          {!readyToMail ? (
            <p className="mt-4 text-sm text-[color:rgba(37,34,30,0.62)]">
              To preview locally: mark deposit paid in demo state and pick 4 of 6 activities.
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
      <CohortWelcomeSpotlights show={showWelcomeSpotlights} />
      <GraderControlPanel storageUserId={storageUserId} showWhenConfigured={serverAuthoritative} />
      <Card variant="scrapbook" className="relative overflow-hidden">
        <div aria-hidden="true" className="cohort-scrap-tape cohort-scrap-tape-tl" />
        <div aria-hidden="true" className="cohort-scrap-tape cohort-scrap-tape-tr" />
        <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge variant="butter">Cohort reveal</Badge>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight">{cohort.name}</h2>
            <p className="mt-4 text-base leading-7 text-[color:rgba(37,34,30,0.72)]">{cohort.theme}</p>
          </div>
          <Sticker className="cohort-scrap-sticker-float">20 people. Familiar faces.</Sticker>
        </div>

        <div className="relative z-10 mt-8 grid grid-cols-1 gap-4 lg:grid-cols-4">
          <div className={["rounded-[1.5rem] border border-black/10 p-5 shadow-[0_12px_32px_rgba(52,36,24,0.1)] lg:col-span-1", cohortPaperColor(0)].join(" ")}>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/55">Members</p>
            <p className="mt-3 text-2xl font-black">{members.length}</p>
            <p className="mt-2 text-sm text-black/65">A real common room size.</p>
          </div>
          <div className={["rounded-[1.5rem] border border-black/10 p-5 shadow-[0_12px_32px_rgba(52,36,24,0.1)] lg:col-span-1", cohortPaperColor(1)].join(" ")}>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/55">Overlap</p>
            <p className="mt-3 text-2xl font-black">{cohort.sharedEventTypeOverlap.length} types</p>
            <p className="mt-2 text-sm text-black/65">{cohort.sharedEventTypeOverlap.join(" • ")}</p>
          </div>
          <div className="flex flex-col gap-3 lg:col-span-2">
            <div>
              <Badge variant="rust">Why you were matched</Badge>
              <h3 className="mt-3 text-xl font-semibold tracking-tight">A legible overlap story.</h3>
            </div>
            <ul className="grid flex-1 gap-3">
              {cohort.whyThisCohortWorks.map((line, index) => (
                <li
                  key={line}
                  className={[
                    "rounded-[1.25rem] border border-black/10 px-4 py-3 text-sm font-medium leading-6 text-black/78 shadow-[0_8px_24px_rgba(52,36,24,0.08)]",
                    cohortPaperColor(index + 2),
                  ].join(" ")}
                >
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Sticker className="relative z-10 mt-6">No bios. No swiping. Just overlap + repetition.</Sticker>
      </Card>

      <Card variant="scrapbook" data-testid="cohort-roster">
        <Badge variant="neutral">Roster</Badge>
        <h3 className="mt-4 text-2xl font-semibold tracking-tight">20 familiar faces-in-progress</h3>
        <p className="mt-3 text-base leading-7 text-[color:rgba(37,34,30,0.72)]">
          {serverAuthoritative
            ? "Your cohort roster from Supabase, including seeded members for a full common-room size."
            : "These are generated demo profiles. In the real product, these are your cohort members (same idea, real people)."}
        </p>
        <div className="mt-6 grid gap-4">
          {members.length === 0 ? (
            <div className="rounded-[1.25rem] border border-dashed border-black/15 bg-white/70 p-5 text-sm font-semibold text-black/70">
              No server roster rows are visible for this cohort yet.
            </div>
          ) : null}
          {chunk(members, 10).map((row, idx) => (
            <div key={idx} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {row.map((m) => (
                <div
                  key={m!.id}
                  className="rounded-[1.4rem] border border-black/10 bg-white/75 p-4 transition-transform hover:-translate-y-[1px]"
                >
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m!.avatarImageUrl}
                      alt=""
                      className="h-11 w-11 shrink-0 rounded-full border-2 border-white object-cover shadow-[0_8px_20px_rgba(52,36,24,0.12)]"
                    />
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
          {featuredEvents.map((evt, index) => (
            <article
              key={evt!.id}
              className={[
                "overflow-hidden rounded-[1.5rem] border border-black/12 shadow-[0_14px_38px_rgba(52,36,24,0.12)]",
                cohortPaperColor(index),
              ].join(" ")}
            >
              {evt!.imageUrl ? (
                <img src={evt!.imageUrl} alt="" className="h-32 w-full object-cover" />
              ) : null}
              <div className="p-5">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-black/55">{evt!.neighborhood}</p>
                <p className="mt-2 text-xl font-black text-black">{evt!.title}</p>
                <p className="mt-2 text-sm text-black/68">{evt!.vibe}</p>
              </div>
            </article>
          ))}
        </div>
      </Card>
    </div>
  );
}
