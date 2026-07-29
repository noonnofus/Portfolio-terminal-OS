import { projectManifest } from "@/shared/content/portfolio/projectManifest";

export const projectSummaries = Object.values(projectManifest);

export const orderedProjectSummaries = projectSummaries.toSorted(
  (left, right) => left.order - right.order,
);
