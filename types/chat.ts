export type CohortChatMessageView = {
  id: string;
  body: string;
  createdAtISO: string;
  authorName: string;
  authorInitials: string;
  isSelf: boolean;
  isLocalOnly?: boolean;
  isSeeded?: boolean;
};

export type CohortChatLoadState =
  | { status: "not_configured"; messages: CohortChatMessageView[]; error?: string }
  | { status: "not_assigned"; messages: CohortChatMessageView[]; error?: string }
  | { status: "ready"; messages: CohortChatMessageView[]; error?: string }
  | { status: "error"; messages: CohortChatMessageView[]; error: string };
