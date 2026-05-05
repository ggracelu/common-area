# TICKET-005: Cohort Chat

## Owner
- Agent: Realtime/Frontend agent
- Branch: `feat/cohort-chat`
- Worktree: `/Users/gracelu/Desktop/mpcs/whynot-qa`

## Goal
Implement cohort chat with Supabase Realtime for live messaging.

## Scope
- `app/dashboard/cohort/[id]/chat/` - Chat pages
- `components/chat/` - Chat UI components
- `lib/supabase/chat.ts` - Chat data access and realtime subscriptions
- `lib/supabase/realtime.ts` - Realtime utilities
- `supabase/migrations/` - chat_messages table schema (if not already created)
- `app/api/chat/` - Chat API routes (if needed for server-side operations)

## Out of scope
- Do not modify the landing page
- Do not modify Stripe deposit flow
- Do not modify activity selection
- Do not modify cohort assignment
- Do not add bingo
- Do not allow cross-cohort messaging
- Do not expose chat to non-cohort members

## Dependencies
- TICKET-004 (cohort assignment must be complete)

## Acceptance criteria
- [ ] npm run lint passes
- [ ] npm run typecheck passes
- [ ] npm run build passes
- [ ] Only cohort members can access their cohort's chat
- [ ] Chat messages are persisted to Postgres before appearing in UI
- [ ] Realtime updates show new messages without page refresh
- [ ] Chat is protected by RLS (cohort members can read/write only their cohort's messages)
- [ ] Message author is linked to profile
- [ ] Empty state and loading states are handled
- [ ] Message timestamps are displayed

## Handoff notes
**Business rules:**
- Chat belongs to a cohort
- Message must be persisted before realtime fan-out
- Only cohort members can read and send messages

**Data model:**
- `chat_messages` table stores messages
- `cohort_id` links to cohort
- `profile_id` links to author
- `body` contains message text

**RLS intent:**
- cohort members can read messages in their cohort
- cohort members can create messages in their cohort

**Realtime setup:**
- Use Supabase Realtime for live updates
- Subscribe to cohort-specific channel
- Handle connection states gracefully
- Consider message ordering and deduplication

**Security:**
- Never trust client-side cohort ID
- Always verify membership server-side
- Sanitize message content to prevent XSS

The next agent will add bingo prompts and completion tracking.

## Status
todo
