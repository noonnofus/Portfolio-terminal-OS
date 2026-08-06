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
    id: "problem",
    itemIds: ["administration", "conversation", "extension"],
  },
  {
    id: "design",
    itemIds: ["informationArchitecture", "stateBoundary", "streaming", "qualityFoundation"],
  },
  {
    id: "implementation",
    itemIds: ["chatExperience", "responseFlow", "accessibility", "responsive"],
  },
  {
    id: "outcome",
    itemIds: ["newProduct", "extensionPath", "qualityBaseline"],
  },
  {
    id: "verification",
    itemIds: ["accessibility", "streaming"],
  },
] as const;


export default function OptigenApp({ language }: OptigenAppProps) {
  const { t } = useTranslation("Optigen");
  const diagram = `flowchart LR
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
  const sections = caseStudySections.map(({ id, itemIds }) => ({
    id,
    title: t(`caseStudy.${id}.title`),
    description: t(`caseStudy.${id}.description`),
    items: itemIds.map((itemId) => ({
      id: itemId,
      title: t(`caseStudy.${id}.items.${itemId}.title`),
      description: t(`caseStudy.${id}.items.${itemId}.description`),
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
