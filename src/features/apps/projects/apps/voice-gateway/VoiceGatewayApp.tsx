"use client";

import { useTranslation } from "react-i18next";
import { projectManifest } from "@/shared/content/portfolio/projectManifest";
import type { Language } from "@/shared/i18n/language";
import {
  ProjectCaseStudyPage,
  type ProjectCaseStudySection,
} from "../../components/ProjectCaseStudyPage";
import { escapeMermaidLabel } from "../../components/ProjectArchitectureDiagram";

type VoiceGatewayAppProps = {
  language: Language;
};

const projectContextIds = ["category", "service", "flow", "role"] as const;
const caseStudySections = [
  {
    id: "problem",
    itemIds: ["realtimeAudio", "sessionConsistency", "vendorDifferences"],
  },
  {
    id: "design",
    itemIds: ["gatewayBoundary", "sessionModel", "providerAdapter"],
  },
  {
    id: "implementation",
    itemIds: ["twilio", "audioPipeline", "callControls", "providerIntegration"],
  },
  {
    id: "outcome",
    itemIds: ["voiceExtension", "providerFlexibility", "stableFlow"],
  },
] as const;

export default function VoiceGatewayApp({
  language,
}: VoiceGatewayAppProps) {
  const { t } = useTranslation("VoiceGateway");
  const diagram = `flowchart LR
    phone(["${escapeMermaidLabel(t("architecture.diagram.phone"))}"]) <-->|"${escapeMermaidLabel(t("architecture.diagram.call"))}"| twilio["${escapeMermaidLabel(t("architecture.diagram.twilio"))}"]
    twilio <-->|"${escapeMermaidLabel(t("architecture.diagram.audioStream"))}"| vg["${escapeMermaidLabel(t("architecture.diagram.gateway"))}"]
    vg -->|"${escapeMermaidLabel(t("architecture.diagram.voiceInput"))}"| stt["${escapeMermaidLabel(t("architecture.diagram.stt"))}"]
    stt -->|"${escapeMermaidLabel(t("architecture.diagram.text"))}"| ai["${escapeMermaidLabel(t("architecture.diagram.ai"))}"]
    ai -->|"${escapeMermaidLabel(t("architecture.diagram.response"))}"| tts["${escapeMermaidLabel(t("architecture.diagram.tts"))}"]
    tts -->|"${escapeMermaidLabel(t("architecture.diagram.voiceOutput"))}"| vg
    providers["${escapeMermaidLabel(t("architecture.diagram.providers"))}"] -. "${escapeMermaidLabel(t("architecture.diagram.adapter"))}" .-> stt
    providers -. "${escapeMermaidLabel(t("architecture.diagram.adapter"))}" .-> tts

    classDef primary fill:#e8f1ff,stroke:#2563eb,stroke-width:3px,color:#111827,font-weight:bold
    classDef extension fill:#f0fdf4,stroke:#16a34a,stroke-width:2px,color:#14532d
    classDef support fill:#f3f4f6,stroke:#9ca3af,stroke-width:1.5px,color:#374151
    classDef actor fill:#ffffff,stroke:#cbd5e1,stroke-width:1.5px,color:#475569
    class vg primary
    class twilio,stt,tts extension
    class ai,providers support
    class phone actor`;

  const contexts = projectContextIds.map((id) => ({
    id,
    label: t(`projectContext.${id}.label`),
    description: t(`projectContext.${id}.description`),
  }));
  const sections: ProjectCaseStudySection[] = caseStudySections.map(
    ({ id, itemIds }) => ({
      id,
      title: t(`caseStudy.${id}.title`),
      description: t(`caseStudy.${id}.description`),
      items: itemIds.map((itemId) => ({
        id: itemId,
        title: t(`caseStudy.${id}.items.${itemId}.title`),
        description: t(`caseStudy.${id}.items.${itemId}.description`),
      })),
    }),
  );

  return (
    <ProjectCaseStudyPage
      projectId="voice-gateway"
      language={language}
      title={t("title")}
      summary={t("summary")}
      stackLabel={t("stackLabel")}
      stack={projectManifest["voice-gateway"].stack}
      overviewTitle={t("projectIntro.title")}
      overviewDescription={t("projectIntro.description")}
      contexts={contexts}
      sections={sections}
      architecture={{
        title: t("architecture.title"),
        description: t("architecture.description"),
        chart: diagram,
        label: t("architecture.alt"),
        caption: t("architecture.caption"),
        loadingLabel: t("architecture.loading"),
        errorLabel: t("architecture.error"),
      }}
    />
  );
}
