"use client";

import type { ReactNode } from "react";
import { Crumbs } from "@/components/brand/Crumbs";
import {
  CHATROOM_CHANNELS,
  CHATROOM_DIRECT_MESSAGES,
  channelDisplayName,
  type ChatroomChannel,
  type ChatroomChannelId,
} from "@/lib/chatroom-channels";

import "@/components/chat/chatroom.css";

type ChatroomShellProps = {
  activeChannelId: ChatroomChannelId;
  onChannelChange: (id: ChatroomChannelId) => void;
  channelHeader: ReactNode;
  statusBanner: ReactNode;
  messages: ReactNode;
  composer: ReactNode;
  emptyState?: ReactNode;
  showEmptyState?: boolean;
};

function ChannelButton({
  channel,
  active,
  onSelect,
}: {
  channel: ChatroomChannel;
  active: boolean;
  onSelect: () => void;
}) {
  const label = channelDisplayName(channel);
  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "chatroom-channel-btn flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
        active ? "bg-[rgba(26,92,255,0.14)] font-semibold text-black" : "text-black/72 hover:bg-black/[0.06]",
      ].join(" ")}
      data-testid={`chatroom-channel-${channel.id}`}
    >
      <span className="truncate">{label}</span>
      {channel.unread ? (
        <span className="ml-auto rounded-full bg-[var(--v16-lime)] px-1.5 py-0.5 text-[0.6rem] font-black text-black">
          {channel.unread}
        </span>
      ) : null}
    </button>
  );
}

export function ChatroomShell({
  activeChannelId,
  onChannelChange,
  channelHeader,
  statusBanner,
  messages,
  composer,
  emptyState,
  showEmptyState = false,
}: ChatroomShellProps) {
  return (
    <div
      className="chatroom-shell flex min-h-[min(72vh,720px)] overflow-hidden rounded-[1.35rem] border border-black/12 bg-[#f4f0ea] shadow-[0_18px_55px_rgba(52,36,24,0.12)]"
      data-testid="chatroom-shell"
    >
      <aside className="flex w-[13.5rem] shrink-0 flex-col border-r border-black/10 bg-[#ece7df] md:w-[15rem]">
        <div className="border-b border-black/10 px-3 py-3">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-black/50" style={{ fontFamily: "var(--v16-mono)" }}>
            Cohort chat
          </p>
          <p className="mt-1 truncate text-sm font-semibold text-black">Common Area</p>
        </div>

        <nav className="flex flex-1 flex-col gap-4 overflow-y-auto p-2" aria-label="Chat channels">
          <div>
            <p className="px-2 py-1 text-[0.62rem] font-black uppercase tracking-[0.18em] text-black/45">Channels</p>
            <div className="mt-0.5 space-y-0.5">
              {CHATROOM_CHANNELS.filter((c) => c.section === "channels").map((channel) => (
                <ChannelButton
                  key={channel.id}
                  channel={channel}
                  active={activeChannelId === channel.id}
                  onSelect={() => onChannelChange(channel.id)}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="px-2 py-1 text-[0.62rem] font-black uppercase tracking-[0.18em] text-black/45">Moderator</p>
            <div className="mt-0.5 space-y-0.5">
              {CHATROOM_CHANNELS.filter((c) => c.section === "moderator").map((channel) => (
                <ChannelButton
                  key={channel.id}
                  channel={channel}
                  active={activeChannelId === channel.id}
                  onSelect={() => onChannelChange(channel.id)}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="px-2 py-1 text-[0.62rem] font-black uppercase tracking-[0.18em] text-black/45">Direct messages</p>
            <div className="mt-0.5 space-y-0.5">
              {CHATROOM_DIRECT_MESSAGES.map((channel) => (
                <ChannelButton
                  key={channel.id}
                  channel={channel}
                  active={activeChannelId === channel.id}
                  onSelect={() => onChannelChange(channel.id)}
                />
              ))}
            </div>
          </div>
        </nav>

        <div className="border-t border-black/10 p-2">
          <div className="flex items-center gap-2 rounded-md bg-white/60 px-2 py-2">
            <Crumbs size="sm" pose="sit" expression="happy" animated={false} className="shrink-0" />
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-black">Crumbs</p>
              <p className="text-[0.62rem] text-black/55">Moderator · online</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col bg-[#faf8f4]">
        <header className="flex items-center gap-3 border-b border-black/10 bg-white/80 px-4 py-3">
          <div className="min-w-0 flex-1">{channelHeader}</div>
        </header>

        <div className="shrink-0 px-4 pt-3">{statusBanner}</div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">{showEmptyState ? emptyState : messages}</div>

        <div className="shrink-0 border-t border-black/10 bg-white/75">{composer}</div>
      </div>
    </div>
  );
}
