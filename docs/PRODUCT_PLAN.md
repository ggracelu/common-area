# Common Area Product Plan

## One-Line Description
Common Area is a seasonal social platform that turns post-grad city life into a campus feeling through recurring, interest-driven cohorts hosted by local businesses.

## Problem Statement
After college, many young adults lose the social architecture that once made community easy. The city may offer endless events, but not enough repeated presence. Swiping is performative, one-off meetups feel random, and generic event marketplaces rarely create familiar faces. Common Area addresses that gap by helping people build a campus feeling after college: recurring cohorts, shared interests, and local businesses that start to feel like common rooms again.

## Target User
- Gen Z young adults in Chicago
- Users looking for friendship, social momentum, and recurring shared experiences
- Users who want a campus-like social rhythm after college
- Users who want structured participation without dating-style matching
- Users who prefer a warm, grounded, low-pressure product tone but still expect trust and operational competence

## Core Product Loop
- Discover the season
- Join the season
- Pay the $20 deposit
- Choose 4 of 6 activities
- Get assigned to a cohort
- Return for dashboard, chat, and bingo prompts

The loop should make social participation feel easy to start, easy to continue, and more rewarding with repetition.

## Positioning
Common Area is not:
- a one-off dinner app
- a swipe-based friend app
- a generic events marketplace

Common Area is positioned around:
- seeing the same people more than once
- joining cohorts based on shared interests
- returning to familiar local businesses
- creating a social rhythm around real places
- making a big city feel like it has common rooms again

Competitor context:
- `222` leans toward curated social experiences and social matching.
- `Timeleft` centers weekly gatherings that turn strangers into friends with no bios, no swiping, and no planning.
- `Common Area` should differentiate on repeated presence, seasonal cohorts, shared interests, and local businesses as the campus buildings of post-grad city life.

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

## Crumbs Brand Voice
Crumbs the Cat is the mascot and tonal guide for the brand.

Crumbs should feel:
- dry
- warm
- lazy
- observant
- low-pressure
- slightly sarcastic
- local and memorable

Crumbs should not make the product feel:
- childish
- flaky
- hyper-social
- careless with trust and safety
- careless with payments
- careless with privacy or user data

The product voice should reduce pressure without reducing clarity. It should feel cozy, lived-in, communal, and more grounded than the product's earlier tone.

## Product Constraints
- Chicago-only for MVP
- Seasonal structure rather than an always-on infinite marketplace
- Exactly 6 curated activities per MVP season
- Exactly 4 user selections per season
- Cohorts target about 15-20 users
- Cohort overlap should aim for at least 2 shared activities, but assignment is best-effort if perfect grouping is not possible
- Deposit is a $20 seasonal commitment mechanism, not a broader payments platform
- Local businesses should be framed as campus-like third places rather than anonymous venues

## Non-Goals
- No swiping
- No dating-style matching UI
- No complex recommendation engine
- No multi-city support yet
- No business-facing dashboard yet
- No mobile app yet
- No production-grade Crumbs automation worker yet

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
