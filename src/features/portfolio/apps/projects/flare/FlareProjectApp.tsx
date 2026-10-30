"use client";

import type { Language } from "@/lib/i18n/language";
import { getProjectDetailPageContent } from "@/features/portfolio/content/projectDetailContent";
import { ProjectCaseStudyPage } from "@/features/portfolio/components/ProjectCaseStudyPage";

export default function FlareProjectApp({ language }: { language: Language }) {
  return <ProjectCaseStudyPage {...getProjectDetailPageContent("flare", language)} projectId="flare" language={language} />;
}
