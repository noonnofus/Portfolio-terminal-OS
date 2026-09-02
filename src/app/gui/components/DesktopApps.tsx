"use client";

import { DirectorySurface } from "@/app/gui/components/directory/DirectorySurface";
import { desktopDirectory } from "@/app/gui/components/directory/directoryTree";

export function DesktopApps() {
  return (
    <DirectorySurface
      windowId="projects"
      directory={desktopDirectory}
      variant="desktop"
    />
  );
}
