# Common Area Architecture

## Intended App Structure
The project should be organized to keep routing, domain logic, and infrastructure concerns separate. The current repo/folder may still be named `whynot`, but the visible product name is `Common Area`.

```text
whynot/
  app/
  components/
  lib/
  types/
  public/
  supabase/
  docs/
```

Recommended responsibilities:
- `app/`: App Router routes, layouts, server actions, and route handlers
- `components/`: reusable UI components
- `lib/`: auth glue, Stripe integration, Supabase clients, cohort logic, and domain helpers
- `types/`: shared TypeScript domain types
- `public/`: static assets and future brand assets
- `supabase/`: migrations, RLS policies, and local config

## Major Subsystems
- Public marketing and season discovery
- Authentication and onboarding
- Payments and deposit verification
- Activity catalog
- Activity selection
- Cohort assignment
- Cohort dashboard
- Cohort chat
- Bingo prompts and progress
- Admin/backoffice as later-phase only

## Service Boundaries
- Clerk manages identity and sessions.
- Supabase stores app data, enforces RLS, and powers Realtime.
- Stripe Checkout in test mode collects the $20 deposit.
- Next.js server actions or route handlers handle privileged server-side flows.
- Stripe webhooks update deposit/payment state in Supabase.

## Security Boundaries
- Never trust client-reported payment completion.
- Never use `SUPABASE_SECRET_KEY` in client code.
- Never expose Stripe secret keys in client code.
- All cohort assignment logic runs server-side.
- The browser should not directly perform privileged database writes.
- Chat messages must persist in Postgres before appearing in the UI.
- Realtime enhances the UX but does not replace persisted records.

## Request And Data Flows

### 1. Discover Current Season
1. Browser requests the landing page or current season page.
2. Next.js reads the active or published Chicago season from Supabase.
3. The app renders public season details and curated activity previews.

Data involved:
- `seasons`
- `activities`
- `season_activities`

### 2. Sign Up Or Log In
1. User authenticates through Clerk.
2. On first authenticated entry, the app creates or syncs a `profiles` row through a trusted server-side path.
3. The app derives the user's onboarding state from persisted records.

Data involved:
- Clerk user/session
- `profiles`

### 3. Pay Seasonal Deposit
1. Authenticated user initiates payment from the season flow.
2. Next.js server-side logic creates a Stripe Checkout session.
3. User completes payment on Stripe-hosted UI.
4. Stripe webhook writes the resulting payment state into `deposits`.
5. The app reads the stored deposit status and updates onboarding state.

Data involved:
- Stripe Checkout session
- `deposits`
- `profiles`

### 4. Choose 4 Of 6 Activities
1. User reads the current season's 6 curated options.
2. User submits exactly 4 choices through a server-side action or route handler.
3. The app persists one row per choice in `user_activity_choices`.
4. The app updates the user's derived onboarding progression.

Data involved:
- `season_activities`
- `user_activity_choices`
- `profiles`

### 5. Cohort Assignment
1. A trusted server-side flow identifies users eligible for assignment.
2. The assignment logic groups users into cohorts of about 15-20.
3. The algorithm aims for at least 2 overlapping activities where feasible.
4. The app writes `cohorts` and `cohort_members`.
5. The app updates derived assignment and onboarding state.

Data involved:
- `profiles`
- `deposits`
- `user_activity_choices`
- `cohorts`
- `cohort_members`

### 6. Cohort Dashboard
1. User opens the dashboard.
2. The app reads the user's cohort membership, season context, selected activities, chat preview, and bingo status.
3. The dashboard renders a single home view for the active season.

Data involved:
- `profiles`
- `seasons`
- `user_activity_choices`
- `cohorts`
- `cohort_members`
- `chat_messages`
- `bingo_cards`
- `bingo_prompts`
- `bingo_completions`

### 7. Cohort Chat
1. User submits a chat message from the cohort dashboard or chat view.
2. Authorized server-side or RLS-validated write persists the message in `chat_messages`.
3. Supabase Realtime broadcasts the inserted row to cohort members.
4. Clients update the UI from the persisted message event.

Data involved:
- `cohort_members`
- `chat_messages`

### 8. Bingo Prompts And Progress
1. User reads the season's bingo card and prompts.
2. User marks a prompt complete through an authenticated write.
3. Completion state is stored in `bingo_completions`.
4. The dashboard reads progress from persisted data.

Data involved:
- `bingo_cards`
- `bingo_prompts`
- `bingo_completions`

## Payment Flow
1. Authenticated user starts checkout.
2. Server creates the Stripe Checkout session.
3. Stripe handles payment UI.
4. Stripe webhook confirms payment outcome.
5. Server updates `deposits` and any derived onboarding fields in Supabase.
6. Client reads the new state from the database.

Rules:
- Never mark payment complete from a client redirect alone.
- Payment truth comes from webhook-confirmed server state.
- Stripe only handles the seasonal deposit for MVP.

## Realtime Flow
1. A durable database write occurs first.
2. Supabase Realtime publishes the change.
3. Authorized cohort clients receive the update.
4. UI refreshes from the persisted event payload.

Primary realtime use cases:
- Cohort chat
- Live dashboard updates related to cohort activity

## Cohort Assignment Flow
1. Filter users with a `paid` deposit for the active season.
2. Filter users with exactly 4 valid `user_activity_choices`.
3. Run server-side grouping logic.
4. Create `cohorts`.
5. Create `cohort_members`.
6. Move users into an assigned onboarding state.

Implementation note:
- Assignment is best-effort. The system should optimize for overlap without blocking the entire season if perfect groupings are impossible.

## Architecture Rules
- Never trust client-reported payment completion.
- Never use `SUPABASE_SECRET_KEY` in client code.
- All cohort assignment logic runs server-side.
- Chat messages persist in Postgres before appearing in the UI.
- Season, activity, cohort, and user-facing records should use stable UUIDs.
- The browser should not directly perform privileged database writes.
