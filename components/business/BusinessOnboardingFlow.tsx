"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { BusinessDashboardHome } from "@/components/business/BusinessDashboardHome";
import { BusinessPartnerTestControls } from "@/components/business/BusinessPartnerTestControls";
import {
  partnerEventTypes,
  partnerFrequencies,
  partnerGroupSizes,
  partnerMonthlyFeeUsd,
} from "@/lib/business-partners";
import {
  clearBusinessOnboardingState,
  defaultBusinessOnboardingState,
  isBusinessBasicsComplete,
  isBusinessHostingComplete,
  isBusinessOnboardingComplete,
  loadBusinessOnboardingState,
  saveBusinessOnboardingState,
  type BusinessOnboardingState,
} from "@/lib/business-onboarding";

type OnboardingStep = "basics" | "hosting" | "plan" | "review";

const stepOrder: OnboardingStep[] = ["basics", "hosting", "plan", "review"];

function stepLabel(step: OnboardingStep) {
  switch (step) {
    case "basics":
      return "Business basics";
    case "hosting":
      return "Hosting preferences";
    case "plan":
      return "Partner plan";
    case "review":
      return "Review";
  }
}

function canAdvance(step: OnboardingStep, state: BusinessOnboardingState) {
  switch (step) {
    case "basics":
      return isBusinessBasicsComplete(state);
    case "hosting":
      return isBusinessHostingComplete(state);
    case "plan":
      return state.subscriptionAcknowledged;
    case "review":
      return (
        isBusinessBasicsComplete(state) &&
        isBusinessHostingComplete(state) &&
        state.subscriptionAcknowledged
      );
  }
}

