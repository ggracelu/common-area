# Feature: onboarding funnel

## Goal
A signed-in user can move from account creation through deposit, four activity picks, matching, cohort reveal, cohort room, chat, and bingo bonus tiles.

## Scenarios
- Given a new Clerk user, when they open `/dashboard`, then a `profiles` row exists.
- Given a paid deposit, when the user saves four picks, then onboarding advances to assignment pending.
- Given assignment completes, when the user opens the Future letter, then cohort reveal is marked seen in Supabase.
- Given assignment completes, when the user opens `/cohort`, then roster members are visible.

## Linked tests
- `e2e/smoke.spec.ts`

## References
- [docs/PRODUCT_PLAN.md](../docs/PRODUCT_PLAN.md)
- [docs/DATA_MODEL.md](../docs/DATA_MODEL.md)
