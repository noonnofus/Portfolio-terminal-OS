import { expect, test } from "@playwright/test";

const projects = [
    {
        appId: "project:wchms",
        listTitle: "WCHMS",
        windowTitle: "WCHMS",
    },
    {
        appId: "project:flare",
        listTitle: "Flare",
        windowTitle: "Flare",
    },
    {
        appId: "project:weconnect",
        listTitle: "WeConnect",
        windowTitle: "WeConnect",
    },
    {
        appId: "project:pagessence",
        listTitle: "PageSsence",
        windowTitle: "pageSsence",
    },
    {
        appId: "project:diceroller",
        listTitle: "DiceRoller",
        windowTitle: "다이스롤러",
    },
    {
        appId: "project:mejubot",
        listTitle: "MejuBot",
        windowTitle: "디스코드 봇",
    },
    {
        appId: "project:webpiano",
        listTitle: "WebPiano",
        windowTitle: "웹 피아노",
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
