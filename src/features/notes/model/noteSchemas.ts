export function parseNoteContentInput(value: unknown): string | null {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  ) {
    return null;
  }

  const entries = Object.entries(value);
  if (entries.length !== 1 || entries[0]?.[0] !== "content") {
    return null;
  }

  const content = entries[0][1];
  if (typeof content !== "string") {
    return null;
  }

  const trimmed = content.trim();
  if (trimmed.length < 1 || trimmed.length > 1000) {
    return null;
  }

  return trimmed;
}
