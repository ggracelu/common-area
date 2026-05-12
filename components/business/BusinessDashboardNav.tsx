"use client";

export type BusinessDashboardTab = "dashboard" | "calendar" | "analytics" | "community" | "profile";

const tabs: { id: BusinessDashboardTab; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "calendar", label: "Calendar" },
  { id: "analytics", label: "Analytics" },
  { id: "community", label: "Community" },
  { id: "profile", label: "Profile" },
];

type BusinessDashboardNavProps = {
  activeTab: BusinessDashboardTab;
  onTabChange: (tab: BusinessDashboardTab) => void;
};

export function BusinessDashboardNav({ activeTab, onTabChange }: BusinessDashboardNavProps) {
  return (
    <nav className="flex flex-wrap gap-2" aria-label="Business dashboard">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`rounded-full px-4 py-2 text-[0.72rem] font-black uppercase tracking-[0.18em] transition-colors ${
              isActive
                ? "bg-black text-white shadow-[0_18px_55px_rgba(52,36,24,0.14)]"
                : "border border-black/15 bg-white/70 text-black/65 hover:bg-white hover:text-black"
            }`}
            style={{ fontFamily: "var(--v16-mono)" }}
            aria-current={isActive ? "page" : undefined}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
