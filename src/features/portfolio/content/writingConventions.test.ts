import { readdirSync, readFileSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const workspaceRoot = resolve(import.meta.dirname, "../../../..");
const sourceRoots = ["src", "public"].map((directory) =>
  resolve(workspaceRoot, directory),
);
const textExtensions = new Set([".css", ".json", ".md", ".svg", ".ts", ".tsx"]);
const forbiddenSeparator = String.fromCodePoint(0x00b7);
const deprecatedFrontendSpelling = ["프", "런", "트엔드"].join("");

function collectTextFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      return collectTextFiles(path);
    }

    return textExtensions.has(extname(entry.name)) ? [path] : [];
  });
}

describe("portfolio writing conventions", () => {
  const files = sourceRoots.flatMap(collectTextFiles);

  it.each(files)("uses approved separators and frontend spelling in %s", (file) => {
    const content = readFileSync(file, "utf8");
    const filePath = relative(workspaceRoot, file);

    expect(content, `${filePath} contains a forbidden separator`).not.toContain(
      forbiddenSeparator,
    );
    expect(content, `${filePath} contains a deprecated frontend spelling`).not.toContain(
      deprecatedFrontendSpelling,
    );
  });
});
