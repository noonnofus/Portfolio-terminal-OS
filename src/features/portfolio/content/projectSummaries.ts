import { projectManifest } from "@/features/portfolio/content/projectManifest";

export const projectSummaries = Object.values(projectManifest);

export const orderedProjectSummaries = projectSummaries.toSorted(
  (left, right) => left.order - right.order,
);
