import { useState } from "react";
import { Filter, Grid, List } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PromptTile } from "./PromptTile";
import type { BingoCardWithPrompts, PromptType } from "@/types/bingo";

interface BingoCardProps {
  bingoCard: BingoCardWithPrompts;
  onCompletePrompt?: (promptId: string) => Promise<void>;
  loading?: boolean;
}

const promptTypeLabels: Record<PromptType, string> = {
  icebreaker: "Icebreakers",
  shared_experience: "Shared Experiences",
  discovery: "Discoveries",
  collaboration: "Collaborations",
  recognition: "Recognitions",
};

const difficultyLabels = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export function BingoCard({ bingoCard, onCompletePrompt, loading }: BingoCardProps) {
  const [selectedType, setSelectedType] = useState<PromptType | "all">("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<"all" | "easy" | "medium" | "hard">(
    "all",
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [completingId, setCompletingId] = useState<string | null>(null);

  const filteredPrompts = bingoCard.prompts.filter((prompt) => {
    if (selectedType !== "all" && prompt.promptType !== selectedType) return false;
    if (selectedDifficulty !== "all" && prompt.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const completedCount = bingoCard.prompts.filter((p) => p.completed).length;
  const totalCount = bingoCard.prompts.length;

  const handleComplete = async (promptId: string) => {
    if (completingId || loading) return;

    setCompletingId(promptId);
    try {
      await onCompletePrompt?.(promptId);
    } finally {
      setCompletingId(null);
    }
  };

  const promptTypes = Array.from(
    new Set(bingoCard.prompts.map((p) => p.promptType)),
  ) as PromptType[];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card variant="paper" className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Season Prompts
            </h2>
            <p className="text-gray-600">
              Complete prompts to build connections and earn achievements
            </p>
          </div>
          <Badge variant="highlight" className="text-lg px-4 py-2">
            {completedCount} / {totalCount}
          </Badge>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={selectedType === "all" ? "default" : "outline"}
            onClick={() => setSelectedType("all")}
          >
            All Types
          </Button>
          {promptTypes.map((type) => (
            <Button
              key={type}
              size="sm"
              variant={selectedType === type ? "default" : "outline"}
              onClick={() => setSelectedType(type)}
            >
              {promptTypeLabels[type]}
            </Button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          <Button
            size="sm"
            variant={selectedDifficulty === "all" ? "default" : "outline"}
            onClick={() => setSelectedDifficulty("all")}
          >
            All Difficulties
          </Button>
          {(["easy", "medium", "hard"] as const).map((difficulty) => (
            <Button
              key={difficulty}
              size="sm"
              variant={selectedDifficulty === difficulty ? "default" : "outline"}
              onClick={() => setSelectedDifficulty(difficulty)}
            >
              {difficultyLabels[difficulty]}
            </Button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 mt-4">
          <span className="text-sm text-gray-600">View:</span>
          <Button
            size="sm"
            variant={viewMode === "grid" ? "default" : "outline"}
            onClick={() => setViewMode("grid")}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant={viewMode === "list" ? "default" : "outline"}
            onClick={() => setViewMode("list")}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* Prompts Grid/List */}
      {filteredPrompts.length === 0 ? (
        <Card variant="paper" className="p-8 text-center">
          <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No prompts match your filters</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSelectedType("all");
              setSelectedDifficulty("all");
            }}
          >
            Clear Filters
          </Button>
        </Card>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-4"
          }
        >
          {filteredPrompts.map((prompt) => (
            <PromptTile
              key={prompt.id}
              prompt={prompt}
              onComplete={handleComplete}
              disabled={loading || completingId !== null}
            />
          ))}
        </div>
      )}

      {/* Completion Summary */}
      {completedCount === totalCount && totalCount > 0 && (
        <Card variant="highlight" className="p-6 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            🎉 You've completed all prompts!
          </h3>
          <p className="text-gray-600">
            Amazing work! You've made the most of this season.
          </p>
        </Card>
      )}
    </div>
  );
}
