"use client";

import { useId, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import StackIcon from "@/features/portfolio/components/StackIcon";
import { getPortfolioContent } from "@/features/portfolio/content/getPortfolioContent";
import { useTranslation } from "react-i18next";
import type { Language } from "@/lib/i18n/language";

interface AboutAppProps {
    language: Language;
}

const technologyGroups = [
    {
        id: "frontend",
        items: [
            { label: "JavaScript (ES6+)", src: "/tech-icons/javascript.png" },
            { label: "TypeScript", src: "/tech-icons/typescript.png" },
            {
                label: "React",
                src: "/tech-icons/react-light.png",
                darkSrc: "/tech-icons/react-dark.png",
            },
            {
                label: "Next.js",
                src: "/tech-icons/nextjs-official.png",
                invertOnDark: true,
            },
            { label: "HTML5", src: "/tech-icons/html5.png" },
            { label: "CSS3", src: "/tech-icons/css3.png" },
            { label: "React Router", src: "/tech-icons/react-router.png" },
        ],
    },
    {
        id: "stateAndApi",
        items: [
            { label: "TanStack Query", src: "/tech-icons/tanstack-query.png" },
            { label: "Zustand", src: "/tech-icons/zustand.png" },
            {
                label: "Context API",
                src: "/tech-icons/react-light.png",
                darkSrc: "/tech-icons/react-dark.png",
            },
            { label: "Axios", src: "/tech-icons/axios.png" },
            { label: "Zod", src: "/tech-icons/zod.png" },
        ],
    },
    {
        id: "uiAndDesign",
        items: [
            { label: "Tailwind CSS", src: "/tech-icons/tailwindcss.png" },
            {
                label: "shadcn/ui",
                src: "/tech-icons/shadcn-ui.png",
                invertOnDark: true,
            },
            { label: "Figma", src: "/tech-icons/figma.png" },
        ],
    },
    {
        id: "infra",
        items: [
            { label: "PostgreSQL", src: "/tech-icons/postgresql.png" },
            {
                label: "MySQL",
                src: "/tech-icons/mysql-light.png",
                darkSrc: "/tech-icons/mysql-dark.png",
            },
            { label: "AWS", src: "/tech-icons/aws.png" },
            { label: "Docker", src: "/tech-icons/docker.png" },
            {
                label: "Vercel",
                src: "/tech-icons/vercel-light.png",
                darkSrc: "/tech-icons/vercel-dark.png",
            },
            { label: "Netlify", src: "/tech-icons/netlify.png" },
            { label: "Render", src: "/tech-icons/render.png" },
        ],
    },
    {
        id: "toolingAndQuality",
        items: [
            { label: "ESLint", src: "/tech-icons/eslint.png" },
            { label: "Prettier", src: "/tech-icons/prettier.png" },
            { label: "npm", src: "/tech-icons/npm.png" },
            { label: "Postman", src: "/tech-icons/postman.png" },
            { label: "Swagger", src: "/tech-icons/swagger.png" },
        ],
    },
    {
        id: "collaboration",
        items: [
            { label: "Git", src: "/tech-icons/git.png" },
            {
                label: "GitHub",
                src: "/tech-icons/github.png",
                invertOnDark: true,
            },
            { label: "Jira", src: "/tech-icons/jira.png" },
            { label: "Confluence", src: "/tech-icons/confluence.png" },
            {
                label: "Notion",
                src: "/tech-icons/notion.png",
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
                                {t(group.id)} {group.items.length}
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
