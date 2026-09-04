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

    test("keeps the terminal language when startx opens the GUI", async ({
        page,
    }) => {
        await page.addInitScript(() => {
            window.localStorage.setItem(
                "gui:preferences",
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

        await expect(page).toHaveURL(/\/en\/gui$/);
        await expect(page.locator("html")).toHaveAttribute("lang", "en");
        await expect(
            page.getByRole("dialog", { name: "Career" }),
        ).toBeVisible();
    });

    test("project loaders render localized content on demand", async ({
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
        const projects = [
            {
                slug: "mcp",
                dialog: "OptiGen MCP 서버",
                diagram:
                    "OptiGen 대화에서 AI 서비스와 MCP 서버를 거쳐 업무 API와 장시간 작업을 실행하는 흐름도",
            },
            {
                slug: "kepco",
                dialog: "공공기관 상담 어드바이저",
                diagram:
                    "활성 통화 탐색, 통화 상태, SSE, 전사 reducer, 상담 화면으로 이어지는 프론트엔드 상태 흐름도",
            },
        ] as const;

        for (const project of projects) {
            await page.goto(`/gui?app=project&slug=${project.slug}`);

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

    test("project detail applies the reading typography tokens", async ({
        page,
    }) => {
        await page.setViewportSize({ width: 1024, height: 768 });
        await page.goto("/gui?app=project&slug=kepco");

        const dialog = page.getByRole("dialog", {
            name: "공공기관 상담 어드바이저",
        });
        const article = dialog.getByRole("article");

        await expect(
            article.getByRole("heading", {
                name: "공공기관 상담 어드바이저",
            }),
        ).toHaveCSS("font-size", "32px");
        await expect(
            article.locator('p[class*="documentSummary"]').first(),
        ).toHaveCSS("font-size", "14.4px");
        await expect(
            article.locator('p[class*="evidenceDescription"]').first(),
        ).toHaveCSS("font-size", "15.2px");
        await expect(
            article.locator('dl[class*="contextList"]'),
        ).toHaveCSS("border-top-width", "1px");
        await expect(
            article.locator('dl[class*="contextList"]'),
        ).toHaveCSS("border-bottom-width", "1px");
        await expect(
            article.locator('section[class*="architectureSection"]'),
        ).toHaveCSS("border-top-width", "0px");

        await page.goto("/gui?app=project&slug=wchms");
        const wchmsArticle = page
            .getByRole("dialog", { name: "WCHMS" })
            .getByRole("article");

        await expect(
            wchmsArticle.locator('dl[class*="contextList"]'),
        ).toHaveCSS("border-bottom-width", "1px");
        await expect(
            wchmsArticle.locator('section[class*="caseSection"]').first(),
        ).toHaveCSS("border-top-width", "0px");
    });

    test("professional project routes expose evidence-backed problem solving", async ({
        page,
    }) => {
        const projects = [
            {
                slug: "kepco",
                dialog: "공공기관 상담 어드바이저",
                heading: "SSE로 실시간 STT 전사를 안정적으로 렌더링했습니다",
                outcome: "전체 상담사의 60% 사용, 평균 대기 시간 30% 감소",
            },
            {
                slug: "optigen",
                dialog: "OptiGen AI 플랫폼",
                heading:
                    "스트리밍 응답이 길어져도 읽던 위치가 밀리지 않는 채팅 레이아웃",
                outcome: "공통 UI 40개 Story와 브라우저 검증 자동화",
            },
            {
                slug: "mcp",
                dialog: "OptiGen MCP 서버",
                heading:
                    "장시간 MCP 작업의 진행 상태를 대화까지 전달하는 세션 기반 SSE",
                outcome:
                    "1시간, 30MB 음성 처리 371.9초에서 291.0초로 단축",
            },
            {
                slug: "voice-gateway",
                dialog: "AICC Voice Gateway",
                heading:
                    "Provider별 통신과 오디오 차이를 Transport와 Factory로 격리",
                outcome:
                    "Provider 변경 범위를 Transport, Strategy와 Codec으로 제한",
            },
            {
                slug: "portfolio",
                dialog: "포트폴리오",
                heading: "창 상태와 URL을 같은 모델로 관리",
                outcome: "URL, History와 GUI 상태를 하나의 탐색 모델로 통합",
            },
            {
                slug: "wchms",
                dialog: "WCHMS",
                heading: "학습자 자습과 직원용 수업 자료의 난이도 기준 통합",
                outcome:
                    "자습, 수업 자료 생성과 운영 관리를 하나의 제품 흐름으로 연결",
            },
            {
                slug: "flare",
                dialog: "Flare",
                heading: "흩어진 산불 정보를 지도 중심의 탐색 흐름으로 통합",
                outcome:
                    "지도, 위험 지표, 뉴스, 질문과 알림을 하나의 PWA로 통합",
            },
        ] as const;

        for (const project of projects) {
            await page.goto(`/gui?app=project&slug=${project.slug}`);
            const dialog = page.getByRole("dialog", {
                name: project.dialog,
            });

            await expect(dialog).toBeVisible();
            await expect(
                dialog.getByRole("heading", { name: project.heading }),
            ).toBeVisible();
            await expect(
                dialog.getByText("Problem Solving", { exact: true }).first(),
            ).toBeVisible();
            await expect(
                dialog.getByRole("heading", {
                    name: "배경 / 문제",
                }).first(),
            ).toBeVisible();
            await expect(
                dialog.getByRole("heading", {
                    name: "해결 과정",
                }).first(),
            ).toBeVisible();
            await expect(
                dialog.getByRole("heading", { name: "결과" }).first(),
            ).toBeVisible();
            await expect(
                dialog.getByText(project.outcome, { exact: true }).first(),
            ).toBeVisible();
        }

        await page.goto("/gui?app=project&slug=mcp");
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

        await page.goto("/gui?app=project&slug=mcp&lang=en");
        const englishMcpDialog = page.getByRole("dialog", {
            name: "OptiGen MCP Server",
        });
        await expect(
            englishMcpDialog.getByRole("heading", {
                name: "Background / Problem",
            }).first(),
        ).toBeVisible();
        await expect(
            englishMcpDialog.getByRole("heading", {
                name: "Solution / Process",
            }).first(),
        ).toBeVisible();
        await expect(
            englishMcpDialog.getByRole("heading", { name: "Result" }).first(),
        ).toBeVisible();
    });

});
