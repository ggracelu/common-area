import { SignIn } from "@clerk/nextjs";
import { AuthShell } from "@/components/site/AuthShell";

export default function SignInPage() {
  return (
    <AuthShell
      title="Sign in to Common Area."
      description="Your bingo card is your season passport: pick 4 experiences, collect stamps, then meet your cohort when matching drops."
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
