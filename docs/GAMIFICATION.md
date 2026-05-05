# Common Area Gamification System

A comprehensive gamification layer that transforms Common Area's bingo card into a sophisticated social connection engine.

## Overview

The gamification system leverages local businesses as third spaces and uses play as social lubricant to build community through repeated, low-stakes interactions. It includes:

- **5 Prompt Types**: Icebreakers, Shared Experiences, Discovery, Collaboration, Recognition
- **3 Difficulty Levels**: Easy, Medium, Hard
- **4 Streak Types**: Attendance, Interaction, Business, Prompt
- **4 Challenge Types**: Weekly Prompts, Visit All Businesses, Total Completions, Meet Everyone
- **4 Quest Types**: Regular, Explorer, Connector, Local
- **6 Achievement Types**: First Prompt, Streak Master, Social Butterfly, Explorer, Connector, Regular

## Quick Start

### 1. Apply Database Schema

```bash
# Option 1: Using the migration script
./scripts/run-gamification-migration.sh

# Option 2: Manual via Supabase Dashboard
# 1. Go to https://app.supabase.com
# 2. Select your project
# 3. Go to SQL Editor
# 4. Copy and paste contents of: supabase/migrations/202605040001_gamification_foundation.sql
# 5. Click "Run"
```

### 2. Seed Initial Data

```bash
# Option 1: Using the migration script (select option 2 or 3)
./scripts/run-gamification-migration.sh

# Option 2: Manual via Supabase Dashboard
# 1. Go to SQL Editor in Supabase Dashboard
# 2. Copy and paste contents of: supabase/seed_gamification.sql
# 3. Click "Run"
```

### 3. Test the Implementation

Visit `/bingo` to see the gamification system in action (currently using mock data).

## Database Schema

### Core Tables

#### `bingo_cards`
User's bingo card for a season
- `profile_id`: User's profile
- `season_id`: Season reference
- `cohort_id`: Optional cohort reference
- `total_prompts`: Total available prompts
- `completed_prompts`: Number of completed prompts

#### `bingo_prompts`
The actual prompts/tasks
- `season_id`: Season reference
- `activity_id`: Optional business reference
- `title`: Prompt title
- `description`: Prompt description
- `prompt_type`: Type (icebreaker, shared_experience, discovery, collaboration, recognition)
- `difficulty`: Difficulty level (easy, medium, hard)
- `requires_interaction`: Whether prompt requires social interaction
- `points`: Points awarded for completion
- `display_order`: Display order
- `is_active`: Whether prompt is active

#### `bingo_completions`
Tracking prompt completions
- `profile_id`: User's profile
- `bingo_card_id`: Bingo card reference
- `prompt_id`: Prompt reference
- `completed_at`: Completion timestamp
- `notes`: Optional notes

#### `user_streaks`
Tracking various streaks
- `profile_id`: User's profile
- `season_id`: Season reference
- `streak_type`: Type (attendance, interaction, business, prompt)
- `current_count`: Current streak count
- `best_count`: Best streak count
- `last_activity_at`: Last activity timestamp

#### `cohort_challenges`
Collective goals for cohorts
- `cohort_id`: Cohort reference
- `challenge_type`: Type (weekly_prompts, visit_all_businesses, total_completions, meet_everyone)
- `title`: Challenge title
- `description`: Challenge description
- `target_count`: Target count
- `current_count`: Current count
- `completed_at`: Completion timestamp

#### `user_achievements`
Badges and achievements
- `profile_id`: User's profile
- `season_id`: Season reference
- `achievement_type`: Type (first_prompt, streak_master, social_butterfly, explorer, connector, regular)
- `title`: Achievement title
- `description`: Achievement description
- `icon_url`: Optional icon URL
- `unlocked_at`: Unlock timestamp

#### `business_quests`
Business-specific quests
- `activity_id`: Activity/business reference
- `season_id`: Season reference
- `quest_type`: Type (regular, explorer, connector, local)
- `title`: Quest title
- `description`: Quest description
- `target_count`: Target count
- `points`: Points awarded
- `is_sponsored`: Whether quest is sponsored

#### `business_quest_completions`
Tracking quest progress
- `profile_id`: User's profile
- `business_quest_id`: Quest reference
- `current_count`: Current count
- `completed_at`: Completion timestamp

#### `user_gamification_preferences`
User settings
- `profile_id`: User's profile
- `notifications_enabled`: Whether notifications are enabled
- `max_active_prompts`: Maximum active prompts
- `prompt_types_enabled`: Enabled prompt types
- `quiet_hours_start`: Quiet hours start time
- `quiet_hours_end`: Quiet hours end time
- `temporary_pause_until`: Optional temporary pause

## API Functions

### Core Bingo Functions (`lib/bingo.ts`)

```typescript
// Get or create a user's bingo card
const card = await getOrCreateBingoCard(profileId, seasonId);

// Get all active prompts for a season
const prompts = await getActivePrompts(seasonId);

// Get bingo card with prompts and completion status
const cardWithPrompts = await getBingoCardWithPrompts(profileId, seasonId);

// Complete a prompt
const completion = await completePrompt(profileId, bingoCardId, promptId, notes);

// Get user's streaks
const streaks = await getUserStreaks(profileId, seasonId);

// Update a streak
const streak = await updateStreak(profileId, seasonId, streakType, increment);

// Get user's achievements
const achievements = await getUserAchievements(profileId, seasonId);

// Unlock an achievement
const achievement = await unlockAchievement(profileId, seasonId, achievementType, title, description, iconUrl);

// Get comprehensive stats
const stats = await getGamificationStats(profileId, seasonId);
```

### Presence Tracking (`lib/presence.ts`)

