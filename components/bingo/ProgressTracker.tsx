import { Flame, Trophy, Target, Award } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { GamificationStats } from "@/types/bingo";

interface ProgressTrackerProps {
  stats: GamificationStats;
}

export function ProgressTracker({ stats }: ProgressTrackerProps) {
  const { totalPrompts, completedPrompts, completionRate, currentStreaks, achievements } =
    stats;

  const promptStreak = currentStreaks.find((s) => s.streakType === "prompt");
  const attendanceStreak = currentStreaks.find((s) => s.streakType === "attendance");

  return (
    <div className="space-y-4">
      {/* Overall Progress */}
      <Card variant="paper" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Your Progress</h3>
          <Badge variant="outline" className="text-sm">
            {completionRate.toFixed(0)}% Complete
          </Badge>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Prompts Completed</span>
              <span className="font-medium text-gray-900">
                {completedPrompts} / {totalPrompts}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Streaks */}
      <Card variant="paper" className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          Current Streaks
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {promptStreak && (
            <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
              <div className="flex items-center gap-2 mb-1">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-medium text-orange-700">Daily Prompts</span>
              </div>
              <p className="text-2xl font-bold text-orange-900">
                {promptStreak.currentCount}
              </p>
              <p className="text-xs text-orange-600">
                Best: {promptStreak.bestCount}
              </p>
            </div>
          )}

          {attendanceStreak && (
            <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-purple-500" />
                <span className="text-xs font-medium text-purple-700">Attendance</span>
              </div>
              <p className="text-2xl font-bold text-purple-900">
                {attendanceStreak.currentCount}
              </p>
              <p className="text-xs text-purple-600">
                Best: {attendanceStreak.bestCount}
              </p>
            </div>
          )}

          {currentStreaks.length === 0 && (
            <div className="col-span-2 text-center py-4 text-gray-500 text-sm">
              Complete prompts to start building streaks!
            </div>
          )}
        </div>
      </Card>

      {/* Achievements */}
      <Card variant="paper" className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Achievements
        </h3>

        {achievements.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {achievements.slice(0, 4).map((achievement) => (
              <div
                key={achievement.id}
                className="bg-yellow-50 rounded-lg p-3 border border-yellow-200"
              >
                <div className="flex items-center gap-2 mb-1">
                  {achievement.iconUrl ? (
                    <img
                      src={achievement.iconUrl}
                      alt={achievement.title}
                      className="w-4 h-4"
                    />
                  ) : (
                    <Award className="w-4 h-4 text-yellow-500" />
                  )}
                  <span className="text-xs font-medium text-yellow-700">
                    {achievement.title}
                  </span>
                </div>
                {achievement.description && (
                  <p className="text-xs text-yellow-600 line-clamp-2">
                    {achievement.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500 text-sm">
            Complete prompts to unlock achievements!
          </div>
        )}

        {achievements.length > 4 && (
          <div className="mt-3 text-center">
            <Badge variant="outline" className="text-xs">
              +{achievements.length - 4} more
            </Badge>
          </div>
        )}
      </Card>
    </div>
  );
}
