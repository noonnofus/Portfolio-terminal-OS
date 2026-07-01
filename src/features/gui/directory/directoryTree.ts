import { projectsNode } from "@/features/apps/projects/app.config";
import { defineFileNode } from "@/features/gui/directory/directoryTypes";
import type {
  DesktopFolderNode,
  DesktopNode,
} from "@/features/gui/directory/directoryTypes";
import type { FolderAppId } from "@/features/gui/registry/appTypes";

export const projectsDirectory = projectsNode;

export const desktopDirectory: DesktopFolderNode = {
  kind: "folder",
  nodeId: "desktop:root",
  appId: "projects",
  appearance: "folder",
  children: [
    projectsDirectory,
    defineFileNode({
      kind: "file",
      nodeId: "desktop:resume",
      appId: "resume",
      appearance: "document",
    }),
  ],
};

function findDirectory(
  nodes: readonly DesktopNode[],
  appId: FolderAppId,
): DesktopFolderNode | null {
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
): DesktopFolderNode | null {
  return findDirectory(desktopDirectory.children, appId);
}

export function collectFolderAppIds(
  nodes: readonly DesktopNode[] = desktopDirectory.children,
): FolderAppId[] {
  return nodes.flatMap((node) =>
    node.kind === "folder"
      ? [node.appId, ...collectFolderAppIds(node.children)]
      : [],
  );
}
