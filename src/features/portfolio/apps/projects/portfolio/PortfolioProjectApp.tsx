"use client";

import Image from "next/image";
import type { Language } from "@/lib/i18n/language";
import { projectManifest } from "@/features/portfolio/content/projectManifest";
import { getPortfolioProjectContent } from "@/features/portfolio/content/projectDetails/portfolio";
import { ProjectCaseStudyPage } from "@/features/portfolio/components/ProjectCaseStudyPage";

type PortfolioAppProps = { language: Language };

export default function PortfolioApp({ language }: PortfolioAppProps) {
  const { page, architecture } = getPortfolioProjectContent(language);

  return (
    <ProjectCaseStudyPage
      {...page}
      projectId="portfolio"
      language={language}
      stack={projectManifest.portfolio.stack}
      architecture={{
        title: architecture.title,
        description: architecture.description,
        label: architecture.alt,
        caption: architecture.caption,
        loadingLabel: "",
        errorLabel: "",
        content: (
          <div className="bg-white py-2">
            <Image
              src="/diagrams/portfolio-os-architecture.svg"
              alt={architecture.alt}
              width={1600}
              height={1000}
              className="h-auto w-full"
              unoptimized
            />
          </div>
        ),
      }}
    />
  );
}
