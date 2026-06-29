"use client";

import { FileText } from "lucide-react";
import { createOpenAppCommand } from "@/features/gui-v2/apps/appTypes";
import { useGuiNavigation } from "@/features/gui-v2/navigation/GuiNavigationProvider";
import { useGuiV2Store } from "@/features/gui-v2/store/GuiV2StoreProvider";
import { orderedProjectSummaries } from "@/shared/content/portfolio/projectSummaries";

export default function ProjectsAppV2() {
    const language = useGuiV2Store((state) => state.language);
    const { navigate, navigationBusy } = useGuiNavigation();
    const itemLabel = language === "ko" ? "개 항목" : "items";

    return (
        <section
            aria-label={language === "ko" ? "프로젝트 폴더" : "Projects folder"}
            className="gui-v2-projects gui-v2-folder-view"
        >
            <ul className="gui-v2-project-grid" role="list">
                {orderedProjectSummaries.map((project) => {
                    const content = project.content[language];
                    const appId = `project:${project.slug}` as const;

                    return (
                        <li key={project.slug}>
                            <button
                                type="button"
                                disabled={navigationBusy}
                                onDoubleClick={() => navigate(createOpenAppCommand(appId))}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter" || event.key === " ") {
                                        event.preventDefault();
                                        navigate(createOpenAppCommand(appId));
                                    }
                                }}
                                className="gui-v2-project-card"
                                aria-label={`${content.title} ${
                                    language === "ko" ? "프로젝트 열기" : "open project"
                                }`}
                            >
                                <span className="gui-v2-project-icon" aria-hidden="true">
                                    <FileText />
                                    <span>md</span>
                                </span>
                                <strong title={content.title}>{content.title}</strong>
                            </button>
                        </li>
                    );
                })}
            </ul>
            <footer className="gui-v2-folder-footer">
                {orderedProjectSummaries.length} {itemLabel}
            </footer>
        </section>
    );
}
