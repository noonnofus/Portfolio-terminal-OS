export const noteQueryKeys = {
  all: ["notes"] as const,
  list: (viewerKey: string) => ["notes", "list", viewerKey] as const,
};
