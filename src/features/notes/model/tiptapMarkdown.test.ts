import { Editor } from "@tiptap/core";
import { Markdown } from "@tiptap/markdown";
import StarterKit from "@tiptap/starter-kit";
import { describe, expect, it } from "vitest";

function roundTripMarkdown(markdown: string) {
  const editor = new Editor({
    extensions: [StarterKit, Markdown],
    content: markdown,
    contentType: "markdown",
  });

  const result = editor.getMarkdown();
  editor.destroy();
  return result;
}

describe("TipTap Markdown storage contract", () => {
  it.each([
    ["heading", "# Heading"],
    ["bullet list", "- one\n- two"],
    ["bold and italic", "**bold** and *italic*"],
    ["link", "[portfolio](https://example.com)"],
    ["code block", "```js\nconsole.log(1)\n```"],
  ])("round-trips %s markdown", (_name, markdown) => {
    expect(roundTripMarkdown(markdown)).toBe(markdown);
  });

  it("escapes raw HTML when parsed as markdown", () => {
    expect(roundTripMarkdown("<script>alert(1)</script>")).toBe(
      "&lt;script&gt;alert(1)&lt;/script&gt;",
    );
  });
});
