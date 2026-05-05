import { useState, useEffect } from "react";
import { Sparkles, MapPin, Clock, Users, X, Coffee, CloudSun, Camera } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export type SpontaneousMomentType =
  | "pop_up"
  | "time_based"
  | "weather_based"
  | "crowd_based";

interface SpontaneousMoment {
  id: string;
  type: SpontaneousMomentType;
  title: string;
  description: string;
  location?: string;
  businessName?: string;
  cohortMembersPresent?: number;
  expiresAt?: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface SpontaneousMomentProps {
  moment: SpontaneousMoment;
  onDismiss?: () => void;
  autoDismiss?: boolean;
  autoDismissDelay?: number;
}

const momentIcons: Record<SpontaneousMomentType, any> = {
  pop_up: Sparkles,
  time_based: Clock,
  weather_based: CloudSun,
  crowd_based: Users,
};

const momentColors: Record<SpontaneousMomentType, string> = {
  pop_up: "bg-purple-50 border-purple-200",
  time_based: "bg-blue-50 border-blue-200",
  weather_based: "bg-green-50 border-green-200",
  crowd_based: "bg-orange-50 border-orange-200",
};

export function SpontaneousMoment({
  moment,
  onDismiss,
  autoDismiss = true,
  autoDismissDelay = 30000,
}: SpontaneousMomentProps) {
  const [timeRemaining, setTimeRemaining] = useState(
    moment.expiresAt ? Math.max(0, new Date(moment.expiresAt).getTime() - Date.now()) : autoDismissDelay,
  );
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!autoDismiss && !moment.expiresAt) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1000) {
          setIsVisible(false);
          onDismiss?.();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [autoDismiss, moment.expiresAt, onDismiss]);

  if (!isVisible) return null;

  const Icon = momentIcons[moment.type];
  const colorClass = momentColors[moment.type];

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m`;
  };

  return (
    <Card
      variant="paper"
      className={`${colorClass} border-2 relative overflow-hidden`}
    >
      {/* Animated background effect */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse" />
      </div>

      <div className="relative p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5" />
            <Badge variant="outline" className="text-xs">
              Spontaneous Moment
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {timeRemaining > 0 && (
              <Badge variant="outline" className="text-xs">
                <Clock className="w-3 h-3 mr-1" />
                {formatTime(timeRemaining)}
              </Badge>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsVisible(false);
                onDismiss?.();
              }}
              className="p-1 h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <h3 className="font-semibold text-gray-900 mb-2">{moment.title}</h3>

        <p className="text-sm text-gray-700 mb-3">{moment.description}</p>

        {moment.location && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <MapPin className="w-4 h-4" />
            <span>{moment.location}</span>
          </div>
        )}

        {moment.businessName && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <Coffee className="w-4 h-4" />
            <span>{moment.businessName}</span>
          </div>
        )}

        {moment.cohortMembersPresent !== undefined && moment.cohortMembersPresent > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <Users className="w-4 h-4" />
            <span>
              {moment.cohortMembersPresent} cohort member
              {moment.cohortMembersPresent !== 1 ? "s" : ""} here
            </span>
          </div>
        )}

        {moment.actionLabel && moment.onAction && (
          <Button
            size="sm"
            onClick={moment.onAction}
            className="w-full"
          >
            {moment.actionLabel}
          </Button>
        )}
      </div>
    </Card>
  );
}

interface SpontaneousMomentsContainerProps {
  moments: SpontaneousMoment[];
  onDismiss?: (momentId: string) => void;
  maxVisible?: number;
}

export function SpontaneousMomentsContainer({
  moments,
  onDismiss,
  maxVisible = 3,
}: SpontaneousMomentsContainerProps) {
  const [visibleMoments, setVisibleMoments] = useState<SpontaneousMoment[]>([]);

  useEffect(() => {
    setVisibleMoments(moments.slice(0, maxVisible));
  }, [moments, maxVisible]);

  const handleDismiss = (momentId: string) => {
    setVisibleMoments((prev) => prev.filter((m) => m.id !== momentId));
    onDismiss?.(momentId);
  };

  if (visibleMoments.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3 max-w-sm">
      {visibleMoments.map((moment) => (
        <SpontaneousMoment
          key={moment.id}
          moment={moment}
          onDismiss={() => handleDismiss(moment.id)}
        />
      ))}
    </div>
  );
}

// Helper function to generate spontaneous moments
export function generateSpontaneousMoments(
  context: {
    currentLocation?: string;
    timeOfDay?: "morning" | "afternoon" | "evening";
    weather?: "sunny" | "cloudy" | "rainy";
    cohortMembersNearby?: number;
  },
): SpontaneousMoment[] {
  const moments: SpontaneousMoment[] = [];

  // Time-based moments
  if (context.timeOfDay === "morning") {
    moments.push({
      id: "morning-coffee",
      type: "time_based",
      title: "Morning Coffee Walk",
      description: "Perfect time for a coffee stroll. Who's up for it?",
      actionLabel: "Find a coffee buddy",
    });
  } else if (context.timeOfDay === "afternoon") {
    moments.push({
      id: "afternoon-break",
      type: "time_based",
      title: "Afternoon Break",
      description: "Take a breather and say hi to someone nearby.",
      actionLabel: "Say hi",
    });
  } else if (context.timeOfDay === "evening") {
    moments.push({
      id: "evening-wind-down",
      type: "time_based",
      title: "Evening Wind-Down",
      description: "End the day with a friendly conversation.",
      actionLabel: "Start a conversation",
    });
  }

  // Weather-based moments
  if (context.weather === "rainy") {
    moments.push({
      id: "rainy-day",
      type: "weather_based",
      title: "Cozy Up",
      description: "Rainy day perfect for cozying up at a local spot.",
      actionLabel: "Find a cozy spot",
    });
  } else if (context.weather === "sunny") {
    moments.push({
      id: "sunny-day",
      type: "weather_based",
      title: "Sunny Day Stroll",
      description: "Beautiful weather! Time to explore the neighborhood.",
      actionLabel: "Go explore",
    });
  }

  // Crowd-based moments
  if (context.cohortMembersNearby && context.cohortMembersNearby >= 3) {
    moments.push({
      id: "group-photo",
      type: "crowd_based",
      title: "Group Photo Time!",
      description: `${context.cohortMembersNearby} cohort members are here. Let's capture the moment!`,
      actionLabel: "Take a photo",
    });
  } else if (context.cohortMembersNearby && context.cohortMembersNearby >= 1) {
    moments.push({
      id: "say-hi",
      type: "crowd_based",
      title: "Familiar Face!",
      description: "A cohort member is nearby. Wave hello!",
      actionLabel: "Wave",
    });
  }

  // Pop-up moments
  if (context.currentLocation) {
    moments.push({
      id: "pop-up-1",
      type: "pop_up",
      title: "Pop Quiz!",
      description: "Someone here is also in your cohort. Can you find them?",
      location: context.currentLocation,
      actionLabel: "Look around",
    });
  }

  return moments;
}
