"use client";

import Image from "next/image";
import { appMetadata } from "@/features/gui/registry/appMetadata";
import {
  isProjectAppId,
  type GuiAppId,
} from "@/features/gui/registry/appTypes";

type CoreAppId = Exclude<GuiAppId, `project:${string}`>;

const coreIcons: Record<CoreAppId, (size: number) => React.ReactNode> = {
  about: (s) => (
    <Image
      src="/icons/about.png"
      alt="나에 대해서"
      width={s}
      height={s}
      className="w-full h-full object-contain"
    />
  ),
  projects: (s) => (
    <Image
      src="/icons/folder.png"
      alt="프로젝트_폴더"
      width={s}
      height={s}
      className="w-full h-full object-contain"
      loading="eager"
    />
  ),
  resume: (s) => (
    <Image
      src="/icons/pdf_file.png"
      alt="이력서"
      width={s}
      height={s}
      className="w-full h-full object-contain"
    />
  ),
  terminal: (s) => (
    <Image
      src="/icons/iterm2.png"
      alt="터미널"
      width={s}
      height={s}
      className="w-full h-full object-contain"
    />
  ),
  contact: (s) => (
    <Image
      src="/icons/contact.png"
      alt="연락처"
      width={s}
      height={s}
      className="w-full h-full object-contain"
    />
  ),
  notes: (s) => (
    <Image
      src="/icons/note.png"
      alt="노트"
      width={s}
      height={s}
      className="w-full h-full object-contain"
    />
  ),
  settings: (s) => (
    <Image
      src="/icons/settings.png"
      alt="세팅"
      width={s}
      height={s}
      className="w-full h-full object-contain"
    />
  ),
};

export function GuiAppIcon({
  appId,
  size = "dock",
}: {
  appId: GuiAppId;
  size?: "dock" | "desktop" | "project";
}) {
  const iconSize = size === "desktop" ? 30 : size === "project" ? 38 : 24;

  if (isProjectAppId(appId)) {
    return (
      <span
        className="gui-app-icon"
        data-app-icon={appId}
        data-size={size}
        aria-hidden="true"
      >
        <Image
          src={appMetadata[appId].icon}
          alt=""
          width={iconSize}
          height={iconSize}
          className="gui-app-icon-image"
        />
      </span>
    );
  }

  return (
    <span
      className="gui-app-icon"
      data-app-icon={appId}
      data-size={size}
      aria-hidden="true"
    >
      {coreIcons[appId](iconSize)}
    </span>
  );
}
