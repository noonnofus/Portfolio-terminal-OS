import getProjectApplicationDefinitions from "@/features/applications/lib/getProjectApplicationDefinitions";
import { useDesktopStore } from "@/features/Desktop/store/useDesktopStore";
import { DesktopIcon } from "@/features/Desktop/components/DesktopIcon";
import { useRef } from "react";
import { useLanguageStore } from "@/shared/lib/i18n/useLanguageStore";

export default function AppFolder() {
  const focusApp = useDesktopStore((state) => state.focusApp);
  const desktopIconPositions = useDesktopStore(
    (state) => state.desktopIconPositions,
  );
  const isTouchDevice = useDesktopStore((state) => state.isTouchDevice);
  const setFocusApp = useDesktopStore((state) => state.setFocusApp);
  const setActiveApp = useDesktopStore((state) => state.setActiveApp);
  const setDesktopIconPosition = useDesktopStore(
    (state) => state.setDesktopIconPosition,
  );
  const language = useLanguageStore((state) => state.currentLanguage);

  const dragAreaRef = useRef<HTMLDivElement>(null);
  const getDefaultFolderIconPosition = (index: number) => ({
    left: 5 + (index % 4) * 80,
    top: Math.floor(index / 4) * 130,
  });

  return (
    <div
      className="w-full h-full grow overflow-scroll text-black rounded-pen-lg relative"
      ref={dragAreaRef}
    >
      <div className="h-full relative">
        {getProjectApplicationDefinitions(language).map((app, i) => (
          <div
            key={`folder-icon-${app.appName}-${
              (
                desktopIconPositions[app.appName] ??
                getDefaultFolderIconPosition(i)
              ).left
            }-${
              (
                desktopIconPositions[app.appName] ??
                getDefaultFolderIconPosition(i)
              ).top
            }`}
            style={{
              position: "absolute",
              left: (
                desktopIconPositions[app.appName] ??
                getDefaultFolderIconPosition(i)
              ).left,
              top: (
                desktopIconPositions[app.appName] ??
                getDefaultFolderIconPosition(i)
              ).top,
            }}
          >
            {isTouchDevice ? (
              <DesktopIcon
                dragConstraintRef={dragAreaRef}
                iconSrc={app.iconSrc}
                isFocused={focusApp === app.appName}
                onDragEnd={(info) => {
                  const currentPosition =
                    desktopIconPositions[app.appName] ??
                    getDefaultFolderIconPosition(i);

                  setDesktopIconPosition(app.appName, {
                    left: Math.round(currentPosition.left + info.offset.x),
                    top: Math.round(currentPosition.top + info.offset.y),
                  });
                }}
                onClick={() => {
                  setFocusApp(app.appName);
                  setActiveApp(app.appName);
                }}
                title={app.title}
              />
            ) : (
              <DesktopIcon
                dragConstraintRef={dragAreaRef}
                iconSrc={app.iconSrc}
                isFocused={focusApp === app.appName}
                onDragEnd={(info) => {
                  const currentPosition =
                    desktopIconPositions[app.appName] ??
                    getDefaultFolderIconPosition(i);

                  setDesktopIconPosition(app.appName, {
                    left: Math.round(currentPosition.left + info.offset.x),
                    top: Math.round(currentPosition.top + info.offset.y),
                  });
                }}
                onClick={() => {
                  setFocusApp(app.appName);
                }}
                onDoubleClick={() => {
                  setFocusApp(app.appName);
                  setActiveApp(app.appName);
                }}
                title={app.title}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
