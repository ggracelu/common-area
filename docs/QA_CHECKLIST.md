# QA Checklist

This checklist provides manual QA flows for testing Common Area features.

## Public Landing Page

### Visual and Functional Checks

- [ ] Page loads without errors
- [ ] All images and assets load correctly
- [ ] Responsive design works on mobile (375px, 414px)
- [ ] Responsive design works on tablet (768px, 1024px)
- [ ] Responsive design works on desktop (1280px, 1440px)
- [ ] Navigation links work correctly
- [ ] Call-to-action buttons are visible and clickable
- [ ] Crumbs mascot appears appropriately (not overused)
- [ ] Brand voice matches guidelines (warm, dry, low-pressure)
- [ ] Design system tokens are applied correctly

### Accessibility Checks

- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Focus indicators are visible
- [ ] ARIA labels are present on interactive elements
- [ ] Color contrast meets WCAG AA standards
- [ ] Screen reader announces content correctly
- [ ] Images have alt text
- [ ] Links have descriptive text

### Performance Checks

- [ ] Page loads within 3 seconds on 3G
- [ ] Lighthouse performance score is 90+
- [ ] No console errors or warnings
- [ ] Images are optimized and lazy-loaded
- [ ] Fonts load without layout shift

## Season Catalog Page

### Functional Checks

- [ ] Page loads without errors
- [ ] Active season is displayed prominently
- [ ] Season details are accurate (name, dates, city)
- [ ] Sign-up button is visible and functional
- [ ] Past seasons are displayed correctly (if applicable)
- [ ] Season status is displayed correctly (draft, published, active, closed)

### Accessibility Checks

- [ ] Keyboard navigation works
- [ ] Focus indicators are visible
- [ ] ARIA labels are present
- [ ] Color contrast meets WCAG AA standards
- [ ] Screen reader announces content correctly

## Sign-Up / Sign-In

### Functional Checks

- [ ] Sign-up flow works end-to-end
- [ ] Sign-in flow works end-to-end
- [ ] Clerk authentication redirects correctly
- [ ] Profile is created in Supabase after sign-up
- [ ] User is redirected to correct page after auth
- [ ] Error states are handled gracefully
- [ ] Logout works correctly

### Accessibility Checks

- [ ] Form fields have labels
- [ ] Error messages are announced to screen readers
- [ ] Focus moves to first error on validation failure
- [ ] Submit button is disabled during submission

## Protected Dashboard

### Functional Checks

- [ ] Dashboard loads only for authenticated users
- [ ] Unauthenticated users are redirected to sign-in
- [ ] User profile information is displayed correctly
- [ ] Onboarding status is displayed correctly
- [ ] Navigation to protected routes works
- [ ] Empty states are handled gracefully

### Accessibility Checks

- [ ] Dashboard is keyboard navigable
- [ ] Focus indicators are visible
- [ ] ARIA labels are present
- [ ] Screen reader announces content correctly

## Stripe Deposit Flow

### Functional Checks

- [ ] Deposit page loads only for authenticated users
- [ ] Deposit page is gated by onboarding status
- [ ] Stripe checkout session creates successfully
- [ ] Deposit record is created in Supabase with `pending` status
- [ ] User is redirected to Stripe checkout
- [ ] Payment completes successfully in test mode
- [ ] Stripe webhook confirms payment
- [ ] Deposit status updates to `paid` in Supabase
- [ ] User is redirected back to app after payment
- [ ] Payment state is never trusted from URL params
- [ ] Error states are handled gracefully

### Security Checks

- [ ] Stripe secret keys are not exposed in client code
- [ ] Webhook signature verification is implemented
- [ ] Payment completion is only confirmed via webhook
- [ ] Client cannot bypass payment

### Accessibility Checks

- [ ] Payment form is keyboard navigable
- [ ] Error messages are announced to screen readers
- [ ] Focus moves to first error on validation failure

## Activity Selection

### Functional Checks

- [ ] Selection page loads only for authenticated users
- [ ] Selection page is gated by deposit status
- [ ] User sees exactly 6 curated activities
- [ ] User can select exactly 4 activities
- [ ] Selection is disabled when 4 activities are chosen
- [ ] User cannot select the same activity twice
- [ ] Selections are persisted to Supabase
- [ ] Selection state is protected by RLS
- [ ] Onboarding status updates after completion
- [ ] User is redirected to next step after completion
- [ ] Error states are handled gracefully

### Accessibility Checks

- [ ] Activity cards are keyboard navigable
- [ ] Selection state is announced to screen readers
- [ ] Focus indicators are visible
- [ ] ARIA labels are present

## Cohort Dashboard

### Functional Checks

- [ ] Dashboard loads only for authenticated users
- [ ] Dashboard is gated by assignment status
- [ ] Cohort information is displayed correctly
- [ ] Cohort members are displayed correctly
- [ ] User's activity selections are displayed
- [ ] Schedule context is displayed correctly
- [ ] Navigation to chat and bingo works
- [ ] Empty states are handled gracefully
- [ ] Error states are handled gracefully

