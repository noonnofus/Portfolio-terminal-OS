"use client";

import type { Language } from "@/lib/i18n/language";
import { projectManifest } from "@/features/portfolio/content/projectManifest";
import { getKepcoProjectContent } from "@/features/portfolio/content/projectDetails/kepco";
import { ProjectCaseStudyPage } from "@/features/portfolio/components/ProjectCaseStudyPage";
import { escapeMermaidLabel } from "@/features/portfolio/components/ProjectArchitectureDiagram";

type KepcoAppProps = {
  language: Language;
};

export default function KepcoApp({ language }: KepcoAppProps) {
  const { page, flow } = getKepcoProjectContent(language);
  const diagram = `flowchart TB
    subgraph before["${escapeMermaidLabel(flow.diagram.before)}"]
      direction LR
      signal["${escapeMermaidLabel(flow.diagram.signal)}"] --> repeatedRefresh["${escapeMermaidLabel(flow.diagram.repeatedRefresh)}"] --> race["${escapeMermaidLabel(flow.diagram.race)}"]
    end

    decision["${escapeMermaidLabel(flow.diagram.decision)}"]

    subgraph after["${escapeMermaidLabel(flow.diagram.after)}"]
      direction LR
      tabs["${escapeMermaidLabel(flow.diagram.tabs)}"] --> ownerRefresh["${escapeMermaidLabel(flow.diagram.ownerRefresh)}"] --> broadcast["${escapeMermaidLabel(flow.diagram.broadcast)}"] --> adopt["${escapeMermaidLabel(flow.diagram.adopt)}"]
    end

    before --> decision --> after

    classDef problem fill:#fff1f2,stroke:#e11d48,stroke-width:2px,color:#881337
    classDef pivot fill:#fff7ed,stroke:#ea580c,stroke-width:2px,color:#7c2d12
    classDef owner fill:#e8f1ff,stroke:#2563eb,stroke-width:2px,color:#172554
    classDef shared fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#064e3b
    class signal,repeatedRefresh,race problem
    class decision pivot
    class tabs,ownerRefresh owner
    class broadcast,adopt shared`;

  return (
    <ProjectCaseStudyPage
      {...page}
      projectId="kepco"
      language={language}
      stack={projectManifest.kepco.stack}
      architecture={{
        title: flow.title,
        description: flow.description,
        chart: diagram,
        label: flow.alt,
        caption: flow.caption,
        loadingLabel: flow.loading,
        errorLabel: flow.error,
        sectionId: "multiTabAuth",
        wide: true,
        scrollable: true,
        scrollLabel: flow.scrollLabel,
      }}
    />
  );
}
