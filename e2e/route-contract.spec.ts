import { expect, test } from "@playwright/test";

test.describe("route compatibility", () => {
    test("redirects legacy GUI URLs to the matching Desktop route", async ({
        page,
    }) => {
        await page.goto("/gui?app=projects");

        await expect(page).toHaveURL(/\/desktop\?app=projects$/);
        await expect(
            page.getByRole("dialog", { name: "프로젝트" }),
        ).toBeVisible();

        await page.goto("/en/gui?app=settings");

        await expect(page).toHaveURL(/\/en\/desktop\?app=settings$/);
        await expect(
            page.getByRole("dialog", { name: "Settings" }),
        ).toBeVisible();
    });

    test("terminal and switched Desktop routes render", async ({
        page,
    }) => {
        await page.goto("/");
        await expect(page.locator("body")).toBeVisible();

        await page.goto("/desktop");
        await expect(
            page.getByRole("dialog", { name: "커리어" }),
        ).toBeVisible();
        await expect(page).toHaveURL(/\/desktop$/);
    });

    test("keeps the terminal language when startx opens the Desktop", async ({
        page,
    }) => {
        await page.addInitScript(() => {
            window.localStorage.setItem(
                "desktop:preferences",
                JSON.stringify({
                    version: 1,
                    preferences: {
                        language: "ko",
                        wallpaper: "golden_gate_light",
                        dockAutoHide: false,
                    },
                }),
            );
        });
        await page.goto("/");

        const terminalInput = page.locator(".xterm-helper-textarea");
        await terminalInput.focus();
        await page.keyboard.press("Space");
        await page.keyboard.type("en");
        await page.keyboard.press("Enter");
        await expect(page.locator("html")).toHaveAttribute("lang", "en");

        await terminalInput.focus();
        await page.keyboard.press("Space");
        await page.keyboard.type("startx");
        await page.keyboard.press("Enter");

        await expect(page).toHaveURL(/\/en\/desktop$/);
        await expect(page.locator("html")).toHaveAttribute("lang", "en");
        await expect(
            page.getByRole("dialog", { name: "Career" }),
        ).toBeVisible();
    });

    test("project loaders render localized content on demand", async ({
        page,
    }) => {
        await page.goto("/desktop?app=projects");
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
        const projects = [
            {
                slug: "optigen",
                dialog: "OptiGen 프론트엔드",
                diagram:
                    "웹 챗과 전화 콜, 공통 API와 AI 서비스, 문서 처리와 저장소를 연결하고 하단에 챗과 OptiGen 모드의 콜 프로세스 및 관계 범례를 배치한 OptiGen 시스템 아키텍처",
            },
            {
                slug: "mcp",
                dialog: "OptiGen MCP 서버",
                diagram:
                    "OptiGen AI 에이전트와 Express 라우터, 회의록 생성 파이프라인, 주문접수 콜봇과 발음 유사도 기반 주소 검증을 보여주고 하단에 전체 프로세스와 관계 범례를 배치한 MCP 서버 시스템 아키텍처",
            },
            {
                slug: "kepco",
                dialog: "한국전력 상담 어드바이저",
                diagram:
                    "여러 탭의 서버 갱신 요청을 Web Lock으로 직렬화하고 BroadcastChannel로 새 Access Token을 공유하는 흐름도",
            },
            {
                slug: "voice-gateway",
                dialog: "OptiGen Voice Gateway",
                diagram:
                    "Main Thread의 ARI Client, MainOrchestrator와 WorkerRegistry, 통화별 Worker의 RTP, STT, TurnManager, OptiGenTransport와 TTS를 보여주는 Voice Gateway 구조도",
            },
            {
                slug: "portfolio",
                dialog: "포트폴리오",
                diagram:
                    "라우트 진입점, Desktop shell, navigation, store, app catalog, dynamic loader, directory tree와 Portfolio, Terminal, Guestbook, Settings feature의 관계를 보여주는 포트폴리오 구조도",
            },
        ] as const;

        for (const project of projects) {
            await page.goto(`/desktop?app=project&slug=${project.slug}`);

            const projectDialog = page.getByRole("dialog", {
                name: project.dialog,
            });
            const diagram = projectDialog.getByRole("img", {
                name: project.diagram,
            });
            await expect(diagram).toBeVisible();
            await expect(projectDialog.getByRole("alert")).toHaveCount(0);
        }
    });

    test("system architecture diagrams stay keyboard-scrollable", async ({
        page,
    }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const projects = [
            {
                slug: "portfolio",
                region:
                    "포트폴리오 폴더와 실행 구조도, 가로로 스크롤할 수 있습니다.",
                image:
                    "라우트 진입점, Desktop shell, navigation, store, app catalog, dynamic loader, directory tree와 Portfolio, Terminal, Guestbook, Settings feature의 관계를 보여주는 포트폴리오 구조도",
            },
        ] as const;

        for (const project of projects) {
            await page.goto(`/desktop?app=project&slug=${project.slug}`);
            const diagram = page.getByRole("region", {
                name: project.region,
            });

            await expect(diagram).toBeVisible();
            await expect(
                diagram.getByRole("img", { name: project.image }),
            ).toBeVisible({ timeout: 15000 });
            await expect(diagram).toHaveAttribute("tabindex", "0");
            await expect(
                diagram.evaluate(
                    (element) => element.scrollWidth > element.clientWidth,
                ),
            ).resolves.toBe(true);
        }
    });

    test("image viewer keeps transparent diagrams readable in dark mode", async ({ page }, testInfo) => {
        await page.addInitScript(() => localStorage.setItem("theme", "dark"));
        await page.goto("/desktop?app=project&slug=portfolio");
        await expect(page.locator(".application-shell")).toHaveAttribute("data-theme", "dark");

        const project = page.locator('[data-window-id="project:portfolio"]');
        const opener = project.getByRole("button", { name: /^이미지 크게 보기:/ });
        await expect(opener).toHaveCSS("background-color", "rgb(255, 255, 255)");
        await opener.click();
        await expect(project.getByRole("dialog").getByRole("img")).toHaveCSS("background-color", "rgb(255, 255, 255)");
        await page.screenshot({ path: testInfo.outputPath("dark-image-preview.png") });
    });

    for (const projectSlug of ["voice-gateway", "optigen", "mcp", "portfolio", "kepco"] as const) {
    for (const language of ["ko", "en"] as const) {
        for (const width of [390, 1440]) {
            test(`${projectSlug} diagram preview stays within its window (${language}, ${width})`, async ({
                page,
            }) => {
                await page.setViewportSize({ width, height: 1000 });
                await page.addInitScript((language) => {
                    localStorage.setItem("desktop:preferences", JSON.stringify({
                        version: 1,
                        preferences: { language },
                    }));
                }, language);
                await page.goto(`${language === "en" ? "/en" : ""}/desktop?app=project&slug=${projectSlug}`);

                const project = page.locator(`[data-window-id="project:${projectSlug}"]`);
                const opener = project.getByRole("button", {
                    name: language === "ko" ? /^이미지 크게 보기:/ : /^View larger image:/,
                });
                const preview = project.getByRole("dialog");
                const close = preview.getByRole("button", {
                    name: language === "ko" ? "확대 이미지 닫기" : "Close enlarged image",
                });
                const surface = project.locator(".application-app-surface");

                if (projectSlug === "optigen") {
                    const source = await opener.getByRole("img").getAttribute("src");
                    const response = await page.request.get(source!);
                    expect(response.ok()).toBe(true);
                    const svg = await response.text();
                    expect(svg).toContain('data-portfolio-process="chat"');
                    expect(svg).toContain('data-portfolio-process="call"');
                    expect(svg).toContain('data-portfolio-legend="relationships"');
                }

                await opener.focus();
                await expect.poll(() => project.locator(".application-window-content").evaluate(
                    (element) => element.scrollHeight - element.clientHeight,
                )).toBeLessThanOrEqual(1);
                const scrollTop = await surface.evaluate((element) => element.scrollTop);
                const thumbnailWidth = await opener.evaluate((element) => element.clientWidth);
                await page.keyboard.press("Enter");
                await expect(preview).toBeVisible();
                await expect.poll(() => preview.evaluate(
                    (element) => element.contains(document.activeElement),
                )).toBe(true);
                await expect.poll(() => surface.evaluate(
                    (element) => element.closest("[inert]") !== null,
                )).toBe(true);
                await expect(preview.getByRole("img")).toBeVisible();

                const bounds = await preview.evaluate((element) => {
                    const rect = element.getBoundingClientRect();
                    const content = element.closest(".application-window-content")!.getBoundingClientRect();
                    const image = element.querySelector("img")!.getBoundingClientRect();
                    return {
                        withinWindow: rect.left >= content.left && rect.right <= content.right && rect.top >= content.top && rect.bottom <= content.bottom,
                        fits: image.left >= rect.left && image.right <= rect.right && image.top >= rect.top && image.bottom <= rect.bottom,
                        imageWidth: image.width,
                    };
                });
                expect(bounds.withinWindow).toBe(true);
                expect(bounds.fits).toBe(true);
                if (projectSlug === "voice-gateway") {
                    expect(bounds.imageWidth).toBeGreaterThan(thumbnailWidth);
                }

                const image = preview.getByRole("img");
                await expect(image).toHaveCSS("background-color", "rgb(255, 255, 255)");
                const canvas = preview.getByRole("group");
                const zoomIn = preview.getByRole("button", {
                    name: language === "ko" ? "확대" : "Zoom in", exact: true,
                });
                const zoomOut = preview.getByRole("button", {
                    name: language === "ko" ? "축소" : "Zoom out", exact: true,
                });
                await zoomIn.click();
                await expect.poll(() => image.evaluate(
                    (element) => element.getBoundingClientRect().width,
                )).toBeGreaterThan(bounds.imageWidth * 1.99);

                const imageX = await image.evaluate((element) => element.getBoundingClientRect().x);
                const frame = (await preview.boundingBox())!;
                const centerX = frame.x + frame.width / 2;
                const centerY = frame.y + frame.height / 2;
                await page.mouse.move(centerX, centerY);
                await page.mouse.down();
                await page.mouse.move(centerX - 60, centerY + 20, { steps: 6 });
                await page.mouse.up();
                await expect.poll(() => image.evaluate(
                    (element, startX) => Math.abs(element.getBoundingClientRect().x - startX), imageX,
                )).toBeGreaterThan(20);

                await zoomOut.click();
                await expect.poll(() => image.evaluate(
                    (element) => element.getBoundingClientRect().width,
                )).toBeLessThanOrEqual(bounds.imageWidth + 1);

                await canvas.focus();
                await page.keyboard.press("+");
                await expect.poll(() => image.evaluate(
                    (element) => element.getBoundingClientRect().width,
                )).toBeGreaterThan(bounds.imageWidth + 1);
                const keyboardImageX = await image.evaluate((element) => element.getBoundingClientRect().x);
                await page.keyboard.press("ArrowRight");
                await expect.poll(() => image.evaluate(
                    (element, startX) => Math.abs(element.getBoundingClientRect().x - startX), keyboardImageX,
                )).toBeGreaterThan(1);
                await page.keyboard.press("0");
                await expect.poll(() => image.evaluate(
                    (element) => element.getBoundingClientRect().width,
                )).toBeLessThanOrEqual(bounds.imageWidth + 1);

                await zoomIn.focus();
                await page.keyboard.press("Tab");
                await expect(close).toBeFocused();
                await expect(close).toHaveCSS("outline-style", "solid");
                await expect(close).toHaveCSS("outline-width", "2px");
                await expect.poll(() => preview.evaluate(
                    (element) => element.contains(document.activeElement),
                )).toBe(true);
                await page.keyboard.press("Shift+Tab");
                await expect.poll(() => preview.evaluate(
                    (element) => element.contains(document.activeElement),
                )).toBe(true);
                await page.keyboard.press("Escape");
                await expect(preview).toHaveCount(0);
                await expect(opener).toBeFocused();
                expect(await surface.evaluate((element) => element.scrollTop)).toBe(scrollTop);

                await opener.click();
                await canvas.click();
                await expect(preview).toBeVisible();
                await canvas.dblclick();
                await expect.poll(() => image.evaluate(
                    (element) => element.getBoundingClientRect().width,
                )).toBeGreaterThan(bounds.imageWidth + 1);
                await close.click();
                await expect(preview).toHaveCount(0);
                await expect(opener).toBeFocused();

                await opener.click();
                await page.mouse.move(centerX, centerY);
                await page.mouse.wheel(0, -150);
                await expect.poll(() => image.evaluate(
                    (element) => element.getBoundingClientRect().width,
                )).toBeGreaterThan(bounds.imageWidth + 1);
                await page.keyboard.press("Escape");
                await expect(preview).toHaveCount(0);

                await opener.click();
                await preview.click({ position: { x: 2, y: 2 } });
                await expect(preview).toHaveCount(0);
                await expect(opener).toBeFocused();
            });
        }
    }

    }

    test("KEPCO case diagram stays with its problem-solving case", async ({
        page,
    }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto("/desktop?app=project&slug=kepco");

        const dialog = page.getByRole("dialog", {
            name: "한국전력 상담 어드바이저",
        });
        const authenticationCase = dialog.locator(
            'section[aria-labelledby="kepco-multiTabAuth-title"]',
        );
        const problemHeading = authenticationCase.getByRole("heading", {
            name: "개요", exact: true,
        });
        const diagram = dialog.getByRole("region", {
            name: "다이어그램 가로 스크롤 영역",
        });

        await expect(problemHeading).toBeVisible();
        await expect(diagram).toBeVisible();
        await expect(
            diagram.getByRole("img", {
                name: "여러 탭의 서버 갱신 요청을 Web Lock으로 직렬화하고 BroadcastChannel로 새 Access Token을 공유하는 흐름도",
            }),
        ).toBeVisible({ timeout: 15000 });
        await expect(diagram).toHaveAttribute("tabindex", "0");
        const headingOrder = await authenticationCase
            .locator("h3, h4")
            .allTextContents();
        expect(headingOrder.indexOf("개요")).toBeLessThan(
            headingOrder.indexOf(
                "멀티탭 토큰 갱신의 요청 직렬화와 결과 공유를 분리했습니다.",
            ),
        );
        await expect(
            diagram.evaluate(
                (element) => element.scrollWidth > element.clientWidth,
            ),
        ).resolves.toBe(true);
    });

    test("project detail applies the reading typography tokens", async ({
        page,
    }) => {
        await page.setViewportSize({ width: 1024, height: 768 });
        await page.goto("/desktop?app=project&slug=kepco");

        const dialog = page.getByRole("dialog", {
            name: "한국전력 상담 어드바이저",
        });
        const article = dialog.getByRole("article");

        await expect(
            article.getByRole("heading", {
                name: "한국전력 상담 어드바이저",
            }),
        ).toHaveCSS("font-size", "32px");
        await expect(
            article.locator('p[class*="documentSummary"]').first(),
        ).toHaveCSS("font-size", "14.4px");
        await expect(
            article.locator('div[class*="caseMarkdown"] > p').first(),
        ).toHaveCSS("font-size", "15.2px");
        const paragraphOffsets = await article
            .locator('section[class*="casePhase"]')
            .evaluateAll((phases) => phases.flatMap((phase) => {
                const headingLeft = phase.querySelector("h4")!.getBoundingClientRect().left;
                return Array.from(phase.querySelectorAll("p"))
                    .filter((paragraph) => !paragraph.closest("li"))
                    .map((paragraph) => paragraph.getBoundingClientRect().left - headingLeft);
            }));
        expect(paragraphOffsets.length).toBeGreaterThan(0);
        for (const offset of paragraphOffsets) {
            expect(Math.abs(offset)).toBeLessThan(1);
        }
        await expect(
            article.locator('dl[class*="contextList"]'),
        ).toHaveCSS("border-top-width", "1px");
        await expect(
            article.locator('dl[class*="contextList"]'),
        ).toHaveCSS("border-bottom-width", "1px");
        await expect(
            article.locator('section[class*="caseArchitectureSection"]'),
        ).toHaveCSS("border-top-width", "0px");

        await page.goto("/desktop?app=project&slug=wchms");
        const wchmsArticle = page
            .getByRole("dialog", { name: "WCHMS" })
            .getByRole("article");

        await expect(
            wchmsArticle.locator('dl[class*="contextList"]'),
        ).toHaveCSS("border-bottom-width", "1px");
        await expect(
            wchmsArticle.locator('section[class*="caseSection"]').first(),
        ).toHaveCSS("border-top-width", "1px");
    });

    test("professional project routes expose evidence-backed problem solving", async ({
        page,
    }) => {
        const projects = [
            {
                slug: "kepco",
                dialog: "한국전력 상담 어드바이저",
                heading:
                    "멀티탭 인증과 비활성 로그아웃 동기화",
                outcome: "전체 상담사의 60% 사용, 고객 평균 대기 시간 30% 감소",
                caseCount: 3,
            },
            {
                slug: "optigen",
                dialog: "OptiGen 프론트엔드",
                heading:
                    "AI 응답과 도구 실행 상태를 전달하는 대화 화면",
                outcome: "초기 전송량 약 54% 감소",
                caseCount: 4,
            },
            {
                slug: "mcp",
                dialog: "OptiGen MCP 서버",
                heading:
                    "실제 건물 정보와 발음 유사도를 이용한 동 번호 보정",
                outcome:
                    "동 번호 오인식 전사 353건 중 259건에 정답 후보 제안",
                caseCount: 2,
            },
            {
                slug: "voice-gateway",
                dialog: "OptiGen Voice Gateway",
                heading:
                    "STT 평가 파이프라인 구축과 주소 인식 개선",
                outcome:
                    "동, 호수 전사 오류 18.9% 감소",
                caseCount: 4,
            },
            {
                slug: "portfolio",
                dialog: "포트폴리오",
                heading: "Desktop과 앱 기능의 책임 분리",
                outcome: "앱 등록 정합성과 탐색 동작 검증",
                caseCount: 2,
            },
            {
                slug: "wchms",
                dialog: "WCHMS",
                heading: "자습과 수업 자료의 난이도 기준 통합",
                outcome:
                    "하나의 기준으로 연결된 학습과 운영",
                caseCount: 1,
            },
            {
                slug: "flare",
                dialog: "Flare",
                heading: "산불 정보 탐색과 질문, 알림 연결",
                outcome:
                    "탐색에서 질문과 알림까지 연결",
                caseCount: 1,
            },
        ] as const;

        for (const project of projects) {
            await page.goto(`/desktop?app=project&slug=${project.slug}`);
            const dialog = page.getByRole("dialog", {
                name: project.dialog,
            });

            await expect(dialog).toBeVisible();
            await expect(
                dialog.getByRole("heading", { name: "프로젝트 정보" }),
            ).toBeVisible();
            await expect(
                dialog.getByRole("heading", { name: "프로젝트 개요" }),
            ).toBeVisible();
            await expect(
                dialog.getByRole("heading", { name: project.heading }),
            ).toBeVisible();
            const headingOrder = await dialog.locator("h3, h4").allTextContents();
            expect(headingOrder.indexOf("프로젝트 개요")).toBeLessThan(
                headingOrder.indexOf("프로젝트 정보"),
            );
            await expect(
                dialog.getByText("주요 작업", { exact: true }),
            ).toHaveCount(project.caseCount);
            await expect(
                dialog.getByRole("heading", {
                    name: "개요", exact: true,
                }).first(),
            ).toBeVisible();
            await expect(
                dialog.getByRole("heading", {
                    name: "세부 내용", exact: true,
                }).first(),
            ).toBeVisible();
            await expect(
                dialog.getByRole("heading", { name: "성과", exact: true }).first(),
            ).toBeVisible();
            await expect(
                dialog.getByText(project.outcome, { exact: true }).first(),
            ).toBeVisible();
            await expect(
                dialog.getByRole("region", { name: "주요 성과", exact: true }),
            ).toHaveCount(project.slug === "kepco" ? 1 : 0);
            if (project.slug === "wchms" || project.slug === "flare") {
                const players = dialog.locator("video");
                await expect(players).toHaveCount(project.slug === "flare" ? 2 : 1);
                for (const player of await players.all()) {
                    await expect(player).toHaveAttribute("controls", "");
                    await expect(player.locator("source")).toHaveAttribute("src", /^\/videos\/.+\.mp4$/);
                }
            }
        }

        await page.goto("/desktop?app=project&slug=mcp");
        const mcpDialog = page.getByRole("dialog", {
            name: "OptiGen MCP 서버",
        });
        await expect(
            mcpDialog
                .getByRole("list", { name: "개발 스택" })
                .getByText("Express.js", { exact: true }),
        ).toBeVisible();
        await expect(
            mcpDialog.locator('img[src*="express-light.png"]'),
        ).toBeVisible();

        await page.goto("/desktop?app=project&slug=mcp&lang=en");
        const englishMcpDialog = page.getByRole("dialog", {
            name: "OptiGen MCP Server",
        });
        await expect(
            englishMcpDialog.getByRole("heading", {
                name: /^Overview$/i,
            }).first(),
        ).toBeVisible();
        await expect(
            englishMcpDialog.getByRole("heading", {
                name: /^Implementation$/i,
            }).first(),
        ).toBeVisible();
        await expect(
            englishMcpDialog.getByRole("heading", { name: /^Outcomes$/i }).first(),
        ).toBeVisible();
    });

    test("English project routes keep the shared case-study structure", async ({
        page,
    }) => {
        const projects = [
            ["kepco", "Korea Electric Power Contact Center Advisor", 3],
            ["optigen", "OptiGen Frontend", 4],
            ["mcp", "OptiGen MCP Server", 2],
            ["voice-gateway", "OptiGen Voice Gateway", 4],
            ["portfolio", "Portfolio", 2],
            ["wchms", "WCHMS", 1],
            ["flare", "Flare", 1],
        ] as const;

        for (const [slug, dialogName, caseCount] of projects) {
            await page.goto(`/desktop?app=project&slug=${slug}&lang=en`);
            const dialog = page.getByRole("dialog", { name: dialogName });

            await expect(
                dialog.getByRole("heading", {
                    name: "Project information",
                }),
            ).toBeVisible();
            await expect(
                dialog.getByRole("heading", { name: "Project overview" }),
            ).toBeVisible();
            await expect(
                dialog.getByText("Selected work", { exact: true }),
            ).toHaveCount(caseCount);
            await expect(
                dialog.getByRole("region", { name: "Project outcomes", exact: true }),
            ).toHaveCount(slug === "kepco" ? 1 : 0);
        }
    });

});
