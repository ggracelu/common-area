import { SignUp } from "@clerk/nextjs";
import { AuthShell } from "@/components/site/AuthShell";

export default function SignUpPage() {
  return (
    <AuthShell
      title="Join the season before the cohort fills up."
      description="Create your account now. Real season signup, deposits, and activity selection come next, but the auth foundation is ready."
    >
      <div className="flex justify-center py-4">
        <SignUp
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
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
