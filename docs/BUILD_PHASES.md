# Common Area Build Phases

## Quality Bar
The project plan is complete only if a future implementation session can begin building without product ambiguity. Each phase below assumes the same MVP flow, entity names, stack, security assumptions, and implementation order described across the other planning docs.

## 1. Bootstrap Repo And Tooling
Purpose:
- Establish the project foundation without building feature logic yet.

Goals:
- Create the Next.js App Router project
- Configure TypeScript, Tailwind, linting, and test tooling
- Add baseline repo docs and environment templates

Main implementation tasks:
- Scaffold the app
- Set up project structure matching `AGENTS.md`
- Add base scripts for dev, lint, typecheck, test, and build
- Add env examples for Clerk, Supabase, Stripe, and Vercel-related config

Dependencies:
- Planning docs finalized

Acceptance criteria:
- Repo runs locally
- Core scripts exist and execute
- Folder structure matches the documented architecture

Out of scope:
- Product features
- Real auth
- Real payment flow

## 2. Landing Page And Brand System
Purpose:
- Create the public entry point and visual system for Common Area.

Goals:
- Launch a strong landing page
- Introduce Crumbs' brand voice visually and in copy
- Make current season discovery visible

Main implementation tasks:
- Build landing page
- Establish typography, color tokens, and layout primitives
- Add current season hero and CTA structure

Dependencies:
- Phase 1

Acceptance criteria:
- Public landing page renders
- Brand system is consistent and reusable
- Season discovery has a clear path

Out of scope:
- Authenticated dashboard
- Deposit flow
- Cohort features

## 3. Clerk Auth And Profile Setup
Purpose:
- Establish identity and user-scoped profile records.

Goals:
- Add sign up and login
- Protect authenticated flows
- Sync Clerk users into `profiles`

Main implementation tasks:
- Integrate Clerk
- Add auth-aware route protection
- Create `profiles` creation/sync flow
- Derive basic onboarding status

Dependencies:
- Phase 1
- Landing routes from Phase 2

Acceptance criteria:
- Users can sign up and log in
- Authenticated session state is visible to the app
- A matching `profiles` row exists for each user

Out of scope:
- Deposit checkout
- Activity selection
- Cohort assignment

## 4. Seasons And Activity Catalog
Purpose:
- Model and surface the active Chicago season and its curated activities.

Goals:
- Add season and activity data model
- Show the current season
- Show the 6 curated activity options

Main implementation tasks:
- Implement `seasons`, `activities`, and `season_activities`
- Build current season page and activity catalog views
- Expose public read access for published/active discovery data

Dependencies:
- Phases 1 and 3

Acceptance criteria:
- Active season can be viewed publicly
- Exactly 6 curated activities are displayed for the MVP season
- The app vocabulary matches the planning docs

Out of scope:
- Payment
- User selections
- Assignment

## 5. Stripe Deposit Flow And Webhook Sync
Purpose:
- Add durable payment collection for seasonal participation.

Goals:
- Collect the $20 deposit
- Persist deposit state in Supabase
- Trust only webhook-confirmed payment outcomes

Main implementation tasks:
- Create server-side Stripe Checkout session flow
- Implement `deposits`
- Add Stripe webhook handling
- Reflect confirmed deposit state in onboarding UX

Dependencies:
- Phases 1, 3, and 4

Acceptance criteria:
- Authenticated users can start checkout
- Successful test payments produce `paid` deposit records
- Client redirects alone do not mark payments complete

Out of scope:
- Refund automation
- Marketplace or subscription billing

## 6. Activity Selection And Onboarding Progression
Purpose:
- Let users commit to their seasonal activities and move toward assignment.

Goals:
- Enforce exactly 4 selections out of 6
- Persist `user_activity_choices`
- Move users into the correct onboarding state

Main implementation tasks:
- Build activity selection UI
- Add validation for exactly 4 selections
- Persist one row per selected activity
- Derive selection and onboarding status

Dependencies:
- Phases 3, 4, and 5

Acceptance criteria:
- Paid users can choose exactly 4 activities
- Invalid selection counts are rejected
- Selections are durable and user-scoped

Out of scope:
- Final cohort grouping
- Chat
- Bingo

## 7. Cohort Assignment And Dashboard
Purpose:
- Group eligible users and give them a durable home view.

Goals:
- Form cohorts of about 15-20 users
- Aim for at least 2 overlapping activities where feasible
- Render a dashboard with cohort and season context

Main implementation tasks:
- Implement `cohorts` and `cohort_members`
- Build server-side assignment flow
- Add dashboard reads for cohort, selections, and schedule context
- Update assignment and onboarding states

Dependencies:
- Phases 3 through 6

Acceptance criteria:
- Eligible users can be assigned to a cohort
- Cohort membership is persisted
- Assigned users can view their dashboard

Out of scope:
- Live chat
- Bingo progress

## 8. Cohort Chat With Supabase Realtime
Purpose:
- Add lightweight live conversation for each cohort.

Goals:
- Persist cohort chat messages
- Broadcast updates with Realtime
- Restrict access to cohort members

Main implementation tasks:
- Implement `chat_messages`
- Build chat UI
- Add Realtime subscriptions for new messages
- Enforce cohort-scoped access rules

Dependencies:
- Phase 7

Acceptance criteria:
- Cohort members can send and receive chat messages
- Messages are visible after reload because they are persisted
- Non-members cannot access the cohort chat

Out of scope:
- Rich moderation tooling
- Media attachments

## 9. Bingo Prompts And Completion Tracking
Purpose:
- Add seasonal engagement loops beyond chat.

Goals:
- Define a bingo card and prompts
- Persist user completion state
- Surface progress in the dashboard

Main implementation tasks:
- Implement `bingo_cards`, `bingo_prompts`, and `bingo_completions`
- Build bingo card or prompts UI
- Add completion actions and progress display

Dependencies:
- Phases 4 and 7

Acceptance criteria:
- Eligible users can view bingo prompts
- Users can mark prompts complete
- Completion state persists across sessions

Out of scope:
- Advanced gamification
- Rewards marketplace

## 10. QA, Trust/Safety, Analytics, And Launch Hardening
Purpose:
- Prepare the MVP for stable testing and a credible first launch.

Goals:
- Improve reliability
- Validate security assumptions
- Add instrumentation for product learning

Main implementation tasks:
- Add end-to-end coverage for core flows
- Review RLS policies and privileged paths
- Add error handling and observability
- Add baseline analytics for funnel and engagement metrics
- Review trust/safety copy and operational safeguards

Dependencies:
- Phases 1 through 9

Acceptance criteria:
- Core MVP journey is tested end to end
- Security assumptions are reflected in code and policy
- Product metrics can be measured

Out of scope:
- Full admin suite
- Multi-city rollout
- Native mobile app
