import { Fragment, type ReactNode } from "react";
import type { Language } from "@/lib/i18n/language";
import type {
  ProjectCaseStudyPhase,
  ProjectDetailPageContent,
} from "@/features/portfolio/content/projectDetailContent";
import { ProjectArchitectureDiagram } from "./ProjectArchitectureDiagram";
import { ProjectTechBadges } from "./ProjectTechBadges";
import styles from "./ProjectContent.module.css";

const phaseLabelsByLanguage: Record<
  Language,
  Record<ProjectCaseStudyPhase, string>
> = {
  ko: {
    problem: "배경 / 문제",
    process: "해결 과정",
    result: "결과",
  },
  en: {
    problem: "Background / Problem",
    process: "Solution / Process",
    result: "Result",
  },
};

const projectInfoLabels: Record<Language, string> = {
  ko: "프로젝트 정보",
  en: "Project information",
};

type ProjectArchitectureBase = {
  title: string;
  description: string;
  label: string;
  caption: string;
  loadingLabel: string;
  errorLabel: string;
  sectionId?: string;
  wide?: boolean;
  scrollable?: boolean;
  scrollLabel?: string;
};

export type ProjectArchitecture = ProjectArchitectureBase &
  (
    | { chart: string; content?: never }
    | { chart?: never; content: ReactNode }
  );

type ProjectCaseStudyPageProps = ProjectDetailPageContent & {
  projectId: string;
  language: Language;
  stackLabel: string;
  stack: readonly string[];
  problemSolvingLabel?: string;
  children?: ReactNode;
  architecture?: ProjectArchitecture;
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
  children,
  architecture,
}: ProjectCaseStudyPageProps) {
  const phaseLabels = phaseLabelsByLanguage[language];
  const orderedSections = [
    ...sections.filter((section) => section.isProblemSolving),
    ...sections.filter((section) => !section.isProblemSolving),
  ];
  const renderArchitecture = (
    architectureSectionId: string,
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
          {"content" in architecture ? (
            architecture.content
          ) : (
            <ProjectArchitectureDiagram
              chart={architecture.chart}
              label={architecture.label}
              loadingLabel={architecture.loadingLabel}
              errorLabel={architecture.errorLabel}
              wide={architecture.wide}
              scrollable={architecture.scrollable}
              scrollLabel={architecture.scrollLabel}
            />
          )}
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
    <div className="application-app-surface h-full w-full overflow-y-auto">
      <article lang={language} className={styles.readingArticle}>
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

        {architecture && !architecture.sectionId
          ? renderArchitecture("architecture")
          : null}

        {orderedSections.map((section) => (
          <section
            key={section.id}
            className={
              section.isProblemSolving
                ? styles.caseSection
                : styles.supportingSection
            }
            aria-labelledby={`${projectId}-${section.id}-title`}
          >
            {section.isProblemSolving && problemSolvingLabel ? (
              <p className={styles.caseTypeLabel}>{problemSolvingLabel}</p>
            ) : null}
            <h3
              id={`${projectId}-${section.id}-title`}
              className={`${styles.sectionTitle} font-semibold text-[var(--application-app-surface-text)]`}
            >
              {section.title}
            </h3>
            <p
              className={`${styles.sectionDescription} mt-3 text-[var(--application-app-surface-muted)]`}
            >
              {section.description}
            </p>
            {section.isProblemSolving ? (
              <div className={styles.casePhases}>
                {(
                  [
                    ["problem", phaseLabels.problem],
                    ["process", phaseLabels.process],
                    ["result", phaseLabels.result],
                  ] as const
                ).map(([phase, label]) => {
                  const items = section.items.filter(
                    (item) => item.phase === phase,
                  );

                  return items.length > 0 ? (
                    <Fragment key={phase}>
                      <section className={styles.casePhase}>
                        <h4 className={styles.casePhaseLabel}>{label}</h4>
                        <ul className={styles.caseEvidenceList}>
                          {items.map((item) => (
                            <li key={item.id} className={styles.evidenceItem}>
                              {item.description.split("\n\n").map(
                                (paragraph, index) => (
                                  <p
                                    key={paragraph}
                                    className={`${styles.evidenceDescription} ${index > 0 ? "mt-3" : ""} text-[var(--application-app-surface-muted)]`}
                                  >
                                    {index === 0 && item.title ? (
                                      <>
                                        <strong className="font-semibold text-[var(--application-app-surface-text)]">
                                          {item.title}
                                        </strong>{" "}
                                      </>
                                    ) : null}
                                    {paragraph}
                                  </p>
                                ),
                              )}
                            </li>
                          ))}
                        </ul>
                      </section>
                      {phase === "problem" &&
                      architecture?.sectionId === section.id
                        ? renderArchitecture(
                            `${section.id}-architecture`,
                            true,
                          )
                        : null}
                    </Fragment>
                  ) : null;
                })}
              </div>
            ) : (
              <ul className={styles.evidenceList}>
                {section.items.map((item) => (
                  <li key={item.id} className={styles.evidenceItem}>
                    <h4
                      className={`${styles.evidenceTitle} font-semibold text-[var(--application-app-surface-text)]`}
                    >
                      {item.title}
                    </h4>
                    <p
                      className={`${styles.evidenceDescription} text-[var(--application-app-surface-muted)]`}
                    >
                      {item.description}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}

        {children}

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
      </article>
    </div>
  );
}
