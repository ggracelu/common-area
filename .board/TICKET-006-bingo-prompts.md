# TICKET-006: Bingo Prompts

## Owner
- Agent: Frontend/Content agent
- Branch: `feat/bingo-prompts`
- Worktree: `/Users/gracelu/Desktop/mpcs/whynot-qa`

## Goal
Implement seasonal bingo/scavenger-hunt prompts and completion tracking.

## Scope
- `app/dashboard/cohort/[id]/bingo/` - Bingo pages
- `components/bingo/` - Bingo UI components
- `lib/supabase/bingo.ts` - Bingo data access
- `supabase/migrations/` - bingo_cards, bingo_prompts, bingo_completions tables (if not already created)
- `app/api/bingo/` - Bingo API routes (if needed)

## Out of scope
- Do not modify the landing page
- Do not modify Stripe deposit flow
- Do not modify activity selection
- Do not modify cohort assignment
- Do not modify chat
- Do not allow users to create their own prompts
- Do not expose bingo to non-participants

## Dependencies
- TICKET-004 (cohort assignment must be complete)

## Acceptance criteria
- [ ] npm run lint passes
- [ ] npm run typecheck passes
- [ ] npm run build passes
- [ ] Only season participants can access bingo
- [ ] Bingo card displays all prompts for the season
- [ ] Users can mark prompts as completed
- [ ] Completions are persisted to `bingo_completions` table
- [ ] Duplicate completion of the same prompt by the same user is prevented
- [ ] Bingo progress is protected by RLS (user can read/manage only their own completions)
- [ ] Visual feedback shows completed vs. incomplete prompts
- [ ] Crumbs mascot appears in empty states or completion celebrations

## Handoff notes
**Business rules:**
- MVP can use one primary card per active season
- Bingo progress belongs to a user within a season/cohort context
- Duplicate completion of the same prompt by the same user should be prevented

**Data model:**
- `bingo_cards` table defines season's bingo card
- `bingo_prompts` table stores individual prompts
- `bingo_completions` table tracks user progress

**RLS intent:**
- readable to eligible season participants
- user can read and manage only their own completion state

**Content guidelines:**
- Prompts should be social, low-pressure, and aligned with Common Area values
- Use Crumbs voice: warm, dry, observant, slightly funny
- Prompts should encourage real-world interaction, not just app usage
- Examples: "Introduce yourself to someone new", "Share a photo from an activity", etc.

**UI considerations:**
- Grid layout for bingo card
- Clear visual distinction between completed and incomplete
- Celebration animation on completion
- Progress indicator

This is the final feature ticket before QA and launch hardening.

## Status
todo
