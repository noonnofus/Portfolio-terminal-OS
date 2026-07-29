import { expect, test } from "@playwright/test";

const projects = [
    {
        appId: "project:portfolio",
        listTitle: "인터랙티브 포트폴리오 웹",
        windowTitle: "인터랙티브 포트폴리오 웹",
    },
    {
        appId: "project:optigen",
        listTitle: "B2B AI 지식·업무 플랫폼",
        windowTitle: "B2B AI 지식·업무 플랫폼",
    },
    {
        appId: "project:kepco",
        listTitle: "B2B AICC 플랫폼",
        windowTitle: "B2B AICC 플랫폼",
    },
    {
        appId: "project:wchms",
        listTitle: "다국어 학습 지원 플랫폼",
        windowTitle: "다국어 학습 지원 플랫폼",
    },
    {
        appId: "project:flare",
        listTitle: "실시간 재난 정보 플랫폼",
        windowTitle: "실시간 재난 정보 플랫폼",
    },
] as const;

test("all project windows stay bounded and release DOM after close", async ({
    page,
    browserName,
    context,
}) => {
    test.setTimeout(60_000);
    test.skip(
        browserName !== "chromium",
        "Heap diagnostics use the Chromium DevTools Protocol.",
    );

    await page.goto("/gui?app=projects");
    const dock = page.getByRole("navigation", {
        name: "Applications",
    });

    for (const project of projects) {
        await page
            .getByRole("button", {
                name: `${project.listTitle} 프로젝트 열기`,
            })
            .dblclick();
        await expect(
            page.getByRole("dialog", {
                name: project.windowTitle,
            }),
        ).toBeVisible();
        await dock.getByRole("button", { name: "프로젝트" }).click();
    }

    const nodesWhileOpen = await page.locator("*").count();
    expect(nodesWhileOpen).toBeLessThan(8_000);

    const cdp = await context.newCDPSession(page);
    await cdp.send("HeapProfiler.collectGarbage");
    const beforeClose = await cdp.send("Performance.getMetrics");
    const heapBeforeClose =
        beforeClose.metrics.find(
            (metric) => metric.name === "JSHeapUsedSize",
        )?.value ?? 0;

    for (const project of projects) {
        const dialog = page.getByRole("dialog", {
            name: project.windowTitle,
        });
        if ((await dialog.count()) === 0) {
            continue;
        }
        await dialog.dispatchEvent("pointerdown");
        await expect(dialog).toHaveAttribute("data-active", "true");
        await dialog
            .getByRole("button", { name: `${project.windowTitle} close` })
            .click();
        await expect(dialog).toHaveCount(0);
    }

    await cdp.send("HeapProfiler.collectGarbage");
    const afterClose = await cdp.send("Performance.getMetrics");
    const heapAfterClose =
        afterClose.metrics.find(
            (metric) => metric.name === "JSHeapUsedSize",
        )?.value ?? 0;
    const nodesAfterClose = await page.locator("*").count();

    expect(nodesAfterClose).toBeLessThan(nodesWhileOpen);
    expect(heapAfterClose).toBeLessThan(
        heapBeforeClose + 5 * 1024 * 1024,
    );
});
