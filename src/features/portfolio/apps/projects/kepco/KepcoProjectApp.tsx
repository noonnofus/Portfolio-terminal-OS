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
    polling["${escapeMermaidLabel(flow.diagram.polling)}"] --> callState["${escapeMermaidLabel(flow.diagram.callState)}"]
    callState -->|"${escapeMermaidLabel(flow.diagram.live)}"| stream["${escapeMermaidLabel(flow.diagram.stream)}"]
    stream --> reducer["${escapeMermaidLabel(flow.diagram.reducer)}"]
    reducer --> ui["${escapeMermaidLabel(flow.diagram.ui)}"]
    reducer --> terminal["${escapeMermaidLabel(flow.diagram.terminal)}"]

    classDef source fill:#e8f1ff,stroke:#2563eb,stroke-width:2px,color:#172554
    classDef state fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#064e3b
    classDef presentation fill:#fff7ed,stroke:#ea580c,stroke-width:2px,color:#7c2d12
    classDef terminalState fill:#faf5ff,stroke:#9333ea,stroke-width:2px,color:#581c87
    class polling source
    class callState,stream,reducer state
    class ui presentation
    class terminal terminalState`;

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
      }}
    />
  );
}
