import { expect, test } from "@playwright/test";

test.describe("legacy route baseline", () => {
    test("terminal and GUI routes render before V2 entry work begins", async ({
        page,
    }) => {
        await page.goto("/");
        await expect(page.locator("body")).toBeVisible();

        await page.goto("/gui");
        await expect(page.locator("body")).toBeVisible();
        await expect(page).toHaveURL(/\/gui$/);
    });
});
