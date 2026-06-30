import type {
  ExternalUrl,
  ProjectSlug,
  PublicAssetPath,
} from "@/features/gui/registry/appTypes";
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
  fileIcon: string;
};

export type ProjectSummary = ProjectCatalogEntry & {
  content: Record<Language, LocalizedProjectSummary>;
};

export type ProfileContent = {
  name: string;
  role: string;
  summary: string;
  location: string;
};

export type ExperienceContent = {
  title: string;
  role: string;
  period: string;
  highlights: readonly string[];
};

export type SkillGroup = {
  label: string;
  items: readonly string[];
};

export type EducationContent = {
  institution: string;
  program: string;
  period: string;
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
  labels: {
    experience: string;
    skills: string;
    projects: string;
    education: string;
    contact: string;
    print: string;
  };
};

export type PortfolioContentByLanguage = Record<Language, PortfolioContent>;
