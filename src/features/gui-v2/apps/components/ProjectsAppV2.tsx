"use client";

import { createOpenAppCommand } from "@/features/gui-v2/apps/appTypes";
import { GuiAppIcon } from "@/features/gui-v2/components/GuiAppIcon";
import { useGuiNavigation } from "@/features/gui-v2/navigation/GuiNavigationProvider";
import { useGuiV2Store } from "@/features/gui-v2/store/GuiV2StoreProvider";
import { orderedProjectSummaries } from "@/shared/content/portfolio/projectSummaries";

export default function ProjectsAppV2() {
    const language = useGuiV2Store((state) => state.language);
    const { navigate, navigationBusy } = useGuiNavigation();

    return (
        <section
            aria-labelledby="projects-v2-heading"
            aria-label={language === "ko" ? "프로젝트 폴더" : "Projects folder"}
            className="gui-v2-projects gui-v2-folder-view"
        >
            <header className="gui-v2-projects-header">
                <p className="gui-v2-folder-path">
                    <GuiAppIcon appId="projects" size="dock" />
                    <span>Portfolio</span>
                    <span aria-hidden="true">/</span>
                    <strong id="projects-v2-heading">
                        {language === "ko" ? "프로젝트" : "Projects"}
                    </strong>
                </p>
                <p className="gui-v2-folder-description">
                    {language === "ko"
                        ? "프로젝트 파일을 선택하면 각각 독립된 창으로 열립니다."
                        : "Select a project file to open it in an independent window."}
                </p>
            </header>

            <ul className="gui-v2-project-grid" role="list">
                {orderedProjectSummaries.map((project) => {
                    const content = project.content[language];
                    const appId = `project:${project.slug}` as const;

                    return (
                        <li key={project.slug}>
                            <button
                                type="button"
                                disabled={navigationBusy}
                                onClick={() => navigate(createOpenAppCommand(appId))}
                                className="gui-v2-project-card"
                                aria-label={`${content.title} ${
                                    language === "ko" ? "프로젝트 열기" : "open project"
                                }`}
                            >
                                <span className="gui-v2-project-icon">
                                    <GuiAppIcon appId={appId} size="project" />
                                </span>
                                <strong>{content.title}</strong>
                                <span className="gui-v2-project-kind">{content.kind}</span>
                                <span className="gui-v2-project-summary">{content.summary}</span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
