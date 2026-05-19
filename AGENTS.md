# Common Area Agent Handbook

## Mission
Common Area helps Gen Z young adults in Chicago build a campus feeling after college through recurring, interest-driven cohorts hosted by local businesses. The product replaces swiping, one-off meetups, and generic event browsing with repeated presence, familiar faces, and a social rhythm anchored in real neighborhood spaces.

## Product Summary
Common Area is a seasonal, cohort-based social platform for Chicago. Users discover the current season, sign up, pay a $20 seasonal deposit, choose 4 of 6 curated activities, and get assigned to a cohort of about 15-20 people with meaningful activity overlap. After assignment, they return to a shared dashboard for schedule context, cohort chat, and bingo/scavenger-hunt prompts.

Core promise: turn your city into a campus.

Important repository note:
- The visible product name is **Common Area**.
- The GitHub repository is **ggracelu/common-area**; npm package name is **common-area**.
- The local checkout folder may still be named `whynot` on disk until renamed manually.

## Target Audience
- Gen Z young adults in Chicago
- Users seeking friendship, community, and recurring low-pressure social interaction
- Users who want a campus-like social rhythm after college
- Users who are tired of swiping, awkward cold starts, or one-off social events with no follow-through

## MVP Success Criteria
The MVP is successful when a user can:
- Discover the active Chicago season
- Create an account or log in
- Pay the $20 seasonal deposit
- Choose exactly 4 of 6 curated activities
- Get assigned to a cohort of about 15-20 people
- Return to a dashboard showing their cohort, schedule context, selections, chat, and bingo prompts
- Participate in cohort chat
- Complete bingo/scavenger-hunt prompts during the season

## Planned Stack
- Next.js App Router
- TypeScript
- Tailwind CSS
- Clerk for authentication
- Supabase Postgres, Row Level Security, and Realtime
- Stripe test mode for the seasonal deposit
- Vercel for deployment
- Supabase MCP and Playwright MCP later for development/testing workflows

## Intended Repo Structure
This project starts documentation-first. When the app is scaffolded later, prefer this structure:

```text
common-area/
  AGENTS.md
  docs/
    PRODUCT_PLAN.md
    ARCHITECTURE.md
    DATA_MODEL.md
    BUILD_PHASES.md
  app/
  components/
  lib/
  types/
  public/
  supabase/
  tests/
  e2e/
```

Notes:
- `app/` is for App Router routes, layouts, and route handlers.
- `components/` is for reusable UI.
- `lib/` is for server-side integrations, domain logic, and data access helpers.
- `types/` is for shared domain types.
- `supabase/` is for migrations, policies, and local config once that work begins.

Brand notes:
- Crumbs the Cat is the mascot and tonal guide.
- Crumbs is Common Area's resident lounge cat: cozy, observant, quietly funny, and low-pressure.
- The product should feel warm, editorial, youthful, trustworthy, and communal.
- The tone should be more campus common room than spontaneous dare.

## Default Commands
Once the app exists, use these as the baseline local commands:

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
```

## Architecture Guardrails
- Use Next.js App Router only.
- Use TypeScript across application code.
- Clerk is the only auth provider.
- Supabase Postgres is the source of truth for app data.
- All user-scoped data must respect RLS.
- Stripe only handles the seasonal deposit.
- Payment state must be mirrored in Supabase.
- Never trust client-reported payment completion.
- Trust payment completion only through webhook-confirmed server state.
- Cohort assignment logic must run server-side.
- Realtime is for cohort chat and live dashboard updates, not a replacement for persisted state.
- Chat messages must persist in Postgres before they appear in the UI.
- The browser must not directly perform privileged database writes.
- Use stable UUIDs for season, activity, cohort, and other user-facing records.

## Security Rules
- Never expose `SUPABASE_SECRET_KEY` in client code.
- Never expose Stripe secret keys in client code.
- Never bypass RLS for user-facing browser access.
- Treat payment and assignment internals as server-controlled workflows.
- Only webhook-confirmed payment events can move a deposit into a paid state.
- Restrict cohort data, chat, and bingo progress to cohort members only.
- Do not put sensitive business logic in client components.
- Log carefully and avoid storing unnecessary personal data.

## Coding Conventions
- Prefer server components by default; use client components only where interactivity requires them.
- Keep page components thin and move domain logic into `lib/`.
- Define shared domain types early and reuse them consistently.
- Use explicit, readable names matching the data model docs.
- Keep asynchronous flows idempotent where practical, especially for payments and assignment.
- Avoid overengineering the MVP. Build the smallest durable version that fits the product docs.
- Favor accessibility, fast page loads, and clear empty/loading/error states.
- Preserve the Common Area positioning: recurring cohorts, familiar faces, shared interests, and local businesses as campus-like third places.

## RLS-First Database Rules
- Public discovery data may be readable without auth only when intentionally marked public.
- `profiles`, `deposits`, and `user_activity_choices` are user-scoped and must be protected by ownership-aware RLS.
- `cohorts`, `cohort_members`, `chat_messages`, and bingo progress must only be readable to the appropriate cohort members.
- Server-side jobs may use elevated Supabase access only outside the browser and only for trusted workflows such as payment reconciliation or cohort assignment.
- Derived user status in the app must come from persisted database state, not from client assumptions.

## Environment Variable Policy
- Public browser-safe environment variables must use the `NEXT_PUBLIC_` prefix.
- Clerk publishable keys are client-safe; Clerk secret keys are server-only.
- Supabase publishable keys may be exposed only for intended client usage.
- `SUPABASE_SECRET_KEY` is server-only.
- Stripe publishable keys are client-safe; Stripe secret keys and webhook secrets are server-only.
- Never commit real secrets.
- Maintain `.env.example` or equivalent templates once the app is scaffolded.

## Domain Vocabulary
Use the same terms across code and docs:
- `profiles`
- `seasons`
- `activities`
- `season_activities`
- `deposits`
- `user_activity_choices`
- `cohorts`
- `cohort_members`
- `chat_messages`
- `bingo_cards`
- `bingo_prompts`
- `bingo_completions`

Core statuses:
- season status: `draft | published | active | closed`
- deposit status: `pending | paid | refunded | failed`
- assignment status: `not_started | pending | assigned`
- onboarding status: `created | deposit_pending | selection_pending | assignment_pending | active`

## Phase-by-Phase Implementation Sequence
Build in this order and do not skip foundational dependencies:

1. Bootstrap repo and tooling
2. Landing page and brand system
3. Clerk auth and profile setup
4. Seasons and activity catalog
5. Stripe deposit flow and webhook sync
6. Activity selection and onboarding progression
7. Cohort assignment and dashboard
8. Cohort chat with Supabase Realtime
9. Bingo prompts and completion tracking
10. QA, trust/safety, analytics, and launch hardening

## Delivery Expectations For Future Codex Sessions
- Start by reading `AGENTS.md` and the docs in `docs/`.
- Preserve cross-file consistency in naming and workflow.
- Do not introduce features that conflict with MVP non-goals.
- When making schema or architecture choices, align them to the docs unless the user explicitly changes the plan.
