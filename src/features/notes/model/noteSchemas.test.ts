import { describe, expect, it } from "vitest";

import { parseNoteContentInput } from "@/features/notes/model/noteSchemas";

describe("parseNoteContentInput", () => {
  it("accepts only trimmed content", () => {
    expect(parseNoteContentInput({ content: " hello " })).toBe("hello");
  });

  it("rejects unknown fields and empty content", () => {
    expect(parseNoteContentInput({ content: "ok", extra: true })).toBeNull();
    expect(parseNoteContentInput({ content: "   " })).toBeNull();
  });
});
