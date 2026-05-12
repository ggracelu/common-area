"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Sticker } from "@/components/ui/Sticker";
import { demoData, getDemoChatThread, getDemoUser } from "@/lib/demo-data";
import { addChatMessage, loadDemoState } from "@/lib/demo-state";

function formatTime(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(d);
}

export function CohortChatDemo() {
  const { userId } = useAuth();
  const storageUserId = userId ?? null;

  const [state, setState] = useState(() => loadDemoState(storageUserId));
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setState(loadDemoState(storageUserId));
    }, 0);
    return () => window.clearTimeout(id);
  }, [storageUserId]);

  const cohortId = state.matching.cohortId ?? demoData.cohorts[0].id;
  const thread = getDemoChatThread(cohortId);
  const local = state.chat.messagesByCohortId[cohortId] ?? [];

  const messages = useMemo(() => {
    const seeded = thread?.seededMessages ?? [];
    const mappedLocal = local.map((m) => ({
      id: m.id,
      authorUserId: "system",
      body: m.body,
      createdAtISO: m.createdAtISO,
      isLocal: true as const,
    }));
    return [...seeded.map((m) => ({ ...m, isLocal: false as const })), ...mappedLocal].sort(
      (a, b) => new Date(a.createdAtISO).getTime() - new Date(b.createdAtISO).getTime(),
    );
  }, [thread, local]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="grid gap-6">
      <Card variant="scrapbook">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge variant="sky">Chat (demo)</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">A cohort group chat that feels lived-in.</h2>
            <p className="mt-4 text-base leading-7 text-[color:rgba(37,34,30,0.72)]">
              Seeded messages are part of the demo. Anything you send is saved on this device only — not persisted or realtime.
            </p>
          </div>
          <Sticker>Say hi. Then leave after an hour.</Sticker>
        </div>
      </Card>

      <Card variant="paper" className="p-0 overflow-hidden">
        <div ref={listRef} className="max-h-[62vh] overflow-auto p-5 sm:p-6">
          <div className="grid gap-3">
            {messages.map((m) => {
              const author =
                m.authorUserId === "system"
                  ? { displayName: "Crumbs", avatar: { value: "CA" } }
                  : getDemoUser(m.authorUserId) ?? { displayName: "Someone", avatar: { value: "CA" } };

              return (
                <div key={m.id} className="rounded-[1.25rem] border border-black/10 bg-white/70 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-foreground)] text-xs font-black text-[var(--color-paper)]">
                        {"avatar" in author ? author.avatar.value : "CA"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">
                          {"displayName" in author ? author.displayName : "Crumbs"}
                          {m.isLocal ? <span className="ml-2 text-xs text-black/50">(local)</span> : null}
                        </p>
                        <p className="text-xs text-black/50">{formatTime(m.createdAtISO)}</p>
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[color:rgba(37,34,30,0.82)]">{m.body}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-black/10 bg-[color:rgba(247,240,228,0.72)] p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Write a message… (demo)"
              className="flex-1 rounded-[999px] border border-black/10 bg-white/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
            <Button
              variant="primary"
              onClick={() => {
                const next = addChatMessage(cohortId, draft, storageUserId);
                setState(next);
                setDraft("");
              }}
            >
              Send
            </Button>
          </div>
          <p className="mt-3 text-xs text-black/55">
            Demo note: this doesn’t claim realtime or server persistence.
          </p>
        </div>
      </Card>
    </div>
  );
}

