import { aboutAppConfig } from "@/features/apps/about/app.config";
import { contactAppConfig } from "@/features/apps/contact/app.config";
import { notesAppConfig } from "@/features/apps/notes/app.config";
import { flareAppConfig } from "@/features/apps/projects/apps/flare/app.config";
import { kepcoAppConfig } from "@/features/apps/projects/apps/kepco/app.config";
import { optigenAppConfig } from "@/features/apps/projects/apps/optigen/app.config";
import { portfolioAppConfig } from "@/features/apps/projects/apps/portfolio/app.config";
import { wchmsAppConfig } from "@/features/apps/projects/apps/wchms/app.config";
import { projectsAppConfig } from "@/features/apps/projects/app.config";
import { resumeAppConfig } from "@/features/apps/resume/app.config";
import { settingsAppConfig } from "@/features/apps/settings/app.config";
import { terminalAppConfig } from "@/features/apps/terminal/app.config";
import type { AppConfigMap } from "@/features/gui/registry/appTypes";

export const appMetadata = {
  about: aboutAppConfig,
  projects: projectsAppConfig,
  resume: resumeAppConfig,
  terminal: terminalAppConfig,
  contact: contactAppConfig,
  notes: notesAppConfig,
  settings: settingsAppConfig,
  "project:portfolio": portfolioAppConfig,
  "project:optigen": optigenAppConfig,
  "project:kepco": kepcoAppConfig,
  "project:wchms": wchmsAppConfig,
  "project:flare": flareAppConfig,
} satisfies AppConfigMap;

export const appMetadataKeys = Object.keys(appMetadata).sort();
