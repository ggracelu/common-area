# Feature: cohort chat

## Scenarios
- Given an assigned cohort member, when they open `/cohort/chat`, then seeded thread copy is visible.
- Given a signed-in member, when they send a message, then it appears in the local demo thread until DB chat ships.

## Linked tests
- `e2e/smoke.spec.ts`
