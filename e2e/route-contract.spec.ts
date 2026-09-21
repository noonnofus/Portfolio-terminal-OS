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
                dialog: "OptiGen AI 플랫폼",
                diagram:
                    "OptiGen 웹 애플리케이션과 API, AI 서비스, MCP, Voice Gateway의 관계를 보여주는 플랫폼 흐름도",
            },
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
                    "여러 브라우저 탭 중 한 탭만 Refresh Token으로 서버 갱신을 수행하고 BroadcastChannel로 새 Access Token을 공유하는 흐름도",
            },
            {
                slug: "voice-gateway",
                dialog: "AICC Voice Gateway",
                diagram:
                    "전화 통화가 PBX와 SIP 연결 계층, 통화별 Worker, Transport Factory, Strategy와 Codec을 거쳐 Voice AI Provider에 연결되는 흐름도",
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
                slug: "optigen",
                region: "플랫폼 전체 흐름도 가로 스크롤 영역",
                image:
                    "OptiGen 웹 애플리케이션과 API, AI 서비스, MCP, Voice Gateway의 관계를 보여주는 플랫폼 흐름도",
            },
            {
                slug: "mcp",
                region: "MCP 도구 실행 흐름도 가로 스크롤 영역",
                image:
                    "OptiGen 대화에서 AI 서비스와 MCP 서버를 거쳐 업무 API와 장시간 작업을 실행하는 흐름도",
            },
            {
                slug: "voice-gateway",
                region: "실시간 음성 흐름도 가로 스크롤 영역",
                image:
                    "전화 통화가 PBX와 SIP 연결 계층, 통화별 Worker, Transport Factory, Strategy와 Codec을 거쳐 Voice AI Provider에 연결되는 흐름도",
            },
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

    test("KEPCO case diagram stays with its problem-solving case", async ({
        page,
    }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto("/desktop?app=project&slug=kepco");

        const dialog = page.getByRole("dialog", {
            name: "공공기관 상담 어드바이저",
        });
        const problemHeading = dialog.getByRole("heading", {
            name: "배경 / 문제",
        });
        const diagram = dialog.getByRole("region", {
            name: "다이어그램 가로 스크롤 영역",
        });

        await expect(problemHeading).toBeVisible();
        await expect(diagram).toBeVisible();
        await expect(
            diagram.getByRole("img", {
                name: "여러 브라우저 탭 중 한 탭만 Refresh Token으로 서버 갱신을 수행하고 BroadcastChannel로 새 Access Token을 공유하는 흐름도",
            }),
        ).toBeVisible({ timeout: 15000 });
        await expect(diagram).toHaveAttribute("tabindex", "0");
        const headingOrder = await dialog
            .locator("h3, h4")
            .allTextContents();
        expect(headingOrder.indexOf("배경 / 문제")).toBeLessThan(
            headingOrder.indexOf(
                "멀티탭 토큰 갱신을 작업 소유권과 결과 공유로 분리했습니다.",
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
            article.locator('section[class*="caseArchitectureSection"]'),
        ).toHaveCSS("border-top-width", "1px");

        await page.goto("/desktop?app=project&slug=wchms");
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
                heading:
                    "여러 탭의 비활성 로그아웃과 토큰 갱신 상태를 일관되게 관리",
                outcome: "전체 상담사의 60% 사용, 고객 평균 대기 시간 30% 감소",
                caseCount: 1,
            },
            {
                slug: "optigen",
                dialog: "OptiGen AI 플랫폼",
                heading:
                    "스트리밍 응답이 길어져도 질문 위치가 밀리지 않는 채팅 레이아웃",
                outcome: "POC, DEV, SOLUM 3개 실행 환경으로 확장한 AI 플랫폼 기반",
                caseCount: 1,
            },
            {
                slug: "mcp",
                dialog: "OptiGen MCP 서버",
                heading:
                    "장시간 MCP 작업의 진행 상태를 대화까지 전달하는 세션 기반 SSE",
                outcome:
                    "음성 파일 기반 회의록 생성 구현, 처리 시간 21.8% 단축",
                caseCount: 2,
            },
            {
                slug: "voice-gateway",
                dialog: "AICC Voice Gateway",
                heading:
                    "Provider별 통신과 오디오 차이를 Transport와 Factory로 격리",
                outcome:
                    "Provider 변경 범위를 Transport, Strategy와 Codec으로 제한",
                caseCount: 2,
            },
            {
                slug: "portfolio",
                dialog: "포트폴리오",
                heading: "Desktop shell과 제품 기능을 변경 이유에 따라 분리",
                outcome: "새 Desktop 앱을 같은 등록, 로딩, 탐색 계약으로 추가하는 구조 정립",
                caseCount: 2,
            },
            {
                slug: "wchms",
                dialog: "WCHMS",
                heading: "학습자 자습과 직원용 수업 자료의 난이도 기준 통합",
                outcome:
                    "자습, 수업 자료 생성과 운영 관리를 하나의 제품 흐름으로 연결",
                caseCount: 1,
            },
            {
                slug: "flare",
                dialog: "Flare",
                heading: "흩어진 산불 정보를 지도 중심의 탐색 흐름으로 통합",
                outcome:
                    "지도, 위험 지표, 뉴스, 질문과 알림을 하나의 PWA로 통합",
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
            await expect(
                dialog.getByText("Problem Solving", { exact: true }),
            ).toHaveCount(project.caseCount);
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

    test("English project routes keep the shared case-study structure", async ({
        page,
    }) => {
        const projects = [
            ["kepco", "Public-Sector Contact Center Advisor", 1],
            ["optigen", "OptiGen AI Platform", 1],
            ["mcp", "OptiGen MCP Server", 2],
            ["voice-gateway", "AICC Voice Gateway", 2],
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
                dialog.getByText("Problem Solving", { exact: true }),
            ).toHaveCount(caseCount);
        }
    });

});
