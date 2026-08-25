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
    id: "providerArchitecture",
    items: [
      { id: "coupling", phase: "problem" },
      { id: "contract", phase: "process" },
      { id: "factory", phase: "process" },
      { id: "strategyCodec", phase: "process" },
      { id: "verification", phase: "result" },
    ],
    isProblemSolving: true,
  },
  {
    id: "workerDecomposition",
    items: [
      { id: "oversizedContext", phase: "problem" },
      { id: "responsibilityBoundary", phase: "process" },
      { id: "callIsolation", phase: "process" },
      { id: "result", phase: "result" },
    ],
    isProblemSolving: true,
  },
  {
    id: "implementation",
    items: [
      { id: "twilio" },
      { id: "audioPipeline" },
      { id: "callControls" },
      { id: "providerIntegration" },
    ],
  },
] as const;

export default function VoiceGatewayApp({
  language,
}: VoiceGatewayAppProps) {
  const { t } = useTranslation("VoiceGateway");
  const diagram = `flowchart TB
    phone(["${escapeMermaidLabel(t("architecture.diagram.phone"))}"]) <-->|"${escapeMermaidLabel(t("architecture.diagram.call"))}"| pbx["${escapeMermaidLabel(t("architecture.diagram.pbx"))}"]
    pbx <-->|"${escapeMermaidLabel(t("architecture.diagram.audioStream"))}"| worker["${escapeMermaidLabel(t("architecture.diagram.worker"))}"]
    worker --> factory["${escapeMermaidLabel(t("architecture.diagram.factory"))}"]
    factory --> transport["${escapeMermaidLabel(t("architecture.diagram.transport"))}"]
    transport --> strategy["${escapeMermaidLabel(t("architecture.diagram.strategy"))}"]
    transport --> codec["${escapeMermaidLabel(t("architecture.diagram.codec"))}"]
    strategy --> providers["${escapeMermaidLabel(t("architecture.diagram.providers"))}"]
    codec --> providers

    classDef primary fill:#e8f1ff,stroke:#2563eb,stroke-width:3px,color:#111827,font-weight:bold
    classDef extension fill:#f0fdf4,stroke:#16a34a,stroke-width:2px,color:#14532d
    classDef support fill:#f3f4f6,stroke:#9ca3af,stroke-width:1.5px,color:#374151
    classDef actor fill:#ffffff,stroke:#cbd5e1,stroke-width:1.5px,color:#475569
    class worker primary
    class transport,factory extension
    class pbx,strategy,codec,providers support
    class phone actor`;

  const contexts = projectContextIds.map((id) => ({
    id,
    label: t(`projectContext.${id}.label`),
    description: t(`projectContext.${id}.description`),
  }));
  const sections: ProjectCaseStudySection[] = caseStudySections.map(
    ({ id, items, ...section }) => ({
      id,
      title: t(`caseStudy.${id}.title`),
      description: t(`caseStudy.${id}.description`),
      isProblemSolving: "isProblemSolving" in section,
      items: items.map((item) => ({
        ...item,
        title: t(`caseStudy.${id}.items.${item.id}.title`),
        description: t(`caseStudy.${id}.items.${item.id}.description`),
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
      keyOutcome={{
        label: t("keyOutcome.label"),
        value: t("keyOutcome.value"),
        description: t("keyOutcome.description"),
      }}
      sections={sections}
      problemSolvingLabel={t("problemSolvingLabel")}
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
