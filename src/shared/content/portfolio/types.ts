import type {
    ExternalUrl,
    ProjectSlug,
    PublicAssetPath,
} from "@/features/gui-v2/apps/appTypes";
import type { Language } from "@/shared/lib/i18n/useLanguageStore";

export type ProjectStatus = "live" | "archived" | "private";

export type ProjectCatalogEntry = {
    slug: ProjectSlug;
    order: number;
    status: ProjectStatus;
    stack: readonly string[];
    icon: PublicAssetPath;
    links: {
        live?: ExternalUrl;
        source?: ExternalUrl;
    };
    media: readonly PublicAssetPath[];
};

export type LocalizedProjectSummary = {
    title: string;
    summary: string;
    kind: string;
};

export type ProjectSummary = ProjectCatalogEntry & {
    content: Record<Language, LocalizedProjectSummary>;
};
