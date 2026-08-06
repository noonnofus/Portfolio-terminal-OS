import { expect, test } from "@playwright/test";

test.describe("route compatibility", () => {
    test("terminal and switched GUI routes render", async ({
        page,
    }) => {
        await page.goto("/");
        await expect(page.locator("body")).toBeVisible();

        await page.goto("/gui");
        await expect(
            page.getByRole("dialog", { name: "커리어" }),
        ).toBeVisible();
        await expect(page).toHaveURL(/\/gui$/);
    });

    test("project loaders register their namespace on demand", async ({
        page,
    }) => {
        await page.goto("/gui?app=projects");
        await page
            .getByRole("button", {
                name: "WCHMS 프로젝트 열기",
            })
            .dblclick();

        await expect(
            page.getByRole("heading", {
                name: "WCHMS",
            }),
        ).toBeVisible();
    });

    test("project architecture exposes a labeled image after rendering", async ({
        page,
    }) => {
        await page.goto("/gui?app=project&slug=mcp");

        const projectDialog = page.getByRole("dialog", {
            name: "OptiGen MCP 서버",
        });
        const diagram = projectDialog.getByRole("img", {
            name: "OptiGen 대화에서 AI 서비스와 MCP 서버를 거쳐 업무 API와 장시간 작업을 실행하는 흐름도",
        });
        await expect(diagram).toBeVisible();
        await expect(projectDialog.getByRole("alert")).toHaveCount(0);
    });

});
