# TICKET-003: Activity Selection

## Owner
- Agent: Frontend/Backend agent
- Branch: `feat/activity-selection`
- Worktree: `/Users/gracelu/Desktop/mpcs/whynot-qa`

## Goal
Implement the activity selection flow where users choose exactly 4 of 6 curated activities.

## Scope
- `app/dashboard/selection/` - Activity selection pages
- `components/selection/` - Selection UI components
- `lib/supabase/activities.ts` - Activity data access
- `lib/supabase/selections.ts` - User activity choices operations
- `supabase/migrations/` - user_activity_choices table schema (if not already created)
- `app/api/selection/` - Selection API routes (if needed)

## Out of scope
- Do not modify the landing page
- Do not modify Stripe deposit flow
- Do not add cohort assignment
- Do not add chat
- Do not add bingo
- Do not allow more than 4 selections
- Do not allow duplicate selections

## Dependencies
- TICKET-002 (deposit must be paid before selection is allowed)

## Acceptance criteria
- [ ] npm run lint passes
- [ ] npm run typecheck passes
- [ ] npm run build passes
- [ ] User can only access selection after deposit is paid
- [ ] User sees exactly 6 curated activities for the active season
- [ ] User can select exactly 4 activities
- [ ] Selection is disabled when 4 activities are chosen
- [ ] User cannot select the same activity twice
- [ ] Selections are persisted to `user_activity_choices` table
- [ ] Selection state is protected by RLS (user can only read/write their own)
- [ ] Onboarding status updates to `selection_pending` → `assignment_pending` after completion

## Handoff notes
**Business rules:**
- Each MVP season exposes exactly 6 curated activities
- A user must choose exactly 4 activities
- No duplicate activity for the same user and season
- Selections must refer to activities curated for the same season

**Data model:**
- `user_activity_choices` table stores selections
- `choice_rank` field stores selection order (1-4)
- One profile can have many `user_activity_choices`

**RLS intent:**
- user can read and manage only their own choices

The next agent will use these selections to assign users to cohorts with overlapping interests.

## Status
todo
