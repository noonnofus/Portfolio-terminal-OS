"use client";

import { useTranslation } from "react-i18next";
import type { Language } from "@/shared/i18n/language";
import { projectManifest } from "@/shared/content/portfolio/projectManifest";
import { ProjectCaseStudyPage } from "../../components/ProjectCaseStudyPage";

type WchmsAppProps = {
  language: Language;
};

const projectContextIds = ["category", "product", "users", "role"] as const;
const caseStudySections = [
  {
    id: "problem",
    itemIds: ["learningAccess", "materialPreparation", "administration"],
  },
  {
    id: "design",
    itemIds: ["difficultyAlignment", "topicReading", "contentModel"],
  },
  {
    id: "implementation",
    itemIds: ["selfStudy", "pdfMaterials", "adminWorkspace", "localization"],
  },
  {
    id: "outcome",
    itemIds: ["connectedFlow", "reusableMaterials", "operationalWorkspace"],
  },
] as const;

export default function WchmsApp({ language }: WchmsAppProps) {
  const { t } = useTranslation("WCHMS");
  const contexts = projectContextIds.map((id) => ({
    id,
    label: t(`projectContext.${id}.label`),
    description: t(`projectContext.${id}.description`),
  }));
  const sections = caseStudySections.map(({ id, itemIds }) => ({
    id,
    title: t(`caseStudy.${id}.title`),
    description: t(`caseStudy.${id}.description`),
    items: itemIds.map((itemId) => ({
      id: itemId,
      title: t(`caseStudy.${id}.items.${itemId}.title`),
      description: t(`caseStudy.${id}.items.${itemId}.description`),
    })),
  }));

  return (
    <ProjectCaseStudyPage
      projectId="wchms"
      language={language}
      title={t("title")}
      summary={t("summary")}
      stackLabel={t("stackLabel")}
      stack={projectManifest.wchms.stack}
      overviewTitle={t("projectIntro.title")}
      overviewDescription={t("projectIntro.description")}
      contexts={contexts}
      sections={sections}
    >
      <section className="mt-12" aria-labelledby="wchms-walkthrough-title">
        <h3
          id="wchms-walkthrough-title"
          className="text-lg font-semibold text-[var(--application-app-surface-text)]"
        >
          {t("walkthrough.title")}
        </h3>
        <p className="mt-3 text-[length:var(--application-text-body)] leading-7 text-[var(--application-app-surface-muted)]">
          {t("walkthrough.description")}
        </p>
        <video className="mt-5 aspect-video w-full" controls preload="metadata">
          <source src="/videos/wchms-walkthrough.mp4" type="video/mp4" />
          {t("walkthrough.unsupported")}
        </video>
      </section>
    </ProjectCaseStudyPage>
  );
}
