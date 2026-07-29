import { publicAssetPath, type ProjectSlug } from "@/features/gui/registry/appTypes";
import type { ProjectCatalogEntry } from "@/shared/content/portfolio/types";

export const projectManifest = {
    portfolio: {
        slug: "portfolio",
        order: 10,
        status: "private",
        stack: ["Next.js", "TypeScript", "Zustand", "Tailwind CSS"],
        icon: publicAssetPath("/icons/optimized/document.png"),
        links: {},
        media: [],
    },
    optigen: {
        slug: "optigen",
        order: 12,
        status: "private",
        stack: ["Next.js", "TypeScript", "React Query", "Zustand"],
        icon: publicAssetPath("/icons/optimized/document.png"),
        links: {},
        media: [],
    },
    kepco: {
        slug: "kepco",
        order: 15,
        status: "private",
        stack: ["React 19", "TypeScript", "TanStack Query", "Zustand"],
        icon: publicAssetPath("/icons/optimized/document.png"),
        links: {},
        media: [],
    },
    wchms: {
        slug: "wchms",
        order: 20,
        status: "private",
        stack: ["Next.js", "TypeScript", "MySQL", "OpenAI"],
        icon: publicAssetPath("/icons/optimized/document.png"),
        links: {},
        media: [],
    },
    flare: {
        slug: "flare",
        order: 30,
        status: "private",
        stack: ["Next.js", "TypeScript", "PostgreSQL", "OpenAI"],
        icon: publicAssetPath("/icons/optimized/document.png"),
        links: {},
        media: [],
    },
} satisfies Record<ProjectSlug, ProjectCatalogEntry>;
