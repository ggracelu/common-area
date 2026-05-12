# Grader walkthrough

## Local setup
1. Copy `.env.example` to `.env.local` and fill Clerk, Supabase, and optional Stripe test keys.
2. Run `supabase db reset` to apply migrations and seeds (`seed.sql`, `seed_cohorts.sql`, `seed_gamification.sql`).
3. Start the app with `npm run dev`.

## Happy path
1. `/sign-up` → create a Clerk test user.
2. `/dashboard` bootstraps a `profiles` row.
3. `/bingo` → choose four experiences and submit.
4. Pay the deposit with Stripe when configured, or use the demo deposit path when checkout returns `501`.
5. Return to `/dashboard` for matching, open **Future** for the cohort letter, then visit `/cohort` and `/cohort/chat`.
6. `/bingo` bonus tiles unlock after assignment.

## QA
- `npm run typecheck`
- `npm run build`
- `npm run test` for local Playwright smoke
- `PLAYWRIGHT_BASE_URL=<preview-url> npm run test:preview` for deploy smoke

## Spec Kit
Living specs live in `.specify/` and link to `docs/PRODUCT_PLAN.md` without duplicating product canon.

## Tooling friction note
Parallel worktrees and preview env drift made Clerk middleware and Supabase RLS gaps harder to spot than local UI work. Cursor helped land route protection and demo-state fixes quickly; database authority still needed explicit migrations, seeds, and server actions.
