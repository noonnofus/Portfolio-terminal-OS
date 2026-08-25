"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import type { Language } from "@/shared/i18n/language";
import { projectManifest } from "@/shared/content/portfolio/projectManifest";
import { ProjectCaseStudyPage } from "../../components/ProjectCaseStudyPage";

type PortfolioAppProps = {
  language: Language;
};

const projectContextIds = ["category", "product", "users", "role"] as const;
const problemSolvingCaseIds = ["navigation", "directory"] as const;
const supportingCaseIds = ["content", "accessibility"] as const;

export default function PortfolioApp({ language }: PortfolioAppProps) {
  const { t } = useTranslation("Portfolio");
  const contexts = projectContextIds.map((id) => ({
    id,
    label: t(`projectContext.${id}.label`),
    description: t(`projectContext.${id}.description`),
  }));
  const sections = [
    ...problemSolvingCaseIds.map((id) => ({
      id,
      title: t(`cases.${id}.title`),
      description: t(`cases.${id}.context`),
      isProblemSolving: true,
      items: [
        {
          id: "problem",
          phase: "problem" as const,
          title: "",
          description: t(`cases.${id}.problem`),
        },
        {
          id: "process",
          phase: "process" as const,
          title: "",
          description: t(`cases.${id}.decision`),
        },
        {
          id: "result",
          phase: "result" as const,
          title: "",
          description: t(`cases.${id}.result`),
        },
      ],
    })),
    {
      id: "otherContributions",
      title: t("otherContributions.title"),
      description: t("otherContributions.description"),
      items: supportingCaseIds.map((id) => ({
        id,
        title: t(`cases.${id}.title`),
        description: t(`cases.${id}.result`),
      })),
    },
  ];

  return (
    <ProjectCaseStudyPage
      projectId="portfolio"
      language={language}
      title={t("title")}
      summary={t("summary")}
      stackLabel={t("stackLabel")}
      stack={projectManifest.portfolio.stack}
      overviewTitle={t("intent.title")}
      overviewDescription={t("intent.description")}
      contexts={contexts}
      keyOutcome={{
        label: t("keyOutcome.label"),
        value: t("keyOutcome.value"),
        description: t("keyOutcome.description"),
      }}
      sections={sections}
      problemSolvingLabel={t("problemSolvingLabel")}
      architecture={{
        title: t("architecture.title"),
        description: t("architecture.description"),
        label: t("architecture.alt"),
        caption: t("architecture.caption"),
        loadingLabel: "",
        errorLabel: "",
        content: (
          <div className="bg-white py-2">
            <Image
              src="/diagrams/portfolio-os-architecture.svg"
              alt={t("architecture.alt")}
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
