import { expect, test } from "@playwright/test";

test.describe("initial document language", () => {
  test.use({ javaScriptEnabled: false });
  for (const [path, language] of [
    ["/", "ko"], ["/en", "en"], ["/desktop", "ko"], ["/en/desktop", "en"],
    ["/desktop?app=project&slug=kepco", "ko"],
    ["/en/desktop?app=project&slug=kepco", "en"],
    ["/desktop?app=project&slug=kepco&lang=en", "en"],
    ["/en/desktop?app=project&slug=kepco&lang=ko", "ko"],
  ]) {
    test(`${path} serves html lang=${language} without JavaScript`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", language);
      if (path.includes("slug=")) await expect(page.locator("article")).toHaveAttribute("lang", language);
    });
  }
});
