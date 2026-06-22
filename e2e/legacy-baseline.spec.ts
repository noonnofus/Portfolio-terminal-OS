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

    test("legacy project loaders register their namespace on demand", async ({
        page,
    }) => {
        await page.goto("/gui");
        await page
            .getByRole("button", { name: "프로젝트_폴더" })
            .dblclick();
        await page.getByRole("button", { name: "WCHMS" }).dblclick();

        await expect(
            page.getByRole("heading", {
                name: "WCHMS - 클라이언트 프로젝트",
            }),
        ).toBeVisible();
    });
});
