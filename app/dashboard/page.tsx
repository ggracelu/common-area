import { currentUser } from "@clerk/nextjs/server";
import { AppShell } from "@/components/app/AppShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { buildProfilePreviewFromClerkUser } from "@/lib/profile";

const onboardingChecklist = [
  "Profile created",
  "Deposit pending",
  "Activities not selected",
  "Cohort not assigned",
];

const dashboardActions = [
  {
    title: "Browse season",
    description: "Preview the current Chicago season and see how the campus feeling is taking shape.",
    href: "/season",
  },
  {
    title: "Pick activities",
    description: "This route is protected now and ready for the interest-driven season flow.",
    href: "/season/select",
  },
  {
    title: "View cohort",
    description: "The destination is scaffolded so recurring cohort work has a home base.",
    href: "/cohort",
  },
  {
    title: "Open bingo card",
    description: "The shell is in place even though the real common-room rituals come later.",
    href: "/bingo",
  },
];

export default async function DashboardPage() {
  const user = await currentUser();
  const profilePreview = buildProfilePreviewFromClerkUser(user);
  const greetingName =
    profilePreview.firstName || profilePreview.username || "there";

  return (
    <AppShell
      title={`Hi, ${greetingName}.`}
      description="This is the authenticated Common Area shell. Profile persistence, season state, and real onboarding logic will connect in later phases."
    >
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card className="bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(248,226,196,0.82))]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
            Onboarding preview
          </p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight">
            Current status: {profilePreview.onboardingStatus.replaceAll("_", " ")}
          </h2>
          <ul className="mt-6 grid gap-3">
            {onboardingChecklist.map((item, index) => (
              <li
                key={item}
                className="flex items-center gap-3 rounded-[1.25rem] bg-white/78 px-4 py-3 text-sm font-medium text-[color:rgba(37,34,30,0.82)]"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-foreground)] text-[var(--color-background)]">
                  {index + 1}
                </span>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm font-medium text-[color:rgba(37,34,30,0.72)]">
            Crumbs says: showing up counts. Your spot is still here.
          </p>
        </Card>

        <div className="grid gap-5 md:grid-cols-2">
          {dashboardActions.map((action) => (
            <Card key={action.title} className="flex h-full flex-col justify-between">
              <div>
                <h3 className="text-2xl font-semibold tracking-tight">{action.title}</h3>
                <p className="mt-4 text-base leading-7 text-[color:rgba(37,34,30,0.72)]">
                  {action.description}
                </p>
              </div>
              <div className="mt-6">
                <Button href={action.href}>Open</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
