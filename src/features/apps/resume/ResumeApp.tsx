"use client";

import { useTranslation } from "react-i18next";
import type { GuiAppComponentProps } from "@/features/gui/registry/appTypes";
import { getPortfolioContent } from "@/shared/content/portfolio/getPortfolioContent";

export default function ResumeApp({
    language,
}: GuiAppComponentProps<"resume">) {
    const content = getPortfolioContent(language);
    const { t } = useTranslation("Resume");

    return (
        <article
            aria-labelledby="resume-heading"
            className="application-resume"
        >
            <header className="application-resume-hero">
                <div>
                    <p className="text-sm font-medium text-slate-500">
                        {content.profile.location}
                    </p>
                    <h3
                        id="resume-heading"
                        className="mt-1 text-4xl font-bold tracking-tight"
                    >
                        {content.profile.name}
                    </h3>
                    <p className="mt-2 text-lg font-medium text-blue-700">
                        {content.profile.role}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => window.print()}
                    className="application-resume-print-action"
                >
                    {t("print")}
                </button>
                <div className="mt-5 max-w-3xl space-y-2 text-sm leading-6 text-slate-700">
                    {content.profile.summary.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                    ))}
                </div>
            </header>

            <div className="application-resume-layout">
                <div className="space-y-8">
                    <section aria-labelledby="resume-experience">
                        <h4
                            id="resume-experience"
                            className="application-resume-section-title"
                        >
                            {t("experience")}
                        </h4>
                        <div className="mt-4 space-y-5">
                            {content.experience.map((experience) => (
                                <article
                                    key={experience.title}
                                    className="application-resume-block"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-2">
                                        <div>
                                            <h5 className="font-semibold">
                                                {experience.title}
                                            </h5>
                                            <p className="text-sm text-slate-600">
                                                {experience.role}
                                            </p>
                                        </div>
                                        <span className="text-xs font-medium text-slate-500">
                                            {experience.period}
                                        </span>
                                    </div>
                                    <div className="mt-4 space-y-4">
                                        {experience.highlights.map((highlight) => (
                                            <section key={highlight.title}>
                                                <h6 className="text-sm font-semibold">
                                                    {highlight.title}
                                                </h6>
                                                <ul className="mt-1.5 list-disc space-y-1.5 pl-5 text-sm leading-6 text-slate-700">
                                                    {highlight.items.map((item) => (
                                                        <li key={item}>{item}</li>
                                                    ))}
                                                </ul>
                                            </section>
                                        ))}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section aria-labelledby="resume-projects">
                        <h4
                            id="resume-projects"
                            className="application-resume-section-title"
                        >
                            {t("projects")}
                        </h4>
                        <div className="mt-4 grid gap-3">
                            {content.projects.map((project) => (
                                <article
                                    key={project.slug}
                                    className="application-resume-block"
                                >
                                    <h5 className="font-semibold">
                                        {project.title}
                                    </h5>
                                    <p className="mt-1 text-sm leading-6 text-slate-700">
                                        {project.summary}
                                    </p>
                                    <p className="mt-2 text-xs text-slate-500">
                                        {project.stack.join(", ")}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </section>
                </div>

                <aside className="space-y-8">
                    <section aria-labelledby="resume-skills">
                        <h4
                            id="resume-skills"
                            className="application-resume-section-title"
                        >
                            {t("skills")}
                        </h4>
                        <dl className="mt-4 space-y-4">
                            {content.skills.map((group) => (
                                <div key={group.label}>
                                    <dt className="text-sm font-semibold">
                                        {group.label}
                                    </dt>
                                    <dd className="mt-1 text-sm leading-6 text-slate-600">
                                        {group.items.join(", ")}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </section>

                    <section aria-labelledby="resume-education">
                        <h4
                            id="resume-education"
                            className="application-resume-section-title"
                        >
                            {t("education")}
                        </h4>
                        <div className="mt-4 space-y-3">
                            {content.education.map((education) => (
                                <article key={education.institution}>
                                    <h5 className="text-sm font-semibold">
                                        {education.institution}
                                    </h5>
                                    <p className="mt-1 text-sm text-slate-600">
                                        {education.program}
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500">
                                        {education.period}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section aria-labelledby="resume-contact">
                        <h4
                            id="resume-contact"
                            className="application-resume-section-title"
                        >
                            {t("contact")}
                        </h4>
                        <address className="mt-4 space-y-2 text-sm not-italic">
                            <a
                                href={`mailto:${content.contact.email}`}
                                className="application-resume-link"
                            >
                                {content.contact.email}
                            </a>
                            <a
                                href={content.contact.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="application-resume-link"
                            >
                                github.com/noonnofus
                            </a>
                            <a
                                href={content.contact.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="application-resume-link"
                            >
                                linkedin.com/in/kevin-hyun-ho-kim
                            </a>
                        </address>
                    </section>
                </aside>
            </div>
        </article>
    );
}
