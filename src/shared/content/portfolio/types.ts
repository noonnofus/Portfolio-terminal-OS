import type {
  ExternalUrl,
  ProjectSlug,
  PublicAssetPath,
} from "@/features/gui/registry/appTypes";
import type { Language } from "@/shared/i18n/language";

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
  logo?: PublicAssetPath;
};

export type ExperienceHighlight = {
  title: string;
  items: readonly string[];
  projectSlug?: ProjectSlug;
};

export type SkillGroup = {
  label: string;
  items: readonly string[];
};

export type EducationContent = {
  institution: string;
  program: string;
  period: string;
  logo?: PublicAssetPath;
};

export type ContactContent = {
  email: string;
  github: ExternalUrl;
  linkedin: ExternalUrl;
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
