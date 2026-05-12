# Feature: cohort chat

## Scenarios
- Given an assigned local-demo member, when they open `/cohort/chat`, then seeded thread copy is visible with a local-only banner.
- Given an assigned cohort member with `chat_messages` available, when they open `/cohort/chat`, then the Postgres-backed thread is visible and no realtime badge appears.
- Given a signed-in assigned member, when they send a message, then the composer exposes sending, saved, and retryable error states.
- Given any unassigned visitor on `/cohort/chat`, when the page loads, then no seeded demo thread or roster appears.
- Given local demo chat is in use, when the page loads, then `cohort-chat-demo-label` states that seeded and local messages are not server-persisted or realtime.
- Given keyboard focus on the composer, when the user types and activates Send, then the control exposes an accessible label and does not claim Slack-style threading.

## Linked tests
- `e2e/smoke.spec.ts`
- `e2e/grader-journey.spec.ts`
