"use client";

import { aboutAppLoader } from "@/features/apps/about/app.loader";
import { contactAppLoader } from "@/features/apps/contact/app.loader";
import { diceRollerAppLoader } from "@/features/apps/projects/apps/diceroller/app.loader";
import { flareAppLoader } from "@/features/apps/projects/apps/flare/app.loader";
import { mejuBotAppLoader } from "@/features/apps/projects/apps/mejubot/app.loader";
import { pageSsenceAppLoader } from "@/features/apps/projects/apps/pagessence/app.loader";
import { wchmsAppLoader } from "@/features/apps/projects/apps/wchms/app.loader";
import { webPianoAppLoader } from "@/features/apps/projects/apps/webpiano/app.loader";
import { weConnectAppLoader } from "@/features/apps/projects/apps/weconnect/app.loader";
import { resumeAppLoader } from "@/features/apps/resume/app.loader";
import { settingsAppLoader } from "@/features/apps/settings/app.loader";
import { terminalAppLoader } from "@/features/apps/terminal/app.loader";
import type { LeafAppLoaderMap } from "@/features/gui/registry/appTypes";

export const appLoaderRegistry = {
  about: aboutAppLoader,
  resume: resumeAppLoader,
  terminal: terminalAppLoader,
  contact: contactAppLoader,
  settings: settingsAppLoader,
  "project:wchms": wchmsAppLoader,
  "project:flare": flareAppLoader,
  "project:weconnect": weConnectAppLoader,
  "project:pagessence": pageSsenceAppLoader,
  "project:diceroller": diceRollerAppLoader,
  "project:mejubot": mejuBotAppLoader,
  "project:webpiano": webPianoAppLoader,
} satisfies LeafAppLoaderMap;

export const appLoaderRegistryKeys = Object.keys(appLoaderRegistry).sort();
