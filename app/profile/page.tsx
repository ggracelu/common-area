import { currentUser } from "@clerk/nextjs/server";
import { AppShell } from "@/components/app/AppShell";
import { Card } from "@/components/ui/Card";
import { buildProfilePreviewFromClerkUser } from "@/lib/profile";

export default async function ProfilePage() {
  const user = await currentUser();
  const profilePreview = buildProfilePreviewFromClerkUser(user);

  return (
    <AppShell
      title="Profile foundation"
      description="This page previews how Clerk user data will map into the future profiles table once Supabase arrives."
    >
      <Card className="max-w-3xl">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-[color:rgba(37,34,30,0.62)]">Clerk user id</dt>
            <dd className="mt-1 text-base font-medium">{profilePreview.clerkUserId ?? "Unavailable"}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-[color:rgba(37,34,30,0.62)]">Username</dt>
            <dd className="mt-1 text-base font-medium">{profilePreview.username ?? "Not set"}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-[color:rgba(37,34,30,0.62)]">First name</dt>
            <dd className="mt-1 text-base font-medium">{profilePreview.firstName ?? "Not set"}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-[color:rgba(37,34,30,0.62)]">Last name</dt>
            <dd className="mt-1 text-base font-medium">{profilePreview.lastName ?? "Not set"}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-[color:rgba(37,34,30,0.62)]">Home city</dt>
            <dd className="mt-1 text-base font-medium">{profilePreview.homeCity ?? "Not set"}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-[color:rgba(37,34,30,0.62)]">Onboarding status</dt>
            <dd className="mt-1 text-base font-medium">{profilePreview.onboardingStatus}</dd>
          </div>
        </dl>
      </Card>
    </AppShell>
  );
}
