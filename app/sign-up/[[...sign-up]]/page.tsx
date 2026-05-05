import { SignUp } from "@clerk/nextjs";
import { AuthShell } from "@/components/site/AuthShell";

export default function SignUpPage() {
  return (
    <AuthShell
      title="Join the season before the room fills up."
      description="You’re joining a 6-week season. You’ll commit to 4 experiences, put down a $20 deposit, then get matched into a 20-person cohort based on overlap after the one-week signup window closes."
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
              formButtonPrimary:
                "rounded-[var(--radius-button)] bg-[var(--color-foreground)] text-[var(--color-paper)] shadow-[var(--shadow-button)] hover:bg-[var(--color-accent-dark)]",
              footerActionLink: "text-[var(--color-accent)] hover:text-[var(--color-accent-dark)]",
              formFieldInput:
                "rounded-[1rem] border-[var(--color-line)] bg-white/70 focus:border-[var(--color-accent)] focus:ring-[var(--color-accent)]",
              formFieldLabel: "text-[var(--color-foreground)]",
            },
          }}
        />
      </div>
    </AuthShell>
  );
}
