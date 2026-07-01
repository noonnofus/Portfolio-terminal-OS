import { describe, expect, it } from "vitest";
import i18n from "@/shared/lib/i18n";
import { ensureProjectNamespace } from "@/shared/lib/i18n/loadProjectNamespace";

describe("project i18n namespaces", () => {
    it("loads project translations only when requested", async () => {
        i18n.removeResourceBundle("ko", "WCHMS");
        i18n.removeResourceBundle("en", "WCHMS");

        expect(i18n.hasResourceBundle("ko", "WCHMS")).toBe(false);
        expect(i18n.hasResourceBundle("en", "WCHMS")).toBe(false);

        await ensureProjectNamespace("WCHMS");

        expect(i18n.hasResourceBundle("ko", "WCHMS")).toBe(true);
        expect(i18n.hasResourceBundle("en", "WCHMS")).toBe(true);
        expect(i18n.getResource("ko", "WCHMS", "title")).toBe(
            "WCHMS - 클라이언트 프로젝트",
        );
    });
});
