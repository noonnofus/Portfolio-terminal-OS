import { Fragment } from "react";
import { ProjectMarkdown } from "./ProjectMarkdown";
import { ImageViewer, type OpenImageViewer } from "@/components/ui/ImageViewer";
import type { Language } from "@/lib/i18n/language";
import type {
  ProjectCaseStudyPhase,
  ProjectDetailPageContent,
} from "@/features/portfolio/content/projectDetailContent";
import { ProjectTechBadges } from "./ProjectTechBadges";
import styles from "./ProjectContent.module.css";

const phaseLabelsByLanguage: Record<
  Language,
  Record<ProjectCaseStudyPhase, string>
> = {
  ko: {
    problem: "개요",
    process: "세부 내용",
    result: "성과",
  },
  en: {
    problem: "Overview",
    process: "Implementation",
    result: "Outcomes",
  },
};

const projectInfoLabels: Record<Language, string> = {
  ko: "프로젝트 정보",
  en: "Project information",
};

type ProjectCaseStudyPageProps = ProjectDetailPageContent & {
  projectId: string;
  language: Language;
};

export function ProjectCaseStudyPage({
  projectId,
  language,
  title,
  summary,
  stackLabel,
  stack,
  overviewTitle,
  overviewDescription,
  contexts,
  keyOutcome,
  sections,
  problemSolvingLabel,
  walkthrough,
  architecture,
}: ProjectCaseStudyPageProps) {
  const phaseLabels = phaseLabelsByLanguage[language];
  const renderArchitecture = (
    architectureSectionId: string,
    openImage: OpenImageViewer,
    isCaseStudy = false,
  ) => {
    if (!architecture) return null;

    return (
      <section
        className={
          isCaseStudy
            ? styles.caseArchitectureSection
            : styles.architectureSection
        }
        aria-labelledby={`${projectId}-${architectureSectionId}-title`}
      >
        <h3
          id={`${projectId}-${architectureSectionId}-title`}
          className={`${styles.sectionTitle} font-semibold text-[var(--application-app-surface-text)]`}
        >
          {architecture.title}
        </h3>
        <p
          className={`${styles.sectionDescription} mt-3 text-[var(--application-app-surface-muted)]`}
        >
          {architecture.description}
        </p>
        <figure className="mt-5">
          <ProjectMarkdown markdown={architecture.markdown} language={language} media={architecture} openImage={openImage} />
          <figcaption
            className={`${styles.supportingText} mt-3 text-[var(--application-app-surface-muted)]`}
          >
            {architecture.caption}
          </figcaption>
        </figure>
      </section>
    );
  };

  return (
    <ImageViewer language={language}>{(openImage) => (
    <div className="application-app-surface h-full w-full overflow-y-auto">
      <article lang={language} className={`application-content-inset ${styles.readingArticle}`}>
        <header className={styles.documentHeader}>
          <h2
            className={`${styles.documentTitle} font-bold tracking-tight text-[var(--application-app-surface-text)]`}
          >
            {title}
          </h2>
          <p
            className={`${styles.documentSummary} mt-4 text-[var(--application-app-surface-muted)]`}
          >
            {summary}
          </p>
        </header>

        <section
          className={styles.overviewSection}
          aria-labelledby={`${projectId}-overview-title`}
        >
          <h3
            id={`${projectId}-overview-title`}
            className={`${styles.sectionTitle} font-semibold text-[var(--application-app-surface-text)]`}
          >
            {overviewTitle}
          </h3>
          {overviewDescription.split("\n\n").map((paragraph) => (
            <p
              key={paragraph}
              className={`${styles.sectionDescription} mt-3 text-[var(--application-app-surface-muted)]`}
            >
              {paragraph}
            </p>
          ))}
        </section>

        <section
          className={styles.projectInfoSection}
          aria-labelledby={`${projectId}-project-info-title`}
        >
          <h3
            id={`${projectId}-project-info-title`}
            className={`${styles.sectionTitle} font-semibold text-[var(--application-app-surface-text)]`}
          >
            {projectInfoLabels[language]}
          </h3>
          <div className={styles.projectInfoStack}>
            <ProjectTechBadges label={stackLabel} items={stack} />
          </div>
          <div className={styles.overviewGrid}>
            <dl className={styles.contextList}>
              {contexts.map((context) => (
                <div key={context.id} className={styles.contextRow}>
                  <dt className="font-semibold text-[var(--application-app-surface-text)]">
                    {context.label}
                  </dt>
                  <dd className="text-[var(--application-app-surface-muted)]">
                    {context.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {architecture && !architecture.sectionId
          ? renderArchitecture("architecture", openImage)
          : null}

        {sections.map((section) => (
          <section
            key={section.id}
            className={styles.caseSection}
            aria-labelledby={`${projectId}-${section.id}-title`}
          >
            {problemSolvingLabel ? (
              <p className={styles.caseTypeLabel}>{problemSolvingLabel}</p>
            ) : null}
            <h3
              id={`${projectId}-${section.id}-title`}
              className={`${styles.sectionTitle} font-semibold text-[var(--application-app-surface-text)]`}
            >
              {section.title}
            </h3>
            <div className={styles.casePhases}>
              {(["problem", "process", "result"] as const).map((phase) => (
                <Fragment key={phase}>
                  <section className={styles.casePhase}>
                    <h4 className={styles.casePhaseLabel}>{phaseLabels[phase]}</h4>
                    <ProjectMarkdown markdown={section.phases[phase]} language={language} openImage={openImage} />
                  </section>
                  {phase === "problem" && architecture?.sectionId === section.id
                    ? renderArchitecture(`${section.id}-architecture`, openImage, true)
                    : null}
                </Fragment>
              ))}
            </div>
          </section>
        ))}

        {walkthrough ? (
          <section className={styles.supportingSection} aria-labelledby={`${projectId}-walkthrough-title`}>
            <h3 id={`${projectId}-walkthrough-title`} className={`${styles.sectionTitle} font-semibold text-[var(--application-app-surface-text)]`}>{walkthrough.title}</h3>
            <p className={`${styles.supportingText} mt-3 text-[var(--application-app-surface-muted)]`}>{walkthrough.description}</p>
            <div className={`${styles.walkthroughMedia} mt-5`}>
              <ProjectMarkdown markdown={walkthrough.markdown} language={language} media={walkthrough} openImage={openImage} />
            </div>
          </section>
        ) : null}

        {keyOutcome ? (
          <section
            className={styles.keyOutcomeSection}
            aria-labelledby={`${projectId}-outcome-title`}
          >
            <p
              id={`${projectId}-outcome-title`}
              className={styles.keyOutcomeLabel}
            >
              {keyOutcome.label}
            </p>
            <p className={styles.keyOutcomeValue}>{keyOutcome.value}</p>
            {keyOutcome.description ? (
              <p className={styles.keyOutcomeDescription}>
                {keyOutcome.description}
              </p>
            ) : null}
          </section>
        ) : null}
      </article>
    </div>
    )}</ImageViewer>
  );
}
