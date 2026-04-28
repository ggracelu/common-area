# WhyNot Data Model

## Modeling Principles
- Supabase Postgres is the source of truth for app data.
- Clerk identity maps to application-level `profiles`.
- All user-scoped data must respect RLS.
- Payment and assignment internals are server-controlled.
- Derived user state should come from persisted records, not client assumptions.

## Core Enums And Derived States

### Season Status
`draft | published | active | closed`

### Deposit Status
`pending | paid | refunded | failed`

### Assignment Status
`not_started | pending | assigned`

### Onboarding Status
`created | deposit_pending | selection_pending | assignment_pending | active`

### Selection Status
Recommended derived values:
`not_started | in_progress | completed`

Selection status is derived from the number and validity of `user_activity_choices` rows for the active season.

## Entity Overview
- `profiles`
- `seasons`
- `activities`
- `season_activities`
- `deposits`
- `user_activity_choices`
- `cohorts`
- `cohort_members`
- `chat_messages`
- `bingo_cards`
- `bingo_prompts`
- `bingo_completions`

## profiles
Purpose:
- Application-facing user record connected to Clerk identity

Key fields:
- `id` UUID
- `clerk_user_id` unique text
- `username` or display handle
- `first_name`
- `last_name`
- `home_city`
- `onboarding_status`
- `created_at`
- `updated_at`

Relationships:
- one profile can have many `deposits`
- one profile can have many `user_activity_choices`
- one profile can have many `cohort_members`
- one profile can author many `chat_messages`
- one profile can have many `bingo_completions`

Ownership rules:
- owned by the authenticated user tied to the matching Clerk identity

Important constraints:
- one profile per Clerk user
- onboarding state should align with deposit, selection, and assignment records

RLS intent:
- user can read and update only their own profile

## seasons
Purpose:
- Defines each seasonal program instance for Chicago

Key fields:
- `id` UUID
- `slug`
- `name`
- `city`
- `status`
- `starts_at`
- `ends_at`
- `signup_opens_at`
- `signup_closes_at`
- `created_at`
- `updated_at`

Relationships:
- one season has many `season_activities`
- one season has many `deposits`
- one season has many `user_activity_choices`
- one season has many `cohorts`
- one season can have one or more `bingo_cards`

Ownership rules:
- platform-controlled

Important constraints:
- MVP assumes one Chicago season is active at a time

RLS intent:
- published and active season data can be public-read

## activities
Purpose:
- Canonical activity and small-business experience records

Key fields:
- `id` UUID
- `title`
- `description`
- `business_name`
- `location_name`
- `address_text`
- `category`
- `created_at`
- `updated_at`

Relationships:
- one activity can appear in many `season_activities`
- one activity can appear in many `user_activity_choices`

Ownership rules:
- platform-controlled

Important constraints:
- activity records are reusable across seasons

RLS intent:
- public-read when attached to visible seasons

## season_activities
Purpose:
- Join table linking a season to its curated activity set

Key fields:
- `id` UUID
- `season_id`
- `activity_id`
- `display_order`
- `is_active`
- `created_at`

Relationships:
- belongs to one `season`
- belongs to one `activity`

Ownership rules:
- platform-controlled

Important constraints:
- each MVP season exposes exactly 6 curated activities
- no duplicate `activity_id` within the same season

RLS intent:
- public-read for published and active seasons

## deposits
Purpose:
- Tracks the $20 seasonal participation deposit and its payment lifecycle

Key fields:
- `id` UUID
- `profile_id`
- `season_id`
- `amount_cents`
- `currency`
- `status`
- `stripe_checkout_session_id`
- `stripe_payment_intent_id`
- `paid_at`
- `refunded_at`
- `created_at`
- `updated_at`

Relationships:
- belongs to one `profile`
- belongs to one `season`

Ownership rules:
- user can read their own deposit records
- payment status transitions are server-controlled

Important constraints:
- one active deposit record per user per season
- amount is fixed to the MVP seasonal deposit value
- payment completion is driven by Stripe webhook confirmation

RLS intent:
- users can read only their own deposits
- privileged status writes happen server-side only

