"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import type { Language } from "@/shared/i18n/language";
import { projectManifest } from "@/shared/content/portfolio/projectManifest";
import { ProjectTechBadges } from "../../components/ProjectTechBadges";
import styles from "../../styles/ProjectContent.module.css";

type OptigenAppProps = {
  language: Language;
};

const projectContextIds = ["service", "users", "role", "constraint"] as const;
const workflowStepIds = ["configure", "selectBot", "chat", "useTool"] as const;
const caseIds = ["admin", "chat", "content", "mcp"] as const;
export default function OptigenApp({ language }: OptigenAppProps) {
  const { t } = useTranslation("Optigen");

  return (
    <div className="application-app-surface h-full w-full overflow-y-auto">
      <article lang={language} className={styles.readingArticle}>
        <header>
          <h2 className="text-3xl font-bold tracking-tight text-[var(--application-app-surface-text)] md:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-[length:var(--application-text-reading)] leading-7 text-[var(--application-app-surface-muted)]">
            {t("summary")}
          </p>
          <div className="mt-5">
            <ProjectTechBadges
              label={t("stackLabel")}
              items={projectManifest.optigen.stack}
            />
          </div>
        </header>

        <section className="mt-12" aria-labelledby="optigen-overview-title">
          <h3 id="optigen-overview-title" className="text-lg font-semibold text-[var(--application-app-surface-text)]">
            {t("projectIntro.title")}
          </h3>
          <p className="mt-3 text-[length:var(--application-text-body)] leading-7 text-[var(--application-app-surface-muted)]">
            {t("projectIntro.description")}
          </p>
          <dl className="mt-7 space-y-4 text-[length:var(--application-text-body)] leading-7">
            {projectContextIds.map((id) => (
              <div key={id} className="grid gap-1 sm:grid-cols-[6.5rem_1fr] sm:gap-5">
                <dt className="font-semibold text-[var(--application-app-surface-text)]">
                  {t(`projectContext.${id}.label`)}
                </dt>
                <dd className="text-[var(--application-app-surface-muted)]">
                  {t(`projectContext.${id}.description`)}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-12" aria-labelledby="optigen-workflow-title">
          <h3 id="optigen-workflow-title" className="text-lg font-semibold text-[var(--application-app-surface-text)]">
            {t("workflow.title")}
          </h3>
          <p className="mt-3 text-[length:var(--application-text-body)] leading-7 text-[var(--application-app-surface-muted)]">
            {t("workflow.description")}
          </p>
          <ol className="mt-6 grid gap-4 sm:grid-cols-4">
            {workflowStepIds.map((id, index) => (
              <li key={id} className="border-t border-[var(--application-border)] pt-3">
                <span className="font-mono text-sm text-[var(--application-accent)]">0{index + 1}</span>
                <p className="mt-2 text-sm font-semibold leading-6 text-[var(--application-app-surface-text)]">
                  {t(`workflow.steps.${id}`)}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-12" aria-labelledby="optigen-architecture-title">
          <h3 id="optigen-architecture-title" className="text-lg font-semibold text-[var(--application-app-surface-text)]">
            {t("architecture.title")}
          </h3>
          <p className="mt-3 text-[length:var(--application-text-body)] leading-7 text-[var(--application-app-surface-muted)]">
            {t("architecture.description")}
          </p>
          <figure className="mt-5 bg-white py-2">
            <Image
              src="/diagrams/optigen-platform-architecture.svg"
              alt={t("architecture.alt")}
              width={1600}
              height={1100}
              className="h-auto w-full"
              unoptimized
            />
            <figcaption className="mt-3 text-sm leading-6 text-[var(--application-app-surface-muted)]">
              {t("architecture.caption")}
            </figcaption>
          </figure>
        </section>

        <section className="mt-14" aria-labelledby="optigen-implementation-title">
          <h3 id="optigen-implementation-title" className="text-lg font-semibold text-[var(--application-app-surface-text)]">
            {t("implementation.title")}
          </h3>
          <p className="mt-3 text-[length:var(--application-text-body)] leading-7 text-[var(--application-app-surface-muted)]">
            {t("implementation.description")}
          </p>
          <div className="mt-8 space-y-12">
            {caseIds.map((id, index) => (
              <section key={id} aria-labelledby={`optigen-${id}-title`}>
                <h4 id={`optigen-${id}-title`} className="text-lg font-semibold text-[var(--application-app-surface-text)]">
                  {index + 1}. {t(`cases.${id}.title`)}
                </h4>
                <p className="mt-3 text-[length:var(--application-text-body)] leading-7 text-[var(--application-app-surface-muted)]">
                  {t(`cases.${id}.context`)}
                </p>
                <dl className="mt-5 space-y-5 text-[length:var(--application-text-body)] leading-7">
                  {(["problem", "decision", "result"] as const).map((part) => (
                    <div key={part}>
                      <dt className="font-semibold text-[var(--application-app-surface-text)]">
                        {t(`labels.${part}`)}
                      </dt>
                      <dd className="mt-1 text-[var(--application-app-surface-muted)]">
                        {t(`cases.${id}.${part}`)}
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-5 text-sm leading-6 text-[var(--application-app-surface-muted)]">
                  {t(`cases.${id}.flow`)}
                </p>
              </section>
            ))}
          </div>
        </section>

        <section className="mt-14" aria-labelledby="optigen-result-title">
          <h3 id="optigen-result-title" className="text-lg font-semibold text-[var(--application-app-surface-text)]">
            {t("result.title")}
          </h3>
          <p className="mt-3 text-[length:var(--application-text-body)] leading-7 text-[var(--application-app-surface-muted)]">
            {t("result.description")}
          </p>
        </section>

        <footer className="mt-12 text-sm leading-6 text-[var(--application-app-surface-muted)]">
          {t("footer")}
        </footer>
      </article>
    </div>
  );
}
