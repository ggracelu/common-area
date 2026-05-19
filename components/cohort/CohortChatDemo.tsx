"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { sendCohortChatMessageAction } from "@/app/actions/chat";
import { ChatMessageRow } from "@/components/chat/ChatMessageRow";
import { ChatroomShell } from "@/components/chat/ChatroomShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Sticker } from "@/components/ui/Sticker";
import {
  formatIcebreakerJoinMessage,
  hasIcebreakerIntroBeenSent,
  markIcebreakerIntroSent,
  type AntiNetworkingIcebreaker,
} from "@/lib/chat-icebreaker";
import {
  CHATROOM_CHANNELS,
  CHATROOM_DIRECT_MESSAGES,
  channelDisplayName,
  type ChatroomChannelId,
} from "@/lib/chatroom-channels";
import { demoData, getDemoChatThread, getDemoUser } from "@/lib/demo-data";
import { addChatMessage, getDefaultDemoState, loadDemoState } from "@/lib/demo-state";
import type { CohortChatLoadState, CohortChatMessageView } from "@/types/chat";
import type { OnboardingSnapshot } from "@/types/onboarding";

type PendingMessage = CohortChatMessageView & { delivery: "sending" | "failed" };

type SendState =
  | { status: "idle" | "sent"; error?: undefined; retryBody?: undefined }
  | { status: "sending"; error?: undefined; retryBody?: string }
  | { status: "error"; error: string; retryBody: string };

function formatTime(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(d);
}

function initialsFor(name: string) {
  return name
    .split(" ")
    .map((part) => part.slice(0, 1).toUpperCase())
    .join("")
    .slice(0, 2) || "CA";
}

function seededMessagesForCohort(cohortId: string | null): CohortChatMessageView[] {
  if (!cohortId) return [];
  const thread = getDemoChatThread(cohortId);
  return (thread?.seededMessages ?? []).map((message) => {
    const author =
      message.authorUserId === "system"
        ? { displayName: "Crumbs", avatar: { value: "CA" } }
        : getDemoUser(message.authorUserId) ?? { displayName: "Cohort member", avatar: { value: "CA" } };

    return {
      id: message.id,
      body: message.body,
      createdAtISO: message.createdAtISO,
      authorName: author.displayName,
      authorInitials: author.avatar.value,
      isSelf: false,
      isSeeded: true,
      isLocalOnly: true,
    };
  });
}

function chatPaperColor(index: number) {
  const colors = [
    "bg-[color:rgba(233,255,107,0.35)]",
    "bg-[color:rgba(255,184,0,0.22)]",
    "bg-[color:rgba(26,92,255,0.14)]",
    "bg-[color:rgba(255,47,184,0.12)]",
  ];
  return colors[index % colors.length]!;
}

const CRUMBS_MOD_MESSAGES: CohortChatMessageView[] = [
  {
    id: "crumbs-mod-welcome",
    authorName: "Crumbs",
    authorInitials: "CA",
    body: "Welcome to #crumbs-mod. I keep things low-pressure — ping me if a thread needs a nudge, not a lecture.",
    createdAtISO: new Date(0).toISOString(),
    isSelf: false,
    isSeeded: true,
  },
  {
    id: "crumbs-mod-rules",
    authorName: "Crumbs",
    authorInitials: "CA",
    body: "House rules: no hustle culture, no LinkedIn voice, snacks encouraged.",
    createdAtISO: new Date(0).toISOString(),
    isSelf: false,
    isSeeded: true,
  },
];

