"use client";

import { aboutAppLoader } from "@/features/apps/about/app.loader";
import { contactAppLoader } from "@/features/apps/contact/app.loader";
import { notesAppLoader } from "@/features/apps/notes/app.loader";
import { flareAppLoader } from "@/features/apps/projects/apps/flare/app.loader";
import { kepcoAppLoader } from "@/features/apps/projects/apps/kepco/app.loader";
import { mcpAppLoader } from "@/features/apps/projects/apps/mcp/app.loader";
import { optigenAppLoader } from "@/features/apps/projects/apps/optigen/app.loader";
import { voiceGatewayAppLoader } from "@/features/apps/projects/apps/voice-gateway/app.loader";
import { portfolioAppLoader } from "@/features/apps/projects/apps/portfolio/app.loader";
import { wchmsAppLoader } from "@/features/apps/projects/apps/wchms/app.loader";
import { resumeAppLoader } from "@/features/apps/resume/app.loader";
import { settingsAppLoader } from "@/features/apps/settings/app.loader";
import { terminalAppLoader } from "@/features/apps/terminal/app.loader";
import type { LeafAppLoaderMap } from "@/features/gui/registry/appTypes";

export const appLoaderRegistry = {
  about: aboutAppLoader,
  resume: resumeAppLoader,
  terminal: terminalAppLoader,
  contact: contactAppLoader,
  notes: notesAppLoader,
  settings: settingsAppLoader,
  "project:portfolio": portfolioAppLoader,
  "project:optigen": optigenAppLoader,
  "project:mcp": mcpAppLoader,
  "project:voice-gateway": voiceGatewayAppLoader,
  "project:kepco": kepcoAppLoader,
  "project:wchms": wchmsAppLoader,
  "project:flare": flareAppLoader,
} satisfies LeafAppLoaderMap;

export const appLoaderRegistryKeys = Object.keys(appLoaderRegistry).sort();
