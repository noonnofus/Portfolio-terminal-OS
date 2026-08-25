"use client";

import { useTranslation } from "react-i18next";
import { projectManifest } from "@/shared/content/portfolio/projectManifest";
import type { Language } from "@/shared/i18n/language";
import {
  ProjectCaseStudyPage,
  type ProjectCaseStudySection,
} from "../../components/ProjectCaseStudyPage";
import { escapeMermaidLabel } from "../../components/ProjectArchitectureDiagram";

type McpAppProps = {
  language: Language;
};

const projectContextIds = ["category", "service", "flow", "role"] as const;
const caseStudySections = [
  {
    id: "performance",
    items: [
      { id: "longAudio", phase: "problem" },
      { id: "chunkBoundary", phase: "process" },
      { id: "parallelPipeline", phase: "process" },
      { id: "measuredResult", phase: "result" },
    ],
    isProblemSolving: true,
  },
  {
    id: "progressProtocol",
    items: [
      { id: "rootCause", phase: "problem" },
      { id: "sessionBoundary", phase: "process" },
      { id: "eventContract", phase: "process" },
      { id: "uiState", phase: "process" },
      { id: "verification", phase: "result" },
    ],
    isProblemSolving: true,
  },
  {
    id: "implementation",
    items: [
      { id: "apiTools" },
      { id: "meetingMinutes" },
      { id: "streaming" },
      { id: "errorBoundary" },
    ],
  },
] as const;

export default function McpApp({ language }: McpAppProps) {
  const { t } = useTranslation("Mcp");
  const diagram = `flowchart TB
    user(["${escapeMermaidLabel(t("architecture.diagram.user"))}"]) --> chat["${escapeMermaidLabel(t("architecture.diagram.chat"))}"]
    chat <-->|"${escapeMermaidLabel(t("architecture.diagram.conversation"))}"| ai["${escapeMermaidLabel(t("architecture.diagram.ai"))}"]
    ai -->|"${escapeMermaidLabel(t("architecture.diagram.toolCall"))}"| mcp["${escapeMermaidLabel(t("architecture.diagram.mcp"))}"]
    mcp -->|"${escapeMermaidLabel(t("architecture.diagram.apiRequest"))}"| api["${escapeMermaidLabel(t("architecture.diagram.businessApi"))}"]
    mcp -->|"${escapeMermaidLabel(t("architecture.diagram.asyncStart"))}"| job["${escapeMermaidLabel(t("architecture.diagram.longJob"))}"]
    job -. "${escapeMermaidLabel(t("architecture.diagram.progress"))}" .-> chat

    classDef primary fill:#e8f1ff,stroke:#2563eb,stroke-width:3px,color:#111827,font-weight:bold
    classDef support fill:#f3f4f6,stroke:#9ca3af,stroke-width:1.5px,color:#374151
    classDef actor fill:#ffffff,stroke:#cbd5e1,stroke-width:1.5px,color:#475569
    class mcp primary
    class chat,ai,api,job support
    class user actor`;

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
      projectId="mcp"
      language={language}
      title={t("title")}
      summary={t("summary")}
      stackLabel={t("stackLabel")}
      stack={projectManifest.mcp.stack}
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
