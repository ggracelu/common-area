import { SignIn } from "@clerk/nextjs";
import { MinimalAuthShell } from "@/components/site/MinimalAuthShell";

export default function SignInPage() {
  return (
    <MinimalAuthShell title="Sign in.">
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
    </MinimalAuthShell>
  );
}
