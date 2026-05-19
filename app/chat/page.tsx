import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app/AppShell";
import { ChatroomExperience } from "@/components/chat/ChatroomExperience";
import { getCohortChatMessagesForSnapshot } from "@/lib/cohort-chat";
import { ensureAuthenticatedProfile, getOnboardingSnapshotForClerkUser } from "@/lib/onboarding";
import type { CohortChatLoadState } from "@/types/chat";

export const dynamic = "force-dynamic";

export default async function ChatPage() {
  let serverOnboarding = null;
  let serverChat: CohortChatLoadState = { status: "not_configured", messages: [] };

  try {
    const { userId } = await auth();
    if (!userId) {
      redirect("/sign-in");
    }
    await ensureAuthenticatedProfile();
    serverOnboarding = await getOnboardingSnapshotForClerkUser(userId);
    serverChat = await getCohortChatMessagesForSnapshot(serverOnboarding);
  } catch {
    serverOnboarding = null;
    serverChat = { status: "error", messages: [], error: "Unable to load chatroom state." };
  }

  return (
    <AppShell
      title="Cohort chatroom"
      description="One-time anti-networking icebreaker, then a moderated common room thread with Crumbs."
    >
      <ChatroomExperience serverOnboarding={serverOnboarding} serverChat={serverChat} />
    </AppShell>
  );
}
