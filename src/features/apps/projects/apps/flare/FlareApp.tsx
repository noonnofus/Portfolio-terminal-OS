"use client";

import { useTranslation } from "react-i18next";
import type { Language } from "@/shared/i18n/language";
import { projectManifest } from "@/shared/content/portfolio/projectManifest";
import { ProjectCaseStudyPage } from "../../components/ProjectCaseStudyPage";

type FlareAppProps = {
  language: Language;
};

const projectContextIds = ["category", "product", "users", "role"] as const;
const caseStudySections = [
  {
    id: "problem",
    itemIds: ["fragmentedInformation", "deviceAccess", "focusedQuestions"],
  },
  {
    id: "design",
    itemIds: ["unifiedView", "installableWeb", "scopedAssistant"],
  },
  {
    id: "implementation",
    itemIds: ["mapAndRisk", "newsPipeline", "chatbot", "notifications"],
  },
  {
    id: "outcome",
    itemIds: ["consolidatedAccess", "installableExperience", "focusedSupport"],
  },
] as const;

export default function FlareApp({ language }: FlareAppProps) {
  const { t } = useTranslation("Flare");
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
      projectId="flare"
      language={language}
      title={t("title")}
      summary={t("summary")}
      stackLabel={t("stackLabel")}
      stack={projectManifest.flare.stack}
      overviewTitle={t("projectIntro.title")}
      overviewDescription={t("projectIntro.description")}
      contexts={contexts}
      sections={sections}
    >
      <section className="mt-12" aria-labelledby="flare-walkthrough-title">
        <h3
          id="flare-walkthrough-title"
          className="text-lg font-semibold text-[var(--application-app-surface-text)]"
        >
          {t("walkthrough.title")}
        </h3>
        <p className="mt-3 text-[length:var(--application-text-body)] leading-7 text-[var(--application-app-surface-muted)]">
          {t("walkthrough.description")}
        </p>
        <div className="mt-5 grid gap-5">
          <video className="aspect-video w-full" controls preload="metadata">
            <source src="/videos/flare-walkthrough-web.mp4" type="video/mp4" />
            {t("walkthrough.unsupported")}
          </video>
          <video className="aspect-video w-full" controls preload="metadata">
            <source src="/videos/flare-walkthrough-app.mp4" type="video/mp4" />
            {t("walkthrough.unsupported")}
          </video>
        </div>
      </section>
    </ProjectCaseStudyPage>
  );
}
