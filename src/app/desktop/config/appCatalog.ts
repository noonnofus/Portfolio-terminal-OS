import { defineAppConfig } from "@/app/desktop/lib/defineAppConfig";
import { publicAssetPath, type AppConfigMap, type DesktopAppId } from "@/app/desktop/types/appTypes";
import { isProjectEnabled } from "@/features/portfolio/content/projectManifest";

const PROJECT_WINDOW_SIZE = { width: 960, height: 720 };

// Set enabled to false to hide a Desktop app in both languages. Rebuild for production.
// Project visibility is configured in projectManifest.ts.
const about = defineAppConfig({ appId: "about", enabled: true, url: { app: "about" }, titleKey: "appNames.about", icon: publicAssetPath("/icons/optimized/about.png"), order: 10, dock: { visible: true, order: 10 }, window: { width: 820, height: 640 } });
const projects = defineAppConfig({ appId: "projects", enabled: true, url: { app: "projects" }, titleKey: "appNames.projects", icon: publicAssetPath("/icons/optimized/folder.png"), order: 20, dock: { visible: true, order: 20 }, window: { width: 700, height: 450 } });
const resume = defineAppConfig({ appId: "resume", enabled: false, url: { app: "resume" }, titleKey: "appNames.resume", icon: publicAssetPath("/icons/optimized/pdf_file.png"), order: 30, dock: { visible: true, order: 30 }, window: { width: 850, height: 680 } });
const terminal = defineAppConfig({ appId: "terminal", enabled: true, url: { app: "terminal" }, titleKey: "appNames.terminal", icon: publicAssetPath("/icons/optimized/iterm2.png"), order: 40, dock: { visible: true, order: 40 }, window: { width: 800, height: 530 } });
const contact = defineAppConfig({ appId: "contact", enabled: true, url: { app: "contact" }, titleKey: "appNames.contact", icon: publicAssetPath("/icons/optimized/contact.png"), order: 50, dock: { visible: true, order: 50 }, window: { width: 600, height: 370 } });
const notes = defineAppConfig({ appId: "notes", enabled: true, url: { app: "notes" }, titleKey: "appNames.notes", icon: publicAssetPath("/icons/optimized/note.png"), order: 55, dock: { visible: true, order: 55 }, window: { width: 640, height: 560 } });
const settings = defineAppConfig({ appId: "settings", enabled: true, url: { app: "settings" }, titleKey: "appNames.settings", icon: publicAssetPath("/icons/optimized/settings.png"), order: 60, dock: { visible: true, order: 60 }, window: { width: 740, height: 610 } });
const portfolio = defineAppConfig({ appId: "project:portfolio", enabled: isProjectEnabled("portfolio"), url: { app: "project", slug: "portfolio" }, titleKey: "appNames.portfolio", icon: publicAssetPath("/icons/optimized/document.png"), order: 100, window: { ...PROJECT_WINDOW_SIZE } });
const optigen = defineAppConfig({ appId: "project:optigen", enabled: isProjectEnabled("optigen"), url: { app: "project", slug: "optigen" }, titleKey: "appNames.optigen", icon: publicAssetPath("/icons/optimized/document.png"), order: 102, window: { ...PROJECT_WINDOW_SIZE } });
const mcp = defineAppConfig({ appId: "project:mcp", enabled: isProjectEnabled("mcp"), url: { app: "project", slug: "mcp" }, titleKey: "appNames.mcp", icon: publicAssetPath("/icons/optimized/document.png"), order: 103, window: { ...PROJECT_WINDOW_SIZE } });
const voiceGateway = defineAppConfig({ appId: "project:voice-gateway", enabled: isProjectEnabled("voice-gateway"), url: { app: "project", slug: "voice-gateway" }, titleKey: "appNames.voice-gateway", icon: publicAssetPath("/icons/optimized/document.png"), order: 104, window: { ...PROJECT_WINDOW_SIZE } });
const kepco = defineAppConfig({ appId: "project:kepco", enabled: isProjectEnabled("kepco"), url: { app: "project", slug: "kepco" }, titleKey: "appNames.kepco", icon: publicAssetPath("/icons/optimized/document.png"), order: 105, window: { ...PROJECT_WINDOW_SIZE } });
const wchms = defineAppConfig({ appId: "project:wchms", enabled: isProjectEnabled("wchms"), url: { app: "project", slug: "wchms" }, titleKey: "appNames.wchms", icon: publicAssetPath("/icons/optimized/document.png"), order: 110, window: { ...PROJECT_WINDOW_SIZE } });
const flare = defineAppConfig({ appId: "project:flare", enabled: isProjectEnabled("flare"), url: { app: "project", slug: "flare" }, titleKey: "appNames.flare", icon: publicAssetPath("/icons/optimized/document.png"), order: 120, window: { ...PROJECT_WINDOW_SIZE } });

export const appCatalog = {
  about, projects, resume, terminal, contact, notes, settings,
  "project:portfolio": portfolio, "project:optigen": optigen, "project:mcp": mcp,
  "project:voice-gateway": voiceGateway, "project:kepco": kepco,
  "project:wchms": wchms, "project:flare": flare,
} satisfies AppConfigMap;

export const appCatalogKeys = Object.keys(appCatalog).sort();

export function isAppEnabled(appId: DesktopAppId): boolean {
  return appCatalog[appId].enabled;
}

export function resolveEnabledAppId(appId: DesktopAppId): DesktopAppId | null {
  if (isAppEnabled(appId)) return appId;
  return appCatalog[appId].url.app === "project" && isAppEnabled("projects")
    ? "projects"
    : null;
}
