import { test } from "@playwright/test";
import { isProjectEnabled } from "../src/features/portfolio/content/projectManifest";
import { projectSlugs, type ProjectSlug } from "../src/features/portfolio/types/projectTypes";
import { isAppEnabled } from "../src/app/desktop/config/appCatalog";
import type { DesktopAppId } from "../src/app/desktop/types/appTypes";

export { isProjectEnabled };
export const enabledProjectSlugs = projectSlugs.filter(isProjectEnabled);

export function requireProjects(...slugs: ProjectSlug[]) {
  test.skip(slugs.some((slug) => !isProjectEnabled(slug)), "A required project is disabled.");
}

export function requireApps(...appIds: DesktopAppId[]) {
  test.skip(appIds.some((appId) => !isAppEnabled(appId)), "A required Desktop app is disabled.");
}
