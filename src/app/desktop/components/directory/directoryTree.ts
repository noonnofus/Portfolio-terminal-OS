import { appCatalog } from "@/app/desktop/config/appCatalog";
import { orderedProjectSummaries } from "@/features/portfolio/content/projectSummaries";
import {
  defineFileNode,
  defineFolderNode,
} from "@/app/desktop/components/directory/directoryTypes";
import type {
  DirectoryFolderNode,
  DirectoryNode,
} from "@/app/desktop/components/directory/directoryTypes";
import type { FolderAppId } from "@/app/desktop/types/appTypes";

const notesNode = defineFileNode({
  kind: "file",
  nodeId: "desktop:notes",
  appId: appCatalog.notes.appId,
  appearance: "document",
});

export const projectsDirectory = defineFolderNode({
  kind: "folder",
  nodeId: "desktop:folder:projects",
  appId: appCatalog.projects.appId,
  appearance: "folder",
  children: orderedProjectSummaries.map(({ slug }) =>
    defineFileNode({
      kind: "file",
      nodeId: `desktop:project:${slug}`,
      appId: appCatalog[`project:${slug}`].appId,
      appearance: "document",
    }),
  ),
});

export const desktopDirectory: DirectoryFolderNode = {
  kind: "folder",
  nodeId: "desktop:root",
  appId: appCatalog.projects.appId,
  appearance: "folder",
  children: [
    projectsDirectory,
    defineFileNode({
      kind: "file",
      nodeId: "desktop:resume",
      appId: "resume",
      appearance: "document",
    }),
    notesNode,
  ],
};

function findDirectory(
  nodes: readonly DirectoryNode[],
  appId: FolderAppId,
): DirectoryFolderNode | null {
  for (const node of nodes) {
    if (node.kind !== "folder") continue;
    const children = node.children;
    if (node.appId === appId) return node;
    const nested = findDirectory(children, appId);
    if (nested !== null) return nested;
  }
  return null;
}

export function findDirectoryByAppId(
  appId: FolderAppId,
): DirectoryFolderNode | null {
  return findDirectory(desktopDirectory.children, appId);
}

export function collectFolderAppIds(
  nodes: readonly DirectoryNode[] = desktopDirectory.children,
): FolderAppId[] {
  return nodes.flatMap((node) =>
    node.kind === "folder"
      ? [node.appId, ...collectFolderAppIds(node.children)]
      : [],
  );
}
