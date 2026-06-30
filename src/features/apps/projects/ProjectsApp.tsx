"use client";

import { FileText } from "lucide-react";
import { createOpenAppCommand } from "@/features/gui/registry/appTypes";
import { useGuiNavigation } from "@/features/gui/navigation/GuiNavigationProvider";
import { useGuiStore } from "@/features/gui/store/GuiStoreProvider";
import { orderedProjectSummaries } from "@/shared/content/portfolio/projectSummaries";

/** File renderer inside Project folder **/
export default function ProjectsApp() {
  const language = useGuiStore((state) => state.language);
  const { navigate, navigationBusy } = useGuiNavigation();
  const itemLabel = language === "ko" ? "개 항목" : "items";

  return (
    <section
      aria-label={language === "ko" ? "프로젝트 폴더" : "Projects folder"}
      className="gui-projects gui-folder-view"
    >
      <ul className="gui-project-grid" role="list">
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
                className="gui-project-card"
                aria-label={`${content.title} ${
                  language === "ko" ? "프로젝트 열기" : "open project"
                }`}
              >
                <span className="gui-project-icon" aria-hidden="true">
                  <FileText />
                  <span>md</span>
                </span>
                <strong title={content.title}>{content.title}</strong>
              </button>
            </li>
          );
        })}
      </ul>
      <footer className="gui-folder-footer">
        {orderedProjectSummaries.length} {itemLabel}
      </footer>
    </section>
  );
}
