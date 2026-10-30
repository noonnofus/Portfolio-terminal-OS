import { expect, test, type Page } from "@playwright/test";

const career = (page: Page) => page.locator('[data-window-id="about"]');

async function expectFullscreenChrome(page: Page) {
    await expect.poll(() => page.evaluate(() => {
        const bar = document.querySelector(".application-system-bar")!;
        const system = bar.getBoundingClientRect();
        const title = document.querySelector('[data-active="true"] .application-title-bar')!.getBoundingClientRect();
        const dock = document.querySelector(".application-dock")!.getBoundingClientRect();
        return system.top === 0 && system.height === 36 &&
            title.bottom <= system.bottom && title.height === 42 && dock.top >= innerHeight &&
            [...bar.children].every((child) => getComputedStyle(child).opacity === "0");
    })).toBe(true);
}

async function maximize(page: Page) {
    await career(page).getByRole("button", { name: "커리어 maximize" }).click();
    await page.mouse.move(600, 400);
    await expect.poll(() => career(page).boundingBox()).toEqual({
        x: 0, y: 36, width: 1280, height: 864,
    });
    await expectFullscreenChrome(page);
}

async function expectRevealedHeaders(page: Page) {
    await expect(page.getByRole("navigation", { name: "System controls" })).toHaveCSS("opacity", "1");
    await expect.poll(() => page.locator('[data-active="true"] .application-title-bar').boundingBox())
        .toMatchObject({ x: 0, y: 36, height: 42 });
}

