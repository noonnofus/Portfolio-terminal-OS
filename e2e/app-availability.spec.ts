import { expect, test } from "@playwright/test";
import { isAppEnabled } from "../src/app/desktop/config/appCatalog";
import { dockAppIds } from "../src/app/desktop/config/dockApps";

for (const language of ["ko", "en"] as const) {
    const route = language === "ko" ? "/desktop" : "/en/desktop";
    const resumeTitle = language === "ko" ? "이력서" : "Resume";
    const projectsTitle = language === "ko" ? "프로젝트" : "Projects";

    test(`hides disabled Resume from ${language} entry points and history`, async ({ page }) => {
        test.skip(isAppEnabled("resume"), "Resume is enabled in this build.");
        const errors: string[] = [];
        page.on("pageerror", (error) => errors.push(error.message));

        await page.goto(`${route}?app=resume`);
        await expect(page).toHaveURL(`${route}?app=desktop`);
        const dock = page.getByRole("navigation", { name: "Applications" });
        await expect(dock.getByRole("button")).toHaveCount(dockAppIds.length);
        await expect(dock.getByRole("button", { name: resumeTitle, exact: true })).toHaveCount(0);
        await expect(page.locator('[data-node-id="desktop:resume"]')).toHaveCount(0);
        await expect(page.locator('[data-window-id="resume"], .application-resume')).toHaveCount(0);

        if (isAppEnabled("projects")) {
            const projectsButton = dock.getByRole("button", { name: projectsTitle, exact: true });
            await projectsButton.focus();
            await page.keyboard.press("Enter");
            await expect(page.getByRole("dialog", { name: projectsTitle, exact: true })).toBeVisible();
            await page.goBack();
            await expect(page).toHaveURL(`${route}?app=desktop`);
            await expect(page.locator('[data-window-id="resume"]')).toHaveCount(0);
        }
        expect(errors).toEqual([]);
    });
}
