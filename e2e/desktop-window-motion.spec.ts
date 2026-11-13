import { expect, test } from "@playwright/test";
import { requireApps } from "./projectAvailability";

for (const app of [
    { id: "contact", dockId: "contact", url: "/desktop?app=contact" },
    { id: "project:mcp", dockId: "projects", url: "/desktop?app=project&slug=mcp" },
] as const) {
    test(`scales ${app.id} uniformly into the Dock and restores its position`, async ({ page }) => {
        requireApps(app.id, app.dockId);
        await page.emulateMedia({ reducedMotion: "no-preference" });
        await page.setViewportSize({ width: 1280, height: 900 });
        await page.goto(app.url);
        const frame = page.locator(`[data-window-id="${app.id}"]`);
        await expect(frame).toHaveCSS("transform", "none");
        const bar = await frame.locator(".application-title-bar").boundingBox();
        await page.mouse.move(bar!.x + bar!.width / 2, bar!.y + 20);
        await page.mouse.down();
        await page.mouse.move(bar!.x + bar!.width / 2 + 100, bar!.y + 100, { steps: 5 });
        await page.mouse.up();
        const original = (await frame.boundingBox())!;
        const dock = page.locator(`[data-dock-app-id="${app.dockId}"]`);
        const icon = (await dock.locator(".application-app-icon").boundingBox())!;
        const animation = frame.evaluate((element) => new Promise<{
            x: number; y: number; width: number; height: number; opacity: number; inert: boolean;
        }[]>((resolve) => {
            const samples: { x: number; y: number; width: number; height: number; opacity: number; inert: boolean }[] = [];
            element.querySelector(".application-traffic-minimize")!.addEventListener("click", () => {
                const sample = () => {
                    if (!element.isConnected) return resolve(samples);
                    const rect = element.getBoundingClientRect();
                    samples.push({ x: rect.x, y: rect.y, width: rect.width, height: rect.height, opacity: Number(getComputedStyle(element).opacity), inert: element.hasAttribute("inert") });
                    requestAnimationFrame(sample);
                };
                requestAnimationFrame(sample);
            }, { once: true });
        }));
        await frame.getByRole("button", { name: / minimize$/ }).click();
        const samples = await animation;
        expect(samples.length).toBeGreaterThan(3);
        for (const sample of samples) {
            expect(sample.width / sample.height).toBeCloseTo(original.width / original.height, 2);
        }
        expect(samples.some((sample) => sample.width < original.width * 0.3 && sample.opacity > 0.95 && sample.inert)).toBe(true);
        const end = samples.at(-1)!;
        expect(end.width).toBeLessThan(icon.width * 1.5);
        expect(Math.abs(end.x + end.width / 2 - icon.x - icon.width / 2)).toBeLessThan(10);
        expect(Math.abs(end.y + end.height / 2 - icon.y - icon.height / 2)).toBeLessThan(10);
        const bounce = app.id === "contact" ? dock.evaluate((button) => new Promise<number>((resolve) => {
            button.addEventListener("click", () => {
                const started = performance.now();
                let maxOffset = 0;
                const sample = () => {
                    const wrapper = button.querySelector(".application-app-icon")!.parentElement!;
                    maxOffset = Math.max(maxOffset, Math.abs(new DOMMatrixReadOnly(getComputedStyle(wrapper).transform).m42));
                    if (performance.now() - started < 550) requestAnimationFrame(sample);
                    else resolve(maxOffset);
                };
                requestAnimationFrame(sample);
            }, { once: true });
        })) : null;
        await dock.click();
        if (bounce !== null) expect(await bounce).toBeLessThan(0.5);
        if (app.id === "project:mcp") {
            await page.locator('[data-window-id="projects"] [data-node-id="desktop:project:mcp"]').press("Enter");
        }
        await expect(frame).toHaveCSS("transform", "none");
        await expect.poll(() => frame.boundingBox()).toEqual(original);
        await expect(frame).not.toHaveAttribute("inert", "");
        await expect(frame.locator(".application-title-text")).toBeFocused();
    });
}
