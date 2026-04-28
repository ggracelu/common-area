import { SignIn } from "@clerk/nextjs";
import { AuthShell } from "@/components/site/AuthShell";

export default function SignInPage() {
  return (
    <AuthShell
      title="Sign in to Common Area."
      description="Come back to your dashboard, check your onboarding progress, and keep your Chicago social rhythm moving."
    >
      <div className="flex justify-center py-4">
        <SignIn
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
          fallbackRedirectUrl="/dashboard"
          appearance={{
            elements: {
              card: "shadow-none bg-transparent",
              rootBox: "w-full",
            },
          }}
        />
      </div>
    </AuthShell>
  );
}
