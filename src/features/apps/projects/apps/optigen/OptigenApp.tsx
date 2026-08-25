"use client";

import { useTranslation } from "react-i18next";
import type { Language } from "@/shared/i18n/language";
import { projectManifest } from "@/shared/content/portfolio/projectManifest";
import { ProjectCaseStudyPage } from "../../components/ProjectCaseStudyPage";
import { escapeMermaidLabel } from "../../components/ProjectArchitectureDiagram";

type OptigenAppProps = {
  language: Language;
};

const projectContextIds = ["category", "service", "users", "role"] as const;
const caseStudySections = [
  {
    id: "streamingLayout",
    items: [
      { id: "growingResponse", phase: "problem" },
      { id: "spacerLayout", phase: "process" },
      { id: "streamState", phase: "process" },
      { id: "readingPosition", phase: "result" },
    ],
    isProblemSolving: true,
  },
  {
    id: "implementation",
    items: [
      { id: "chatExperience" },
      { id: "responseFlow" },
      { id: "accessibility" },
      { id: "responsive" },
    ],
  },
  {
    id: "localStt",
    items: [
      { id: "workerBoundary" },
      { id: "fallback" },
      { id: "verification" },
    ],
  },
  {
    id: "verification",
    items: [{ id: "accessibility" }, { id: "streaming" }],
  },
] as const;


export default function OptigenApp({ language }: OptigenAppProps) {
  const { t } = useTranslation("Optigen");
  const diagram = `flowchart TB
    web(["${escapeMermaidLabel(t("architecture.diagram.webUser"))}"]) --> chat["${escapeMermaidLabel(t("architecture.diagram.chat"))}"]
    chat <-->|"${escapeMermaidLabel(t("architecture.diagram.requestResponse"))}"| api["${escapeMermaidLabel(t("architecture.diagram.api"))}"]
    api <-->|"${escapeMermaidLabel(t("architecture.diagram.orchestration"))}"| ai["${escapeMermaidLabel(t("architecture.diagram.ai"))}"]
    ai -. "${escapeMermaidLabel(t("architecture.diagram.toolExtension"))}" .-> mcp["${escapeMermaidLabel(t("architecture.diagram.mcp"))}"]
    phone(["${escapeMermaidLabel(t("architecture.diagram.phoneCall"))}"]) --> vg["${escapeMermaidLabel(t("architecture.diagram.vg"))}"]
    vg -. "${escapeMermaidLabel(t("architecture.diagram.voiceExtension"))}" .-> api

    classDef primary fill:#e8f1ff,stroke:#2563eb,stroke-width:3px,color:#111827,font-weight:bold
    classDef extension fill:#f0fdf4,stroke:#16a34a,stroke-width:2px,color:#14532d
    classDef support fill:#f3f4f6,stroke:#9ca3af,stroke-width:1.5px,color:#374151
    classDef actor fill:#ffffff,stroke:#cbd5e1,stroke-width:1.5px,color:#475569
    class chat primary
    class mcp,vg extension
    class api,ai support
    class web,phone actor`;

  const contexts = projectContextIds.map((id) => ({
    id,
    label: t(`projectContext.${id}.label`),
    description: t(`projectContext.${id}.description`),
  }));
  const sections = caseStudySections.map(({ id, items, ...section }) => ({
    id,
    title: t(`caseStudy.${id}.title`),
    description: t(`caseStudy.${id}.description`),
    isProblemSolving: "isProblemSolving" in section,
    items: items.map((item) => ({
      ...item,
      title: t(`caseStudy.${id}.items.${item.id}.title`),
      description: t(`caseStudy.${id}.items.${item.id}.description`),
    })),
  }));

  return (
    <ProjectCaseStudyPage
      projectId="optigen"
      language={language}
      title={t("title")}
      summary={t("summary")}
      stackLabel={t("stackLabel")}
      stack={projectManifest.optigen.stack}
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