export function CohortChatDemo({
  serverOnboarding = null,
  serverChat = { status: "not_configured", messages: [] },
  variant = "default",
  userDisplayName = "You",
  icebreakerForIntro = null,
}: {
  serverOnboarding?: OnboardingSnapshot | null;
  serverChat?: CohortChatLoadState;
  variant?: "default" | "chatroom";
  userDisplayName?: string;
  icebreakerForIntro?: AntiNetworkingIcebreaker | null;
}) {
  const isChatroom = variant === "chatroom";
  const router = useRouter();
  const { userId } = useAuth();
  const storageUserId = userId ?? null;

  const [state, setState] = useState(() => getDefaultDemoState());
  const [draft, setDraft] = useState("");
  const [sendState, setSendState] = useState<SendState>({ status: "idle" });
  const [pendingMessages, setPendingMessages] = useState<PendingMessage[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [activeChannelId, setActiveChannelId] = useState<ChatroomChannelId>("main");
  const listRef = useRef<HTMLDivElement | null>(null);
  const introSendStartedRef = useRef(false);

  const serverAuthoritative = Boolean(serverOnboarding?.configured);
  const serverAssigned =
    serverAuthoritative && serverOnboarding?.assignmentStatus === "assigned" && Boolean(serverOnboarding.cohortId);
  const localAssigned = !serverAuthoritative && state.matching.status === "assigned" && Boolean(state.matching.cohortId);
  const chatUnlocked = serverAssigned || localAssigned;
  const cohortId = serverAuthoritative ? serverOnboarding?.cohortDemoId ?? null : state.matching.cohortId;
  const cohort = cohortId ? demoData.cohorts.find((c) => c.id === cohortId) ?? null : null;
  const serverChatReady = serverAuthoritative && serverChat.status === "ready";
  const serverChatError = serverAuthoritative && serverChat.status === "error";

  useEffect(() => {
    const id = window.setTimeout(() => {
      setState(loadDemoState(storageUserId));
    }, 0);
    return () => window.clearTimeout(id);
  }, [storageUserId]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const messages = useMemo(() => {
    if (!chatUnlocked) return [];

    const persisted = serverChatReady ? serverChat.messages : [];
    const localSeeded = !serverAuthoritative ? seededMessagesForCohort(cohortId) : [];
    const local = !serverAuthoritative && cohortId ? state.chat.messagesByCohortId[cohortId] ?? [] : [];
    const mappedLocal: CohortChatMessageView[] = local.map((message) => ({
      id: message.id,
      authorName: "You",
      authorInitials: "YO",
      body: message.body,
      createdAtISO: message.createdAtISO,
      isSelf: true,
      isLocalOnly: true,
    }));

    return [...persisted, ...localSeeded, ...mappedLocal, ...pendingMessages].sort(
      (a, b) => new Date(a.createdAtISO).getTime() - new Date(b.createdAtISO).getTime(),
    );
  }, [
    chatUnlocked,
    serverChatReady,
    serverChat.messages,
    serverAuthoritative,
    cohortId,
    state.chat.messagesByCohortId,
    pendingMessages,
  ]);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }, [messages.length, reducedMotion]);

  const sendMessage = useCallback(
    async (body: string) => {
      const trimmed = body.trim();
      if (!trimmed || !chatUnlocked || !cohortId) return;

      setSendState({ status: "sending", retryBody: trimmed });
      setDraft("");

      if (!serverAuthoritative) {
        const next = addChatMessage(cohortId, trimmed, storageUserId);
        setState(next);
        setSendState({ status: "sent" });
        window.setTimeout(() => setSendState({ status: "idle" }), 1800);
        return;
      }

      const tempId = `pending_${Date.now()}`;
      const pending: PendingMessage = {
        id: tempId,
        body: trimmed,
        createdAtISO: new Date().toISOString(),
        authorName: userDisplayName.trim() || "You",
        authorInitials: initialsFor(userDisplayName),
        isSelf: true,
        delivery: "sending",
      };
      setPendingMessages((current) => [...current, pending]);

      const result = await sendCohortChatMessageAction(trimmed);
      if (result.ok) {
        setPendingMessages((current) =>
          current.map((message) => (message.id === tempId ? { ...result.message, delivery: "sending" } : message)),
        );
        setSendState({ status: "sent" });
        router.refresh();
        window.setTimeout(() => {
          setPendingMessages((current) => current.filter((message) => message.id !== tempId));
          setSendState({ status: "idle" });
        }, 1800);
        return;
      }

      setPendingMessages((current) =>
        current.map((message) => (message.id === tempId ? { ...message, delivery: "failed" } : message)),
      );
      setDraft(trimmed);
      setSendState({ status: "error", error: result.error, retryBody: trimmed });
    },
    [chatUnlocked, cohortId, router, serverAuthoritative, storageUserId, userDisplayName],
  );

  useEffect(() => {
    if (!isChatroom || !chatUnlocked || !cohortId || !icebreakerForIntro || introSendStartedRef.current) return;
    if (hasIcebreakerIntroBeenSent(storageUserId, cohortId)) return;

    introSendStartedRef.current = true;
    markIcebreakerIntroSent(storageUserId, cohortId);
    const body = formatIcebreakerJoinMessage(userDisplayName, icebreakerForIntro);
    void sendMessage(body);
  }, [isChatroom, chatUnlocked, cohortId, icebreakerForIntro, sendMessage, storageUserId, userDisplayName]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(draft);
  }

  const activeChannel =
    [...CHATROOM_CHANNELS, ...CHATROOM_DIRECT_MESSAGES].find((channel) => channel.id === activeChannelId) ??
    CHATROOM_CHANNELS[0]!;

  const channelMessages = useMemo(() => {
    if (activeChannelId === "main") return messages;
    if (activeChannelId === "crumbs-mod") return CRUMBS_MOD_MESSAGES;
    return [];
  }, [activeChannelId, messages]);

  const isDirectMessageChannel = activeChannelId.startsWith("dm-");
  const showChannelEmpty =
    isDirectMessageChannel || (activeChannelId === "main" && channelMessages.length === 0);

  const statusBanner = (
    <div
      className={[
        "rounded-lg border px-3 py-2 text-xs text-[color:rgba(37,34,30,0.82)]",
        serverChatReady
          ? "border-[rgba(103,114,85,0.28)] bg-[rgba(236,245,225,0.72)]"
          : "border-[rgba(26,92,255,0.28)] bg-[linear-gradient(135deg,rgba(26,92,255,0.06),rgba(247,240,228,0.72))]",
      ].join(" ")}
      role={serverChatError ? "alert" : "status"}
      aria-live="polite"
      data-testid="cohort-chat-demo-label"
    >
      <p className="font-semibold text-black">
        {serverChatReady ? "Postgres-backed" : serverChatError ? "Unavailable" : "Demo thread"} · reactions & replies are preview-only
      </p>
    </div>
  );

  const composer = (
    <form onSubmit={onSubmit} className="p-3 sm:p-4">
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={
            activeChannelId === "main"
              ? `Message ${channelDisplayName(activeChannel)}`
              : `Message ${channelDisplayName(activeChannel)} (preview)`
          }
          aria-label="Message input"
          disabled={serverChatError || sendState.status === "sending" || activeChannelId !== "main"}
          maxLength={500}
          className="min-w-0 flex-1 rounded-md border border-black/12 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-50"
        />
        <Button
          type="submit"
          variant="primary"
          disabled={
            !draft.trim() || serverChatError || sendState.status === "sending" || activeChannelId !== "main"
          }
        >
          {sendState.status === "sending" ? "…" : "Send"}
        </Button>
      </div>
      <div className="mt-2 min-h-4 text-[0.65rem] text-black/50" role={sendState.status === "error" ? "alert" : "status"} aria-live="polite">
        {activeChannelId !== "main"
          ? "Posting is enabled in #main for this preview."
          : sendState.status === "error"
            ? sendState.error
            : sendState.status === "sending"
              ? "Saving…"
              : null}
      </div>
    </form>
  );

  if (!chatUnlocked) {
    return (
      <div className="grid gap-6" data-testid="cohort-chat-demo">
        <div
          className="rounded-[1.25rem] border border-black/12 bg-white/78 px-4 py-3 text-sm text-[color:rgba(37,34,30,0.82)]"
          role="status"
          aria-live="polite"
          data-testid="cohort-chat-demo-label"
        >
          <p className="font-semibold text-black">Cohort chat locked</p>
          <p className="mt-1">
            Chat is cohort-private. No thread, roster, or seeded demo cache is shown until assignment exists.
          </p>
        </div>
        <Card variant="paper">
          <Badge variant="neutral">Not assigned</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight">Your cohort thread opens after assignment.</h2>
          <p className="mt-4 text-base leading-7 text-[color:rgba(37,34,30,0.72)]">
            Finish the deposit and 4 of 6 picks first. If the server has not assigned you, this page stays empty.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button href="/dashboard" variant="primary">
              Back to dashboard
            </Button>
            <Button href="/bingo" variant="secondary">
              Open season card
            </Button>
            {isChatroom ? null : (
              <Button href="/chat" variant="ghost">
                Join the conversation
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  if (isChatroom) {
    return (
      <div className="grid gap-6" data-testid="cohort-chat-demo">
        <ChatroomShell
          activeChannelId={activeChannelId}
          onChannelChange={setActiveChannelId}
          channelHeader={
            <>
              <h2 className="text-lg font-bold text-black">{channelDisplayName(activeChannel)}</h2>
              {activeChannel.subtitle ? (
                <p className="text-xs text-black/55">{activeChannel.subtitle}</p>
              ) : null}
            </>
          }
          statusBanner={statusBanner}
          showEmptyState={showChannelEmpty}
          emptyState={
            <div className="rounded-lg border border-dashed border-black/15 bg-white/70 p-6 text-center">
              <p className="text-sm font-semibold text-black">
                {isDirectMessageChannel ? "Direct messages (preview)" : "No messages yet"}
              </p>
              <p className="mt-2 text-sm text-black/60">
                {isDirectMessageChannel
                  ? "DM threads are visual-only in this prototype. Say hi in #main."
                  : "Your icebreaker posts here automatically when you join."}
              </p>
            </div>
          }
          messages={
            <div ref={listRef} className="space-y-1">
              {channelMessages.map((message) => (
                <ChatMessageRow key={message.id} message={message} />
              ))}
            </div>
          }
          composer={composer}
        />
      </div>
    );
  }

  return (
    <div className="grid gap-6" data-testid="cohort-chat-demo">
      <div
        className={[
          "rounded-[1.25rem] border px-4 py-3 text-sm text-[color:rgba(37,34,30,0.82)]",
          serverChatReady
            ? "border-[rgba(103,114,85,0.28)] bg-[rgba(236,245,225,0.72)]"
            : "border-[rgba(26,92,255,0.28)] bg-[linear-gradient(135deg,rgba(26,92,255,0.08),rgba(247,240,228,0.72))]",
        ].join(" ")}
        role={serverChatError ? "alert" : "status"}
        aria-live="polite"
        data-testid="cohort-chat-demo-label"
      >
        <p className="font-semibold text-black">
          {serverChatReady ? "Postgres-backed cohort thread" : serverChatError ? "Chat persistence unavailable" : "Demo chat thread"}
        </p>
        <p className="mt-1">
          {serverChatReady
            ? "Messages are saved through the server before they appear. Realtime is intentionally not advertised yet."
            : serverChatError
              ? serverChat.error
              : "Seeded messages and anything you send stay on this device. No server persistence or realtime claims."}
        </p>
      </div>

      <Card variant="scrapbook">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge variant={serverChatReady ? "moss" : "sky"}>
              {serverChatReady ? "Chat (server)" : "Chat (local demo)"}
            </Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">
              {cohort ? `${cohort.name} thread` : "Your cohort thread"}
            </h2>
            <p className="mt-4 text-base leading-7 text-[color:rgba(37,34,30,0.72)]">
              A simple cohort room for first messages. Send-then-read reliability comes before live badges.
            </p>
          </div>
          <Sticker>Say hi. Low stakes.</Sticker>
        </div>
      </Card>

      <Card variant="paper" className="overflow-hidden p-0">
        <div ref={listRef} className="max-h-[62vh] overflow-auto p-5 sm:p-6">
          {messages.length === 0 ? (
            <div className="rounded-[1.25rem] border border-dashed border-black/15 bg-white/70 p-5">
              <p className="text-sm font-semibold text-black">No messages yet.</p>
              <p className="mt-2 text-sm leading-6 text-black/62">
                The first message will appear here after the server saves it.
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {messages.map((message, index) => {
                const delivery = "delivery" in message ? message.delivery : null;
                const isCrumbs = message.authorName === "Crumbs";
                return (
                  <div
                    key={message.id}
                    className={[
                      "rounded-[1.35rem] border p-4 shadow-[0_10px_28px_rgba(52,36,24,0.08)]",
                      isCrumbs
                        ? "border-[rgba(103,114,85,0.35)] bg-[linear-gradient(135deg,rgba(236,245,225,0.92),rgba(255,252,245,0.88))]"
                        : message.isSelf
                          ? "border-[rgba(26,92,255,0.22)] bg-[linear-gradient(135deg,rgba(233,255,107,0.45),rgba(255,255,255,0.9))]"
                          : `border-black/10 ${chatPaperColor(index)}`,
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-foreground)] text-xs font-black text-[var(--color-paper)]">
                          {isCrumbs ? "🐾" : message.authorInitials}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">
                            {message.authorName}
                            {message.isLocalOnly ? <span className="ml-2 text-xs text-black/50">(local)</span> : null}
                          </p>
                          <p className="text-xs text-black/50">
                            {formatTime(message.createdAtISO)}
                            {delivery === "sending" ? " · sending" : delivery === "failed" ? " · not saved" : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[color:rgba(37,34,30,0.82)]">{message.body}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <form onSubmit={onSubmit} className="border-t border-black/10 bg-[color:rgba(247,240,228,0.72)] p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Write a message to your cohort..."
              aria-label={serverChatReady ? "Message your cohort" : "Message your local demo cohort"}
              disabled={serverChatError || sendState.status === "sending"}
              maxLength={500}
              className="flex-1 rounded-[999px] border border-black/10 bg-white/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-60"
            />
            <Button
              type="submit"
              variant="primary"
              disabled={!draft.trim() || serverChatError || sendState.status === "sending"}
            >
              {sendState.status === "sending" ? "Sending..." : "Send"}
            </Button>
          </div>
          <div className="mt-3 min-h-5 text-xs text-black/55" role={sendState.status === "error" ? "alert" : "status"} aria-live="polite">
            {sendState.status === "sending"
              ? "Saving message before it appears."
              : sendState.status === "sent"
                ? serverChatReady
                  ? "Message saved to the cohort thread."
                  : "Message saved to this device."
                : sendState.status === "error"
                  ? sendState.error
                  : serverChatReady
                    ? "No live badge until realtime is backed by persisted messages."
                    : "Local demo chat is not visible to other members."}
          </div>
          {sendState.status === "error" ? (
            <Button
              variant="secondary"
              size="sm"
              className="mt-3"
              onClick={() => void sendMessage(sendState.retryBody)}
            >
              Retry send
            </Button>
          ) : null}
        </form>
      </Card>
    </div>
  );
}
