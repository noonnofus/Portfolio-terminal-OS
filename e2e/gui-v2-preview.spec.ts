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

    test("keeps tablet chrome usable and desktop decoration non-interactive", async ({
        page,
    }) => {
        await page.setViewportSize({ width: 900, height: 900 });
        await page.goto("/gui-v2");

        await expect(
            page.getByRole("navigation", {
                name: "Desktop shortcuts",
            }),
        ).toBeHidden();
        await expect(
            page.getByRole("navigation", {
                name: "Applications",
            }),
        ).toBeVisible();

        const windowBox = await page
            .getByRole("dialog", { name: "나에 대해서" })
            .boundingBox();
        expect(windowBox).not.toBeNull();
        expect(windowBox?.x).toBe(45);
        expect(windowBox?.width).toBe(810);

        const backgroundType = page.locator(
            ".gui-v2-background-type",
        );
        await expect(backgroundType).toHaveAttribute(
            "aria-hidden",
            "true",
        );
        await expect(backgroundType).toHaveCSS(
            "pointer-events",
            "none",
        );
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

    test("renders a bilingual HTML Resume with print isolation", async ({
        page,
    }) => {
        await page.goto("/gui-v2?lang=en");
        await page
            .getByRole("navigation", { name: "Applications" })
            .getByRole("button", { name: "Resume" })
            .click();

        const resumeWindow = page.locator(
            '[data-window-id="resume"]',
        );
        const aboutWindow = page.locator('[data-window-id="about"]');

        await expect(
            resumeWindow.getByRole("heading", {
                name: "HyunHo Kim",
            }),
        ).toBeVisible();
        await expect(
            resumeWindow.getByRole("heading", {
                name: "Experience",
            }),
        ).toBeVisible();
        await expect(resumeWindow.getByText("WebPiano")).toBeVisible();
        await expect(
            resumeWindow.getByRole("link", {
                name: "github.com/noonnofus",
            }),
        ).toHaveAttribute(
            "href",
            "https://github.com/noonnofus",
        );
        await expect(
            resumeWindow.getByRole("button", {
                name: "Print / Save PDF",
            }),
        ).toBeVisible();

        await page.emulateMedia({ media: "print" });

        await expect(page.locator(".gui-v2-system-bar")).toBeHidden();
        await expect(page.locator(".gui-v2-dock")).toBeHidden();
        await expect(aboutWindow).toBeHidden();
        await expect(
            resumeWindow.locator(".gui-v2-title-bar"),
        ).toBeHidden();
        await expect(
            resumeWindow.getByRole("button", {
                name: "Print / Save PDF",
            }),
        ).toBeHidden();
        await expect(resumeWindow).toHaveCSS("position", "static");
        await expect(resumeWindow).toHaveCSS("box-shadow", "none");
        await expect(page.locator("body")).toHaveCSS(
            "overflow",
            "visible",
        );
    });

    test("restores Settings from the URL and keeps language canonical", async ({
        page,
    }) => {
        await page.goto("/gui-v2?app=settings&lang=en");

        const settingsWindow = page.getByRole("dialog", {
            name: "Settings",
        });
        await expect(settingsWindow).toBeVisible();
        await expect(
            settingsWindow.getByRole("heading", {
                name: "System Settings",
            }),
        ).toBeVisible();

        await settingsWindow
            .getByRole("button", { name: "한국어" })
            .click();
        await expect(page).toHaveURL(/\/gui-v2\?app=settings$/);
        await expect(
            page.getByRole("dialog", { name: "설정" }),
        ).toBeVisible();

        await page
            .getByRole("dialog", { name: "설정" })
            .getByRole("button", { name: "다크 모드" })
            .click();
        await expect(page.locator("html")).toHaveClass(/dark/);

        await page
            .getByRole("dialog", { name: "설정" })
            .getByRole("button", { name: /숲속/ })
            .click();
        await expect(page.locator(".gui-v2-shell")).toHaveAttribute(
            "data-wallpaper",
            "forest",
        );
    });

    test("provides global keyboard switching and excludes inactive content from Tab", async ({
        page,
    }) => {
        await page.goto("/gui-v2");
        const dock = page.getByRole("navigation", {
            name: "Applications",
        });
        await dock.getByRole("button", { name: "프로젝트" }).click();

        const aboutWindow = page.locator('[data-window-id="about"]');
        const projectsWindow = page.locator(
            '[data-window-id="projects"]',
        );

        await expect(
            aboutWindow.locator(".gui-v2-window-content"),
        ).toHaveAttribute("inert", "");
        await expect(
            projectsWindow.locator(".gui-v2-window-content"),
        ).not.toHaveAttribute("inert", "");

        await page.keyboard.press("Control+F6");
        await expect(page).toHaveURL(/\/gui-v2$/);
        await expect(aboutWindow).toHaveAttribute(
            "data-active",
            "true",
        );
        await expect(
            aboutWindow.getByRole("heading", {
                name: "나에 대해서",
            }),
        ).toBeFocused();

        await page
            .getByRole("button", { name: "Show desktop" })
            .click();
        await expect(page).toHaveURL(/app=desktop/);
        await expect(aboutWindow).toBeHidden();
        await expect(projectsWindow).toBeHidden();

        await page
            .getByRole("combobox", { name: "Open windows" })
            .selectOption("projects");
        await expect(page).toHaveURL(/app=projects/);
        await expect(projectsWindow).toBeVisible();
    });

    test("offers non-drag position presets and respects reduced motion", async ({
        page,
    }) => {
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto("/gui-v2");

        const aboutWindow = page.locator('[data-window-id="about"]');
        await aboutWindow
            .getByRole("combobox", {
                name: "나에 대해서 position",
            })
            .selectOption("right");

        const rightAlignedBox = await aboutWindow.boundingBox();
        expect(rightAlignedBox).not.toBeNull();
        expect(
            Math.abs(
                24 -
                    (1280 -
                        ((rightAlignedBox?.x ?? 0) +
                            (rightAlignedBox?.width ?? 0))),
            ),
        ).toBeLessThanOrEqual(1);

        const startedAt = Date.now();
        await aboutWindow
            .getByRole("button", {
                name: "나에 대해서 minimize",
            })
            .click();
        await expect(aboutWindow).toBeHidden();
        expect(Date.now() - startedAt).toBeLessThan(300);
    });
});
