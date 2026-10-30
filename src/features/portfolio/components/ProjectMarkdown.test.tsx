import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ProjectMarkdown } from "./ProjectMarkdown";

describe("project Markdown media", () => {
    it("renders standard Markdown images as preview buttons without a block inside a paragraph", () => {
        const html = renderToStaticMarkup(<ProjectMarkdown
            markdown={'Before.\n\n![System architecture](/diagrams/example.svg "Architecture")\n\nAfter.'}
            language="en"
            openImage={() => {}}
        />);

        expect(html).toContain('src="/diagrams/example.svg"');
        expect(html).toContain('alt="System architecture"');
        expect(html).toContain('aria-haspopup="dialog"');
        expect(html).toContain('aria-label="View larger image: Architecture"');
        expect(html).not.toMatch(/<p>\s*<(?:div|button)/);
        expect(html).toContain("<p>After.</p>");
    });

    it.each(["ko", "en"] as const)("makes every body photo viewable without architecture metadata (%s)", (language) => {
        const html = renderToStaticMarkup(<ProjectMarkdown
            markdown={'![Dashboard screenshot](/images/dashboard.png)\n\n![Team photo](/images/team.jpg "Team")'}
            language={language}
            openImage={() => {}}
        />);
        const label = language === "ko" ? "이미지 크게 보기" : "View larger image";

        expect(html.match(/aria-haspopup="dialog"/g)).toHaveLength(2);
        expect(html).toContain(`aria-label="${label}: Dashboard screenshot"`);
        expect(html).toContain(`aria-label="${label}: Team"`);
        expect(html).toContain('src="/images/dashboard.png"');
        expect(html).toContain('src="/images/team.jpg"');
    });

    it("renders local video links as players and leaves ordinary links as links", () => {
        const html = renderToStaticMarkup(<ProjectMarkdown
            markdown={'[Demo](/videos/example.mp4)\n\n[Repository](https://github.com/example/repo)'}
            language="en"
            openImage={() => {}}
        />);

        expect(html).toContain("<video");
        expect(html).toContain('src="/videos/example.mp4"');
        expect(html).toContain('href="https://github.com/example/repo"');
    });
});
