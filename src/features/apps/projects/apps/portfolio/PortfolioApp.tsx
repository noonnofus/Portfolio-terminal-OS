"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import type { Language } from "@/shared/i18n/language";
import { projectManifest } from "@/shared/content/portfolio/projectManifest";
import { ProjectTechBadges } from "../../components/ProjectTechBadges";
import styles from "../../styles/ProjectContent.module.css";

type PortfolioAppProps = {
  language: Language;
};

const focusIds = ["interaction", "state", "accessibility", "content"] as const;
const caseIds = ["navigation", "directory", "content", "accessibility"] as const;
const verificationIds = ["structure", "navigation", "interaction"] as const;
export default function PortfolioApp({ language }: PortfolioAppProps) {
  const { t } = useTranslation("Portfolio");

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
              items={projectManifest.portfolio.stack}
            />
          </div>
        </header>

        <section className="mt-12" aria-labelledby="portfolio-intent-title">
          <h3 id="portfolio-intent-title" className="text-lg font-semibold text-[var(--application-app-surface-text)]">
            {t("intent.title")}
          </h3>
          <p className="mt-3 text-[length:var(--application-text-body)] leading-7 text-[var(--application-app-surface-muted)]">
            {t("intent.description")}
          </p>
          <ul className="mt-6 space-y-3 text-[length:var(--application-text-body)] leading-7 text-[var(--application-app-surface-muted)]">
            {focusIds.map((id) => (
              <li key={id} className="flex gap-3">
                <span aria-hidden="true" className="mt-3 size-1.5 shrink-0 rounded-full bg-[var(--application-accent)]" />
                <span>{t(`intent.focus.${id}`)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14" aria-labelledby="portfolio-implementation-title">
          <h3 id="portfolio-implementation-title" className="text-lg font-semibold text-[var(--application-app-surface-text)]">
            {t("implementation.title")}
          </h3>
          <p className="mt-3 text-[length:var(--application-text-body)] leading-7 text-[var(--application-app-surface-muted)]">
            {t("implementation.description")}
          </p>
          <div className="mt-8 space-y-12">
            {caseIds.map((id, index) => (
              <section key={id} aria-labelledby={`portfolio-${id}-title`}>
                <h4 id={`portfolio-${id}-title`} className="text-lg font-semibold text-[var(--application-app-surface-text)]">
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
                {id === "navigation" ? (
                  <figure className="mt-6 bg-white py-2">
                    <Image
                      src="/diagrams/portfolio-os-architecture.svg"
                      alt={t("architecture.alt")}
                      width={1600}
                      height={1000}
                      className="h-auto w-full"
                      unoptimized
                    />
                    <figcaption className="mt-3 text-sm leading-6 text-[var(--application-app-surface-muted)]">
                      {t("architecture.caption")}
                    </figcaption>
                  </figure>
                ) : null}
              </section>
            ))}
          </div>
        </section>

        <section className="mt-14" aria-labelledby="portfolio-verification-title">
          <h3 id="portfolio-verification-title" className="text-lg font-semibold text-[var(--application-app-surface-text)]">
            {t("verification.title")}
          </h3>
          <p className="mt-3 text-[length:var(--application-text-body)] leading-7 text-[var(--application-app-surface-muted)]">
            {t("verification.description")}
          </p>
          <ul className="mt-7 grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {verificationIds.map((id) => (
              <li key={id} className="border-t border-[var(--application-border)] pt-4">
                <h4 className="font-semibold text-[var(--application-app-surface-text)]">
                  {t(`verification.items.${id}.title`)}
                </h4>
                <p className="mt-2 text-[length:var(--application-text-body)] leading-7 text-[var(--application-app-surface-muted)]">
                  {t(`verification.items.${id}.description`)}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14" aria-labelledby="portfolio-result-title">
          <h3 id="portfolio-result-title" className="text-lg font-semibold text-[var(--application-app-surface-text)]">
            {t("result.title")}
          </h3>
          <p className="mt-3 text-[length:var(--application-text-body)] leading-7 text-[var(--application-app-surface-muted)]">
            {t("result.description")}
          </p>
        </section>

      </article>
    </div>
  );
}
