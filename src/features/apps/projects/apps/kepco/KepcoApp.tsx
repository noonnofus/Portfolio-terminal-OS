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

const projectContextIds = ["category", "service", "users", "role"] as const;
const caseStudySections = [
  {
    id: "problem",
    itemIds: ["liveContext", "afterCall", "roleScope"],
  },
  {
    id: "design",
    itemIds: ["callState", "streamState", "roleUi"],
  },
  {
    id: "decisions",
    itemIds: ["transport", "reducer", "recovery"],
  },
] as const;
const contributionIds = ["consultation", "history", "roles", "resilience"] as const;
const verificationIds = ["stateTransition", "eventConsistency", "recovery"] as const;

export default function KepcoApp({ language }: KepcoAppProps) {
  const { t } = useTranslation("Kepco");

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
              items={projectManifest.kepco.stack}
            />
          </div>
        </header>

        <section className="mt-12" aria-labelledby="kepco-overview-title">
          <h3
            id="kepco-overview-title"
            className="text-lg font-semibold text-[var(--application-app-surface-text)]"
          >
            {t("projectIntro.title")}
          </h3>
          <p className="mt-3 text-[length:var(--application-text-body)] leading-7 text-[var(--application-app-surface-muted)]">
            {t("projectIntro.description")}
          </p>
          <dl className="mt-7 space-y-4 text-[length:var(--application-text-body)] leading-7">
            {projectContextIds.map((id) => (
              <div
                key={id}
                className="grid gap-1 sm:grid-cols-[6.5rem_1fr] sm:gap-5"
              >
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

        {caseStudySections.map(({ id, itemIds }) => (
          <section
            key={id}
            className="mt-12"
            aria-labelledby={`kepco-${id}-title`}
          >
            <h3
              id={`kepco-${id}-title`}
              className="text-lg font-semibold text-[var(--application-app-surface-text)]"
            >
              {t(`caseStudy.${id}.title`)}
            </h3>
            <p className="mt-3 text-[length:var(--application-text-body)] leading-7 text-[var(--application-app-surface-muted)]">
              {t(`caseStudy.${id}.description`)}
            </p>
            <ul className="mt-7 grid gap-x-8 gap-y-7 sm:grid-cols-2">
              {itemIds.map((itemId) => (
                <li
                  key={itemId}
                  className="border-t border-[var(--application-border)] pt-4"
                >
                  <h4 className="font-semibold text-[var(--application-app-surface-text)]">
                    {t(`caseStudy.${id}.items.${itemId}.title`)}
                  </h4>
                  <p className="mt-2 text-[length:var(--application-text-body)] leading-7 text-[var(--application-app-surface-muted)]">
                    {t(`caseStudy.${id}.items.${itemId}.description`)}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section className="mt-12" aria-labelledby="kepco-contributions-title">
          <h3
            id="kepco-contributions-title"
            className="text-lg font-semibold text-[var(--application-app-surface-text)]"
          >
            {t("contributions.title")}
          </h3>
          <p className="mt-3 text-[length:var(--application-text-body)] leading-7 text-[var(--application-app-surface-muted)]">
            {t("contributions.description")}
          </p>
          <ul className="mt-7 grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {contributionIds.map((id) => (
              <li
                key={id}
                className="border-t border-[var(--application-border)] pt-4"
              >
                <h4 className="font-semibold text-[var(--application-app-surface-text)]">
                  {t(`contributions.items.${id}.title`)}
                </h4>
                <p className="mt-2 text-[length:var(--application-text-body)] leading-7 text-[var(--application-app-surface-muted)]">
                  {t(`contributions.items.${id}.description`)}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12" aria-labelledby="kepco-verification-title">
          <h3
            id="kepco-verification-title"
            className="text-lg font-semibold text-[var(--application-app-surface-text)]"
          >
            {t("verification.title")}
          </h3>
          <p className="mt-3 text-[length:var(--application-text-body)] leading-7 text-[var(--application-app-surface-muted)]">
            {t("verification.description")}
          </p>
          <ul className="mt-7 grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {verificationIds.map((id) => (
              <li
                key={id}
                className="border-t border-[var(--application-border)] pt-4"
              >
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

        <section className="mt-12" aria-labelledby="kepco-flow-title">
          <h3
            id="kepco-flow-title"
            className="text-lg font-semibold text-[var(--application-app-surface-text)]"
          >
            {t("flow.title")}
          </h3>
          <p className="mt-3 text-[length:var(--application-text-body)] leading-7 text-[var(--application-app-surface-muted)]">
            {t("flow.description")}
          </p>
          <figure className="mt-5 bg-white py-2">
            <Image
              src="/diagrams/kepco-advisor-frontend-flow.svg"
              alt={t("flow.alt")}
              width={1400}
              height={700}
              className="h-auto w-full"
              unoptimized
            />
            <figcaption className="mt-3 text-sm leading-6 text-[var(--application-app-surface-muted)]">
              {t("flow.caption")}
            </figcaption>
          </figure>
        </section>
      </article>
    </div>
  );
}