## user_activity_choices
Purpose:
- Stores a user's selected activities for a season

Key fields:
- `id` UUID
- `profile_id`
- `season_id`
- `activity_id`
- `choice_rank`
- `created_at`
- `updated_at`

Relationships:
- belongs to one `profile`
- belongs to one `season`
- references one `activity`

Ownership rules:
- owned by the selecting user until selection is locked for assignment

Important constraints:
- a user must choose exactly 4 activities
- no duplicate activity for the same user and season
- selections must refer to activities curated for the same season

RLS intent:
- user can read and manage only their own choices

## cohorts
Purpose:
- Represents a seasonal group of users

Key fields:
- `id` UUID
- `season_id`
- `name` or cohort code
- `assignment_status`
- `created_at`
- `updated_at`

Relationships:
- belongs to one `season`
- has many `cohort_members`
- has many `chat_messages`

Ownership rules:
- platform-controlled

Important constraints:
- cohorts target 15-20 members

RLS intent:
- readable only to cohort members and trusted admins/server flows

## cohort_members
Purpose:
- Join table linking users to cohorts

Key fields:
- `id` UUID
- `cohort_id`
- `profile_id`
- `season_id`
- `assignment_status`
- `joined_at`
- `created_at`

Relationships:
- belongs to one `cohort`
- belongs to one `profile`
- belongs to one `season`

Ownership rules:
- server-controlled assignment records

Important constraints:
- one user should belong to at most one active cohort per season
- cohort assignment should aim for at least 2 overlapping activities, but assignment is best-effort if perfect grouping is impossible

RLS intent:
- user can read only their own membership and the membership roster of their cohort

## chat_messages
Purpose:
- Durable cohort chat message stream

Key fields:
- `id` UUID
- `cohort_id`
- `profile_id`
- `body`
- `created_at`
- `updated_at`

Relationships:
- belongs to one `cohort`
- belongs to one authoring `profile`

Ownership rules:
- authored by a cohort member

Important constraints:
- chat belongs to a cohort
- message must be persisted before realtime fan-out

RLS intent:
- cohort members can read messages in their cohort
- cohort members can create messages in their cohort

## bingo_cards
Purpose:
- Defines a season's bingo/scavenger-hunt card container

Key fields:
- `id` UUID
- `season_id`
- `title`
- `description`
- `created_at`
- `updated_at`

Relationships:
- belongs to one `season`
- has many `bingo_prompts`

Ownership rules:
- platform-controlled

Important constraints:
- MVP can use one primary card per active season

RLS intent:
- readable to eligible season participants

## bingo_prompts
Purpose:
- Individual prompts or squares on a bingo card

Key fields:
- `id` UUID
- `bingo_card_id`
- `prompt_text`
- `prompt_order`
- `created_at`

Relationships:
- belongs to one `bingo_card`
- can have many `bingo_completions`

Ownership rules:
- platform-controlled

Important constraints:
- prompt ordering should be stable for the season

RLS intent:
- readable to eligible season participants

## bingo_completions
Purpose:
- User progress against bingo prompts

Key fields:
- `id` UUID
- `profile_id`
- `season_id`
- `cohort_id`
- `bingo_prompt_id`
- `completed_at`
- `created_at`

Relationships:
- belongs to one `profile`
- belongs to one `season`
- belongs to one `cohort`
- belongs to one `bingo_prompt`

Ownership rules:
- completion belongs to the user who completed the prompt

Important constraints:
- bingo progress belongs to a user within a season/cohort context
- duplicate completion of the same prompt by the same user should be prevented

RLS intent:
- user can read and manage only their own completion state
- cohort-level aggregate views should be derived carefully if exposed later

## Business Rules Summary
- One active deposit record per user per season.
- Each MVP season exposes exactly 6 curated activities.
- A user must choose exactly 4 activities.
- Cohorts target 15-20 members.
- Cohort assignment should aim for at least 2 overlapping activities, but assignment is best-effort if perfect grouping is impossible.
- Chat belongs to a cohort.
- Bingo progress belongs to a user within a season/cohort context.
- Payment and assignment internals are server-controlled.
