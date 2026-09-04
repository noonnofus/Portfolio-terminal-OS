"use client";

import type { Language } from "@/lib/i18n/language";
import { projectManifest } from "@/features/portfolio/content/projectManifest";
import { getOptigenProjectContent } from "@/features/portfolio/content/projectDetails/optigen";
import { ProjectCaseStudyPage } from "@/features/portfolio/components/ProjectCaseStudyPage";
import { escapeMermaidLabel } from "@/features/portfolio/components/ProjectArchitectureDiagram";

type OptigenAppProps = {
  language: Language;
};

export default function OptigenApp({ language }: OptigenAppProps) {
  const { page, architecture } = getOptigenProjectContent(language);
  const diagram = `flowchart TB
    web(["${escapeMermaidLabel(architecture.diagram.webUser)}"]) --> chat["${escapeMermaidLabel(architecture.diagram.chat)}"]
    chat <-->|"${escapeMermaidLabel(architecture.diagram.requestResponse)}"| api["${escapeMermaidLabel(architecture.diagram.api)}"]
    api <-->|"${escapeMermaidLabel(architecture.diagram.orchestration)}"| ai["${escapeMermaidLabel(architecture.diagram.ai)}"]
    ai -. "${escapeMermaidLabel(architecture.diagram.toolExtension)}" .-> mcp["${escapeMermaidLabel(architecture.diagram.mcp)}"]
    phone(["${escapeMermaidLabel(architecture.diagram.phoneCall)}"]) --> vg["${escapeMermaidLabel(architecture.diagram.vg)}"]
    vg -. "${escapeMermaidLabel(architecture.diagram.voiceExtension)}" .-> api

    classDef primary fill:#e8f1ff,stroke:#2563eb,stroke-width:3px,color:#111827,font-weight:bold
    classDef extension fill:#f0fdf4,stroke:#16a34a,stroke-width:2px,color:#14532d
    classDef support fill:#f3f4f6,stroke:#9ca3af,stroke-width:1.5px,color:#374151
    classDef actor fill:#ffffff,stroke:#cbd5e1,stroke-width:1.5px,color:#475569
    class chat primary
    class mcp,vg extension
    class api,ai support
    class web,phone actor`;

  return (
    <ProjectCaseStudyPage
      {...page}
      projectId="optigen"
      language={language}
      stack={projectManifest.optigen.stack}
      architecture={{
        title: architecture.title,
        description: architecture.description,
        chart: diagram,
        label: architecture.alt,
        caption: architecture.caption,
        loadingLabel: architecture.loading,
        errorLabel: architecture.error,
      }}
    />
  );
}
