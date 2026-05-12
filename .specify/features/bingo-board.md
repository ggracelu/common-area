# Feature: bingo board

## Scenarios
- Given a visitor, when they open `/bingo`, then the board renders with Crumbs accessible labels.
- Given an assigned member, when they complete a bonus tile, then progress can be saved server-side.
- Given a signed-in user with server onboarding configured, when they view the board header, then deposit status reads from account state and the demo “mark paid” control is hidden.
- Given four picks selected, when the user submits the card, then the envelope fold animation respects `prefers-reduced-motion` and the deposit handoff names Summer 2026 with Crumbs copy before Stripe or mock payment.
- Given a paid deposit on a server-backed account, when the handoff closes, then the user can continue to `/dashboard` for matching without a local postcard button.

## Linked tests
- `e2e/smoke.spec.ts`
- `e2e/grader-journey.spec.ts`
