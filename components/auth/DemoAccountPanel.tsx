import {
  businessDemoPersonas,
  businessDemoPassword,
  CLERK_TEST_VERIFICATION_CODE,
  demoAccountHintsEnabled,
  DEMO_MEMBER_PASSWORD,
  memberDemoPersonas,
  type BusinessDemoPersona,
  type MemberDemoPersona,
} from "@/lib/demo-accounts";

type DemoAccountPanelProps = {
  variant: "member" | "partner";
};

function PersonaCard({
  persona,
  variant,
}: {
  persona: MemberDemoPersona | BusinessDemoPersona;
  variant: "member" | "partner";
}) {
  const isBusiness = "businessName" in persona;
  const title = isBusiness ? persona.businessName : persona.displayName;
  const subtitle = isBusiness
    ? `${persona.neighborhood} · ${persona.category}`
    : `${persona.neighborhood} · ${persona.tagline}`;
  const password = isBusiness ? businessDemoPassword(persona.id) : DEMO_MEMBER_PASSWORD;

  return (
    <li
      className="rounded-[1rem] border border-black/10 bg-white/90 px-4 py-3 text-sm"
      data-testid={`demo-account-${persona.id}`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/50">{persona.audienceGroup}</p>
      <p className="mt-1 font-semibold text-black">{title}</p>
      <p className="mt-1 text-black/65">{subtitle}</p>
      <p className="mt-2 font-mono text-xs text-black/80">{persona.email}</p>
      <p className="mt-1 font-mono text-xs text-black/70">Password: {password}</p>
      {variant === "partner" ? (
        <p className="mt-1 text-xs text-black/55">
          Email verification code: <span className="font-semibold">{CLERK_TEST_VERIFICATION_CODE}</span>
        </p>
      ) : (
        <p className="mt-1 text-xs text-black/55">
          If Clerk asks for email verification, use code{" "}
          <span className="font-semibold">{CLERK_TEST_VERIFICATION_CODE}</span> on <code>+clerk_test</code> addresses.
        </p>
      )}
    </li>
  );
}

export function DemoAccountPanel({ variant }: DemoAccountPanelProps) {
  if (!demoAccountHintsEnabled()) {
    return null;
  }

  const personas = variant === "member" ? memberDemoPersonas : businessDemoPersonas;
  const signInPath = variant === "member" ? "/sign-in" : "/partner/sign-in";
  const signUpPath = variant === "member" ? "/sign-up" : "/partner/sign-up";

  return (
    <section
      className="mx-auto mb-6 max-w-2xl rounded-[1.5rem] border border-black/12 bg-[color:rgba(255,252,245,0.92)] px-4 py-5 md:px-6"
      data-testid={variant === "member" ? "member-demo-accounts-panel" : "partner-demo-accounts-panel"}
    >
      <p className="v16-kicker">Demo audience accounts</p>
      <h2 className="mt-2 text-base font-semibold text-black">
        Five {variant === "member" ? "member" : "business"} personas for live demos
      </h2>
      <p className="v16-small mt-2">
        Sign in at <span className="font-semibold">{signInPath}</span> or sign up at{" "}
        <span className="font-semibold">{signUpPath}</span>. Passwords are listed on each card.
        {variant === "partner" ? (
          <>
            {" "}
            For every business email below, Clerk verification code is{" "}
            <span className="font-semibold">{CLERK_TEST_VERIFICATION_CODE}</span>.
          </>
        ) : null}
      </p>
      <ul className="mt-4 grid gap-3 md:grid-cols-2">
        {personas.map((persona) => (
          <PersonaCard key={persona.id} persona={persona} variant={variant} />
        ))}
      </ul>
    </section>
  );
}
