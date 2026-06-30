"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { createOpenAppCommand } from "@/features/gui/registry/appTypes";
import { useGuiNavigation } from "@/features/gui/navigation/GuiNavigationProvider";
import { useGuiStore } from "@/features/gui/store/GuiStoreProvider";
import { useDraggableAppItem } from "@/features/gui/components/useDraggableAppItem";
import { orderedProjectSummaries } from "@/shared/content/portfolio/projectSummaries";
import Image from "next/image";

/** File renderer inside Project folder **/
type ProjectSummary = (typeof orderedProjectSummaries)[number];

function DraggableProjectFile({
  project,
  language,
  selected,
  gridRef,
  onSelect,
}: {
  project: ProjectSummary;
  language: "ko" | "en";
  selected: boolean;
  gridRef: RefObject<HTMLUListElement | null>;
  onSelect: () => void;
}) {
  const { navigate, navigationBusy } = useGuiNavigation();
  const content = project.content[language];
  const appId = `project:${project.slug}` as const;
  const openProject = () => navigate(createOpenAppCommand(appId));
  const {
    ref,
    offset,
    isDragging,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  } = useDraggableAppItem({
    boundsRef: gridRef,
    onOpen: openProject,
    onSelect,
  });

  return (
    <li>
      <button
        ref={ref}
        type="button"
        disabled={navigationBusy}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onLostPointerCapture={handlePointerUp}
        onClick={(event) => {
          if (event.detail === 0) openProject();
        }}
        onDoubleClick={openProject}
        className="gui-project-card"
        data-selected={selected}
        aria-label={`${content.title} ${
          language === "ko" ? "프로젝트 열기" : "open project"
        }`}
        style={{
          position: "relative",
          zIndex: isDragging || selected ? 1 : undefined,
          transform: `translate(${offset.x}px, ${offset.y}px)`,
          cursor: isDragging ? "grabbing" : "pointer",
          touchAction: "none",
        }}
      >
        <span className="gui-project-icon" aria-hidden="true">
          <Image
            src={content.fileIcon}
            fill
            alt={`${content.title} 파일 아이콘`}
          />
          <span>md</span>
        </span>
        <strong title={content.title}>{content.title}</strong>
      </button>
    </li>
  );
}

export default function ProjectsApp() {
  const language = useGuiStore((state) => state.language);
  const itemLabel = language === "ko" ? "개 항목" : "items";
  const gridRef = useRef<HTMLUListElement>(null);
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const clearSelectionOutsideProject = (event: PointerEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".gui-project-card")) {
        setSelectedProjectSlug(null);
      }
    };

    window.addEventListener("pointerdown", clearSelectionOutsideProject);
    return () =>
      window.removeEventListener("pointerdown", clearSelectionOutsideProject);
  }, []);

  return (
    <section
      aria-label={language === "ko" ? "프로젝트 폴더" : "Projects folder"}
      className="gui-projects gui-folder-view"
    >
      <ul ref={gridRef} className="gui-project-grid" role="list">
        {orderedProjectSummaries.map((project) => (
          <DraggableProjectFile
            key={project.slug}
            project={project}
            language={language}
            selected={selectedProjectSlug === project.slug}
            gridRef={gridRef}
            onSelect={() => setSelectedProjectSlug(project.slug)}
          />
        ))}
      </ul>
      <footer className="gui-folder-footer">
        {orderedProjectSummaries.length} {itemLabel}
      </footer>
    </section>
  );
}
