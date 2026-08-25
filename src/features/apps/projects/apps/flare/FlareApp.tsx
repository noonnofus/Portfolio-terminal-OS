"use client";

import { useTranslation } from "react-i18next";
import type { Language } from "@/shared/i18n/language";
import { projectManifest } from "@/shared/content/portfolio/projectManifest";
import { ProjectCaseStudyPage } from "../../components/ProjectCaseStudyPage";
import styles from "../../styles/ProjectContent.module.css";

type FlareAppProps = {
  language: Language;
};

const projectContextIds = ["category", "product", "users", "role"] as const;
const caseStudySections = [
  {
    id: "informationFlow",
    items: [
      { id: "fragmentedInformation", phase: "problem" },
      { id: "unifiedView", phase: "process" },
      { id: "installableWeb", phase: "process" },
      { id: "consolidatedAccess", phase: "result" },
    ],
    isProblemSolving: true,
  },
  {
    id: "implementation",
    items: [
      { id: "mapAndRisk" },
      { id: "newsPipeline" },
      { id: "chatbot" },
      { id: "notifications" },
    ],
  },
] as const;

export default function FlareApp({ language }: FlareAppProps) {
  const { t } = useTranslation("Flare");
  const contexts = projectContextIds.map((id) => ({
    id,
    label: t(`projectContext.${id}.label`),
    description: t(`projectContext.${id}.description`),
  }));
  const sections = caseStudySections.map(({ id, items, ...section }) => ({
    id,
    title: t(`caseStudy.${id}.title`),
    description: t(`caseStudy.${id}.description`),
    isProblemSolving: "isProblemSolving" in section,
    items: items.map((item) => ({
      ...item,
      title: t(`caseStudy.${id}.items.${item.id}.title`),
      description: t(`caseStudy.${id}.items.${item.id}.description`),
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
      keyOutcome={{
        label: t("keyOutcome.label"),
        value: t("keyOutcome.value"),
        description: t("keyOutcome.description"),
      }}
      sections={sections}
      problemSolvingLabel={t("problemSolvingLabel")}
    >
      <section
        className={styles.supportingSection}
        aria-labelledby="flare-walkthrough-title"
      >
        <h3
          id="flare-walkthrough-title"
          className={`${styles.sectionTitle} font-semibold text-[var(--application-app-surface-text)]`}
        >
          {t("walkthrough.title")}
        </h3>
        <p
          className={`${styles.supportingText} mt-3 text-[var(--application-app-surface-muted)]`}
        >
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
