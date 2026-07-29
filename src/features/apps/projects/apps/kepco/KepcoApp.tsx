"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import type { Language } from "@/shared/i18n/language";
import { projectManifest } from "@/shared/content/portfolio/projectManifest";
import { ProjectTechBadges } from "../../components/ProjectTechBadges";
import styles from "../../styles/ProjectContent.module.css";

type KepcoAppProps = {
  language: Language;
};

const frontendCaseIds = ["callState", "streamState", "recovery", "roleUi"] as const;
const projectContextIds = ["service", "users", "role", "constraint"] as const;
const workflowStepIds = ["signIn", "detectCall", "followTranscript", "reviewAfterCall"] as const;

export default function KepcoApp({ language }: KepcoAppProps) {
  const { t } = useTranslation("Kepco");

  return (
    <div className="application-app-surface h-full w-full overflow-y-auto">
      <article
        lang={language}
        className={styles.readingArticle}
      >
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
              items={projectManifest.kepco.stack}
            />
          </div>
        </header>

        <section className="mt-12" aria-labelledby="kepco-overview-title">
          <h3 id="kepco-overview-title" className="text-lg font-semibold text-[var(--application-app-surface-text)]">
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

        <section className="mt-12" aria-labelledby="kepco-workflow-title">
          <h3 id="kepco-workflow-title" className="text-lg font-semibold text-[var(--application-app-surface-text)]">
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

        <section className="mt-12" aria-labelledby="kepco-architecture-title">
          <h3 id="kepco-architecture-title" className="text-lg font-semibold text-[var(--application-app-surface-text)]">
            {t("architectureTitle")}
          </h3>
          <p className="mt-3 text-[length:var(--application-text-body)] leading-7 text-[var(--application-app-surface-muted)]">
            {t("architectureDescription")}
          </p>
          <figure className="mt-5 bg-white py-2">
            <Image
              src="/diagrams/kepco-advisor-architecture.svg"
              alt={t("architectureAlt")}
              width={1600}
              height={1100}
              className="h-auto w-full"
              unoptimized
            />
            <figcaption className="mt-3 text-sm leading-6 text-[var(--application-app-surface-muted)]">
              {t("architectureCaption")}
            </figcaption>
          </figure>
        </section>

        <section className="mt-14" aria-labelledby="kepco-implementation-title">
          <h3 id="kepco-implementation-title" className="text-lg font-semibold text-[var(--application-app-surface-text)]">
            {t("implementationTitle")}
          </h3>
          <p className="mt-3 text-[length:var(--application-text-body)] leading-7 text-[var(--application-app-surface-muted)]">
            {t("implementationDescription")}
          </p>
          <figure className="mt-6 bg-white py-2">
            <Image
              src="/diagrams/kepco-advisor-frontend-flow.svg"
              alt={t("frontendFlowAlt")}
              width={1400}
              height={700}
              className="h-auto w-full"
              unoptimized
            />
            <figcaption className="mt-3 text-sm leading-6 text-[var(--application-app-surface-muted)]">
              {t("frontendFlowCaption")}
            </figcaption>
          </figure>
          <div className="mt-8 space-y-12">
            {frontendCaseIds.map((id, index) => (
              <section key={id} aria-labelledby={`kepco-${id}-title`}>
                <h4
                  id={`kepco-${id}-title`}
                  className="text-lg font-semibold text-[var(--application-app-surface-text)]"
                >
                  {index + 1}. {t(`frontendCases.${id}.title`)}
                </h4>
                <p className="mt-3 text-[length:var(--application-text-body)] leading-7 text-[var(--application-app-surface-muted)]">
                  {t(`frontendCases.${id}.context`)}
                </p>
                <dl className="mt-5 space-y-5 text-[length:var(--application-text-body)] leading-7">
                  {(["problem", "decision", "result"] as const).map((part) => (
                    <div key={part}>
                      <dt className="font-semibold text-[var(--application-app-surface-text)]">
                        {t(`labels.${part}`)}
                      </dt>
                      <dd className="mt-1 text-[var(--application-app-surface-muted)]">
                        {t(`frontendCases.${id}.${part}`)}
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-5 text-sm leading-6 text-[var(--application-app-surface-muted)]">
                  {t(`frontendCases.${id}.flow`)}
                </p>
              </section>
            ))}
          </div>
        </section>

        <section className="mt-14" aria-labelledby="kepco-result-title">
          <h3 id="kepco-result-title" className="text-lg font-semibold text-[var(--application-app-surface-text)]">
            {t("resultTitle")}
          </h3>
          <p className="mt-3 text-[length:var(--application-text-body)] leading-7 text-[var(--application-app-surface-muted)]">
            {t("resultDescription")}
          </p>
        </section>

        <footer className="mt-12 text-sm leading-6 text-[var(--application-app-surface-muted)]">
          {t("footer")}
        </footer>
      </article>
    </div>
  );
}
