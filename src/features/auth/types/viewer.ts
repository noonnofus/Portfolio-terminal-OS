export type Viewer =
  | { status: "guest" }
  | {
      status: "authenticated";
      accountId: string;
      displayName: string;
      email: string | null;
      avatarUrl: string | null;
      role: "user" | "admin";
    };
