import { expect, test } from "@playwright/test";

test.describe("GUI V2 Slice 1", () => {
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
});
