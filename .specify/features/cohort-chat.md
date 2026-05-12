# Feature: cohort chat

## Scenarios
- Given an assigned cohort member, when they open `/cohort/chat`, then seeded thread copy is visible.
- Given a signed-in member, when they send a message, then it appears in the local demo thread until DB chat ships.
- Given any visitor on `/cohort/chat`, when the page loads, then `cohort-chat-demo-label` states that seeded and local messages are not server-persisted or realtime.
- Given keyboard focus on the composer, when the user types and activates Send, then the control exposes an accessible label and does not claim Slack-style threading.

## Linked tests
- `e2e/smoke.spec.ts`
- `e2e/grader-journey.spec.ts`
