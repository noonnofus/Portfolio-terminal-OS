import type { Language } from "@/lib/i18n/language";
import type { ProjectSlug } from "@/features/portfolio/types/projectTypes";
import portfolio_ko from "./markdown/ko/portfolio.md?raw";
import portfolio_en from "./markdown/en/portfolio.md?raw";
import optigen_ko from "./markdown/ko/optigen.md?raw";
import optigen_en from "./markdown/en/optigen.md?raw";
import mcp_ko from "./markdown/ko/mcp.md?raw";
import mcp_en from "./markdown/en/mcp.md?raw";
import voice_gateway_ko from "./markdown/ko/voice-gateway.md?raw";
import voice_gateway_en from "./markdown/en/voice-gateway.md?raw";
import kepco_ko from "./markdown/ko/kepco.md?raw";
import kepco_en from "./markdown/en/kepco.md?raw";
import wchms_ko from "./markdown/ko/wchms.md?raw";
import wchms_en from "./markdown/en/wchms.md?raw";
import flare_ko from "./markdown/ko/flare.md?raw";
import flare_en from "./markdown/en/flare.md?raw";

export const projectDocuments = {
    "portfolio": { ko: portfolio_ko, en: portfolio_en },
    "optigen": { ko: optigen_ko, en: optigen_en },
    "mcp": { ko: mcp_ko, en: mcp_en },
    "voice-gateway": { ko: voice_gateway_ko, en: voice_gateway_en },
    "kepco": { ko: kepco_ko, en: kepco_en },
    "wchms": { ko: wchms_ko, en: wchms_en },
    "flare": { ko: flare_ko, en: flare_en },
} satisfies Record<ProjectSlug, Record<Language, string>>;
