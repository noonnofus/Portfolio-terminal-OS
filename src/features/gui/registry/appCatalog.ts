import { aboutAppConfig } from "@/features/apps/about/app.config";
import { contactAppConfig } from "@/features/apps/contact/app.config";
import { diceRollerAppConfig } from "@/features/apps/projects/apps/diceroller/app.config";
import { flareAppConfig } from "@/features/apps/projects/apps/flare/app.config";
import { mejuBotAppConfig } from "@/features/apps/projects/apps/mejubot/app.config";
import { pageSsenceAppConfig } from "@/features/apps/projects/apps/pagessence/app.config";
import { wchmsAppConfig } from "@/features/apps/projects/apps/wchms/app.config";
import { webPianoAppConfig } from "@/features/apps/projects/apps/webpiano/app.config";
import { weConnectAppConfig } from "@/features/apps/projects/apps/weconnect/app.config";
import { projectsAppConfig } from "@/features/apps/projects/app.config";
import { resumeAppConfig } from "@/features/apps/resume/app.config";
import { settingsAppConfig } from "@/features/apps/settings/app.config";
import { terminalAppConfig } from "@/features/apps/terminal/app.config";
import type { AppConfigMap } from "@/features/gui/registry/appTypes";

export const appCatalog = {
  about: aboutAppConfig,
  projects: projectsAppConfig,
  resume: resumeAppConfig,
  terminal: terminalAppConfig,
  contact: contactAppConfig,
  settings: settingsAppConfig,
  "project:wchms": wchmsAppConfig,
  "project:flare": flareAppConfig,
  "project:weconnect": weConnectAppConfig,
  "project:pagessence": pageSsenceAppConfig,
  "project:diceroller": diceRollerAppConfig,
  "project:mejubot": mejuBotAppConfig,
  "project:webpiano": webPianoAppConfig,
} satisfies AppConfigMap;

export const appCatalogKeys = Object.keys(appCatalog).sort();