### Accessibility Checks

- [ ] Dashboard is keyboard navigable
- [ ] Focus indicators are visible
- [ ] ARIA labels are present
- [ ] Screen reader announces content correctly

## Cohort Chat

### Functional Checks

- [ ] Chat loads only for cohort members
- [ ] Chat is protected by RLS
- [ ] User can send messages
- [ ] Messages are persisted to Postgres
- [ ] Realtime updates show new messages
- [ ] Message author is displayed correctly
- [ ] Message timestamps are displayed correctly
- [ ] Empty state is handled gracefully
- [ ] Error states are handled gracefully
- [ ] Cross-cohort messaging is prevented

### Accessibility Checks

- [ ] Chat input is keyboard navigable
- [ ] New messages are announced to screen readers
- [ ] Focus indicators are visible
- [ ] ARIA labels are present

## Bingo Prompts

### Functional Checks

- [ ] Bingo page loads only for season participants
- [ ] Bingo is protected by RLS
- [ ] Bingo card displays all prompts
- [ ] User can mark prompts as completed
- [ ] Completions are persisted to Supabase
- [ ] Duplicate completion is prevented
- [ ] Visual feedback shows completed vs. incomplete
- [ ] Progress indicator is displayed
- [ ] Crumbs mascot appears appropriately
- [ ] Empty state is handled gracefully
- [ ] Error states are handled gracefully

### Accessibility Checks

- [ ] Bingo grid is keyboard navigable
- [ ] Completion state is announced to screen readers
- [ ] Focus indicators are visible
- [ ] ARIA labels are present

## Mobile Responsive Checks

### General Checks

- [ ] All pages are responsive on mobile (375px, 414px)
- [ ] All pages are responsive on tablet (768px, 1024px)
- [ ] All pages are responsive on desktop (1280px, 1440px)
- [ ] No horizontal scrolling on mobile
- [ ] Touch targets are at least 44x44px
- [ ] Text is readable without zooming
- [ ] Images scale correctly
- [ ] Navigation is accessible on mobile

### Mobile-Specific Checks

- [ ] Hamburger menu works on mobile
- [ ] Touch gestures work correctly
- [ ] No accidental zooming
- [ ] No accidental scrolling
- [ ] Keyboard doesn't cover inputs

## Accessibility Checks

### General Checks

- [ ] All pages are keyboard navigable
- [ ] Focus indicators are visible
- [ ] ARIA labels are present on interactive elements
- [ ] Color contrast meets WCAG AA standards
- [ ] Screen reader announces content correctly
- [ ] Images have alt text
- [ ] Links have descriptive text
- [ ] Forms have labels
- [ ] Error messages are announced to screen readers
- [ ] Focus moves to first error on validation failure

### Screen Reader Checks

- [ ] Page structure is announced correctly
- [ ] Headings are used correctly
- [ ] Lists are announced correctly
- [ ] Tables are announced correctly
- [ ] Dynamic content is announced correctly
- [ ] Focus is managed correctly

### Keyboard Checks

- [ ] Tab order is logical
- [ ] Enter/Space activates buttons
- [ ] Escape closes modals
- [ ] Arrow keys navigate lists
- [ ] Focus is not trapped

## Cross-Browser Checks

- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge
- [ ] Works on iOS Safari
- [ ] Works on Android Chrome

## Performance Checks

- [ ] Lighthouse performance score is 90+
- [ ] Lighthouse accessibility score is 90+
- [ ] Lighthouse best practices score is 90+
- [ ] Lighthouse SEO score is 90+
- [ ] Page loads within 3 seconds on 3G
- [ ] No console errors or warnings
- [ ] Images are optimized
- [ ] Fonts are optimized
- [ ] JavaScript is minified
- [ ] CSS is minified

## Error Handling Checks

- [ ] Network errors are handled gracefully
- [ ] API errors are handled gracefully
- [ ] Validation errors are handled gracefully
- [ ] Auth errors are handled gracefully
- [ ] Payment errors are handled gracefully
- [ ] Empty states are handled gracefully
- [ ] Loading states are handled gracefully

## Security Checks

- [ ] No secret keys in client code
- [ ] No unsafe public write policies
- [ ] Payment state is not trusted from URL params
- [ ] Cohort data is protected by RLS
- [ ] Chat data is protected by RLS
- [ ] Bingo data is protected by RLS
- [ ] Webhook signature verification is implemented
- [ ] Input validation is implemented
- [ ] Output encoding is implemented
- [ ] CSRF protection is implemented

## Additional Resources

- [docs/AGENT_HANDOFF.md](AGENT_HANDOFF.md) - Agent handoff guide
- [docs/SECURITY_CHECKLIST.md](SECURITY_CHECKLIST.md) - Security checklist
- [AGENTS.md](../AGENTS.md) - Agent handbook
- [.board/](../.board/) - Ticket board
