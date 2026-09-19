"use client";

import type { Language } from "@/lib/i18n/language";
import { projectManifest } from "@/features/portfolio/content/projectManifest";
import { getWchmsProjectContent } from "@/features/portfolio/content/projectDetails/wchms";
import { ProjectCaseStudyPage } from "@/features/portfolio/components/ProjectCaseStudyPage";
import styles from "@/features/portfolio/components/ProjectContent.module.css";

type WchmsAppProps = { language: Language };

export default function WchmsApp({ language }: WchmsAppProps) {
  const { page, walkthrough } = getWchmsProjectContent(language);

  return (
    <ProjectCaseStudyPage
      {...page}
      projectId="wchms"
      language={language}
      stack={projectManifest.wchms.stack}
    >
      <section className={styles.supportingSection} aria-labelledby="wchms-walkthrough-title">
        <h3 id="wchms-walkthrough-title" className={`${styles.sectionTitle} font-semibold text-[var(--application-app-surface-text)]`}>
          {walkthrough.title}
        </h3>
        <p className={`${styles.supportingText} mt-3 text-[var(--application-app-surface-muted)]`}>
          {walkthrough.description}
        </p>
        <video className="mt-5 aspect-video w-full" controls preload="metadata">
          <source src="/videos/wchms-walkthrough.mp4" type="video/mp4" />
          {walkthrough.unsupported}
        </video>
      </section>
    </ProjectCaseStudyPage>
  );
}
