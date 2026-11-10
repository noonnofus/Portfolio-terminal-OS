import type { ProjectCatalogEntry } from "@/features/portfolio/content/types";
import type { ProjectSlug } from "@/features/portfolio/types/projectTypes";

// Set enabled to false to hide a project in both languages. Rebuild for production.
export const projectManifest = {
    portfolio: {
        slug: "portfolio",
        enabled: false,
        order: 14,
        status: "private",
        resumeStack: ["Next.js", "TypeScript", "Zustand", "Tailwind CSS"],
        icon: "/icons/optimized/document.png",
        links: {},
        media: [],
    },
    optigen: {
        slug: "optigen",
        enabled: true,
        order: 12,
        status: "private",
        resumeStack: ["Next.js", "TypeScript", "TanStack Query", "Zustand"],
        icon: "/icons/optimized/document.png",
        links: {},
        media: [],
    },
    mcp: {
        slug: "mcp",
        enabled: true,
        order: 20,
        status: "private",
        resumeStack: ["Node.js", "TypeScript", "MCP SDK", "Express.js"],
        icon: "/icons/optimized/document.png",
        links: {},
        media: [],
    },
    "voice-gateway": {
        slug: "voice-gateway",
        enabled: true,
        order: 21,
        status: "private",
        resumeStack: ["Node.js", "TypeScript", "WebSocket", "Pino"],
        icon: "/icons/optimized/document.png",
        links: {},
        media: [],
    },
    kepco: {
        slug: "kepco",
        enabled: true,
        order: 10,
        status: "private",
        resumeStack: ["React 19", "TypeScript", "TanStack Query", "Zustand"],
        icon: "/icons/optimized/document.png",
        links: {},
        media: [],
    },
    wchms: {
        slug: "wchms",
        enabled: false,
        order: 30,
        status: "private",
        resumeStack: ["Next.js", "TypeScript", "MySQL", "OpenAI"],
        icon: "/icons/optimized/document.png",
        links: {},
        media: [],
    },
    flare: {
        slug: "flare",
        enabled: false,
        order: 40,
        status: "private",
        resumeStack: ["Next.js", "TypeScript", "PostgreSQL", "OpenAI"],
        icon: "/icons/optimized/document.png",
        links: {},
        media: [],
    },
} satisfies Record<ProjectSlug, Omit<ProjectCatalogEntry, "stack">>;

export function isProjectEnabled(slug: ProjectSlug): boolean {
    return projectManifest[slug].enabled;
}
