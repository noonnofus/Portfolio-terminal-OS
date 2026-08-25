"use client";

import { useId, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { Component, Route, ShieldCheck } from "lucide-react";
import StackIcon from "@/shared/components/StackIcon";
import { getPortfolioContent } from "@/shared/content/portfolio/getPortfolioContent";
import { useTranslation } from "react-i18next";
import type { Language } from "@/shared/i18n/language";

interface AboutAppProps {
    language: Language;
}

const technologyGroups = [
    {
        id: "frontend",
        items: [
            { label: "JavaScript (ES6+)", src: "/tech-icons/javascript.svg" },
            { label: "TypeScript", src: "/tech-icons/typescript.svg" },
            {
                label: "React",
                src: "/tech-icons/react-light.svg",
                darkSrc: "/tech-icons/react-dark.svg",
            },
            {
                label: "Next.js",
                src: "/tech-icons/nextjs.svg",
                invertOnDark: true,
            },
            { label: "HTML5", src: "/tech-icons/html5.svg" },
            { label: "CSS3", src: "/tech-icons/css3.svg" },
            { label: "React Router", src: "/tech-icons/react-router.svg" },
        ],
    },
    {
        id: "stateAndApi",
        items: [
            { label: "TanStack Query", src: "/tech-icons/tanstack-query.svg" },
            { label: "Zustand", src: "/tech-icons/zustand.svg" },
            {
                label: "Context API",
                src: "/tech-icons/react-light.svg",
                darkSrc: "/tech-icons/react-dark.svg",
            },
            { label: "Axios", src: "/tech-icons/axios.svg" },
            { label: "Zod", src: "/tech-icons/zod.svg" },
        ],
    },
    {
        id: "uiAndDesign",
        items: [
            { label: "Tailwind CSS", src: "/tech-icons/tailwindcss.svg" },
            {
                label: "shadcn/ui",
                src: "/tech-icons/shadcn-ui.svg",
                invertOnDark: true,
            },
            { label: "Figma", src: "/tech-icons/figma.svg" },
        ],
    },
    {
        id: "infra",
        items: [
            { label: "PostgreSQL", src: "/tech-icons/postgresql.svg" },
            {
                label: "MySQL",
                src: "/tech-icons/mysql-light.svg",
                darkSrc: "/tech-icons/mysql-dark.svg",
            },
            { label: "AWS", src: "/tech-icons/aws.svg" },
            { label: "Docker", src: "/tech-icons/docker.svg" },
            {
                label: "Vercel",
                src: "/tech-icons/vercel-light.svg",
                darkSrc: "/tech-icons/vercel-dark.svg",
            },
            { label: "Netlify", src: "/tech-icons/netlify.svg" },
            { label: "Render", src: "/tech-icons/render.svg" },
        ],
    },
    {
        id: "toolingAndQuality",
        items: [
            { label: "ESLint", src: "/tech-icons/eslint.svg" },
            { label: "Prettier", src: "/tech-icons/prettier.svg" },
            { label: "npm", src: "/tech-icons/npm.svg" },
            { label: "Postman", src: "/tech-icons/postman.svg" },
            { label: "Swagger", src: "/tech-icons/swagger.svg" },
        ],
    },
    {
        id: "collaboration",
        items: [
            { label: "Git", src: "/tech-icons/git.svg" },
            {
                label: "GitHub",
                src: "/tech-icons/github.svg",
                invertOnDark: true,
            },
            { label: "Jira", src: "/tech-icons/jira.svg" },
            { label: "Confluence", src: "/tech-icons/confluence.svg" },
            {
                label: "Notion",
                src: "/tech-icons/notion.svg",
                invertOnDark: true,
            },
        ],
    },
] as const;

type TechnologyGroupId = (typeof technologyGroups)[number]["id"];

export default function AboutApp({ language }: AboutAppProps) {
    const { t } = useTranslation(["About", "common"], { lng: language });
    const content = getPortfolioContent(language);
    const [activeTechnologyGroupId, setActiveTechnologyGroupId] =
        useState<TechnologyGroupId>("frontend");
    const technologyPanelId = useId();
    const activeTechnologyGroup =
        technologyGroups.find(
            (group) => group.id === activeTechnologyGroupId,
        ) ?? technologyGroups[0];
    const handleTechnologyTabKeyDown = (
        event: KeyboardEvent<HTMLButtonElement>,
    ) => {
        const currentIndex = technologyGroups.findIndex(
            (group) => group.id === activeTechnologyGroupId,
        );
        const lastIndex = technologyGroups.length - 1;
        const nextIndex =
            event.key === "ArrowRight"
                ? (currentIndex + 1) % technologyGroups.length
                : event.key === "ArrowLeft"
                  ? (currentIndex - 1 + technologyGroups.length) %
                    technologyGroups.length
                  : event.key === "Home"
                    ? 0
                    : event.key === "End"
                      ? lastIndex
                      : null;

        if (nextIndex === null) return;

        const nextGroup = technologyGroups[nextIndex];
        if (nextGroup === undefined) return;

        event.preventDefault();
        setActiveTechnologyGroupId(nextGroup.id);
        document.getElementById(`about-stack-tab-${nextGroup.id}`)?.focus();
    };

    return (
        <div className="application-app-surface h-full w-full overflow-y-auto">
            <article className="mx-auto w-full max-w-4xl px-5 py-8 md:px-10 md:py-12">
                <header className="border-b border-[var(--application-border)] pb-8 md:pb-10">
                    <p className="text-[length:var(--application-text-caption)] font-semibold uppercase tracking-[0.16em] text-[var(--application-accent-text)]">
                        {t("eyebrow")}
                    </p>
                    <h2 className="mt-3 font-bold text-3xl tracking-tight text-[var(--application-app-surface-text)] md:text-4xl">
                        {t("title")}
                    </h2>
                    <div className="mt-5 max-w-2xl space-y-2 text-[length:var(--application-text-reading)] leading-[1.6] text-[var(--application-app-surface-muted)]">
                        {content.profile.summary.map((paragraph, index) => (
                            <p
                                key={paragraph}
                                className={
                                    index === 0
                                        ? "font-medium text-[var(--application-app-surface-text)]"
                                        : undefined
                                }
                            >
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </header>

                <section
                    className="border-b border-[var(--application-border)] py-8 md:py-10"
                    aria-labelledby="about-journey-title"
                >
                    <h3
                        id="about-journey-title"
                        className="text-2xl font-semibold tracking-tight text-[var(--application-app-surface-text)]"
                    >
                        {t("careerTimelineTitle")}
                    </h3>
                    <ol className="mt-8 space-y-10 md:space-y-12">
                        {content.experience.map((experience) => (
                            <li
                                key={experience.title}
                                className="grid gap-2 md:grid-cols-[9.5rem_1fr] md:gap-8"
                            >
                                <div className="flex flex-col items-start gap-2 pt-1 md:block">
                                    {experience.logo ? (
                                        <div
                                            aria-hidden="true"
                                            className="w-32 shrink-0 md:mb-3"
                                        >
                                            <Image
                                                src={experience.logo}
                                                alt=""
                                                width={238}
                                                height={34}
                                                className="h-auto w-full"
                                            />
                                        </div>
                                    ) : null}
                                    <p className="text-[length:var(--application-text-caption)] font-semibold tabular-nums tracking-[0.02em] text-[var(--application-app-surface-muted)]">
                                        {experience.period}
                                    </p>
                                </div>
                                <div className="min-w-0 text-left">
                                    <h4 className="text-2xl font-semibold tracking-tight text-[var(--application-app-surface-text)]">
                                        {experience.title}
                                    </h4>
                                    <p className="mt-1 text-[length:var(--application-text-body)] font-medium text-[var(--application-app-surface-muted)]">
                                        {experience.role}
                                    </p>
                                    <div className="mt-6 space-y-8 text-left">
                                        {experience.highlights.map(
                                            (highlight) => (
                                                <section key={highlight.title}>
                                                    <h5 className="text-base font-semibold text-[var(--application-app-surface-text)]">
                                                        {highlight.title}
                                                    </h5>
                                                    <ul className="m-0 mt-3 list-none space-y-3 p-0">
                                                        {highlight.items.map(
                                                            (item) => (
                                                                <li
                                                                    key={item}
                                                                    className="relative pl-3 text-[length:var(--application-text-reading)] leading-7 text-[var(--application-app-surface-muted)] before:absolute before:left-0 before:top-[0.65em] before:size-1.5 before:rounded-full before:bg-[var(--application-app-surface-text)]"
                                                                >
                                                                    {item}
                                                                </li>
                                                            ),
                                                        )}
                                                    </ul>
                                                </section>
                                            ),
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                        {content.education.map((education) => (
                            <li
                                key={education.institution}
                                className="grid gap-2 md:grid-cols-[9.5rem_1fr] md:gap-8"
                            >
                                <div className="flex flex-col items-start gap-2 pt-1 md:block">
                                    {education.logo ? (
                                        <div
                                            aria-hidden="true"
                                            className="w-32 shrink-0 md:mb-3"
                                        >
                                            <Image
                                                src={education.logo}
                                                alt=""
                                                width={250}
                                                height={120}
                                                className="h-auto w-full"
                                            />
                                        </div>
                                    ) : null}
                                    <p className="text-[length:var(--application-text-caption)] font-semibold tabular-nums tracking-[0.02em] text-[var(--application-app-surface-muted)]">
                                        {education.period}
                                    </p>
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-2xl font-semibold tracking-tight text-[var(--application-app-surface-text)]">
                                        {education.institution}
                                    </h4>
                                    <p className="mt-1 text-[length:var(--application-text-body)] leading-6 text-[var(--application-app-surface-muted)]">
                                        {education.program}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </section>

                <section
                    className="border-b border-[var(--application-border)] py-8 md:py-10"
                    aria-labelledby="about-focus-title"
                >
                    <div className="flex flex-col gap-2">
                        <p className="text-[length:var(--application-text-caption)] font-semibold uppercase tracking-[0.14em] text-[var(--application-app-surface-muted)]">
                            {t("frontendFocusEyebrow")}
                        </p>
                        <h3
                            id="about-focus-title"
                            className="text-2xl font-semibold tracking-tight text-[var(--application-app-surface-text)]"
                        >
                            {t("frontendFocusTitle")}
                        </h3>
                    </div>
                    <div className="mt-6 grid gap-5 md:grid-cols-3">
                        {[
                            {
                                icon: Component,
                                title: "uiArchitecture",
                                description: "uiArchitectureDescription",
                            },
                            {
                                icon: Route,
                                title: "stateData",
                                description: "stateDataDescription",
                            },
                            {
                                icon: ShieldCheck,
                                title: "quality",
                                description: "qualityDescription",
                            },
                        ].map(({ icon: Icon, title, description }) => (
                            <div
                                key={title}
                                className="border-l-2 border-[var(--application-accent)] pl-4"
                            >
                                <Icon
                                    aria-hidden="true"
                                    className="size-5 text-[var(--application-accent)]"
                                />
                                <h4 className="mt-3 font-semibold text-[var(--application-app-surface-text)]">
                                    {t(title)}
                                </h4>
                                <p className="mt-2 text-[length:var(--application-text-body)] leading-6 text-[var(--application-app-surface-muted)]">
                                    {t(description)}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <section
                    className="border-b border-[var(--application-border)] py-8 md:py-10"
                    aria-labelledby="about-stack-title"
                >
                    <div className="flex items-baseline justify-between gap-4">
                        <h3
                            id="about-stack-title"
                            className="text-2xl font-semibold tracking-tight text-[var(--application-app-surface-text)]"
                        >
                            {t("techStackTitle")}
                        </h3>
                    </div>

                    <div
                        aria-label={t("stackCategorySelector")}
                        className="mt-6 flex flex-wrap gap-2"
                        role="tablist"
                    >
                        {technologyGroups.map((group) => (
                            <button
                                key={group.id}
                                id={`about-stack-tab-${group.id}`}
                                aria-controls={technologyPanelId}
                                aria-selected={
                                    group.id === activeTechnologyGroup.id
                                }
                                className={`rounded-[var(--application-radius-panel)] border px-3 py-1.5 text-[length:var(--application-text-control)] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--application-accent)] ${
                                    group.id === activeTechnologyGroup.id
                                        ? "border-[var(--application-accent-strong)] bg-[var(--application-accent-strong)] text-white"
                                        : "border-[var(--application-border)] bg-transparent text-[var(--application-app-surface-text)] hover:bg-black/5 dark:hover:bg-white/10"
                                }`}
                                onClick={() =>
                                    setActiveTechnologyGroupId(group.id)
                                }
                                onKeyDown={handleTechnologyTabKeyDown}
                                role="tab"
                                tabIndex={
                                    group.id === activeTechnologyGroup.id
                                        ? 0
                                        : -1
                                }
                                type="button"
                            >
                                {t(group.id)}, {group.items.length}
                            </button>
                        ))}
                    </div>
                    <div
                        aria-labelledby={`about-stack-tab-${activeTechnologyGroup.id}`}
                        className="mt-6"
                        id={technologyPanelId}
                        role="tabpanel"
                    >
                        <h4 className="text-[length:var(--application-text-control)] font-semibold text-[var(--application-app-surface-text)]">
                            {t(activeTechnologyGroup.id)}
                        </h4>
                        <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                            {activeTechnologyGroup.items.map((item) => (
                                <StackIcon key={item.label} {...item} />
                            ))}
                        </div>
                    </div>
                </section>

            </article>
        </div>
    );
}
