"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { BusinessAnalyticsTab } from "@/components/business/BusinessAnalyticsTab";
import { BusinessCalendarTab } from "@/components/business/BusinessCalendarTab";
import { BusinessCommunityTab } from "@/components/business/BusinessCommunityTab";
import {
  BusinessDashboardNav,
  type BusinessDashboardTab,
} from "@/components/business/BusinessDashboardNav";
import { BusinessDashboardOverviewTab } from "@/components/business/BusinessDashboardOverviewTab";
import { BusinessProfileTab } from "@/components/business/BusinessProfileTab";
import type { BusinessOnboardingState } from "@/lib/business-onboarding";

type BusinessDashboardHomeProps = {
  state: BusinessOnboardingState;
};

export function BusinessDashboardHome({ state }: BusinessDashboardHomeProps) {
  const [activeTab, setActiveTab] = useState<BusinessDashboardTab>("dashboard");

  return (
    <div className="space-y-8">
      <section className="max-w-3xl">
        <Badge variant="neutral" className="rounded-full px-3 py-1.5">
          Partner preview
        </Badge>
        <h1 className="v16-h2 mt-4">{state.businessName || "Your host dashboard"}</h1>
        <p className="v16-small mt-3">
          Sample calendar, analytics, and community views for {state.neighborhood || "your neighborhood"}. Live cohort
          assignment and payouts stay out of this preview.
        </p>
      </section>

      <BusinessDashboardNav activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "dashboard" ? <BusinessDashboardOverviewTab state={state} /> : null}
      {activeTab === "calendar" ? <BusinessCalendarTab /> : null}
      {activeTab === "analytics" ? <BusinessAnalyticsTab /> : null}
      {activeTab === "community" ? <BusinessCommunityTab state={state} /> : null}
      {activeTab === "profile" ? <BusinessProfileTab state={state} /> : null}
    </div>
  );
}
