import { AppShell } from "@/components/app/AppShell";
import { ProfileHome } from "@/components/app/ProfileHome";

export default async function ProfilePage() {
  return (
    <AppShell
      title="Profile"
      description="Your common-room card: neighborhood, prompt vibes, and what you’re currently committed to this season (demo-local)."
    >
      <ProfileHome />
    </AppShell>
  );
}