export function BusinessOnboardingFlow() {
  const { userId } = useAuth();
  const storageUserId = userId ?? null;
  const [state, setState] = useState<BusinessOnboardingState>(() => defaultBusinessOnboardingState());
  const [step, setStep] = useState<OnboardingStep>("basics");
  const [hydrated, setHydrated] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      const loaded = loadBusinessOnboardingState(storageUserId);
      setState(loaded);
      setHydrated(true);
      if (isBusinessOnboardingComplete(loaded)) {
        return;
      }
      if (!isBusinessBasicsComplete(loaded)) {
        setStep("basics");
        return;
      }
      if (!isBusinessHostingComplete(loaded)) {
        setStep("hosting");
        return;
      }
      if (!loaded.subscriptionAcknowledged) {
        setStep("plan");
        return;
      }
      setStep("review");
    }, 0);
    return () => window.clearTimeout(id);
  }, [storageUserId]);

  useEffect(() => {
    if (!hydrated) return;
    saveBusinessOnboardingState(storageUserId, state);
  }, [hydrated, state, storageUserId]);

  const stepIndex = stepOrder.indexOf(step);
  const advanceDisabled = !canAdvance(step, state);

  const fieldClassName =
    "mt-2 w-full rounded-[1rem] border border-black/12 bg-white px-4 py-3 text-sm text-black outline-none focus:border-[var(--v16-blue)] focus:ring-2 focus:ring-[color:rgba(26,92,255,0.18)]";

  const toggleEventType = (eventType: (typeof partnerEventTypes)[number]) => {
    setState((current) => {
      const selected = current.eventTypes.includes(eventType);
      return {
        ...current,
        eventTypes: selected
          ? current.eventTypes.filter((value) => value !== eventType)
          : [...current.eventTypes, eventType],
      };
    });
  };

  const completeOnboarding = () => {
    setState((current) => ({
      ...current,
      completed: true,
    }));
    setShowWelcome(true);
  };

  const resetOnboarding = () => {
    const fresh = defaultBusinessOnboardingState();
    clearBusinessOnboardingState(storageUserId);
    setState(fresh);
    setStep("basics");
    saveBusinessOnboardingState(storageUserId, fresh);
  };

  const applySampleOnboarding = (sample: BusinessOnboardingState) => {
    setState(sample);
    if (!isBusinessBasicsComplete(sample)) {
      setStep("basics");
      return;
    }
    if (!isBusinessHostingComplete(sample)) {
      setStep("hosting");
      return;
    }
    if (!sample.subscriptionAcknowledged) {
      setStep("plan");
      return;
    }
    setStep("review");
  };

  const testControls = (
    <BusinessPartnerTestControls onReset={resetOnboarding} onApplySample={applySampleOnboarding} />
  );

  const progress = useMemo(
    () => [
      { id: "basics" as const, done: isBusinessBasicsComplete(state) },
      { id: "hosting" as const, done: isBusinessHostingComplete(state) },
      { id: "plan" as const, done: state.subscriptionAcknowledged },
      { id: "review" as const, done: state.completed },
    ],
    [state],
  );

  if (!hydrated) {
    return (
      <Card className="p-6 md:p-8">
        <p className="v16-small">Loading your partner profile…</p>
      </Card>
    );
  }

  if (isBusinessOnboardingComplete(state)) {
    return (
      <div className="space-y-8">
        {testControls}
        {showWelcome ? (
          <Card variant="paper" className="p-5 md:p-6" data-testid="partner-onboarding-welcome">
            <p className="v16-kicker">You&apos;re in the preview network</p>
            <p className="v16-small mt-2">
              Explore the host dashboard below. Calendar, analytics, and community use sample preview data until live
              cohort windows ship with the member season.
            </p>
          </Card>
        ) : null}
        <BusinessDashboardHome state={state} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {testControls}
      <section className="max-w-3xl">
        <Badge variant="neutral" className="rounded-full px-3 py-1.5">
          Partner preview
        </Badge>
        <h1 className="v16-h2 mt-4">Host onboarding</h1>
        <p className="v16-small mt-3">
          Tell us about your business, the rituals you want to host, and how you fit the Common Area partner model.
        </p>
      </section>

      <ol className="grid gap-3 sm:grid-cols-4" aria-label="Onboarding progress">
        {progress.map((item, index) => {
          const active = step === item.id;
          return (
            <li
              key={item.id}
              className={`rounded-[1.25rem] border px-4 py-3 ${
                active ? "border-black bg-white" : "border-black/10 bg-white/70"
              }`}
            >
              <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-black/45">Step {index + 1}</p>
              <p className="mt-1 text-sm font-semibold text-black">{stepLabel(item.id)}</p>
              <p className="mt-1 text-xs text-black/55">{item.done ? "Complete" : active ? "In progress" : "Pending"}</p>
            </li>
          );
        })}
      </ol>

      <Card className="p-6 md:p-8">
        {step === "basics" ? (
          <div className="space-y-5">
            <div>
              <p className="v16-kicker">Step 1</p>
              <h2 className="v16-h2 mt-2">Business basics</h2>
              <p className="v16-small mt-2">Who you are and where neighbors will find you.</p>
            </div>
            <label className="block">
              <span className="text-sm font-semibold text-black">Business name</span>
              <input
                className={fieldClassName}
                value={state.businessName}
                onChange={(event) => setState((current) => ({ ...current, businessName: event.target.value }))}
                autoComplete="organization"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-black">Neighborhood</span>
              <input
                className={fieldClassName}
                value={state.neighborhood}
                onChange={(event) => setState((current) => ({ ...current, neighborhood: event.target.value }))}
                autoComplete="address-level2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-black">Category</span>
              <input
                className={fieldClassName}
                value={state.category}
                onChange={(event) => setState((current) => ({ ...current, category: event.target.value }))}
                placeholder="Cafe, studio, gallery…"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-black">Contact email</span>
              <input
                className={fieldClassName}
                type="email"
                value={state.contactEmail}
                onChange={(event) => setState((current) => ({ ...current, contactEmail: event.target.value }))}
                autoComplete="email"
              />
            </label>
          </div>
        ) : null}

        {step === "hosting" ? (
          <div className="space-y-5">
            <div className="space-y-2">
              <p className="v16-kicker">Step 2</p>
              <h2 className="v16-h2 mt-2">Hosting preferences</h2>
              <p className="v16-small mt-2">What kinds of standing nights you want to host for cohorts.</p>
            </div>
            <fieldset>
              <legend className="text-sm font-semibold text-black">Event types</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {partnerEventTypes.map((eventType) => {
                  const selected = state.eventTypes.includes(eventType);
                  return (
                    <button
                      key={eventType}
                      type="button"
                      onClick={() => toggleEventType(eventType)}
                      className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                        selected
                          ? "border-black bg-black text-white"
                          : "border-black/12 bg-white text-black/70 hover:border-black/25"
                      }`}
                    >
                      {eventType}
                    </button>
                  );
                })}
              </div>
            </fieldset>
            <label className="block">
              <span className="text-sm font-semibold text-black">Frequency</span>
              <select
                className={fieldClassName}
                value={state.frequency}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    frequency: event.target.value as BusinessOnboardingState["frequency"],
                  }))
                }
              >
                <option value="">Select frequency</option>
                {partnerFrequencies.map((frequency) => (
                  <option key={frequency} value={frequency}>
                    {frequency}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-black">Typical group size</span>
              <select
                className={fieldClassName}
                value={state.groupSize}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    groupSize: event.target.value as BusinessOnboardingState["groupSize"],
                  }))
                }
              >
                <option value="">Select group size</option>
                {partnerGroupSizes.map((groupSize) => (
                  <option key={groupSize} value={groupSize}>
                    {groupSize}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : null}

        {step === "plan" ? (
          <div className="space-y-5">
            <div>
              <p className="v16-kicker">Step 3</p>
              <h2 className="v16-h2 mt-2">Partner plan</h2>
              <p className="v16-small mt-2">
                Illustrative monthly fee for the preview network. No billing runs in this partner preview.
              </p>
            </div>
            <Card variant="paper" className="p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">Monthly partner fee</p>
              <p className="mt-2 text-3xl font-black text-black">${partnerMonthlyFeeUsd}</p>
              <p className="v16-small mt-3">
                Covers listing in the partner directory, standing-night placement in curated seasons, and read-only
                cohort visibility once the member loop is live.
              </p>
            </Card>
            <label className="flex items-start gap-3 rounded-[1.25rem] border border-black/10 bg-white/80 p-4">
              <input
                type="checkbox"
                className="mt-1"
                checked={state.subscriptionAcknowledged}
                onChange={(event) =>
                  setState((current) => ({ ...current, subscriptionAcknowledged: event.target.checked }))
                }
              />
              <span className="text-sm text-black/75">
                I understand this is a partner preview. The monthly fee is explained for planning only and is not
                charged here.
              </span>
            </label>
          </div>
        ) : null}

        {step === "review" ? (
          <div className="space-y-5">
            <div>
              <p className="v16-kicker">Step 4</p>
              <h2 className="v16-h2 mt-2">Review and join the preview network</h2>
              <p className="v16-small mt-2">Confirm your details before exploring other Common Area hosts.</p>
            </div>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">Business</dt>
                <dd className="mt-1 font-semibold text-black">{state.businessName}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">Neighborhood</dt>
                <dd className="mt-1 font-semibold text-black">{state.neighborhood}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">Category</dt>
                <dd className="mt-1 font-semibold text-black">{state.category}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">Contact</dt>
                <dd className="mt-1 font-semibold text-black">{state.contactEmail}</dd>
              </div>
            </dl>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">Hosting</p>
              <p className="mt-2 text-sm text-black/75">
                {state.eventTypes.join(", ")} · {state.frequency} · {state.groupSize}
              </p>
            </div>
          </div>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 border-t border-black/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Button
            variant="ghost"
            disabled={stepIndex === 0}
            onClick={() => setStep(stepOrder[Math.max(0, stepIndex - 1)])}
          >
            Back
          </Button>
          {step === "review" ? (
            <Button disabled={advanceDisabled} onClick={completeOnboarding}>
              Complete onboarding
            </Button>
          ) : (
            <Button
              disabled={advanceDisabled}
              onClick={() => setStep(stepOrder[Math.min(stepOrder.length - 1, stepIndex + 1)])}
            >
              Continue
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
