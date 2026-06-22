"use client";

import Image from "next/image";
import { createOpenAppCommand } from "@/features/gui-v2/apps/appTypes";
import { useGuiNavigation } from "@/features/gui-v2/navigation/GuiNavigationProvider";
import { useGuiV2Store } from "@/features/gui-v2/store/GuiV2StoreProvider";
import { orderedProjectSummaries } from "@/shared/content/portfolio/projectSummaries";

export default function ProjectsAppV2() {
    const language = useGuiV2Store((state) => state.language);
    const { navigate, navigationBusy } = useGuiNavigation();

    return (
        <section
            aria-labelledby="projects-v2-heading"
            className="gui-v2-projects"
        >
            <header className="gui-v2-projects-header">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Portfolio
                </p>
                <h3
                    id="projects-v2-heading"
                    className="mt-1 text-2xl font-semibold"
                >
                    {language === "ko" ? "프로젝트" : "Projects"}
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    {language === "ko"
                        ? "각 프로젝트는 독립된 창으로 열립니다. 여러 프로젝트를 나란히 열어 비교할 수 있습니다."
                        : "Each project opens in an independent window, so multiple projects can remain available for comparison."}
                </p>
            </header>

            <ul className="gui-v2-project-grid">
                {orderedProjectSummaries.map((project) => {
                    const content = project.content[language];
                    const appId = `project:${project.slug}` as const;

                    return (
                        <li key={project.slug}>
                            <button
                                type="button"
                                disabled={navigationBusy}
                                onClick={() =>
                                    navigate(
                                        createOpenAppCommand(appId),
                                    )
                                }
                                className="gui-v2-project-card"
                                aria-label={`${content.title} ${
                                    language === "ko"
                                        ? "프로젝트 열기"
                                        : "open project"
                                }`}
                            >
                                <span className="gui-v2-project-icon">
                                    <Image
                                        src={project.icon}
                                        alt=""
                                        width={64}
                                        height={64}
                                        sizes="64px"
                                        className="h-16 w-16 object-contain"
                                    />
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="flex flex-wrap items-center gap-2">
                                        <strong className="text-base">
                                            {content.title}
                                        </strong>
                                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
                                            {content.kind}
                                        </span>
                                    </span>
                                    <span className="mt-2 block text-sm leading-6 text-slate-600">
                                        {content.summary}
                                    </span>
                                    <span
                                        aria-label={
                                            language === "ko"
                                                ? "기술 스택"
                                                : "Technology stack"
                                        }
                                        className="mt-3 flex flex-wrap gap-1.5"
                                    >
                                        {project.stack.map((technology) => (
                                            <span
                                                key={technology}
                                                className="rounded bg-slate-900 px-2 py-1 text-[11px] text-white"
                                            >
                                                {technology}
                                            </span>
                                        ))}
                                    </span>
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
