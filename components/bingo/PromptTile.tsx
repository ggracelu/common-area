import { Check, MessageSquare, Eye, Users, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { BingoPrompt } from "@/types/bingo";

interface PromptTileProps {
  prompt: BingoPrompt & { completed?: boolean; completedAt?: string };
  onComplete?: (promptId: string) => void;
  disabled?: boolean;
}

const promptTypeIcons = {
  icebreaker: MessageSquare,
  shared_experience: Users,
  discovery: Eye,
  collaboration: Sparkles,
  recognition: Sparkles,
};

const promptTypeLabels = {
  icebreaker: "Icebreaker",
  shared_experience: "Shared",
  discovery: "Discovery",
  collaboration: "Collaborate",
  recognition: "Recognize",
};

const difficultyColors = {
  easy: "bg-green-100 text-green-800 border-green-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  hard: "bg-red-100 text-red-800 border-red-200",
};

const difficultyLabels = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export function PromptTile({ prompt, onComplete, disabled }: PromptTileProps) {
  const Icon = promptTypeIcons[prompt.promptType];
  const isCompleted = prompt.completed;

  return (
    <Card
      variant={isCompleted ? "highlight" : "default"}
      className={`relative transition-all duration-200 ${
        isCompleted
          ? "opacity-75 bg-green-50 border-green-200"
          : "hover:shadow-md"
      }`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-4 h-4 text-gray-600" />
              <Badge variant="outline" className="text-xs">
                {promptTypeLabels[prompt.promptType]}
              </Badge>
              <Badge
                variant="outline"
                className={`text-xs ${difficultyColors[prompt.difficulty]}`}
              >
                {difficultyLabels[prompt.difficulty]}
              </Badge>
              {prompt.requiresInteraction && (
                <Badge variant="outline" className="text-xs">
                  <Users className="w-3 h-3 mr-1" />
                  Social
                </Badge>
              )}
            </div>

            <h3 className="font-semibold text-gray-900 mb-1">{prompt.title}</h3>

            {prompt.description && (
              <p className="text-sm text-gray-600 leading-relaxed">
                {prompt.description}
              </p>
            )}

            {prompt.points > 1 && (
              <div className="mt-2 flex items-center gap-1 text-xs text-amber-600">
                <Sparkles className="w-3 h-3" />
                <span className="font-medium">{prompt.points} points</span>
              </div>
            )}
          </div>

          {isCompleted ? (
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={() => onComplete?.(prompt.id)}
              disabled={disabled}
              className="flex-shrink-0"
            >
              Complete
            </Button>
          )}
        </div>

        {isCompleted && prompt.completedAt && (
          <div className="mt-3 pt-3 border-t border-green-200">
            <p className="text-xs text-green-700">
              Completed {new Date(prompt.completedAt).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
