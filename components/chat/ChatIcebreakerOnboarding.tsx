"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Crumbs } from "@/components/brand/Crumbs";
import { Sticker } from "@/components/ui/Sticker";
import {
  antiNetworkingIcebreakerOptions,
  saveChatIcebreaker,
  type AntiNetworkingIcebreakerKind,
} from "@/lib/chat-icebreaker";

const paperColors = [
  "bg-[color:rgba(233,255,107,0.88)]",
  "bg-[color:rgba(255,184,0,0.30)]",
  "bg-[color:rgba(26,92,255,0.18)]",
] as const;

type ChatIcebreakerOnboardingProps = {
  userId: string | null;
  onComplete: () => void;
};

export function ChatIcebreakerOnboarding({ userId, onComplete }: ChatIcebreakerOnboardingProps) {
  const [selectedKind, setSelectedKind] = useState<AntiNetworkingIcebreakerKind | null>(null);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState<string | null>(null);

  const selectedOption = antiNetworkingIcebreakerOptions.find((option) => option.kind === selectedKind);

  function handleSubmit() {
    if (!selectedOption) {
      setError("Pick one anti-networking prompt first.");
      return;
    }
    const trimmed = answer.trim();
    if (trimmed.length < 3) {
      setError("Write at least a short answer — mundane is perfect.");
      return;
    }
    saveChatIcebreaker(
      {
        kind: selectedOption.kind,
        prompt: selectedOption.prompt,
        answer: trimmed,
      },
      userId,
    );
    onComplete();
  }

  return (
    <div className="grid gap-6" data-testid="chat-icebreaker-onboarding">
      <div className="relative overflow-hidden rounded-[2rem] border border-black/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(247,240,228,0.94))] p-6 shadow-[0_22px_70px_rgba(52,36,24,0.14)] md:p-8">
        <div aria-hidden="true" className="cohort-scrap-tape cohort-scrap-tape-tl" />
        <div aria-hidden="true" className="cohort-scrap-tape cohort-scrap-tape-tr" />

        <div className="relative z-10 flex flex-wrap items-start gap-4">
          <Crumbs size="lg" pose="nap" expression="sleepy" animated className="shrink-0" />
          <div className="min-w-0 flex-1">
            <Badge variant="butter">One-time chatroom gate</Badge>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-black">Anti-networking icebreaker</h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-black/72">
              Crumbs moderates this room. Before you join the conversation, pick one low-stakes prompt and answer it.
              No elevator pitches. No “what do you do?” energy.
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-8 grid gap-3 md:grid-cols-3">
          {antiNetworkingIcebreakerOptions.map((option, index) => {
            const active = selectedKind === option.kind;
            return (
              <button
                key={option.kind}
                type="button"
                data-testid={`chat-icebreaker-option-${option.kind}`}
                onClick={() => {
                  setSelectedKind(option.kind);
                  setError(null);
                }}
                className={[
                  "group relative aspect-[4/3] overflow-hidden rounded-[1.35rem] border p-4 text-left shadow-[0_14px_38px_rgba(52,36,24,0.12)] transition-transform",
                  "hover:-translate-y-[2px] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]",
                  paperColors[index]!,
                  active
                    ? "border-[3px] border-[var(--color-accent-dark)] ring-2 ring-[color:rgba(233,255,107,0.55)]"
                    : "border-black/12",
                ].join(" ")}
              >
                <p className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-black/55">Option {index + 1}</p>
                <p className="mt-2 text-lg font-black leading-tight text-black">{option.title}</p>
                <p className="mt-2 text-sm leading-5 text-black/70">{option.prompt}</p>
              </button>
            );
          })}
        </div>

        {selectedOption ? (
          <div className="relative z-10 mt-6 rounded-[1.5rem] border border-black/10 bg-white/85 p-5">
            <label htmlFor="chat-icebreaker-answer" className="text-xs font-black uppercase tracking-[0.22em] text-black/60">
              Your answer · {selectedOption.prompt}
            </label>
            <textarea
              id="chat-icebreaker-answer"
              data-testid="chat-icebreaker-answer"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder={selectedOption.placeholder}
              rows={4}
              maxLength={280}
              className="mt-3 w-full resize-none rounded-[1.1rem] border border-black/10 bg-white/90 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
            <p className="mt-2 text-xs text-black/55">Saved to your profile card. You only do this once.</p>
          </div>
        ) : null}

        {error ? (
          <p className="relative z-10 mt-4 text-sm font-semibold text-amber-900" role="alert">
            {error}
          </p>
        ) : null}

        <div className="relative z-10 mt-6 flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="primary"
            data-testid="chat-icebreaker-submit"
            disabled={!selectedKind || answer.trim().length < 3}
            onClick={handleSubmit}
          >
            Enter the chatroom
          </Button>
          <Sticker>Crumbs is napping on moderation duty.</Sticker>
        </div>
      </div>
    </div>
  );
}
