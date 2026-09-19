"use client";

import type { Language } from "@/lib/i18n/language";
import { projectManifest } from "@/features/portfolio/content/projectManifest";
import { getPortfolioProjectContent } from "@/features/portfolio/content/projectDetails/portfolio";
import { ProjectCaseStudyPage } from "@/features/portfolio/components/ProjectCaseStudyPage";
import { escapeMermaidLabel } from "@/features/portfolio/components/ProjectArchitectureDiagram";

type PortfolioAppProps = { language: Language };

export default function PortfolioApp({ language }: PortfolioAppProps) {
  const { page, architecture } = getPortfolioProjectContent(language);
  const diagram = `flowchart TB
    route["${escapeMermaidLabel(architecture.diagram.route)}"] --> client["${escapeMermaidLabel(architecture.diagram.client)}"]
    client --> shell["${escapeMermaidLabel(architecture.diagram.shell)}"]
    client --> store["${escapeMermaidLabel(architecture.diagram.store)}"]
    client --> navigation["${escapeMermaidLabel(architecture.diagram.navigation)}"]
    navigation --> planner["${escapeMermaidLabel(architecture.diagram.planner)}"]
    navigation --> history["${escapeMermaidLabel(architecture.diagram.history)}"]
    shell --> catalog["${escapeMermaidLabel(architecture.diagram.catalog)}"]
    catalog --> directory["${escapeMermaidLabel(architecture.diagram.directory)}"]
    shell --> renderer["${escapeMermaidLabel(architecture.diagram.renderer)}"]
    renderer --> loader["${escapeMermaidLabel(architecture.diagram.loader)}"]
    loader --> portfolio["${escapeMermaidLabel(architecture.diagram.portfolio)}"]
    loader --> terminal["${escapeMermaidLabel(architecture.diagram.terminal)}"]
    loader --> guestbook["${escapeMermaidLabel(architecture.diagram.guestbook)}"]
    loader --> settings["${escapeMermaidLabel(architecture.diagram.settings)}"]
    store --> shell

    classDef route fill:#ffffff,stroke:#94a3b8,stroke-width:1.5px,color:#334155
    classDef shell fill:#e8f1ff,stroke:#2563eb,stroke-width:3px,color:#111827,font-weight:bold
    classDef contract fill:#f3f4f6,stroke:#6b7280,stroke-width:1.5px,color:#374151
    classDef feature fill:#f0fdf4,stroke:#16a34a,stroke-width:2px,color:#14532d
    class route,client,history route
    class shell,store,navigation shell
    class planner,catalog,directory,renderer,loader contract
    class portfolio,terminal,guestbook,settings feature`;

  return (
    <ProjectCaseStudyPage
      {...page}
      projectId="portfolio"
      language={language}
      stack={projectManifest.portfolio.stack}
      architecture={{
        title: architecture.title,
        description: architecture.description,
        chart: diagram,
        label: architecture.alt,
        caption: architecture.caption,
        loadingLabel: architecture.loading,
        errorLabel: architecture.error,
        wide: true,
        scrollable: true,
        scrollLabel: architecture.scrollLabel,
      }}
    />
  );
}
