"use client";

import type { Language } from "@/lib/i18n/language";
import { getProjectDetailPageContent } from "@/features/portfolio/content/projectDetailContent";
import { ProjectCaseStudyPage } from "@/features/portfolio/components/ProjectCaseStudyPage";

export default function VoiceGatewayProjectApp({ language }: { language: Language }) {
  return <ProjectCaseStudyPage {...getProjectDetailPageContent("voice-gateway", language)} projectId="voice-gateway" language={language} />;
}
