import { externalUrl } from "@/features/gui/registry/appTypes";
import { orderedProjectSummaries } from "@/shared/content/portfolio/projectSummaries";
import type { PortfolioContent } from "@/shared/content/portfolio/types";

export const enPortfolioContent = {
    profile: {
        name: "HyunHo Kim",
        role: "Full-Stack Web Developer",
        summary:
            "A web developer with more than ten years of life experience in Canada, building web products and real-time systems for diverse users. I validate AI systems directly and combine tools and agents to improve engineering outcomes.",
        location: "South Korea",
    },
    experience: [
        {
            title: "AI Platform and AICC Engineering",
            role: "Frontend · Voice Gateway",
            period: "Recent work",
            highlights: [
                "Built the frontend of an AI agent platform from scratch.",
                "Designed and implemented the Voice Gateway responsible for real-time voice processing in an AICC solution.",
                "Applied a development workflow that validates AI output and combines multiple agents.",
            ],
        },
    ],
    skills: [
        {
            label: "Languages",
            items: ["TypeScript", "JavaScript", "HTML", "CSS", "PHP"],
        },
        {
            label: "Frontend",
            items: ["React", "Next.js", "Vue.js", "Tailwind CSS"],
        },
        {
            label: "Backend",
            items: ["Node.js", "Express", "Hono", "Laravel"],
        },
        {
            label: "Data",
            items: [
                "PostgreSQL",
                "MySQL",
                "MongoDB",
                "Drizzle",
                "Prisma",
            ],
        },
        {
            label: "Realtime and AI",
            items: ["WebRTC", "WebSocket", "OpenAI API", "STT"],
        },
        {
            label: "Tools",
            items: ["Git", "GitHub", "Jira", "Figma"],
        },
    ],
    projects: orderedProjectSummaries.map((project) => ({
        slug: project.slug,
        title: project.content.en.title,
        summary: project.content.en.summary,
        stack: project.stack,
    })),
    education: [
        {
            institution:
                "British Columbia Institute of Technology (BCIT)",
            program: "Full-Stack Web Development",
            period: "Graduated June 2025",
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
        experience: "Experience",
        skills: "Skills",
        projects: "Projects",
        education: "Education",
        contact: "Contact",
        print: "Print / Save PDF",
    },
} satisfies PortfolioContent;
