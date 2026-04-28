# WhyNot Product Plan

## One-Line Description
WhyNot is a seasonal social platform that groups Gen Z Chicago users into local activity cohorts with no swiping or bio-based matching.

## Problem Statement
Young adults often want community but dislike the friction of swiping, the pressure of profile-based matching, and the randomness of one-off social events. Many existing products create attention loops instead of repeated, low-stakes familiarity. WhyNot addresses that gap by turning social discovery into a seasonal commitment around curated local activities and small businesses.

## Target User
- Gen Z young adults in Chicago
- Users looking for friendship, social momentum, and recurring shared experiences
- Users who want structured participation without dating-style matching
- Users who prefer a playful, low-pressure product tone but still expect trust and operational competence

## Core Product Loop
- Discover the season
- Join the season
- Pay the $20 deposit
- Choose 4 of 6 activities
- Get assigned to a cohort
- Return for dashboard, chat, and bingo prompts

The loop should make social participation feel easy to start, easy to continue, and more rewarding with repetition.

## MVP Journey
1. User discovers the current Chicago season.
2. User signs up or logs in.
3. User pays a $20 seasonal deposit.
4. User chooses 4 of 6 curated activities.
5. User gets assigned into a cohort of about 15-20 people.
6. The cohort should share activity overlap, ideally at least 2 shared activities.
7. User returns to a dashboard showing their cohort, schedule context, activity selections, chat, and bingo prompts.
8. User participates in a cohort chat.
9. User completes a seasonal bingo/scavenger-hunt card.

## MVP Pages
- Landing page
- Authentication entry points
- Current season page
- Deposit checkout handoff and return states
- Activity selection page
- Assignment pending/processing state
- Cohort dashboard
- Cohort chat view
- Bingo card or seasonal prompts view

## Core Features
- Public season discovery for Chicago
- Account creation and login
- Seasonal deposit collection with Stripe test mode
- Curated activity catalog limited to 6 options per season
- Activity selection with exactly 4 choices per user
- Server-side cohort assignment based on overlap
- Cohort dashboard with schedule context and selected activities
- Cohort chat
- Bingo/scavenger-hunt prompts and completion tracking

## Wally Brand Voice
Wally the pigeon is the mascot and tonal guide for the brand.

Wally should feel:
- playful
- chaotic in a charming way
- socially warm
- encouraging
- local and memorable

Wally should not make the product feel:
- childish
- flaky
- careless with trust and safety
- careless with payments
- careless with privacy or user data

The product voice should reduce pressure without reducing clarity.

## Product Constraints
- Chicago-only for MVP
- Seasonal structure rather than an always-on infinite marketplace
- Exactly 6 curated activities per MVP season
- Exactly 4 user selections per season
- Cohorts target about 15-20 users
- Cohort overlap should aim for at least 2 shared activities, but assignment is best-effort if perfect grouping is not possible
- Deposit is a $20 seasonal commitment mechanism, not a broader payments platform

## Non-Goals
- No swiping
- No dating-style matching UI
- No complex recommendation engine
- No multi-city support yet
- No business-facing dashboard yet
- No mobile app yet
- No production-grade Wally automation worker yet

## Success Metrics
- Deposit conversion
- Activity selection completion
- Cohort assignment completion
- Cohort dashboard return rate
- Chat participation
- Bingo completion rate

## MVP Success Definition
The MVP is complete when the full user journey works end to end and every major state is durable:
- season discovery is visible
- auth works
- deposit state is persisted
- activity choices are persisted
- cohort assignment is persisted
- dashboard state is readable
- chat is persisted and live-updating
- bingo progress is persisted
