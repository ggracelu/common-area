// Types for the gamification system

export type PromptType = 'icebreaker' | 'shared_experience' | 'discovery' | 'collaboration' | 'recognition';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type StreakType = 'attendance' | 'interaction' | 'business' | 'prompt';
export type ChallengeType = 'weekly_prompts' | 'visit_all_businesses' | 'total_completions' | 'meet_everyone';
export type AchievementType = 'first_prompt' | 'streak_master' | 'social_butterfly' | 'explorer' | 'connector' | 'regular';
export type QuestType = 'regular' | 'explorer' | 'connector' | 'local';

export interface Cohort {
  id: string;
  seasonId: string;
  name: string;
  slug: string;
  status: 'active' | 'completed' | 'archived';
  maxMembers: number;
  createdAt: string;
  updatedAt: string;
}

export interface CohortMember {
  id: string;
  cohortId: string;
  profileId: string;
  joinedAt: string;
}

export interface BingoCard {
  id: string;
  profileId: string;
  seasonId: string;
  cohortId: string | null;
  totalPrompts: number;
  completedPrompts: number;
  createdAt: string;
  updatedAt: string;
}

export interface BingoPrompt {
  id: string;
  seasonId: string;
  activityId: string | null;
  title: string;
  description: string | null;
  promptType: PromptType;
  difficulty: Difficulty;
  requiresInteraction: boolean;
  points: number;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BingoCompletion {
  id: string;
  profileId: string;
  bingoCardId: string;
  promptId: string;
  completedAt: string;
  notes: string | null;
}

export interface UserStreak {
  id: string;
  profileId: string;
  seasonId: string;
  streakType: StreakType;
  currentCount: number;
  bestCount: number;
  lastActivityAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CohortChallenge {
  id: string;
  cohortId: string;
  challengeType: ChallengeType;
  title: string;
  description: string | null;
  targetCount: number;
  currentCount: number;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserAchievement {
  id: string;
  profileId: string;
  seasonId: string;
  achievementType: AchievementType;
  title: string;
  description: string | null;
  iconUrl: string | null;
  unlockedAt: string;
}

export interface BusinessQuest {
  id: string;
  activityId: string;
  seasonId: string;
  questType: QuestType;
  title: string;
  description: string | null;
  targetCount: number;
  points: number;
  isSponsored: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessQuestCompletion {
  id: string;
  profileId: string;
  businessQuestId: string;
  currentCount: number;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserGamificationPreferences {
  id: string;
  profileId: string;
  notificationsEnabled: boolean;
  maxActivePrompts: number;
  promptTypesEnabled: PromptType[];
  quietHoursStart: string;
  quietHoursEnd: string;
  temporaryPauseUntil: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BingoCardWithPrompts extends BingoCard {
  prompts: (BingoPrompt & { completed: boolean; completedAt?: string })[];
}

export interface GamificationStats {
  totalPrompts: number;
  completedPrompts: number;
  completionRate: number;
  currentStreaks: UserStreak[];
  achievements: UserAchievement[];
  activeChallenges: CohortChallenge[];
}
