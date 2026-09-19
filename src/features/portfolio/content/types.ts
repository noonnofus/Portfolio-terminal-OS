import type { Language } from "@/lib/i18n/language";
import type {
  PortfolioAssetPath,
  PortfolioExternalUrl,
  ProjectSlug,
} from "@/features/portfolio/types/projectTypes";

export type ProjectStatus = "live" | "archived" | "private";

export type ProjectCatalogEntry = {
  slug: ProjectSlug;
  order: number;
  status: ProjectStatus;
  stack: readonly string[];
  resumeStack: readonly string[];
  icon: PortfolioAssetPath;
  links: {
    live?: PortfolioExternalUrl;
    source?: PortfolioExternalUrl;
  };
  media: readonly PortfolioAssetPath[];
};

export type ProfileContent = {
  name: string;
  role: string;
  summary: readonly string[];
  location: string;
};

export type ExperienceContent = {
  title: string;
  role: string;
  period: string;
  highlights: readonly ExperienceHighlight[];
  logo?: PortfolioAssetPath;
};

export type ExperienceHighlight = {
  title: string;
  items: readonly string[];
};

export type SkillGroup = {
  label: string;
  items: readonly string[];
};

export type EducationContent = {
  institution: string;
  program: string;
  period: string;
  logo?: PortfolioAssetPath;
};

export type ContactContent = {
  email: string;
  github: PortfolioExternalUrl;
  linkedin: PortfolioExternalUrl;
};

export type ResumeProjectContent = {
  slug: ProjectSlug;
  title: string;
  summary: string;
  stack: readonly string[];
};

export type PortfolioContent = {
  profile: ProfileContent;
  experience: readonly ExperienceContent[];
  skills: readonly SkillGroup[];
  projects: readonly ResumeProjectContent[];
  education: readonly EducationContent[];
  contact: ContactContent;
};

export type PortfolioContentByLanguage = Record<Language, PortfolioContent>;
