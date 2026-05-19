export type ChatroomChannelId = "main" | "crumbs-mod" | `dm-${string}`;

export type ChatroomChannel = {
  id: ChatroomChannelId;
  label: string;
  subtitle?: string;
  section: "channels" | "direct" | "moderator";
  unread?: number;
};

export const CHATROOM_CHANNELS: ChatroomChannel[] = [
  {
    id: "main",
    label: "main",
    subtitle: "Everyone in your cohort",
    section: "channels",
    unread: 0,
  },
  {
    id: "crumbs-mod",
    label: "crumbs-mod",
    subtitle: "Crumbs · moderator",
    section: "moderator",
  },
];

export const CHATROOM_DIRECT_MESSAGES: ChatroomChannel[] = [
  { id: "dm-jordan", label: "Jordan K.", section: "direct", unread: 0 },
  { id: "dm-sam", label: "Sam R.", section: "direct", unread: 1 },
  { id: "dm-riley", label: "Riley T.", section: "direct" },
];

export function channelDisplayName(channel: ChatroomChannel): string {
  if (channel.section === "channels" || channel.section === "moderator") {
    return `#${channel.label}`;
  }
  return channel.label;
}