```typescript
// Get members at a specific business
const presence = await getBusinessPresence(activityId, cohortId);

// Get all business presences
const presences = await getAllBusinessPresence(cohortId);

// Update user's presence
await updatePresence(profileId, activityId);

// Check if cohort members are at a business
const hasMembers = await hasCohortMembersAtBusiness(activityId, cohortId, excludeProfileId);
```

### Cohort Challenges (`lib/challenges.ts`)

```typescript
// Get all challenges for a cohort
const challenges = await getCohortChallenges(cohortId);

// Get active challenges
const activeChallenges = await getActiveCohortChallenges(cohortId);

// Create a new challenge
const challenge = await createCohortChallenge(cohortId, challengeType, title, description, targetCount);

// Update challenge progress
const updated = await updateChallengeProgress(challengeId, increment);

// Complete a challenge
await completeChallenge(challengeId);
```

### Business Quests (`lib/business.ts`)

```typescript
// Get all quests for a season
const quests = await getBusinessQuests(seasonId);

// Get quests for a specific business
const businessQuests = await getQuestsByActivity(activityId);

// Get user's quest completions
const completions = await getUserQuestCompletions(profileId);

// Update quest progress
const completion = await updateQuestProgress(profileId, questId, increment);

// Complete a quest
await completeQuest(profileId, questId);
```

### Gamification Preferences (`lib/gamification-preferences.ts`)

```typescript
// Get user's preferences
const preferences = await getUserGamificationPreferences(profileId);

// Update preferences
const updated = await upsertGamificationPreferences(profileId, preferences);

// Update notification settings
await updateNotificationPreferences(profileId, enabled);

// Update max active prompts
await updateMaxActivePrompts(profileId, maxPrompts);

// Update enabled prompt types
await updatePromptTypesEnabled(profileId, promptTypes);

// Update quiet hours
await updateQuietHours(profileId, start, end);

// Set temporary pause
await setTemporaryPause(profileId, until);

// Check if notifications should be sent
const shouldSend = await shouldSendNotifications(profileId);
```

## Components

### UI Components

#### `PromptTile`
Individual prompt display with completion status
- Shows prompt type, difficulty, and interaction requirement
- Displays completion status and timestamp
- Includes complete button

#### `ProgressTracker`
Shows user's progress, streaks, and achievements
- Overall progress bar
- Current streaks with best counts
- Achievement badges

#### `BingoCard`
Main card with filtering and view modes
- Filter by prompt type and difficulty
- Grid and list view modes
- Shows completion summary

#### `SocialPrompt`
Interactive prompts with conversation starters
- Built-in conversation starters
- Easy conversation initiation
- Social interaction guidance

#### `PresenceIndicator`
Shows who's where with member avatars
- Business location display
- Present member list
- Online status indicators

#### `AchievementBadge`
Individual achievement display
- Achievement icon and title
- Description and unlock date
- Color-coded by type

#### `SpontaneousMoment`
Pop-up moment display with auto-dismiss
- Time-based expiration
- Context-aware content
- Action buttons

## Server Actions

### `app/bingo/actions.ts`

```typescript
// Complete a prompt
await completePrompt(profileId, bingoCardId, promptId, notes);

// Update a streak
await updateStreakAction(profileId, seasonId, streakType, increment);
```

## Next Steps

### 1. Connect Authentication

Update `/bingo/page.tsx` to use real user authentication:

```typescript
// Get current user
const { userId } = auth();

// Get user's profile
const profile = await getProfileByClerkId(userId);

// Load real data
const bingoCard = await getBingoCardWithPrompts(profile.id, seasonId);
const stats = await getGamificationStats(profile.id, seasonId);
```

### 2. Enable Real-time Features

Set up Supabase Realtime for presence tracking:

```typescript
// Subscribe to presence changes
const channel = supabase
  .channel('presence')
  .on('presence', { event: 'sync' }, () => {
    // Handle presence updates
  })
  .subscribe();
```

### 3. Configure Push Notifications

Set up push notifications for spontaneous moments:

```typescript
// Send notification when spontaneous moment triggers
await sendNotification(profileId, {
  title: moment.title,
  body: moment.description,
  data: { momentId: moment.id },
});
```

### 4. Add Business Dashboard

Create a dashboard for business partners to:
- View cohort visit schedules
- See quest completion rates
- Adjust quest preferences
- Set capacity limits

### 5. Implement Analytics

Add tracking for:
- Prompt completion rates
- Social interaction frequency
- Business visit frequency
- Cohort engagement metrics

## Testing

### Manual Testing

1. Visit `/bingo` to see the gamification UI
2. Click "Complete" on prompts to test completion flow
3. Check progress tracker updates
4. Test filtering by type and difficulty
5. Switch between grid and list views

### Automated Testing

```bash
# Run tests (when test framework is configured)
npm test
```

## Troubleshooting

### Migration Issues

If the migration fails:

1. Check that `SUPABASE_SECRET_KEY` is set in `.env.local`
2. Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
3. Ensure you have permissions to create tables
4. Check for existing tables that might conflict

### Data Not Showing

If prompts aren't showing:

1. Verify the migration was applied successfully
2. Check that seed data was loaded
3. Ensure the season is active
4. Verify prompts have `is_active = true`

### Authentication Issues

If authentication isn't working:

1. Check Clerk keys in `.env.local`
2. Verify Clerk middleware is configured
3. Ensure user is signed in
4. Check profile exists in database

## Contributing

When adding new features:

1. Update the database schema with a new migration
2. Add API functions in the appropriate lib file
3. Create UI components as needed
4. Update this README with documentation
5. Test thoroughly before committing

## License

Part of the Common Area project.
