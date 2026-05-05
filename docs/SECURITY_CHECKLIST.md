# Security Checklist

This checklist provides security rules and checks for Common Area.

## Environment Variable Rules

### General Rules

- [ ] Never commit real secrets to the repository
- [ ] Use `.env.example` or `.env.template` for required env vars
- [ ] Keep `.env` files in `.gitignore`
- [ ] Rotate secrets if they are accidentally committed
- [ ] Use different secrets for development, staging, and production

### Public vs. Private Variables

- [ ] Public browser-safe variables use `NEXT_PUBLIC_` prefix
- [ ] Server-only variables do NOT use `NEXT_PUBLIC_` prefix
- [ ] Clerk publishable keys are client-safe
- [ ] Clerk secret keys are server-only
- [ ] Supabase publishable keys are client-safe
- [ ] `SUPABASE_SECRET_KEY` is server-only
- [ ] Stripe publishable keys are client-safe
- [ ] Stripe secret keys are server-only
- [ ] Stripe webhook secrets are server-only

### Required Environment Variables

```bash
# Clerk (auth)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Supabase (database)
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SECRET_KEY=eyJ...

# Stripe (payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Clerk Auth Rules

### General Rules

- [ ] Clerk is the only auth provider
- [ ] All protected routes require authentication
- [ ] Unauthenticated users are redirected to sign-in
- [ ] Clerk identity maps to application-level `profiles`
- [ ] Clerk user ID is stored in `profiles.clerk_user_id`

### Middleware Configuration

- [ ] Clerk middleware is configured correctly
- [ ] Public routes are explicitly allowed
- [ ] Protected routes require authentication
- [ ] API routes respect auth state

### Session Management

- [ ] Sessions are managed by Clerk
- [ ] Session tokens are validated server-side
- [ ] Session expiration is handled correctly
- [ ] Logout invalidates the session

### Profile Creation

- [ ] Profile is created in Supabase after Clerk sign-up
- [ ] Profile is linked to Clerk user ID
- [ ] Profile creation is idempotent
- [ ] Profile creation errors are handled gracefully

## Supabase RLS Rules

### General Rules

- [ ] All user-scoped data respects RLS
- [ ] RLS is enabled on all user-facing tables
- [ ] Public data is explicitly marked as public
- [ ] Server-side jobs use elevated access only outside the browser

### Table-Specific RLS

#### profiles

- [ ] User can read only their own profile
- [ ] User can update only their own profile
- [ ] User cannot delete their own profile (if not allowed)
- [ ] Server can create profiles

#### seasons

- [ ] Published and active seasons are public-read
- [ ] Draft and closed seasons are admin-only
- [ ] Server can create and update seasons

#### activities

- [ ] Activities are public-read when attached to visible seasons
- [ ] Server can create and update activities

#### season_activities

- [ ] Season activities are public-read for published and active seasons
- [ ] Server can create and update season activities

#### deposits

- [ ] Users can read only their own deposits
- [ ] Privileged status writes happen server-side only
- [ ] Server can create deposits
- [ ] Server can update deposit status

#### user_activity_choices

- [ ] User can read only their own choices
- [ ] User can create only their own choices
- [ ] User can update only their own choices (until locked)
- [ ] Server can read all choices (for assignment)

#### cohorts

- [ ] Cohorts are readable only to cohort members and trusted admins
- [ ] Server can create and update cohorts

#### cohort_members

- [ ] User can read only their own membership
- [ ] User can read the membership roster of their cohort
- [ ] Server can create and update cohort memberships

#### chat_messages

- [ ] Cohort members can read messages in their cohort
- [ ] Cohort members can create messages in their cohort
- [ ] Users cannot read messages from other cohorts

#### bingo_cards

- [ ] Bingo cards are readable to eligible season participants
- [ ] Server can create and update bingo cards

#### bingo_prompts

- [ ] Bingo prompts are readable to eligible season participants
- [ ] Server can create and update bingo prompts

#### bingo_completions

- [ ] User can read only their own completions
- [ ] User can create only their own completions
- [ ] User cannot create duplicate completions
- [ ] Server can read all completions (for analytics)

### RLS Testing

- [ ] Test RLS policies with different user roles
- [ ] Test RLS policies with unauthenticated users
- [ ] Test RLS policies with users from different cohorts
- [ ] Test RLS policies with admin users

## Stripe Webhook Rules

### General Rules

- [ ] Webhook signature verification is implemented
- [ ] Webhook endpoint is idempotent
- [ ] Webhook endpoint handles all relevant events
- [ ] Webhook endpoint logs errors appropriately
- [ ] Webhook endpoint returns correct status codes

### Webhook Events

- [ ] `checkout.session.completed` - Mark deposit as paid
- [ ] `checkout.session.async_payment_failed` - Mark deposit as failed
- [ ] `checkout.session.expired` - Handle expired sessions
- [ ] `payment_intent.succeeded` - Confirm payment (if needed)
- [ ] `payment_intent.payment_failed` - Handle failed payment

### Webhook Security

- [ ] Webhook secret is server-only
- [ ] Webhook signature is verified before processing
- [ ] Webhook endpoint is rate-limited
- [ ] Webhook endpoint is idempotent (can be called multiple times)
- [ ] Webhook endpoint does not trust client data

### Payment State Rules

- [ ] Payment state is never trusted from URL params
- [ ] Payment completion is only confirmed via webhook
- [ ] Client cannot bypass payment
- [ ] Payment state is mirrored in Supabase
- [ ] Payment state transitions are server-controlled

## No Secret Keys in Client Code

### General Rules

- [ ] No `SUPABASE_SECRET_KEY` in client code
- [ ] No `CLERK_SECRET_KEY` in client code
- [ ] No `STRIPE_SECRET_KEY` in client code
- [ ] No `STRIPE_WEBHOOK_SECRET` in client code
- [ ] No API keys in client code
- [ ] No database credentials in client code

### Code Review Checklist

- [ ] Check for hardcoded secrets
- [ ] Check for secrets in console.log
- [ ] Check for secrets in error messages
- [ ] Check for secrets in comments
- [ ] Check for secrets in bundle (use `npm run build` and inspect)

## No Unsafe Public Write Policies

### General Rules

- [ ] No public write policies on user data
- [ ] No public write policies on payment data
- [ ] No public write policies on cohort data
- [ ] No public write policies on chat data
- [ ] No public write policies on bingo data

### Write Policy Checklist

- [ ] Write policies are scoped to the user
- [ ] Write policies check ownership
- [ ] Write policies check cohort membership
- [ ] Write policies check business rules
- [ ] Write policies are tested

## Payment State Must Not Be Trusted from URL Params

### General Rules

- [ ] Payment state is never read from URL params
- [ ] Payment state is only read from Supabase
- [ ] Payment state is only updated via webhook
- [ ] Client cannot modify payment state
- [ ] Payment state transitions are server-controlled

### Implementation Checklist

- [ ] Checkout success page does not trust URL params
- [ ] Checkout success page reads payment state from Supabase
- [ ] Checkout success page handles pending payments
- [ ] Checkout success page handles failed payments
- [ ] Checkout success page shows appropriate messaging

## Cohort/Chat Privacy Checks

### Cohort Privacy

- [ ] Cohort data is readable only to cohort members
- [ ] Cohort members cannot see other cohorts
- [ ] Cohort assignment is server-controlled
- [ ] Cohort membership is verified server-side
- [ ] Cohort data is not exposed in API responses

### Chat Privacy

- [ ] Chat messages are readable only to cohort members
- [ ] Chat messages are not exposed to other cohorts
- [ ] Chat messages are persisted before realtime fan-out
- [ ] Chat messages are not stored in client-side storage
- [ ] Chat messages are sanitized to prevent XSS

### Testing Checklist

- [ ] Test with users from different cohorts
- [ ] Test with unauthenticated users
- [ ] Test with admin users
- [ ] Test chat message visibility
- [ ] Test cohort member visibility

## Basic Abuse/Moderation Risks

### General Risks

- [ ] Rate limiting is implemented on API routes
- [ ] Input validation is implemented on all inputs
- [ ] Output encoding is implemented on all outputs
- [ ] CSRF protection is implemented
- [ ] XSS protection is implemented

### Chat Abuse

- [ ] Chat messages are rate-limited
- [ ] Chat messages are sanitized
- [ ] Chat messages are logged
- [ ] Chat messages can be reported
- [ ] Chat messages can be deleted by admins

### User Abuse

- [ ] User profiles are rate-limited
- [ ] User profiles are validated
- [ ] User profiles can be reported
- [ ] User profiles can be suspended
- [ ] User profiles can be deleted

### Payment Abuse

- [ ] Payment attempts are rate-limited
- [ ] Payment attempts are logged
- [ ] Payment failures are monitored
- [ ] Payment fraud is detected
- [ ] Payment refunds are handled

## Additional Security Considerations

### Data Privacy

- [ ] Personal data is minimized
- [ ] Personal data is encrypted at rest
- [ ] Personal data is encrypted in transit
- [ ] Personal data is retained only as long as necessary
- [ ] Personal data can be deleted on request

### Logging and Monitoring

- [ ] Security events are logged
- [ ] Errors are logged appropriately
- [ ] Logs do not contain secrets
- [ ] Logs are monitored
- [ ] Alerts are configured for security events

### Dependency Security

- [ ] Dependencies are kept up to date
- [ ] Dependencies are scanned for vulnerabilities
- [ ] Vulnerable dependencies are patched
- [ ] Dependency updates are tested
- [ ] Dependency updates are documented

### Deployment Security

- [ ] Environment variables are set correctly
- [ ] Secrets are managed securely
- [ ] Access is restricted to authorized users
- [ ] Deployment is automated
- [ ] Deployment is audited

## Additional Resources

- [docs/AGENT_HANDOFF.md](AGENT_HANDOFF.md) - Agent handoff guide
- [docs/QA_CHECKLIST.md](QA_CHECKLIST.md) - QA checklist
- [AGENTS.md](../AGENTS.md) - Agent handbook
- [.board/](../.board/) - Ticket board
