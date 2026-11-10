import { projectManifest } from "@/features/portfolio/content/projectManifest";
import { projectDocuments } from "@/features/portfolio/content/projectDocuments";
import { readProjectDocument } from "@/features/portfolio/content/projectMetadata";

export const projectSummaries = Object.values(projectManifest).map((project) => ({
  ...project,
  stack: readProjectDocument(projectDocuments[project.slug].ko).metadata.stack,
}));

const enabledProjects = projectSummaries.filter((project) => project.enabled);

export const enabledProjectSlugs = enabledProjects.map((project) => project.slug);

export const orderedProjectSummaries = enabledProjects.toSorted(
  (left, right) => left.order - right.order,
);
