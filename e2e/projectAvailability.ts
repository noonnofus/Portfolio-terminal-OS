import { test } from "@playwright/test";
import { isProjectEnabled } from "../src/features/portfolio/content/projectManifest";
import { projectSlugs, type ProjectSlug } from "../src/features/portfolio/types/projectTypes";

export { isProjectEnabled };
export const enabledProjectSlugs = projectSlugs.filter(isProjectEnabled);

export function requireProjects(...slugs: ProjectSlug[]) {
  test.skip(slugs.some((slug) => !isProjectEnabled(slug)), "A required project is disabled.");
}
