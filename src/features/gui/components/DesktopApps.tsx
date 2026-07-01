"use client";

import { DirectorySurface } from "@/features/gui/directory/DirectorySurface";
import { desktopDirectory } from "@/features/gui/directory/directoryTree";

export function DesktopApps() {
  return (
    <DirectorySurface
      windowId="projects"
      directory={desktopDirectory}
      variant="desktop"
    />
  );
}
