"use client";

import type { Language } from "@/lib/i18n/language";
import { projectManifest } from "@/features/portfolio/content/projectManifest";
import { getVoiceGatewayProjectContent } from "@/features/portfolio/content/projectDetails/voiceGateway";
import { ProjectCaseStudyPage } from "@/features/portfolio/components/ProjectCaseStudyPage";
import { escapeMermaidLabel } from "@/features/portfolio/components/ProjectArchitectureDiagram";

type VoiceGatewayAppProps = { language: Language };

export default function VoiceGatewayApp({ language }: VoiceGatewayAppProps) {
  const { page, architecture } = getVoiceGatewayProjectContent(language);
  const diagram = `flowchart TB
    phone(["${escapeMermaidLabel(architecture.diagram.phone)}"]) <-->|"${escapeMermaidLabel(architecture.diagram.call)}"| pbx["${escapeMermaidLabel(architecture.diagram.pbx)}"]
    pbx <-->|"${escapeMermaidLabel(architecture.diagram.audioStream)}"| worker["${escapeMermaidLabel(architecture.diagram.worker)}"]
    worker --> factory["${escapeMermaidLabel(architecture.diagram.factory)}"]
    factory --> transport["${escapeMermaidLabel(architecture.diagram.transport)}"]
    transport --> strategy["${escapeMermaidLabel(architecture.diagram.strategy)}"]
    transport --> codec["${escapeMermaidLabel(architecture.diagram.codec)}"]
    strategy --> providers["${escapeMermaidLabel(architecture.diagram.providers)}"]
    codec --> providers

    classDef primary fill:#e8f1ff,stroke:#2563eb,stroke-width:3px,color:#111827,font-weight:bold
    classDef extension fill:#f0fdf4,stroke:#16a34a,stroke-width:2px,color:#14532d
    classDef support fill:#f3f4f6,stroke:#9ca3af,stroke-width:1.5px,color:#374151
    classDef actor fill:#ffffff,stroke:#cbd5e1,stroke-width:1.5px,color:#475569
    class worker primary
    class transport,factory extension
    class pbx,strategy,codec,providers support
    class phone actor`;

  return (
    <ProjectCaseStudyPage
      {...page}
      projectId="voice-gateway"
      language={language}
      stack={projectManifest["voice-gateway"].stack}
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
