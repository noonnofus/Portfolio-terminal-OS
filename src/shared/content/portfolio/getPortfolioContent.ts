import { enPortfolioContent } from "@/shared/content/portfolio/en";
import { koPortfolioContent } from "@/shared/content/portfolio/ko";
import type {
    PortfolioContent,
    PortfolioContentByLanguage,
} from "@/shared/content/portfolio/types";
import type { Language } from "@/shared/lib/i18n/useLanguageStore";

export const portfolioContent = {
    ko: koPortfolioContent,
    en: enPortfolioContent,
} satisfies PortfolioContentByLanguage;

export function getPortfolioContent(
    language: Language,
): PortfolioContent {
    return portfolioContent[language];
}
