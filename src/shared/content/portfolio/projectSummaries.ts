import { projectCatalog } from "@/shared/content/portfolio/catalog";
import type { ProjectSummary } from "@/shared/content/portfolio/types";

export const projectSummaries = [
    {
        ...projectCatalog.wchms,
        content: {
            ko: {
                title: "WCHMS",
                kind: "클라이언트 팀 프로젝트",
                summary:
                    "밴쿠버 일본인 노년층의 치매 예방을 지원하는 AI 자습·코스 관리 플랫폼입니다.",
            },
            en: {
                title: "WCHMS",
                kind: "Client team project",
                summary:
                    "An AI-assisted self-study and course management platform supporting dementia prevention programs for Japanese seniors in Vancouver.",
            },
        },
    },
    {
        ...projectCatalog.flare,
        content: {
            ko: {
                title: "Flare",
                kind: "팀 프로젝트",
                summary:
                    "지도, 위험 지표, 뉴스와 AI 챗봇을 결합한 캐나다 산불 정보 PWA입니다.",
            },
            en: {
                title: "Flare",
                kind: "Team project",
                summary:
                    "A wildfire information PWA combining live maps, risk indicators, news, notifications, and a focused AI chatbot.",
            },
        },
    },
    {
        ...projectCatalog.weconnect,
        content: {
            ko: {
                title: "WeConnect",
                kind: "팀 프로젝트",
                summary:
                    "WebRTC 회의와 STT·AI 번역 자막을 결합해 언어 장벽을 줄이는 화상 회의 앱입니다.",
            },
            en: {
                title: "WeConnect",
                kind: "Team project",
                summary:
                    "A video meeting application that combines WebRTC calls with speech-to-text and AI-translated captions.",
            },
        },
    },
    {
        ...projectCatalog.pagessence,
        content: {
            ko: {
                title: "PageSsence",
                kind: "개인 프로젝트",
                summary:
                    "도서 탐색, 리뷰, 별점과 역할 기반 관리를 제공하는 커뮤니티 도서 플랫폼입니다.",
            },
            en: {
                title: "PageSsence",
                kind: "Solo project",
                summary:
                    "A community book platform with discovery, reviews, ratings, and role-based catalog management.",
            },
        },
    },
    {
        ...projectCatalog.diceroller,
        content: {
            ko: {
                title: "DiceRoller",
                kind: "개인 프로젝트",
                summary:
                    "모바일 흔들기와 웹 키보드 입력을 지원하는 물리 기반 3D 주사위 앱입니다.",
            },
            en: {
                title: "DiceRoller",
                kind: "Solo project",
                summary:
                    "A physics-based 3D dice app supporting mobile shake gestures and keyboard interaction on the web.",
            },
        },
    },
    {
        ...projectCatalog.mejubot,
        content: {
            ko: {
                title: "MejuBot",
                kind: "개인 프로젝트",
                summary:
                    "음악 재생, 게임 통계와 미니게임을 제공하는 Discord 인증 커뮤니티 봇입니다.",
            },
            en: {
                title: "MejuBot",
                kind: "Solo project",
                summary:
                    "A Discord-verified community bot offering music playback, game statistics, and interactive mini-games.",
            },
        },
    },
    {
        ...projectCatalog.webpiano,
        content: {
            ko: {
                title: "WebPiano",
                kind: "개인 프로젝트",
                summary:
                    "키보드 연주, 음높이 조절과 사용자 MP3 사운드 매핑을 지원하는 웹 피아노입니다.",
            },
            en: {
                title: "WebPiano",
                kind: "Solo project",
                summary:
                    "A browser piano with keyboard performance, pitch controls, and playable sound mapping from uploaded MP3 files.",
            },
        },
    },
] as const satisfies readonly ProjectSummary[];

export const orderedProjectSummaries = projectSummaries.toSorted(
    (left, right) => left.order - right.order,
);