test.describe("Desktop fullscreen", () => {
    test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 900 });
    });

    test("animates into fullscreen and restores the original bounds", async ({ page }) => {
        await page.goto("/desktop");
        const original = await career(page).boundingBox();
        const originalRadius = await career(page).evaluate((dialog) => getComputedStyle(dialog).borderRadius);
        const article = career(page).locator(".application-content-inset");
        const originalPadding = await article.evaluate((element) => getComputedStyle(element).paddingTop);
        expect(parseFloat(originalRadius)).toBeGreaterThan(0);
        await career(page).getByRole("button", { name: "커리어 maximize" }).evaluate((button) => {
            button.addEventListener("click", () => {
                const dialog = button.closest("section")!;
                const widths: number[] = [];
                const start = performance.now();
                const sample = () => {
                    widths.push(dialog.getBoundingClientRect().width);
                    if (performance.now() - start < 500) requestAnimationFrame(sample);
                    else dialog.setAttribute("data-width-samples", JSON.stringify(widths));
                };
                requestAnimationFrame(sample);
            }, { once: true });
        });
        await maximize(page);
        await expect(career(page)).toHaveCSS("border-radius", "0px");
        await expect(career(page)).toHaveAttribute("data-width-samples", /\[/);
        const widths: number[] = JSON.parse((await career(page).getAttribute("data-width-samples"))!);
        expect(widths.some((width) => width > original!.width + 1 && width < 1279)).toBe(true);
        const content = await career(page).locator(".application-window-content").boundingBox();
        expect(content).toEqual({ x: 0, y: 36, width: 1280, height: 864 });
        await expect(article).toHaveCSS("padding-top", "57px");
        const scrollSurface = career(page).locator(".application-app-surface");
        const firstLine = article.locator("header > p").first();
        expect((await firstLine.boundingBox())!.y).toBe(93);
        await scrollSurface.evaluate((surface) => { surface.scrollTop = 57; });
        await expect.poll(async () => (await firstLine.boundingBox())!.y).toBe(36);
        await expect(firstLine).toBeInViewport({ ratio: 1 });
        await scrollSurface.evaluate((surface) => { surface.scrollTop = 240; });
        await expect.poll(() => scrollSurface.evaluate((surface) => surface.scrollTop)).toBe(240);

        await page.mouse.move(500, 18);
        const samples = await career(page).locator(".application-title-bar").evaluate((header) =>
            new Promise<{ headerY: number; contentY: number }[]>((resolve) => {
                const positions: { headerY: number; contentY: number }[] = [];
                const startedAt = performance.now();
                const sample = () => {
                    positions.push({
                        headerY: header.getBoundingClientRect().y,
                        contentY: header.parentElement!.querySelector(".application-window-content")!.getBoundingClientRect().y,
                    });
                    if (performance.now() - startedAt < 450) requestAnimationFrame(sample);
                    else resolve(positions);
                };
                requestAnimationFrame(sample);
            }),
        );
        expect(samples.some(({ headerY }) => headerY > -6 && headerY < 36)).toBe(true);
        expect(samples.every(({ contentY }) => contentY === content!.y)).toBe(true);
        expect(await scrollSurface.evaluate((surface) => surface.scrollTop)).toBe(240);
        const systemControls = page.getByRole("navigation", { name: "System controls" });
        await expect(systemControls).toHaveCSS("opacity", "1");
        await expect.poll(() => page.locator(".application-system-bar").boundingBox())
            .toEqual({ x: 0, y: 0, width: 1280, height: 36 });
        await expect.poll(() => career(page).locator(".application-title-bar").boundingBox())
            .toEqual({ x: 0, y: 36, width: 1280, height: 42 });
        expect(await career(page).locator(".application-window-content").boundingBox()).toEqual(content);

        for (const y of [76, 18, 58]) {
            await page.mouse.move(500, y);
            await expect(systemControls).toHaveCSS("opacity", "1");
            await expect(career(page).locator(".application-title-bar"))
                .toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
            expect(await career(page).locator(".application-window-content").boundingBox()).toEqual(content);
            expect(await scrollSurface.evaluate((surface) => surface.scrollTop)).toBe(240);
        }

        await page.mouse.move(500, 400);
        await expectFullscreenChrome(page);
        expect(await career(page).locator(".application-window-content").boundingBox()).toEqual(content);
        expect(await scrollSurface.evaluate((surface) => surface.scrollTop)).toBe(240);
        await page.mouse.move(500, 58);
        await career(page).getByRole("button", { name: "커리어 restore" }).click();
        await expect.poll(() => career(page).boundingBox()).toEqual(original);
        await expect(career(page)).toHaveCSS("border-radius", originalRadius);
        await expect(article).toHaveCSS("padding-top", originalPadding);
        await expect(page.locator(".application-shell")).toHaveAttribute("data-fullscreen", "false");
    });

    for (const theme of ["light", "dark"]) {
        test(`fills the fullscreen viewport with the app surface in ${theme} mode`, async ({ page }) => {
            await page.addInitScript((value) => localStorage.setItem("theme", value), theme);
            await page.goto("/desktop");
            await expect(page.locator(".application-shell")).toHaveAttribute("data-theme", theme);
            const dialog = career(page);
            const originalBackground = await dialog.evaluate((element) => getComputedStyle(element).backgroundColor);
            const dock = page.locator(".application-dock");
            const originalDockBackground = await dock.evaluate((element) => getComputedStyle(element).backgroundColor);
            await maximize(page);
            const surfaceBackground = await dialog.locator(".application-window-content")
                .evaluate((element) => getComputedStyle(element).backgroundColor);
            const surface = dialog.locator(".application-app-surface");
            await expect(surface).toHaveCSS("background-color", surfaceBackground);
            expect(await surface.boundingBox()).toEqual({ x: 0, y: 36, width: 1280, height: 864 });
            await expect(dialog).toHaveCSS("background-color", originalBackground);
            await expect(dialog).toHaveCSS("opacity", "1");
            await expect(dock).toHaveCSS("background-color", originalDockBackground);
            await page.keyboard.press("Escape");
            await expect(dialog).toHaveCSS("background-color", originalBackground);
        });
    }

    test("blocks fullscreen dragging without changing the restored position and allows normal dragging", async ({ page }) => {
        await page.goto("/desktop");
        const original = (await career(page).boundingBox())!;
        await maximize(page);
        const fullscreen = await career(page).boundingBox();
        await page.mouse.move(640, 18);
        await expectRevealedHeaders(page);

        await page.mouse.move(640, 57);
        await page.mouse.down();
        await page.mouse.move(820, 197, { steps: 6 });
        expect(await career(page).boundingBox()).toEqual(fullscreen);
        await page.mouse.up();
        expect(await career(page).boundingBox()).toEqual(fullscreen);

        await page.mouse.move(640, 18);
        await career(page).getByRole("button", { name: "커리어 restore" }).click();
        await expect.poll(() => career(page).boundingBox()).toEqual(original);
        await expect(career(page)).toHaveCSS("border-radius", "12px");

        const grabX = original.x + original.width / 2;
        const grabY = original.y + 21;
        await page.mouse.move(grabX, grabY);
        await page.mouse.down();
        await page.mouse.move(grabX + 120, grabY + 80, { steps: 6 });
        await page.mouse.up();
        await expect.poll(() => career(page).boundingBox()).toEqual({
            ...original, x: original.x + 120, y: original.y + 80,
        });
    });

    test("preserves bounds and corners through repeated button and Escape restores", async ({ page }) => {
        await page.goto("/desktop");
        const original = await career(page).boundingBox();
        const radius = await career(page).evaluate((dialog) => getComputedStyle(dialog).borderRadius);
        for (const exit of ["button", "Escape", "button", "Escape"]) {
            await maximize(page);
            if (exit === "button") {
                await page.mouse.move(500, 18);
                await career(page).getByRole("button", { name: "커리어 restore" }).click();
            } else {
                await page.keyboard.press("Escape");
            }
            await expect.poll(() => career(page).boundingBox()).toEqual(original);
            await expect(career(page)).toHaveCSS("border-radius", radius);
            await expect(page.locator(".application-shell")).toHaveAttribute("data-fullscreen", "false");
        }
    });

    test("settles both headers correctly after rapid hover reversals", async ({ page }) => {
        await page.goto("/desktop");
        await maximize(page);
        const content = await career(page).locator(".application-window-content").boundingBox();
        for (const y of [18, 400, 58, 400, 18, 58]) {
            await page.mouse.move(500, y, { steps: 2 });
        }
        await expectRevealedHeaders(page);
        expect(await career(page).locator(".application-window-content").boundingBox()).toEqual(content);
        await page.mouse.move(500, 400);
        await expectFullscreenChrome(page);
        expect(await career(page).locator(".application-window-content").boundingBox()).toEqual(content);
        await page.mouse.move(500, 18);
        await expectRevealedHeaders(page);
    });

    test("keeps fullscreen chrome aligned after resize and restores a bounded window", async ({ page }) => {
        await page.goto("/desktop");
        await maximize(page);
        await page.setViewportSize({ width: 700, height: 700 });
        await expect.poll(() => career(page).boundingBox())
            .toEqual({ x: 0, y: 36, width: 700, height: 664 });
        await expectFullscreenChrome(page);
        const content = await career(page).locator(".application-window-content").boundingBox();
        await page.mouse.move(350, 18);
        await expectRevealedHeaders(page);
        expect(await career(page).locator(".application-window-content").boundingBox()).toEqual(content);
        await career(page).getByRole("button", { name: "커리어 restore" }).click();
        await expect(career(page)).not.toHaveClass(/application-window-maximized/);
        await expect.poll(async () => {
            const box = (await career(page).boundingBox())!;
            return box.x >= 0 && box.y >= 36 && box.x + box.width <= 700 && box.y + box.height <= 700;
        }).toBe(true);
        await expect(career(page)).toHaveCSS("border-radius", "12px");
    });

    for (const app of [
        { id: "terminal", title: "터미널", surface: ".xterm", insets: ".xterm", url: "/desktop?app=terminal" },
        { id: "settings", title: "설정", surface: ".application-settings-surface", insets: ".application-settings-sidebar, .application-settings-detail", url: "/desktop?app=settings" },
        { id: "resume", title: "이력서", surface: ".application-resume", insets: ".application-resume", url: "/desktop?app=resume" },
        { id: "contact", title: "연락처", surface: ".application-app-surface", insets: ".application-content-inset", url: "/desktop?app=contact" },
        { id: "notes", title: "방명록", surface: ".application-content-inset", insets: ".application-content-inset", url: "/desktop?app=notes" },
        { id: "projects", title: "프로젝트", surface: ".directory-surface--window", insets: ".directory-surface--window > .directory-grid", url: "/desktop?app=projects" },
        { id: "project:portfolio", title: "포트폴리오", surface: ".application-content-inset", insets: ".application-content-inset", url: "/desktop?app=project&slug=portfolio" },
    ]) {
        test(`keeps ${app.id} content below the fullscreen header without duplicate top spacing`, async ({ page }) => {
            await page.goto(app.url);
            const dialog = page.locator(`[data-window-id="${app.id}"]`);
            await expect(dialog.locator(app.surface)).toBeVisible();
            const original = await dialog.boundingBox();
            const insets = dialog.locator(app.insets);
            await expect(insets.first()).toBeVisible();
            const originalInsets = await insets.evaluateAll((elements) => elements.map((element) => ({
                paddingTop: getComputedStyle(element).paddingTop,
                marginTop: getComputedStyle(element).marginTop,
            })));
            await dialog.getByRole("button", { name: `${app.title} maximize` }).click();
            await page.mouse.move(600, 400);
            await expectFullscreenChrome(page);
            const content = dialog.locator(".application-window-content");
            await expect.poll(() => content.boundingBox())
                .toEqual({ x: 0, y: 36, width: 1280, height: 864 });
            for (const [index, inset] of (await insets.all()).entries()) {
                const padding = app.id === "terminal" || (app.id === "contact" && index > 0) ? "0px" : "57px";
                await expect(inset).toHaveCSS("padding-top", padding);
                await expect(inset).toHaveCSS("margin-top", "0px");
            }
            for (const y of [18, 58]) {
                await page.mouse.move(500, y);
                await expectRevealedHeaders(page);
                expect(await content.boundingBox()).toEqual({ x: 0, y: 36, width: 1280, height: 864 });
            }
            if (app.id === "resume") {
                await page.emulateMedia({ media: "print" });
                await expect(content).toHaveCSS("margin-top", "0px");
                await page.emulateMedia({ media: "screen" });
            }
            await page.mouse.move(500, 400);
            await expectFullscreenChrome(page);
            await page.mouse.move(500, 18);
            await dialog.getByRole("button", { name: `${app.title} restore` }).click();
            await expect.poll(() => dialog.boundingBox()).toEqual(original);
            await expect(dialog).toHaveCSS("border-radius", "12px");
            expect(await insets.evaluateAll((elements) => elements.map((element) => ({
                paddingTop: getComputedStyle(element).paddingTop,
                marginTop: getComputedStyle(element).marginTop,
            })))).toEqual(originalInsets);
        });
    }

    for (const app of [
        { id: "resume", url: "/desktop?app=resume", scroller: ".application-window-content", firstContent: ".application-resume-hero > div:first-child > p:first-child" },
        { id: "settings", url: "/desktop?app=settings", scroller: ".application-settings-detail", firstContent: ".application-settings-section-title" },
        { id: "project:portfolio", url: "/desktop?app=project&slug=portfolio", scroller: ".application-app-surface", firstContent: ".application-content-inset > header > h2" },
    ]) {
        test(`scrolls the initial fullscreen clearance away with ${app.id} content`, async ({ page }) => {
            await page.setViewportSize({ width: 1280, height: 300 });
            await page.goto(app.url);
            const dialog = page.locator(`[data-window-id="${app.id}"]`);
            await dialog.getByRole("button", { name: / maximize$/ }).click();
            await page.mouse.move(600, 150);
            await expectFullscreenChrome(page);
            const firstContent = dialog.locator(app.firstContent);
            const scroller = dialog.locator(app.scroller);
            await expect.poll(async () => (await firstContent.boundingBox())!.y).toBe(93);
            await scroller.evaluate((element) => { element.scrollTop = 57; });
            await expect.poll(async () => (await firstContent.boundingBox())!.y).toBe(36);
            await expect(firstContent).toBeInViewport({ ratio: 1 });
            expect((await scroller.boundingBox())!.y).toBe(36);
        });
    }

    for (const dockAutoHide of [false, true]) {
        test(`reveals the Dock at the bottom with auto-hide ${dockAutoHide}`, async ({ page }) => {
            await page.addInitScript((autoHide) => {
                localStorage.setItem("desktop:preferences", JSON.stringify({
                    version: 1,
                    preferences: { language: "ko", wallpaper: "golden_gate_light", dockAutoHide: autoHide },
                }));
            }, dockAutoHide);
            await page.goto("/desktop");
            await maximize(page);

            const dock = page.getByRole("navigation", { name: "Applications" });
            await expect(dock).toHaveAttribute("data-auto-hide", String(dockAutoHide));
            await page.mouse.move(20, 899);
            await expect.poll(async () => (await dock.boundingBox())!.y).toBeLessThan(834);
            await page.mouse.move(640, 850);
            await dock.getByRole("button", { name: "프로젝트", exact: true }).click();
            await expect(page.locator(".application-shell")).toHaveAttribute("data-fullscreen", "false");
            await page.keyboard.press("Control+F6");
            await expect(page.locator(".application-shell")).toHaveAttribute("data-fullscreen", "true");
            await page.mouse.move(600, 400);
            await expectFullscreenChrome(page);
            await page.keyboard.press("Escape");
            await expect(career(page)).not.toHaveClass(/application-window-maximized/);
            await expect(dock).toHaveAttribute("data-auto-hide", String(dockAutoHide));
            if (dockAutoHide) {
                await expect.poll(async () => (await dock.boundingBox())!.y).toBeGreaterThanOrEqual(900);
            } else {
                await expect.poll(async () => (await dock.boundingBox())!.y).toBeLessThan(834);
            }
            expect(await page.evaluate(() =>
                JSON.parse(localStorage.getItem("desktop:preferences")!).preferences.dockAutoHide,
            )).toBe(dockAutoHide);
        });
    }

    test("reveals window controls for keyboard focus and exits with Escape", async ({ page, browserName }) => {
        await page.goto("/desktop");
        await maximize(page);
        await page.keyboard.press(browserName === "webkit" ? "Alt+Shift+Tab" : "Shift+Tab");
        await expect(career(page).getByRole("button", { name: "커리어 restore" })).toBeFocused();
        await expect(career(page).locator(".application-title-bar")).toBeInViewport({ ratio: 1 });
        await expect(page.getByRole("navigation", { name: "System controls" })).toHaveCSS("opacity", "1");
        await expect.poll(async () => (await page.locator(".application-system-bar").boundingBox())!.y).toBe(0);
        await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab");
        await expectFullscreenChrome(page);
        const dockButton = page.getByRole("navigation", { name: "Applications" })
            .getByRole("button", { name: "설정", exact: true });
        await dockButton.focus();
        await expect.poll(async () => (await page.locator(".application-dock").boundingBox())!.y).toBeLessThan(834);
        await page.keyboard.press("Escape");
        await expect(career(page)).not.toHaveClass(/application-window-maximized/);
        await expect(page.locator(".application-shell")).toHaveAttribute("data-fullscreen", "false");
    });

    test("restores fullscreen after minimizing and resets it after closing", async ({ page }) => {
        await page.goto("/desktop");
        await maximize(page);
        await page.mouse.move(500, 58);
        await career(page).getByRole("button", { name: "커리어 minimize" }).click();
        await expect(career(page)).toBeHidden();
        await expect(page.locator(".application-shell")).toHaveAttribute("data-fullscreen", "false");
        await page.getByRole("navigation", { name: "Applications" })
            .getByRole("button", { name: "커리어", exact: true }).click();
        await expect(career(page)).toHaveClass(/application-window-maximized/);
        await page.mouse.move(600, 400);
        await expectFullscreenChrome(page);
        await page.mouse.move(500, 58);
        await career(page).getByRole("button", { name: "커리어 close" }).click();
        await expect(career(page)).toHaveCount(0);
        await page.getByRole("navigation", { name: "Applications" })
            .getByRole("button", { name: "커리어", exact: true }).click();
        await expect(career(page)).not.toHaveClass(/application-window-maximized/);
    });

    test("skips fullscreen and chrome animation with reduced motion", async ({ page }) => {
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto("/desktop");
        await maximize(page);
        await expect(page.getByRole("navigation", { name: "System controls" })).toHaveCSS("transition-duration", "0s");
        await expect(page.locator(".application-dock")).toHaveCSS("transition-duration", "0s");
        await expect(career(page).locator(".application-title-bar")).toHaveCSS("transition-duration", "0s");
        await page.mouse.move(500, 58);
        expect((await career(page).locator(".application-title-bar").boundingBox())!.y).toBe(36);
        await expect(career(page)).toHaveCSS("transform", "none");
        await page.keyboard.press("Escape");
        await expect(career(page)).not.toHaveClass(/application-window-maximized/);
    });
});

