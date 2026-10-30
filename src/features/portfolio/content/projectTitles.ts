import type { Language } from "@/lib/i18n/language";
import type { ProjectSlug } from "@/features/portfolio/types/projectTypes";
import { projectDocuments } from "./projectDocuments";
import { readProjectDocument } from "./projectMetadata";

function title(language: Language, slug: ProjectSlug) {
    return readProjectDocument(projectDocuments[slug][language]).metadata.title;
}

export const projectTitles = {
    ko: {
        "portfolio": title("ko", "portfolio"),
        "optigen": title("ko", "optigen"),
        "mcp": title("ko", "mcp"),
        "voice-gateway": title("ko", "voice-gateway"),
        "kepco": title("ko", "kepco"),
        "wchms": title("ko", "wchms"),
        "flare": title("ko", "flare"),
    },
    en: {
        "portfolio": title("en", "portfolio"),
        "optigen": title("en", "optigen"),
        "mcp": title("en", "mcp"),
        "voice-gateway": title("en", "voice-gateway"),
        "kepco": title("en", "kepco"),
        "wchms": title("en", "wchms"),
        "flare": title("en", "flare"),
    },
} satisfies Record<Language, Record<ProjectSlug, string>>;
