import type {
  FolderAppId,
  DesktopAppId,
  LeafAppId,
} from "@/app/desktop/types/appTypes";

export type DirectoryNodeId = `desktop:${string}`;

export type DirectoryFileNode<K extends LeafAppId = LeafAppId> = {
  kind: "file";
  nodeId: DirectoryNodeId;
  appId: K;
  appearance: "application" | "document";
};

export type DirectoryFolderNode<K extends FolderAppId = FolderAppId> = {
  kind: "folder";
  nodeId: DirectoryNodeId;
  appId: K;
  appearance: "folder";
  children: readonly DirectoryNode[];
};

export type DirectoryNode = DirectoryFileNode | DirectoryFolderNode;

export function defineFileNode<K extends LeafAppId>(
  node: DirectoryFileNode<K>,
): DirectoryFileNode<K> {
  return node;
}

export function defineFolderNode<K extends FolderAppId>(
  node: DirectoryFolderNode<K>,
): DirectoryFolderNode<K> {
  return node;
}

export function isFolderNode(
  node: DirectoryNode,
): node is DirectoryFolderNode {
  return node.kind === "folder";
}

export function nodeAppId(node: DirectoryNode): DesktopAppId {
  return node.appId;
}
