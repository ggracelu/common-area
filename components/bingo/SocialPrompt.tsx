import { useState } from "react";
import { MessageSquare, Users, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { BingoPrompt } from "@/types/bingo";

interface SocialPromptProps {
  prompt: BingoPrompt & { completed?: boolean };
  onComplete?: (promptId: string) => void;
  disabled?: boolean;
  showConversationStarters?: boolean;
}

const conversationStarters: Record<string, string[]> = {
  icebreaker: [
    "What's your favorite thing about this neighborhood?",
    "How did you hear about Common Area?",
    "What's been your favorite activity so far?",
    "Have you been to this place before?",
  ],
  shared_experience: [
    "I noticed you ordered the same thing - how is it?",
    "What do you think of this place?",
    "Have you tried anything similar before?",
    "What's your go-to order here?",
  ],
  discovery: [
    "Did you notice that interesting detail over there?",
    "What's something new you've discovered today?",
    "Have you explored this neighborhood much?",
    "What's your favorite hidden gem around here?",
  ],
  collaboration: [
    "Want to work on this together?",
    "I could use some help with this - mind joining?",
    "Let's tackle this as a team!",
    "I think we could accomplish more together.",
  ],
  recognition: [
    "Hey, I remember seeing you at the last event!",
    "Great to see a familiar face!",
    "How have you been since we last met?",
    "It's nice to see you again!",
  ],
};

export function SocialPrompt({
  prompt,
  onComplete,
  disabled,
  showConversationStarters = true,
}: SocialPromptProps) {
  const [showStarters, setShowStarters] = useState(false);
  const [selectedStarter, setSelectedStarter] = useState<string | null>(null);

  const starters = conversationStarters[prompt.promptType] || [];

  const handleSelectStarter = (starter: string) => {
    setSelectedStarter(starter);
    setShowStarters(false);
  };

  return (
    <Card
      variant={prompt.completed ? "highlight" : "default"}
      className={`relative transition-all duration-200 ${
        prompt.completed
          ? "opacity-75 bg-green-50 border-green-200"
          : "hover:shadow-md"
      }`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {prompt.requiresInteraction ? (
                <Users className="w-4 h-4 text-purple-600" />
              ) : (
                <MessageSquare className="w-4 h-4 text-blue-600" />
              )}
              <Badge variant="outline" className="text-xs">
                {prompt.promptType}
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
          </div>

          {prompt.completed && (
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
          )}
        </div>

        {/* Conversation Starters */}
        {showConversationStarters && !prompt.completed && starters.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowStarters(!showStarters)}
              className="w-full mb-3"
            >
              {showStarters ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-2" />
                  Hide Conversation Starters
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-2" />
                  Show Conversation Starters
                </>
              )}
            </Button>

            {showStarters && (
              <div className="space-y-2">
                <p className="text-xs text-gray-600 mb-2">
                  Not sure what to say? Try one of these:
                </p>
                {starters.map((starter, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectStarter(starter)}
                    className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
                      selectedStarter === starter
                        ? "bg-blue-100 border-2 border-blue-500 text-blue-900"
                        : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    "{starter}"
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Selected Starter Display */}
        {selectedStarter && !prompt.completed && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900 font-medium">
              Try saying: "{selectedStarter}"
            </p>
          </div>
        )}

        {/* Action Button */}
        {!prompt.completed && (
          <div className="mt-4 flex gap-2">
            <Button
              size="sm"
              onClick={() => onComplete?.(prompt.id)}
              disabled={disabled}
              className="flex-1"
            >
              Complete
            </Button>
            {starters.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowStarters(!showStarters)}
              >
                <MessageSquare className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}

        {/* Completion Message */}
        {prompt.completed && (
          <div className="mt-4 pt-4 border-t border-green-200">
            <p className="text-sm text-green-700 font-medium">
              ✓ Completed! You're building connections.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
