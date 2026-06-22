import { expect, test } from "@playwright/test";

test.describe("GUI V2 preview", () => {
    test("opens About by default and preserves user-selected history", async ({
        page,
    }) => {
        await page.goto("/gui-v2");

        await expect(
            page.getByRole("dialog", { name: "나에 대해서" }),
        ).toBeVisible();
        await expect(page).toHaveURL(/\/gui-v2$/);

        const dock = page.getByRole("navigation", {
            name: "Applications",
        });
        await dock.getByRole("button", { name: "프로젝트" }).click();
        await expect(page).toHaveURL(/app=projects/);
        await expect(
            page.getByRole("dialog", { name: "프로젝트" }),
        ).toBeVisible();

        await dock.getByRole("button", { name: "나에 대해서" }).click();
        await expect(page).toHaveURL(/\/gui-v2$/);

        await page.goBack();
        await expect(page).toHaveURL(/app=projects/);

        await page
            .getByRole("dialog", { name: "프로젝트" })
            .getByRole("button", { name: "프로젝트 close" })
            .click();
        await expect(page).toHaveURL(/\/gui-v2$/);
        await expect(
            page.getByRole("dialog", { name: "프로젝트" }),
        ).toHaveCount(0);
    });

    test("keeps language in the canonical shared URL", async ({ page }) => {
        await page.goto("/gui-v2");

        const systemControls = page.getByRole("navigation", {
            name: "System controls",
        });
        await systemControls.getByRole("button", { name: "en" }).click();

        await expect(page).toHaveURL(/lang=en/);
        await expect(
            page.getByRole("dialog", { name: "About" }),
        ).toBeVisible();
        await expect(page.locator("html")).toHaveAttribute("lang", "en");
    });

    test("uses the near-fullscreen mobile window contract", async ({
        page,
    }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto("/gui-v2");

        const window = page.getByRole("dialog", {
            name: "나에 대해서",
        });
        const box = await window.boundingBox();

        expect(box).not.toBeNull();
        expect(box?.x).toBe(8);
        expect(box?.width).toBe(374);
        expect(box?.y).toBe(44);
        expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThan(770);
    });

    test("opens independent project windows without eager media", async ({
        page,
    }) => {
        const mediaRequests: string[] = [];
        page.on("request", (request) => {
            if (request.resourceType() === "media") {
                mediaRequests.push(request.url());
            }
        });

        await page.goto("/gui-v2?app=projects");
        await expect(
            page.getByRole("dialog", { name: "프로젝트" }),
        ).toBeVisible();
        await expect(
            page.getByRole("button", {
                name: "WCHMS 프로젝트 열기",
            }),
        ).toBeVisible();
        expect(mediaRequests).toEqual([]);

        await page
            .getByRole("button", { name: "WCHMS 프로젝트 열기" })
            .click();
        await expect(page).toHaveURL(/app=project&slug=wchms/);
        await expect(
            page.getByRole("dialog", { name: "WCHMS" }),
        ).toBeVisible();

        const dock = page.getByRole("navigation", {
            name: "Applications",
        });
        await dock.getByRole("button", { name: "프로젝트" }).click();
        await page
            .getByRole("button", { name: "Flare 프로젝트 열기" })
            .click();

        await expect(page).toHaveURL(/app=project&slug=flare/);
        await expect(
            page.getByRole("dialog", { name: "WCHMS" }),
        ).toBeVisible();
        await expect(
            page.getByRole("dialog", { name: "Flare" }),
        ).toBeVisible();

        await dock.getByRole("button", { name: "프로젝트" }).click();
        await page
            .getByRole("button", { name: "WCHMS 프로젝트 열기" })
            .click();

        await expect(
            page.getByRole("dialog", { name: "WCHMS" }),
        ).toHaveCount(1);
        await expect(page).toHaveURL(/app=project&slug=wchms/);
    });

    test("preserves Terminal while lifecycle visibility suspends work", async ({
        page,
    }) => {
        await page.goto("/gui-v2?app=terminal");

        const terminalWindow = page.locator(
            '[data-window-id="terminal"]',
        );
        const terminalRuntime = terminalWindow.locator(
            "[data-effective-visibility]",
        );
        const xterm = terminalWindow.locator(".xterm").first();

        await expect(xterm).toBeVisible();
        await expect(terminalRuntime).toHaveAttribute(
            "data-effective-visibility",
            "active",
        );
        await xterm.evaluate((element) => {
            element.setAttribute("data-runtime-id", "terminal-preserved");
        });
        await terminalRuntime.evaluate((element) => {
            const media = document.createElement("video");
            media.setAttribute("data-runtime-media", "true");
            media.setAttribute("data-pause-called", "false");
            media.pause = () => {
                media.setAttribute("data-pause-called", "true");
            };
            element.append(media);
        });

        const dock = page.getByRole("navigation", {
            name: "Applications",
        });
        await dock.getByRole("button", { name: "나에 대해서" }).click();

        await expect(terminalRuntime).toHaveAttribute(
            "data-effective-visibility",
            "inactive",
        );
        await expect(
            terminalRuntime.locator("[data-runtime-media]"),
        ).toHaveAttribute("data-pause-called", "true");

        await dock.getByRole("button", { name: "터미널" }).click();
        await expect(
            terminalWindow.locator('[data-runtime-id="terminal-preserved"]'),
        ).toHaveCount(1);

        await page.evaluate(() => {
            Object.defineProperty(document, "visibilityState", {
                configurable: true,
                value: "hidden",
            });
            document.dispatchEvent(new Event("visibilitychange"));
        });
        await expect(terminalRuntime).toHaveAttribute(
            "data-effective-visibility",
            "page-suspended",
        );

        await page.evaluate(() => {
            Object.defineProperty(document, "visibilityState", {
                configurable: true,
                value: "visible",
            });
            document.dispatchEvent(new Event("visibilitychange"));
        });
        await expect(terminalRuntime).toHaveAttribute(
            "data-effective-visibility",
            "active",
        );
        await expect(xterm).toBeVisible();

        const resumeEpoch = Number(
            await terminalRuntime.getAttribute("data-resume-epoch"),
        );
        await page.evaluate(() => {
            window.history.replaceState(
                null,
                "",
                "/gui-v2?app=terminal&lang=en",
            );
            window.dispatchEvent(
                new PageTransitionEvent("pageshow", {
                    persisted: true,
                }),
            );
        });

        await expect(page.locator("html")).toHaveAttribute("lang", "en");
        await expect(terminalRuntime).toHaveAttribute(
            "data-resume-epoch",
            String(resumeEpoch + 1),
        );
        await expect(terminalRuntime).toHaveAttribute(
            "data-effective-visibility",
            "active",
        );
    });
});
