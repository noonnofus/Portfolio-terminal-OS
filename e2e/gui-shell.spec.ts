import { expect, test } from "@playwright/test";

test.describe("GUI shell", () => {
    test("hydrates a persisted dark theme without a server mismatch", async ({ page }) => {
        const hydrationErrors: string[] = [];
        page.on("console", (message) => {
            if (
                message.type() === "error" &&
                /hydration|did not match|server rendered/i.test(message.text())
            ) {
                hydrationErrors.push(message.text());
            }
        });
        await page.addInitScript(() => localStorage.setItem("theme", "dark"));

        await page.goto("/gui");
        await expect(page.locator(".gui-shell")).toHaveAttribute(
            "data-theme",
            "dark",
        );
        expect(hydrationErrors).toEqual([]);
    });

    test("opens About by default and preserves user-selected history", async ({
        page,
    }) => {
        await page.goto("/gui");

        await expect(
            page.getByRole("dialog", { name: "나에 대해서" }),
        ).toBeVisible();
        await expect(page).toHaveURL(/\/gui$/);

        const dock = page.getByRole("navigation", {
            name: "Applications",
        });
        await dock.getByRole("button", { name: "프로젝트" }).click();
        await expect(page).toHaveURL(/app=projects/);
        await expect(
            page.getByRole("dialog", { name: "프로젝트" }),
        ).toBeVisible();

        await dock.getByRole("button", { name: "나에 대해서" }).click();
        await expect(page).toHaveURL(/\/gui$/);

        await page.goBack();
        await expect(page).toHaveURL(/app=projects/);

        await page
            .getByRole("dialog", { name: "프로젝트" })
            .getByRole("button", { name: "프로젝트 close" })
            .click();
        await expect(page).toHaveURL(/\/gui$/);
        await expect(
            page.getByRole("dialog", { name: "프로젝트" }),
        ).toHaveCount(0);
    });

    test("keeps language in the canonical shared URL", async ({ page }) => {
        await page.goto("/gui");

        const systemControls = page.getByRole("navigation", {
            name: "System controls",
        });
        await expect(systemControls.getByRole("button", { name: "en" })).toHaveCount(0);
        await expect(page.getByRole("button", { name: "Show desktop" })).toHaveCount(0);
        await expect(page.locator(".gui-viewer-name")).toHaveText("Guest");

        await page
            .getByRole("navigation", { name: "Applications" })
            .getByRole("button", { name: "설정" })
            .click();
        await page
            .getByRole("dialog", { name: "설정" })
            .getByRole("button", { name: "English" })
            .click();

        await expect(page).toHaveURL(/lang=en/);
        await expect(page.locator("html")).toHaveAttribute("lang", "en");
    });

    test("focuses a desktop shortcut on one click and opens it on double click", async ({
        page,
    }) => {
        await page.goto("/gui?app=desktop");
        const projectsShortcut = page
            .getByRole("navigation", { name: "Desktop shortcuts" })
            .getByRole("button", { name: "프로젝트" });

        await projectsShortcut.click();
        await expect(projectsShortcut).toBeFocused();
        await expect(projectsShortcut).toHaveAttribute("data-selected", "true");
        await expect(page).toHaveURL(/app=desktop/);

        await projectsShortcut.dblclick();
        await expect(page).toHaveURL(/app=projects/);
        await expect(page.getByRole("dialog", { name: "프로젝트" })).toBeVisible();
    });

    test("keeps a floating window bounded when a desktop browser becomes narrow", async ({
        page,
    }) => {
        await page.setViewportSize({ width: 1200, height: 800 });
        await page.goto("/gui?app=projects");
        const projectsWindow = page.getByRole("dialog", { name: "프로젝트" });
        await expect(projectsWindow).toBeVisible();

        await page.setViewportSize({ width: 700, height: 700 });
        const initialBox = await projectsWindow.boundingBox();

        expect(initialBox).not.toBeNull();
        expect(initialBox?.x).toBeGreaterThanOrEqual(24);
        expect(initialBox?.width).toBeLessThanOrEqual(652);
        expect(initialBox?.height).toBeLessThanOrEqual(450);

        const titleBar = projectsWindow.locator(".gui-title-bar");
        const titleBox = await titleBar.boundingBox();
        expect(titleBox).not.toBeNull();
        await page.mouse.move(
            (titleBox?.x ?? 0) + (titleBox?.width ?? 0) / 2,
            (titleBox?.y ?? 0) + (titleBox?.height ?? 0) / 2,
        );
        await page.mouse.down();
        await page.mouse.move(690, 690);
        await page.mouse.up();

        const draggedBox = await projectsWindow.boundingBox();
        expect(draggedBox).not.toBeNull();
        expect(draggedBox?.x).toBeGreaterThanOrEqual(0);
        expect(draggedBox?.y).toBeGreaterThanOrEqual(36);
        expect((draggedBox?.x ?? 0) + (draggedBox?.width ?? 0)).toBeLessThanOrEqual(700);
        expect((draggedBox?.y ?? 0) + (draggedBox?.height ?? 0)).toBeLessThanOrEqual(700);
    });

    test("uses the near-fullscreen mobile window contract", async ({ browser }) => {
        const mobileContext = await browser.newContext({
            hasTouch: true,
            isMobile: true,
            viewport: { width: 390, height: 844 },
        });
        const page = await mobileContext.newPage();
        await page.goto("/gui");

        const window = page.getByRole("dialog", {
            name: "나에 대해서",
        });
        const box = await window.boundingBox();

        expect(box).not.toBeNull();
        expect(box?.x).toBe(8);
        expect(box?.width).toBe(374);
        expect(box?.y).toBe(44);
        expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThan(770);

        const windowLayerZ = Number(
            await page.locator(".gui-window-layer").evaluate((element) =>
                getComputedStyle(element).zIndex,
            ),
        );
        const shortcutsZ = Number(
            await page.locator(".desktop-apps").evaluate((element) =>
                getComputedStyle(element).zIndex,
            ),
        );
        expect(windowLayerZ).toBeGreaterThan(shortcutsZ);
        await mobileContext.close();
    });

    test("drags desktop shortcuts at narrow viewport widths", async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto("/gui?app=desktop");

        const projectsShortcut = page
            .getByRole("navigation", { name: "Desktop shortcuts" })
            .getByRole("button", { name: "프로젝트" });
        const before = await projectsShortcut.boundingBox();
        expect(before).not.toBeNull();

        await page.mouse.move(
            (before?.x ?? 0) + (before?.width ?? 0) / 2,
            (before?.y ?? 0) + (before?.height ?? 0) / 2,
        );
        await page.mouse.down();
        await page.mouse.move(
            (before?.x ?? 0) + (before?.width ?? 0) / 2 - 72,
            (before?.y ?? 0) + (before?.height ?? 0) / 2 + 80,
        );
        await page.mouse.up();

        const after = await projectsShortcut.boundingBox();
        expect((after?.x ?? 0) - (before?.x ?? 0)).toBeLessThan(-60);
        expect((after?.y ?? 0) - (before?.y ?? 0)).toBeGreaterThan(60);
        await expect(page).toHaveURL(/app=desktop/);

        await projectsShortcut.focus();
        await page.keyboard.press("Enter");
        await expect(page).toHaveURL(/app=projects/);
    });

    test("keeps tablet chrome usable and desktop decoration non-interactive", async ({
        page,
    }) => {
        await page.setViewportSize({ width: 900, height: 900 });
        await page.goto("/gui");

        await expect(
            page.getByRole("navigation", {
                name: "Desktop shortcuts",
            }),
        ).toBeVisible();
        await expect(
            page.getByRole("navigation", {
                name: "Applications",
            }),
        ).toBeVisible();

        const windowBox = await page
            .getByRole("dialog", { name: "나에 대해서" })
            .boundingBox();
        expect(windowBox).not.toBeNull();
        expect(windowBox?.x).toBe(64);
        expect(windowBox?.width).toBe(740);

        const backgroundType = page.locator(
            ".gui-wallpaper-art",
        );
        await expect(backgroundType).toHaveAttribute(
            "aria-hidden",
            "true",
        );
        await expect(backgroundType).toHaveCSS(
            "pointer-events",
            "none",
        );

        const dock = page.getByRole("navigation", { name: "Applications" });
        await dock.getByRole("button", { name: "프로젝트" }).click();
        const aboutWindow = page.locator('[data-window-id="about"]');
        const shortcutLayer = page.locator(".desktop-apps");
        const inactiveZ = Number(await aboutWindow.evaluate((element) => getComputedStyle(element).zIndex));
        const shortcutsZ = Number(await shortcutLayer.evaluate((element) => getComputedStyle(element).zIndex));
        expect(inactiveZ).toBeGreaterThan(shortcutsZ);
        await page.mouse.click(72, 260);
        await expect(aboutWindow).toHaveAttribute("data-active", "true");

        const beforeDrag = await aboutWindow.boundingBox();
        const titleBar = aboutWindow.locator(".gui-title-bar");
        const titleBarBox = await titleBar.boundingBox();
        expect(titleBarBox).not.toBeNull();
        await page.mouse.move(
            (titleBarBox?.x ?? 0) + (titleBarBox?.width ?? 0) / 2,
            (titleBarBox?.y ?? 0) + 18,
        );
        await page.mouse.down();
        await page.mouse.move(
            (titleBarBox?.x ?? 0) + (titleBarBox?.width ?? 0) / 2 + 36,
            (titleBarBox?.y ?? 0) + 34,
        );
        await page.mouse.up();
        const afterDrag = await aboutWindow.boundingBox();
        expect((afterDrag?.x ?? 0) - (beforeDrag?.x ?? 0)).toBeGreaterThan(20);

        const movedTitleBar = await titleBar.boundingBox();
        await page.mouse.move(
            (movedTitleBar?.x ?? 0) + (movedTitleBar?.width ?? 0) / 2,
            (movedTitleBar?.y ?? 0) + 18,
        );
        await page.mouse.down();
        await page.mouse.move(
            (movedTitleBar?.x ?? 0) + (movedTitleBar?.width ?? 0) / 2,
            36,
        );
        await page.mouse.up();
        await expect(aboutWindow).toHaveCSS("top", "0px");
        expect((await aboutWindow.boundingBox())?.y).toBe(36);
    });

    test("gives project files the desktop selection and bounded drag contract", async ({
        page,
    }) => {
        await page.goto("/gui?app=projects");
        const projectFile = page.getByRole("button", {
            name: "WCHMS 프로젝트 열기",
        });
        const projectGrid = page.locator(".gui-project-grid");

        await projectFile.click();
        await expect(projectFile).toBeFocused();
        await expect(projectFile).toHaveAttribute("data-selected", "true");
        await expect(projectFile.locator("strong")).toHaveCSS(
            "background-color",
            "rgb(11, 97, 232)",
        );
        await expect(page).toHaveURL(/app=projects/);

        const before = await projectFile.boundingBox();
        const bounds = await projectGrid.boundingBox();
        expect(before).not.toBeNull();
        expect(bounds).not.toBeNull();
        await page.mouse.move(
            (before?.x ?? 0) + (before?.width ?? 0) / 2,
            (before?.y ?? 0) + (before?.height ?? 0) / 2,
        );
        await page.mouse.down();
        await page.mouse.move(
            (before?.x ?? 0) + (before?.width ?? 0) / 2 + 64,
            (before?.y ?? 0) + (before?.height ?? 0) / 2 + 48,
        );
        await page.mouse.up();

        const after = await projectFile.boundingBox();
        expect((after?.x ?? 0) - (before?.x ?? 0)).toBeGreaterThan(50);
        expect((after?.y ?? 0) - (before?.y ?? 0)).toBeGreaterThan(35);
        expect(after?.x).toBeGreaterThanOrEqual(bounds?.x ?? 0);
        expect((after?.x ?? 0) + (after?.width ?? 0)).toBeLessThanOrEqual(
            (bounds?.x ?? 0) + (bounds?.width ?? 0),
        );
        await expect(page).toHaveURL(/app=projects/);

        await projectFile.dblclick();
        await expect(page).toHaveURL(/app=project&slug=wchms/);
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

        await page.goto("/gui?app=projects");
        const projectsWindow = page.getByRole("dialog", { name: "프로젝트" });
        await expect(projectsWindow).toBeVisible();
        const projectsBox = await projectsWindow.boundingBox();
        expect(projectsBox?.width).toBe(700);
        expect(projectsBox?.height).toBe(450);
        await expect(projectsWindow.locator(".gui-project-icon").first()).toHaveCSS(
            "width",
            "56px",
        );
        await expect(
            page.getByRole("button", {
                name: "WCHMS 프로젝트 열기",
            }),
        ).toBeVisible();
        expect(mediaRequests).toEqual([]);

        await page
            .getByRole("button", { name: "WCHMS 프로젝트 열기" })
            .dblclick();
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
            .dblclick();

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
            .dblclick();

        await expect(
            page.getByRole("dialog", { name: "WCHMS" }),
        ).toHaveCount(1);
        await expect(page).toHaveURL(/app=project&slug=wchms/);
    });

    test("keeps the Terminal boot animation running behind the active window", async ({
        page,
    }) => {
        await page.goto("/gui?app=terminal");
        const terminalWindow = page.locator('[data-window-id="terminal"]');
        const terminalRows = terminalWindow.locator(".xterm-rows");
        await expect(terminalRows).toBeVisible();

        const dock = page.getByRole("navigation", { name: "Applications" });
        await dock.getByRole("button", { name: "나에 대해서" }).click();
        await expect(terminalWindow).toHaveAttribute("data-active", "false");

        const before = await terminalRows.textContent();
        await page.waitForTimeout(600);
        const after = await terminalRows.textContent();
        expect(after).not.toBe(before);
    });

    test("preserves Terminal while lifecycle visibility suspends work", async ({
        page,
    }) => {
        await page.goto("/gui?app=terminal");

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
                "/gui?app=terminal&lang=en",
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
        await page.goto("/gui?lang=en");
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

        await expect(page.locator(".gui-system-bar")).toBeHidden();
        await expect(page.locator(".gui-dock")).toBeHidden();
        await expect(aboutWindow).toBeHidden();
        await expect(
            resumeWindow.locator(".gui-title-bar"),
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

    test("restores saved GUI preferences after a reload", async ({ page }) => {
        await page.goto("/gui?app=settings");

        await page.getByRole("button", { name: "English" }).click();
        await page.getByRole("button", { name: "Dark Mode" }).click();
        await page.getByRole("button", { name: "Auto hide" }).click();
        await page.getByRole("button", { name: /Tahoe Light/ }).click();

        await page.goto("/gui?app=settings");

        await expect(page.locator("html")).toHaveAttribute("lang", "en");
        await expect(page.locator(".gui-shell")).toHaveAttribute(
            "data-theme",
            "dark",
        );
        await expect(page.locator(".gui-shell")).toHaveAttribute(
            "data-wallpaper",
            "tahoe_light",
        );
        await expect(
            page.getByRole("navigation", { name: "Applications" }),
        ).toHaveAttribute("data-auto-hide", "true");
    });

    test("restores Settings from the URL and keeps language canonical", async ({
        page,
    }) => {
        await page.goto("/gui?app=settings&lang=en");

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
        await expect(page).toHaveURL(/\/gui\?app=settings$/);
        await expect(
            page.getByRole("dialog", { name: "설정" }),
        ).toBeVisible();

        await page
            .getByRole("dialog", { name: "설정" })
            .getByRole("button", { name: "다크 모드" })
            .click();
        await expect(page.locator("html")).toHaveClass(/dark/);
        await expect(page.locator(".gui-shell")).toHaveAttribute(
            "data-theme",
            "dark",
        );

        await page
            .getByRole("dialog", { name: "설정" })
            .getByRole("button", { name: /Tahoe Light/ })
            .click();
        await expect(page.locator(".gui-shell")).toHaveAttribute(
            "data-wallpaper",
            "tahoe_light",
        );

        await page
            .getByRole("dialog", { name: "설정" })
            .getByRole("button", { name: "라이트 모드" })
            .click();
        await expect(page.locator("html")).toHaveClass(/light/);
        const shell = page.locator(".gui-shell");
        await expect(shell).toHaveAttribute("data-theme", "light");
        await expect(shell).toHaveCSS(
            "background-image",
            /tahoe_light\.jpg/,
        );
        const settings = page.getByRole("dialog", { name: "설정" });
        await expect(
            settings.locator(".gui-settings-panel").first(),
        ).toHaveCSS("background-color", "rgb(248, 250, 252)");

        const dock = page.getByRole("navigation", { name: "Applications" });
        await settings.getByRole("button", { name: "자동 숨김" }).click();
        await expect(dock).toHaveAttribute("data-auto-hide", "true");
        await expect
            .poll(async () => (await dock.boundingBox())?.y ?? 0)
            .toBeGreaterThan(700);
        await page.mouse.move(640, 719);
        await expect.poll(async () => (await dock.boundingBox())?.y ?? 720).toBeLessThan(700);
        await settings.getByRole("button", { name: "항상 표시" }).click();
        await expect(dock).toHaveAttribute("data-auto-hide", "false");

        await page
            .getByRole("navigation", { name: "Applications" })
            .getByRole("button", { name: "프로젝트" })
            .click();
        const projectsWindow = page.getByRole("dialog", { name: "프로젝트" });
        const projectsContent = projectsWindow.locator(".gui-window-content");
        const folder = projectsWindow.locator(".gui-folder-view");
        await expect(folder).toHaveCSS("background-color", "rgb(247, 249, 252)");
        const contentBox = await projectsContent.boundingBox();
        const folderBox = await folder.boundingBox();
        expect(folderBox?.height).toBe(contentBox?.height);
    });

    test("uses adaptive app surfaces, content-sized windows, and pointer affordances", async ({
        page,
    }) => {
        await page.goto("/gui");

        await expect(
            page.locator(".gui-system-title"),
        ).toHaveText("Hyunho's Portfolio");
        await expect(page.locator(".gui-viewer-name")).toContainText(
            "Guest",
        );

        const dockButtons = page.locator(".dock-app");
        await expect(dockButtons.first()).toHaveCSS("cursor", "pointer");
        await expect(page.locator(".desktop-app").first()).toHaveCSS(
            "cursor",
            "pointer",
        );

        const aboutWindow = page.locator('[data-window-id="about"]');
        const aboutBox = await aboutWindow.boundingBox();

        await page
            .getByRole("navigation", { name: "Applications" })
            .getByRole("button", { name: "연락처" })
            .click();

        const contactWindow = page.locator(
            '[data-window-id="contact"]',
        );
        const contactSurface = contactWindow.locator(
            ".gui-app-surface",
        );
        const contactBox = await contactWindow.boundingBox();

        expect(contactBox?.width).toBe(600);
        expect(contactBox?.height).toBe(370);
        expect(contactBox?.height ?? 0).toBeLessThan(
            aboutBox?.height ?? 0,
        );
        await expect(contactSurface).toHaveCSS(
            "background-color",
            "rgb(247, 249, 252)",
        );

        await page
            .getByRole("navigation", { name: "Applications" })
            .getByRole("button", { name: "설정" })
            .click();
        await page
            .getByRole("dialog", { name: "설정" })
            .getByRole("button", { name: "다크 모드" })
            .click();
        await page
            .getByRole("navigation", { name: "Applications" })
            .getByRole("button", { name: "연락처" })
            .click();

        await expect(contactSurface).toHaveCSS(
            "background-color",
            "rgb(25, 29, 38)",
        );
        await expect(contactSurface).toHaveCSS(
            "color",
            "rgb(244, 247, 251)",
        );
    });

    test("provides global keyboard switching and excludes inactive content from Tab", async ({
        page,
    }) => {
        await page.goto("/gui");
        const dock = page.getByRole("navigation", {
            name: "Applications",
        });
        await dock.getByRole("button", { name: "프로젝트" }).click();

        const aboutWindow = page.locator('[data-window-id="about"]');
        const projectsWindow = page.locator(
            '[data-window-id="projects"]',
        );

        await expect(
            aboutWindow.locator(".gui-window-content"),
        ).toHaveAttribute("inert", "");
        await expect(
            projectsWindow.locator(".gui-window-content"),
        ).not.toHaveAttribute("inert", "");

        await page.keyboard.press("Control+F6");
        await expect(page).toHaveURL(/\/gui$/);
        await expect(aboutWindow).toHaveAttribute(
            "data-active",
            "true",
        );
        await expect(
            aboutWindow.getByRole("heading", {
                name: "나에 대해서",
            }),
        ).toBeFocused();

        await expect(
            page.getByRole("button", { name: "Show desktop" }),
        ).toHaveCount(0);
        await dock.getByRole("button", { name: "프로젝트" }).click();
        await expect(page).toHaveURL(/app=projects/);
        await expect(projectsWindow).toBeVisible();
    });

    test("keeps title bars clean and respects reduced motion", async ({ page }) => {
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.setViewportSize({ width: 756, height: 801 });
        await page.goto("/gui");

        const aboutWindow = page.locator('[data-window-id="about"]');
        await expect(
            aboutWindow.getByRole("combobox", {
                name: "나에 대해서 position",
            }),
        ).toHaveCount(0);
        await expect(
            page.getByRole("button", { name: "Close active window" }),
        ).toHaveCount(0);

        const maximizeButton = aboutWindow.getByRole("button", {
            name: "나에 대해서 maximize",
        });
        await maximizeButton.click();
        await expect(aboutWindow).toHaveClass(/gui-window-maximized/);
        const maximizedBox = await aboutWindow.boundingBox();
        expect(maximizedBox).toEqual({ x: 0, y: 36, width: 756, height: 765 });

        await aboutWindow
            .getByRole("button", { name: "나에 대해서 restore" })
            .click();
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
