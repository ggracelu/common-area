# TICKET-004: Cohort Assignment

## Owner
- Agent: Backend/Algorithm agent
- Branch: `feat/cohort-assignment`
- Worktree: `/Users/gracelu/Desktop/mpcs/whynot-qa`

## Goal
Implement server-side cohort assignment that groups users based on activity overlap.

## Scope
- `lib/assignment/` - Cohort assignment algorithm
- `lib/supabase/cohorts.ts` - Cohort data access
- `app/api/assignment/` - Assignment trigger endpoint
- `app/dashboard/assignment/` - Assignment status pages
- `supabase/migrations/` - cohorts and cohort_members tables (if not already created)
- `lib/supabase/profiles.ts` - Profile status updates

## Out of scope
- Do not modify the landing page
- Do not modify Stripe deposit flow
- Do not modify activity selection
- Do not add chat
- Do not add bingo
- Do not expose assignment algorithm to client
- Do not allow client-side cohort creation

## Dependencies
- TICKET-003 (activity selection must be complete before assignment)

## Acceptance criteria
- [ ] npm run lint passes
- [ ] npm run typecheck passes
- [ ] npm run build passes
- [ ] Assignment runs server-side only
- [ ] Cohorts target 15-20 members
- [ ] Assignment aims for at least 2 overlapping activities per cohort
- [ ] Assignment is best-effort if perfect grouping is impossible
- [ ] One user belongs to at most one active cohort per season
- [ ] Assignment status updates from `not_started` → `pending` → `assigned`
- [ ] Onboarding status updates to `active` after assignment
- [ ] Cohort data is protected by RLS (readable only to cohort members)

## Handoff notes
**Business rules:**
- Cohorts target 15-20 members
- Cohort assignment should aim for at least 2 overlapping activities
- Assignment is best-effort if perfect grouping is impossible
- One user should belong to at most one active cohort per season

**Data model:**
- `cohorts` table stores cohort records
- `cohort_members` join table links users to cohorts
- `assignment_status` field tracks assignment progress

**RLS intent:**
- readable only to cohort members and trusted admins/server flows
- user can read only their own membership and the membership roster of their cohort

**Algorithm considerations:**
- Group users by activity overlap
- Balance cohort sizes
- Handle edge cases (odd numbers, insufficient overlap)
- Make assignment deterministic for reproducibility

The next agent will build the cohort dashboard and chat features.

## Status
todo
