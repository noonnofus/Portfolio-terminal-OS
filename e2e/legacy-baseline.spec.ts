import { expect, test } from "@playwright/test";

test.describe("route compatibility", () => {
    test("terminal and switched GUI routes render", async ({
        page,
    }) => {
        await page.goto("/");
        await expect(page.locator("body")).toBeVisible();

        await page.goto("/gui");
        await expect(
            page.getByRole("dialog", { name: "나에 대해서" }),
        ).toBeVisible();
        await expect(page).toHaveURL(/\/gui$/);
    });

    test("reused project loaders register their namespace on demand", async ({
        page,
    }) => {
        await page.goto("/gui?app=projects");
        await page
            .getByRole("button", {
                name: "WCHMS 프로젝트 열기",
            })
            .click();

        await expect(
            page.getByRole("heading", {
                name: "WCHMS - 클라이언트 프로젝트",
            }),
        ).toBeVisible();
    });

    test("removes the preview route after the entry switch", async ({
        request,
    }) => {
        const response = await request.get("/gui-v2");
        expect(response.status()).toBe(404);
    });
});
