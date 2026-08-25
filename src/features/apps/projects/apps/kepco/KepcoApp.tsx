"use client";

import { useTranslation } from "react-i18next";
import type { Language } from "@/shared/i18n/language";
import { projectManifest } from "@/shared/content/portfolio/projectManifest";
import { ProjectCaseStudyPage } from "../../components/ProjectCaseStudyPage";
import { escapeMermaidLabel } from "../../components/ProjectArchitectureDiagram";

type KepcoAppProps = {
  language: Language;
};

const projectContextIds = ["category", "service", "users", "role"] as const;
const caseStudySections = [
  {
    id: "sttRecovery",
    items: [
      { id: "problem", phase: "problem" },
      { id: "errorPolicy", phase: "process" },
      { id: "authRecovery", phase: "process" },
      { id: "scrollOwnership", phase: "process" },
      { id: "verification", phase: "result" },
    ],
    isProblemSolving: true,
  },
  {
    id: "contributions",
    items: [
      { id: "consultation" },
      { id: "history" },
      { id: "roles" },
      { id: "resilience" },
    ],
  },
  {
    id: "verification",
    items: [
      { id: "stateTransition" },
      { id: "eventConsistency" },
      { id: "recovery" },
    ],
  },
] as const;

export default function KepcoApp({ language }: KepcoAppProps) {
  const { t } = useTranslation("Kepco");
  const diagram = `flowchart TB
    polling["${escapeMermaidLabel(t("flow.diagram.polling"))}"] --> callState["${escapeMermaidLabel(t("flow.diagram.callState"))}"]
    callState -->|"${escapeMermaidLabel(t("flow.diagram.live"))}"| stream["${escapeMermaidLabel(t("flow.diagram.stream"))}"]
    stream --> reducer["${escapeMermaidLabel(t("flow.diagram.reducer"))}"]
    reducer --> ui["${escapeMermaidLabel(t("flow.diagram.ui"))}"]
    reducer --> terminal["${escapeMermaidLabel(t("flow.diagram.terminal"))}"]

    classDef source fill:#e8f1ff,stroke:#2563eb,stroke-width:2px,color:#172554
    classDef state fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#064e3b
    classDef presentation fill:#fff7ed,stroke:#ea580c,stroke-width:2px,color:#7c2d12
    classDef terminalState fill:#faf5ff,stroke:#9333ea,stroke-width:2px,color:#581c87
    class polling source
    class callState,stream,reducer state
    class ui presentation
    class terminal terminalState`;

  const contexts = projectContextIds.map((id) => ({
    id,
    label: t(`projectContext.${id}.label`),
    description: t(`projectContext.${id}.description`),
  }));
  const sections = caseStudySections.map(({ id, items, ...section }) => {
    const translationRoot =
      id === "contributions" || id === "verification"
        ? id
        : `caseStudy.${id}`;

    return {
      id,
      title: t(`${translationRoot}.title`),
      description: t(`${translationRoot}.description`),
      isProblemSolving: "isProblemSolving" in section,
      items: items.map((item) => ({
        ...item,
        title: t(`${translationRoot}.items.${item.id}.title`),
        description: t(`${translationRoot}.items.${item.id}.description`),
      })),
    };
  });

  return (
    <ProjectCaseStudyPage
      projectId="kepco"
      language={language}
      title={t("title")}
      summary={t("summary")}
      stackLabel={t("stackLabel")}
      stack={projectManifest.kepco.stack}
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
        title: t("flow.title"),
        description: t("flow.description"),
        chart: diagram,
        label: t("flow.alt"),
        caption: t("flow.caption"),
        loadingLabel: t("flow.loading"),
        errorLabel: t("flow.error"),
      }}
    />
  );
}
