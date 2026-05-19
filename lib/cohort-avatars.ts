import type { DemoUser } from "@/lib/demo-data";

/** Stable demo portrait per cohort member (not production uploads). */
export function demoMemberAvatarUrl(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i += 1) {
    hash = (hash + userId.charCodeAt(i) * (i + 1)) % 70;
  }
  const img = (hash % 70) + 1;
  return `https://i.pravatar.cc/160?img=${img}`;
}

export function memberAvatarUrl(member: {
  id: string;
  avatarImageUrl?: string;
}): string {
  return member.avatarImageUrl ?? demoMemberAvatarUrl(member.id);
}

export function demoUserAvatarUrl(user: DemoUser): string {
  return user.avatarImageUrl ?? demoMemberAvatarUrl(user.id);
}
