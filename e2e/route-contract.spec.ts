import { expect, test } from "@playwright/test";

test.describe("route compatibility", () => {
    test("terminal and switched GUI routes render", async ({
        page,
    }) => {
        await page.goto("/");
        await expect(page.locator("body")).toBeVisible();

        await page.goto("/gui");
        await expect(
            page.getByRole("dialog", { name: "김현호" }),
        ).toBeVisible();
        await expect(page).toHaveURL(/\/gui$/);
    });

    test("project loaders register their namespace on demand", async ({
        page,
    }) => {
        await page.goto("/gui?app=projects");
        await page
            .getByRole("button", {
                name: "다국어 학습 지원 플랫폼 프로젝트 열기",
            })
            .dblclick();

        await expect(
            page.getByRole("heading", {
                name: "다국어 학습 지원 플랫폼",
            }),
        ).toBeVisible();
    });

});
