# Feature: onboarding funnel

## Goal
A signed-in user can move from account creation through deposit, four activity picks, matching, cohort reveal, cohort room, chat, and bingo bonus tiles.

## Scenarios
- Given a new Clerk user, when they open `/dashboard`, then a `profiles` row exists.
- Given a paid deposit, when the user saves four picks, then onboarding advances to assignment pending.
- Given assignment completes, when the user opens the Future letter, then cohort reveal is marked seen in Supabase.
- Given assignment completes, when the user opens `/cohort`, then roster members are visible.
- Given a signed-in user on `/dashboard`, when they view Current, then the season progress rail shows deposit, picks, matching, letter, and cohort room with done/pending styling.
- Given matching is complete and the letter is unopened, when the user is on Current, then a cohort-reveal status banner offers the Future tab without blocking checklist `data-testid`s.
- Given matching is not complete, when the user opens the Future tab, then the cohort letter stays locked and no preview assignment is shown.
- Given a user on `/bingo` with four picks committed, when the fold-to-envelope animation completes, then the deposit handoff panel (`bingo-deposit-handoff`) explains the $20 seasonal deposit and links forward to the dashboard after payment when server-backed.

## Linked tests
- `e2e/smoke.spec.ts`
- `e2e/grader-journey.spec.ts`
- `e2e/preview-smoke.spec.ts`

## Authority
- When `SUPABASE_SECRET_KEY` is set, dashboard, bingo, and cohort read `OnboardingSnapshot` from the server; local demo state does not gate assignment or reveal.
- Chat on `/cohort/chat` uses the Postgres `chat_messages` thread when available; local demo chat remains explicitly labeled with `cohort-chat-demo-label`.
- Roster, chat, and bingo progress do not fall back to demo cache when server state says the user is unassigned or the roster is empty.
- Grader undo controls rewind Supabase stages and clear local demo cache for reruns.

## References
- [docs/PRODUCT_PLAN.md](../docs/PRODUCT_PLAN.md)
- [docs/DATA_MODEL.md](../docs/DATA_MODEL.md)
