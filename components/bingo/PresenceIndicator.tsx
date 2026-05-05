import { Users, MapPin, Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { BusinessPresence } from "@/lib/presence";

interface PresenceIndicatorProps {
  presence: BusinessPresence;
  showDetails?: boolean;
  compact?: boolean;
}

export function PresenceIndicator({
  presence,
  showDetails = true,
  compact = false,
}: PresenceIndicatorProps) {
  const { activityName, businessName, neighborhood, presentMembers, totalMembers } =
    presence;

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <Users className="w-4 h-4 text-gray-600" />
        <span className="text-gray-700">{totalMembers}</span>
        <span className="text-gray-500">cohort members here</span>
      </div>
    );
  }

  return (
    <Card variant="paper" className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-900">{businessName}</h4>
          {neighborhood && (
            <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
              <MapPin className="w-3 h-3" />
              <span>{neighborhood}</span>
            </div>
          )}
        </div>
        <Badge variant="highlight" className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          {totalMembers}
        </Badge>
      </div>

      {showDetails && presentMembers.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Clock className="w-3 h-3" />
            <span>Currently here:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {presentMembers.slice(0, 6).map((member) => (
              <div
                key={member.profileId}
                className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1.5"
              >
                {member.avatarUrl ? (
                  <img
                    src={member.avatarUrl}
                    alt={member.displayName}
                    className="w-5 h-5 rounded-full"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-xs text-gray-600">
                      {member.displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="text-sm text-gray-700">
                  {member.displayName}
                </span>
                {member.isOnline && (
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                )}
              </div>
            ))}
            {presentMembers.length > 6 && (
              <Badge variant="outline" className="rounded-full">
                +{presentMembers.length - 6} more
              </Badge>
            )}
          </div>
        </div>
      )}

      {showDetails && presentMembers.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-2">
          No cohort members currently here
        </p>
      )}
    </Card>
  );
}

interface PresenceListProps {
  presences: BusinessPresence[];
  maxItems?: number;
}

export function PresenceList({ presences, maxItems }: PresenceListProps) {
  const displayPresences = maxItems
    ? presences.slice(0, maxItems)
    : presences;

  const totalMembers = presences.reduce(
    (sum, p) => sum + p.totalMembers,
    0,
  );

  if (presences.length === 0) {
    return (
      <Card variant="paper" className="p-6 text-center">
        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No cohort members currently at any locations</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Who's Where</h3>
        <Badge variant="outline" className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          {totalMembers} total
        </Badge>
      </div>

      <div className="space-y-3">
        {displayPresences.map((presence) => (
          <PresenceIndicator
            key={presence.activityId}
            presence={presence}
            showDetails
          />
        ))}
      </div>

      {maxItems && presences.length > maxItems && (
        <div className="text-center">
          <Badge variant="outline" className="text-xs">
            +{presences.length - maxItems} more locations
          </Badge>
        </div>
      )}
    </div>
  );
}
