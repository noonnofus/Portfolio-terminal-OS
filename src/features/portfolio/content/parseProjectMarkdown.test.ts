import { describe, expect, it } from "vitest";
import { parseProjectMarkdown } from "./parseProjectMarkdown";

const koreanCase = `<!-- case: performance -->

## 로딩 개선

### 개요

화면이 느렸습니다.

### 세부 내용

**지연 로딩** 필요한 시점에 불러왔습니다.

- 실제 목록
  - 하위 목록

\`\`\`md
## 코드 안의 제목
### Overview
\`\`\`

### 성과

초기 전송량이 줄었습니다.
`;

const englishCase = `<!-- case: streaming -->

## Streaming

### Overview

Long-running requests needed progress updates.

### Implementation

I connected [SSE events](https://example.com/events) to the UI.

### Outcomes

Progress and final results appear in the same conversation.
`;

describe("project Markdown parsing", () => {
    it("rejects an empty body instead of silently hiding all project work", () => {
        expect(() => parseProjectMarkdown("")).toThrow("at least one case");
    });

    it("keeps nested Markdown and fenced headings inside their phase", () => {
        const [section] = parseProjectMarkdown(koreanCase);

        expect(section.id).toBe("performance");
        expect(section.title).toBe("로딩 개선");
        expect(section.phases.process).toContain("**지연 로딩**");
        expect(section.phases.process).toContain("- 실제 목록\n  - 하위 목록");
        expect(section.phases.process).toContain("## 코드 안의 제목\n### Overview");
        expect(section.phases.result).toBe("초기 전송량이 줄었습니다.");
    });

    it("separates cases without leaking markers and supports both phase languages", () => {
        const sections = parseProjectMarkdown(`${koreanCase}\n${englishCase}`);

        expect(sections.map((section) => section.id)).toEqual(["performance", "streaming"]);
        expect(sections[0].phases.result).toBe("초기 전송량이 줄었습니다.");
        expect(sections[1].phases.process).toContain("[SSE events](https://example.com/events)");
        expect(sections[1].phases.result).toContain("final results");
    });

    it("rejects missing or repeated stable case IDs used for diagram placement", () => {
        expect(() => parseProjectMarkdown(koreanCase.replace("<!-- case: performance -->", "")))
            .toThrow("unique");
        expect(() => parseProjectMarkdown(`${koreanCase}\n${koreanCase}`))
            .toThrow("unique");
    });

    it("rejects incomplete or ambiguous phase headings", () => {
        expect(() => parseProjectMarkdown(koreanCase.replace("### 성과", "### 개요")))
            .toThrow("duplicate");
        expect(() => parseProjectMarkdown(koreanCase.slice(0, koreanCase.indexOf("### 성과"))))
            .toThrow("must include");
    });
});
