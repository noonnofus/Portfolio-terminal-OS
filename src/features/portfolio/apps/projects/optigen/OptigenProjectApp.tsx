"use client";

import type { Language } from "@/lib/i18n/language";
import { getProjectDetailPageContent } from "@/features/portfolio/content/projectDetailContent";
import { ProjectCaseStudyPage } from "@/features/portfolio/components/ProjectCaseStudyPage";

export default function OptigenProjectApp({ language }: { language: Language }) {
  return <ProjectCaseStudyPage {...getProjectDetailPageContent("optigen", language)} projectId="optigen" language={language} />;
}
