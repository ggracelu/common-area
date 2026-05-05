import { Award, Trophy, Star, Flame, Users, Target, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { UserAchievement } from "@/types/bingo";

interface AchievementBadgeProps {
  achievement: UserAchievement;
  size?: "sm" | "md" | "lg";
  showDescription?: boolean;
  showDate?: boolean;
}

const achievementIcons: Record<string, any> = {
  first_prompt: Star,
  streak_master: Flame,
  social_butterfly: Users,
  explorer: Target,
  connector: Sparkles,
  regular: Trophy,
};

const achievementColors: Record<string, string> = {
  first_prompt: "bg-yellow-100 text-yellow-800 border-yellow-200",
  streak_master: "bg-orange-100 text-orange-800 border-orange-200",
  social_butterfly: "bg-purple-100 text-purple-800 border-purple-200",
  explorer: "bg-blue-100 text-blue-800 border-blue-200",
  connector: "bg-pink-100 text-pink-800 border-pink-200",
  regular: "bg-green-100 text-green-800 border-green-200",
};

export function AchievementBadge({
  achievement,
  size = "md",
  showDescription = true,
  showDate = false,
}: AchievementBadgeProps) {
  const Icon = achievementIcons[achievement.achievementType] || Award;
  const colorClass = achievementColors[achievement.achievementType] || "bg-gray-100 text-gray-800 border-gray-200";

  const sizeClasses = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <Card
      variant="paper"
      className={`${sizeClasses[size]} ${colorClass} border-2`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {achievement.iconUrl ? (
            <img
              src={achievement.iconUrl}
              alt={achievement.title}
              className={`${iconSizes[size]} rounded-full`}
            />
          ) : (
            <Icon className={`${iconSizes[size]}`} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 truncate">
            {achievement.title}
          </h4>

          {showDescription && achievement.description && (
            <p className="text-sm text-gray-700 mt-1 line-clamp-2">
              {achievement.description}
            </p>
          )}

          {showDate && (
            <p className="text-xs text-gray-600 mt-2">
              Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

interface AchievementGridProps {
  achievements: UserAchievement[];
  maxItems?: number;
  size?: "sm" | "md" | "lg";
}

export function AchievementGrid({
  achievements,
  maxItems,
  size = "md",
}: AchievementGridProps) {
  const displayAchievements = maxItems
    ? achievements.slice(0, maxItems)
    : achievements;

  if (achievements.length === 0) {
    return (
      <Card variant="paper" className="p-6 text-center">
        <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No achievements yet</p>
        <p className="text-sm text-gray-500 mt-2">
          Complete prompts to unlock achievements!
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {displayAchievements.map((achievement) => (
        <AchievementBadge
          key={achievement.id}
          achievement={achievement}
          size={size}
        />
      ))}
    </div>
  );
}

interface AchievementListProps {
  achievements: UserAchievement[];
  maxItems?: number;
}

export function AchievementList({
  achievements,
  maxItems,
}: AchievementListProps) {
  const displayAchievements = maxItems
    ? achievements.slice(0, maxItems)
    : achievements;

  if (achievements.length === 0) {
    return (
      <Card variant="paper" className="p-6 text-center">
        <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No achievements yet</p>
        <p className="text-sm text-gray-500 mt-2">
          Complete prompts to unlock achievements!
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {displayAchievements.map((achievement) => (
        <AchievementBadge
          key={achievement.id}
          achievement={achievement}
          size="sm"
          showDescription
          showDate
        />
      ))}
    </div>
  );
}
