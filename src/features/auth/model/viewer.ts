export type Viewer =
  | { status: "guest" }
  | {
      status: "authenticated";
      accountId: string;
      displayName: string;
      avatarUrl: string | null;
      role: "user" | "admin";
    };
