"use client";

import type { CohortChatMessageView } from "@/types/chat";

const MOCK_REACTIONS = ["👋", "😂", "❤️", "🔥"] as const;

type ChatMessageRowProps = {
  message: CohortChatMessageView & { delivery?: "sending" | "failed" };
  showMockReactions?: boolean;
};

function formatTime(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(d);
}

export function ChatMessageRow({ message, showMockReactions = true }: ChatMessageRowProps) {
  const delivery = "delivery" in message ? message.delivery : null;
  const isCrumbs = message.authorName === "Crumbs";
  const mockReaction =
    showMockReactions && message.isSeeded && !message.isSelf ? MOCK_REACTIONS[message.id.length % 4] : null;

  return (
    <article
      className="group relative flex gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-black/[0.04]"
      data-testid="chat-message-row"
    >
      <div
        className={[
          "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-black",
          isCrumbs ? "bg-[rgba(103,114,85,0.2)] text-black" : "bg-black text-white",
        ].join(" ")}
        aria-hidden
      >
        {isCrumbs ? "🐾" : message.authorInitials}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-sm font-bold text-black">{message.authorName}</span>
          {isCrumbs ? (
            <span className="rounded bg-[rgba(103,114,85,0.2)] px-1.5 py-0.5 text-[0.58rem] font-black uppercase tracking-[0.12em] text-black/65">
              mod
            </span>
          ) : null}
          <time className="text-[0.68rem] text-black/45" dateTime={message.createdAtISO}>
            {formatTime(message.createdAtISO)}
          </time>
          {message.isLocalOnly && !message.isSeeded ? (
            <span className="text-[0.65rem] text-black/40">(you)</span>
          ) : null}
          {delivery === "sending" ? <span className="text-[0.65rem] text-black/45">Sending…</span> : null}
          {delivery === "failed" ? <span className="text-[0.65rem] font-semibold text-amber-900">Not saved</span> : null}
        </div>
        <p className="mt-0.5 text-[0.9375rem] leading-relaxed text-black/85">{message.body}</p>

        {mockReaction ? (
          <div className="mt-1.5 flex flex-wrap gap-1">
            <span className="inline-flex items-center gap-1 rounded-full border border-black/10 bg-white px-2 py-0.5 text-xs">
              {mockReaction} <span className="font-semibold text-black/55">2</span>
            </span>
          </div>
        ) : null}

        <div
          className="mt-1 flex flex-wrap items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
          aria-label="Message actions (preview)"
        >
          {MOCK_REACTIONS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              className="rounded-md border border-transparent px-1.5 py-0.5 text-base hover:border-black/10 hover:bg-white"
              aria-label={`React with ${emoji} (preview)`}
              onClick={() => undefined}
            >
              {emoji}
            </button>
          ))}
          <button
            type="button"
            className="ml-1 rounded-md px-2 py-0.5 text-[0.68rem] font-semibold text-black/55 hover:bg-white hover:text-black"
            aria-label="Reply in thread (preview)"
            onClick={() => undefined}
          >
            Reply
          </button>
        </div>
      </div>
    </article>
  );
}
