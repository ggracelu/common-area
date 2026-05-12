import { auth } from "@clerk/nextjs/server";
import { AppShell } from "@/components/app/AppShell";
import { CohortChatDemo } from "@/components/cohort/CohortChatDemo";
import { getCohortChatMessagesForSnapshot } from "@/lib/cohort-chat";
import { ensureAuthenticatedProfile, getOnboardingSnapshotForClerkUser } from "@/lib/onboarding";
import type { CohortChatLoadState } from "@/types/chat";

export const dynamic = "force-dynamic";

export default async function CohortChatPage() {
  let serverOnboarding = null;
  let serverChat: CohortChatLoadState = { status: "not_configured", messages: [] };

  try {
    const { userId } = await auth();
    if (userId) {
      await ensureAuthenticatedProfile();
      serverOnboarding = await getOnboardingSnapshotForClerkUser(userId);
      serverChat = await getCohortChatMessagesForSnapshot(serverOnboarding);
    }
  } catch {
    serverOnboarding = null;
    serverChat = { status: "error", messages: [], error: "Unable to load cohort chat state." };
  }

  return (
    <AppShell
      title="Cohort chat"
      description="Assigned cohort members can send messages through the server-backed thread. Realtime waits until send-then-read is reliable."
    >
      <CohortChatDemo serverOnboarding={serverOnboarding} serverChat={serverChat} />
    </AppShell>
  );
}
