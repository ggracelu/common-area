# Tooling friction: Claude parallel worktrees vs Cursor

Short learning artifact for grading and team review. This is not product canon.

## What broke or drifted with parallel Claude worktrees

1. **Clerk route protection vs Next 16 proxy** — Preview and alternate branches sometimes lacked the same `proxy.ts` / Clerk wiring as local, so protected routes (for example `/bingo` behind auth) could 500 or behave differently on deploy than on laptop.
2. **Supabase authority lagging UI** — Dashboard and bingo shipped motion and copy before migrations, RLS, and seeds caught up, so “matching” felt real in the browser while Postgres had no deposits, choices, or cohort membership.
3. **Preview environment drift** — Missing or stale `SUPABASE_SECRET_KEY`, Clerk keys, and Stripe secrets on preview made the happy path depend on `localStorage` demo state instead of the server snapshot graders expect.

## What Cursor shipped to stabilize the prototype

- Route protection and auth shell aligned with App Router + Clerk.
- Server onboarding snapshot, deposit recording, activity choices, cohort assignment, and reveal flags behind server actions.
- Migrations, cohort seeds, and grader undo controls so QA can rewind persisted state.
- Playwright smoke plus a grader journey project and preview smoke entry points.

## Takeaway

Parallel UI branches are fine for exploration; **one branch** should own migrations, env templates, and E2E before calling the loop “done.”
