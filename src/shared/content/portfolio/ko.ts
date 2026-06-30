import { externalUrl } from "@/features/gui/registry/appTypes";
import { orderedProjectSummaries } from "@/shared/content/portfolio/projectSummaries";
import type { PortfolioContent } from "@/shared/content/portfolio/types";

export const koPortfolioContent = {
    profile: {
        name: "김현호",
        role: "풀스택 웹 개발자",
        summary:
            "캐나다에서 10년 이상 생활한 경험을 바탕으로 다양한 사용자 환경을 이해하며, 웹 제품과 실시간 시스템을 구현합니다. AI를 단순히 사용하는 데 그치지 않고 직접 검증하고 여러 도구와 에이전트를 조합해 결과를 개선합니다.",
        location: "대한민국",
    },
    experience: [
        {
            title: "AI 플랫폼 및 AICC 엔지니어링",
            role: "프론트엔드 · Voice Gateway",
            period: "최근 실무",
            highlights: [
                "AI 에이전트 플랫폼의 프론트엔드를 스크래치부터 구축했습니다.",
                "AICC 솔루션의 실시간 음성 처리를 담당하는 Voice Gateway를 설계하고 구현했습니다.",
                "AI 결과를 직접 검증하고 여러 에이전트를 조합하는 개발 워크플로를 적용했습니다.",
            ],
        },
    ],
    skills: [
        {
            label: "언어",
            items: ["TypeScript", "JavaScript", "HTML", "CSS", "PHP"],
        },
        {
            label: "프론트엔드",
            items: ["React", "Next.js", "Vue.js", "Tailwind CSS"],
        },
        {
            label: "백엔드",
            items: ["Node.js", "Express", "Hono", "Laravel"],
        },
        {
            label: "데이터",
            items: [
                "PostgreSQL",
                "MySQL",
                "MongoDB",
                "Drizzle",
                "Prisma",
            ],
        },
        {
            label: "실시간 · AI",
            items: ["WebRTC", "WebSocket", "OpenAI API", "STT"],
        },
        {
            label: "도구",
            items: ["Git", "GitHub", "Jira", "Figma"],
        },
    ],
    projects: orderedProjectSummaries.map((project) => ({
        slug: project.slug,
        title: project.content.ko.title,
        summary: project.content.ko.summary,
        stack: project.stack,
    })),
    education: [
        {
            institution:
                "British Columbia Institute of Technology (BCIT)",
            program: "Full-Stack Web Development",
            period: "2025년 6월 졸업",
        },
    ],
    contact: {
        email: "kevinvancouver02@gmail.com",
        github: externalUrl("https://github.com/noonnofus"),
        linkedin: externalUrl(
            "https://www.linkedin.com/in/kevin-hyun-ho-kim/",
        ),
    },
    labels: {
        experience: "경력",
        skills: "기술",
        projects: "프로젝트",
        education: "교육",
        contact: "연락처",
        print: "인쇄 / PDF 저장",
    },
} satisfies PortfolioContent;
