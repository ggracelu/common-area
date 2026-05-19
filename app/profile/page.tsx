import { AppShell } from "@/components/app/AppShell";
import { ProfileHome } from "@/components/app/ProfileHome";

export default async function ProfilePage() {
  return (
    <AppShell
      title="Profile"
      description="Your common-room card and season checklist — location, progress, and bingo."
    >
      <ProfileHome />
    </AppShell>
  );
}
