"use client";

import type { Language } from "@/lib/i18n/language";
import { projectManifest } from "@/features/portfolio/content/projectManifest";
import { getFlareProjectContent } from "@/features/portfolio/content/projectDetails/flare";
import { ProjectCaseStudyPage } from "@/features/portfolio/components/ProjectCaseStudyPage";
import styles from "@/features/portfolio/components/ProjectContent.module.css";

type FlareAppProps = { language: Language };

export default function FlareApp({ language }: FlareAppProps) {
  const { page, walkthrough } = getFlareProjectContent(language);

  return (
    <ProjectCaseStudyPage
      {...page}
      projectId="flare"
      language={language}
      stack={projectManifest.flare.stack}
    >
      <section className={styles.supportingSection} aria-labelledby="flare-walkthrough-title">
        <h3 id="flare-walkthrough-title" className={`${styles.sectionTitle} font-semibold text-[var(--application-app-surface-text)]`}>
          {walkthrough.title}
        </h3>
        <p className={`${styles.supportingText} mt-3 text-[var(--application-app-surface-muted)]`}>
          {walkthrough.description}
        </p>
        <div className="mt-5 grid gap-5">
          <video className="aspect-video w-full" controls preload="metadata">
            <source src="/videos/flare-walkthrough-web.mp4" type="video/mp4" />
            {walkthrough.unsupported}
          </video>
          <video className="aspect-video w-full" controls preload="metadata">
            <source src="/videos/flare-walkthrough-app.mp4" type="video/mp4" />
            {walkthrough.unsupported}
          </video>
        </div>
      </section>
    </ProjectCaseStudyPage>
  );
}
