import enFlare from "@/features/portfolio/i18n/en/Flare.json";
import enKepco from "@/features/portfolio/i18n/en/Kepco.json";
import enMcp from "@/features/portfolio/i18n/en/Mcp.json";
import enOptigen from "@/features/portfolio/i18n/en/Optigen.json";
import enPortfolio from "@/features/portfolio/i18n/en/Portfolio.json";
import enVoiceGateway from "@/features/portfolio/i18n/en/VoiceGateway.json";
import enWchms from "@/features/portfolio/i18n/en/WCHMS.json";
import koFlare from "@/features/portfolio/i18n/ko/Flare.json";
import koKepco from "@/features/portfolio/i18n/ko/Kepco.json";
import koMcp from "@/features/portfolio/i18n/ko/Mcp.json";
import koOptigen from "@/features/portfolio/i18n/ko/Optigen.json";
import koPortfolio from "@/features/portfolio/i18n/ko/Portfolio.json";
import koVoiceGateway from "@/features/portfolio/i18n/ko/VoiceGateway.json";
import koWchms from "@/features/portfolio/i18n/ko/WCHMS.json";
import type { Language } from "@/lib/i18n/language";
import type { ProjectSlug } from "@/features/portfolio/types/projectTypes";

export const projectTitles = {
  ko: {
    portfolio: koPortfolio.title, optigen: koOptigen.title, mcp: koMcp.title,
    "voice-gateway": koVoiceGateway.title, kepco: koKepco.title,
    wchms: koWchms.title, flare: koFlare.title,
  },
  en: {
    portfolio: enPortfolio.title, optigen: enOptigen.title, mcp: enMcp.title,
    "voice-gateway": enVoiceGateway.title, kepco: enKepco.title,
    wchms: enWchms.title, flare: enFlare.title,
  },
} satisfies Record<Language, Record<ProjectSlug, string>>;
