"use client";

import type { Language } from "@/lib/i18n/language";
import { projectManifest } from "@/features/portfolio/content/projectManifest";
import { getMcpProjectContent } from "@/features/portfolio/content/projectDetails/mcp";
import { ProjectCaseStudyPage } from "@/features/portfolio/components/ProjectCaseStudyPage";
import { escapeMermaidLabel } from "@/features/portfolio/components/ProjectArchitectureDiagram";

type McpAppProps = { language: Language };

export default function McpApp({ language }: McpAppProps) {
  const { page, architecture } = getMcpProjectContent(language);
  const diagram = `flowchart TB
    user(["${escapeMermaidLabel(architecture.diagram.user)}"]) --> chat["${escapeMermaidLabel(architecture.diagram.chat)}"]
    chat <-->|"${escapeMermaidLabel(architecture.diagram.conversation)}"| ai["${escapeMermaidLabel(architecture.diagram.ai)}"]
    ai -->|"${escapeMermaidLabel(architecture.diagram.toolCall)}"| mcp["${escapeMermaidLabel(architecture.diagram.mcp)}"]
    mcp -->|"${escapeMermaidLabel(architecture.diagram.apiRequest)}"| api["${escapeMermaidLabel(architecture.diagram.businessApi)}"]
    mcp -->|"${escapeMermaidLabel(architecture.diagram.asyncStart)}"| job["${escapeMermaidLabel(architecture.diagram.longJob)}"]
    job -. "${escapeMermaidLabel(architecture.diagram.progress)}" .-> chat

    classDef primary fill:#e8f1ff,stroke:#2563eb,stroke-width:3px,color:#111827,font-weight:bold
    classDef support fill:#f3f4f6,stroke:#9ca3af,stroke-width:1.5px,color:#374151
    classDef actor fill:#ffffff,stroke:#cbd5e1,stroke-width:1.5px,color:#475569
    class mcp primary
    class chat,ai,api,job support
    class user actor`;

  return (
    <ProjectCaseStudyPage
      {...page}
      projectId="mcp"
      language={language}
      stack={projectManifest.mcp.stack}
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
