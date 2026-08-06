import type { ReactNode } from "react";
import type { Language } from "@/shared/i18n/language";
import { ProjectArchitectureDiagram } from "./ProjectArchitectureDiagram";
import { ProjectTechBadges } from "./ProjectTechBadges";
import styles from "../styles/ProjectContent.module.css";

export type ProjectCaseStudyContext = {
  id: string;
  label: string;
  description: string;
};

export type ProjectCaseStudySection = {
  id: string;
  title: string;
  description: string;
  items: readonly {
    id: string;
    title: string;
    description: string;
  }[];
};

export type ProjectArchitecture = {
  title: string;
  description: string;
  chart: string;
  label: string;
  caption: string;
  loadingLabel: string;
  errorLabel: string;
};

type ProjectCaseStudyPageProps = {
  projectId: string;
  language: Language;
  title: string;
  summary: string;
  stackLabel: string;
  stack: readonly string[];
  overviewTitle: string;
  overviewDescription: string;
  contexts: readonly ProjectCaseStudyContext[];
  sections: readonly ProjectCaseStudySection[];
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
  sections,
  children,
  architecture,
}: ProjectCaseStudyPageProps) {
  return (
    <div className="application-app-surface h-full w-full overflow-y-auto">
      <article lang={language} className={styles.readingArticle}>
        <header>
          <h2 className="text-3xl font-bold tracking-tight text-[var(--application-app-surface-text)] md:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-[length:var(--application-text-reading)] leading-7 text-[var(--application-app-surface-muted)]">
            {summary}
          </p>
          <div className="mt-5">
            <ProjectTechBadges label={stackLabel} items={stack} />
          </div>
        </header>

        <section
          className="mt-12"
          aria-labelledby={`${projectId}-overview-title`}
        >
          <h3
            id={`${projectId}-overview-title`}
            className="text-lg font-semibold text-[var(--application-app-surface-text)]"
          >
            {overviewTitle}
          </h3>
          <p className="mt-3 text-[length:var(--application-text-body)] leading-7 text-[var(--application-app-surface-muted)]">
            {overviewDescription}
          </p>
          <dl className="mt-7 space-y-4 text-[length:var(--application-text-body)] leading-7">
            {contexts.map((context) => (
              <div
                key={context.id}
                className="grid gap-1 sm:grid-cols-[6.5rem_1fr] sm:gap-5"
              >
                <dt className="font-semibold text-[var(--application-app-surface-text)]">
                  {context.label}
                </dt>
                <dd className="text-[var(--application-app-surface-muted)]">
                  {context.description}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {sections.map((section) => (
          <section
            key={section.id}
            className="mt-12"
            aria-labelledby={`${projectId}-${section.id}-title`}
          >
            <h3
              id={`${projectId}-${section.id}-title`}
              className="text-lg font-semibold text-[var(--application-app-surface-text)]"
            >
              {section.title}
            </h3>
            <p className="mt-3 text-[length:var(--application-text-body)] leading-7 text-[var(--application-app-surface-muted)]">
              {section.description}
            </p>
            <ul className="mt-7 grid gap-x-8 gap-y-7 sm:grid-cols-2">
              {section.items.map((item) => (
                <li
                  key={item.id}
                  className="border-t border-[var(--application-border)] pt-4"
                >
                  <h4 className="font-semibold text-[var(--application-app-surface-text)]">
                    {item.title}
                  </h4>
                  <p className="mt-2 text-[length:var(--application-text-body)] leading-7 text-[var(--application-app-surface-muted)]">
                    {item.description}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ))}

        {children}

        {architecture ? (
          <section
            className="mt-12"
            aria-labelledby={`${projectId}-architecture-title`}
          >
            <h3
              id={`${projectId}-architecture-title`}
              className="text-lg font-semibold text-[var(--application-app-surface-text)]"
            >
              {architecture.title}
            </h3>
            <p className="mt-3 text-[length:var(--application-text-body)] leading-7 text-[var(--application-app-surface-muted)]">
              {architecture.description}
            </p>
            <figure className="mt-5">
              <ProjectArchitectureDiagram
                chart={architecture.chart}
                label={architecture.label}
                loadingLabel={architecture.loadingLabel}
                errorLabel={architecture.errorLabel}
              />
              <figcaption className="mt-3 text-sm leading-6 text-[var(--application-app-surface-muted)]">
                {architecture.caption}
              </figcaption>
            </figure>
          </section>
        ) : null}
      </article>
    </div>
  );
}
