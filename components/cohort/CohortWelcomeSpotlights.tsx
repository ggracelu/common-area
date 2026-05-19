"use client";

import { useEffect, useState } from "react";

import "@/components/cohort/cohort-scrapbook.css";

type CohortWelcomeSpotlightsProps = {
  show: boolean;
};

export function CohortWelcomeSpotlights({ show }: CohortWelcomeSpotlightsProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!show) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const showTimer = window.setTimeout(() => setVisible(true), 0);
    const hideTimer = window.setTimeout(() => setVisible(false), 5200);

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, [show]);

  if (!visible) return null;

  return (
    <div className="cohort-welcome-spotlights" data-testid="cohort-welcome-spotlights" aria-hidden="true">
      <div className="cohort-welcome-spotlight cohort-welcome-spotlight--lime" />
      <div className="cohort-welcome-spotlight cohort-welcome-spotlight--blue" />
      <div className="cohort-welcome-spotlight cohort-welcome-spotlight--magenta" />
      <div className="cohort-welcome-spotlight cohort-welcome-spotlight--gold" />
      <p className="cohort-welcome-spotlights-label">Welcome to your common room</p>
    </div>
  );
}
