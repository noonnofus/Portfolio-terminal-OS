import { describe, expect, it } from "vitest";
import i18n from "@/shared/i18n/client";
import { ensureProjectNamespace } from "@/shared/lib/i18n/loadProjectNamespace";

describe("project i18n namespaces", () => {
    it("loads project translations only when requested", async () => {
        const namespaces = [
            ["WCHMS", "WCHMS"],
            ["Mcp", "OptiGen MCP 서버"],
            ["VoiceGateway", "AICC Voice Gateway"],
        ] as const;

        for (const [namespace, title] of namespaces) {
            i18n.removeResourceBundle("ko", namespace);
            i18n.removeResourceBundle("en", namespace);

            expect(i18n.hasResourceBundle("ko", namespace)).toBe(false);
            expect(i18n.hasResourceBundle("en", namespace)).toBe(false);

            await ensureProjectNamespace(namespace);

            expect(i18n.hasResourceBundle("ko", namespace)).toBe(true);
            expect(i18n.hasResourceBundle("en", namespace)).toBe(true);
            expect(i18n.getResource("ko", namespace, "title")).toBe(title);
        }
    });
});