test.describe("Touch fullscreen", () => {
    test.skip(({ browserName }) => browserName === "firefox", "Firefox does not emulate touch contexts");
    test.use({ hasTouch: true });

    for (const width of [390, 1024]) {
        test(`keeps both headers and the Dock available at ${width}px`, async ({ page }) => {
            await page.setViewportSize({ width, height: 844 });
            await page.goto("/desktop");
            const article = career(page).locator(".application-content-inset");
            const padding = await article.evaluate((element) => getComputedStyle(element).paddingTop);
            await career(page).getByRole("button", { name: "커리어 maximize" }).tap();
            await expect.poll(async () => {
                const box = (await career(page).boundingBox())!;
                return { ...box, width: Math.round(box.width), height: Math.round(box.height) };
            }).toEqual({ x: 0, y: 36, width, height: 724 });
            await expect(page.locator(".application-system-bar")).toBeInViewport({ ratio: 1 });
            await expect(career(page).locator(".application-title-bar")).toBeInViewport({ ratio: 1 });
            const dock = page.getByRole("navigation", { name: "Applications" });
            await expect(dock).toBeInViewport();
            const content = (await career(page).locator(".application-window-content").boundingBox())!;
            expect(content.y).toBe(78);
            await expect(article).toHaveCSS("padding-top", padding);
            expect(content.y + content.height).toBeLessThanOrEqual((await dock.boundingBox())!.y);
            await page.setViewportSize({ width: 844, height: width });
            await expect.poll(async () => {
                const box = (await career(page).boundingBox())!;
                return { ...box, width: Math.round(box.width), height: Math.round(box.height) };
            }).toEqual({ x: 0, y: 36, width: 844, height: width - 120 });
            await expect(career(page).locator(".application-title-bar")).toBeInViewport({ ratio: 1 });
            await expect(dock).toBeInViewport({ ratio: 1 });
            await page.setViewportSize({ width, height: 844 });
            await career(page).getByRole("button", { name: "커리어 restore" }).tap();
            await expect(career(page)).not.toHaveClass(/application-window-maximized/);
        });
    }
});
