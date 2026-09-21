import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const errors = [];
const sourceExtensions = new Set([".ts", ".tsx"]);

async function exists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

async function sourceFiles(root) {
  if (!(await exists(root))) return [];
  const entries = await readdir(root, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const target = path.join(root, entry.name);
    if (entry.isDirectory()) return sourceFiles(target);
    return sourceExtensions.has(path.extname(entry.name)) ? [target] : [];
  }));
  return files.flat();
}

async function assertAbsent(target) {
  if (await exists(target)) errors.push(`${target}: legacy directory must not exist`);
}

async function assertRequired(paths) {
  for (const target of paths) {
    if (!(await exists(target))) errors.push(`${target}: required by the Desktop architecture`);
  }
}

async function validateFeatureDependencies() {
  const featureNames = new Set(["auth", "terminal", "portfolio", "guestbook", "settings"]);
  for (const featureName of featureNames) {
    for (const file of await sourceFiles(path.join("src/features", featureName))) {
      const source = await readFile(file, "utf8");
      if (source.includes('"@/app/') || source.includes("'@/app/")) {
        errors.push(`${file}: features cannot import app modules`);
      }
      for (const otherFeature of featureNames) {
        if (otherFeature === featureName) continue;
        const token = `@/features/${otherFeature}/`;
        if (source.includes(token)) {
          errors.push(`${file}: features cannot import ${otherFeature}`);
        }
      }
    }
  }
}

async function validateFoundations() {
  for (const root of ["src/components", "src/lib", "src/styles", "src/types", "src/utils"]) {
    for (const file of await sourceFiles(root)) {
      const source = await readFile(file, "utf8");
      if (source.includes("@/app/") || source.includes("@/features/")) {
        errors.push(`${file}: foundations cannot import app or feature modules`);
      }
    }
  }
}

async function validateGuestbookComposition() {
  const actionPath = "src/app/desktop/actions/guestbookActions.ts";
  const actionSource = await readFile(actionPath, "utf8");
  if (!actionSource.startsWith('"use server";')) {
    errors.push(`${actionPath}: must be a top-level use server module`);
  }
  if (!actionSource.includes("@/features/auth/server/public") ||
      !actionSource.includes("@/features/guestbook/server/public")) {
    errors.push(`${actionPath}: must compose Auth and Guestbook public server contracts`);
  }

  for (const file of await sourceFiles("src/features/guestbook/server")) {
    const source = await readFile(file, "utf8");
    if (source.includes("@/features/auth/")) {
      errors.push(`${file}: Guestbook server cannot import Auth`);
    }
  }
}

await assertAbsent("src/features/apps");
await assertAbsent("src/features/desktop");
await assertAbsent("src/features/wallpapers");
await assertAbsent("src/app/desktop/registry");
await assertRequired([
  "src/app/desktop/DesktopClient.tsx",
  "src/app/desktop/components/AppRuntimeBoundary.tsx",
  "src/app/desktop/components/DesktopNavigationProvider.tsx",
  "src/app/desktop/hooks/useAppRuntime.ts",
  "src/app/desktop/hooks/useDesktopNavigation.ts",
  "src/app/desktop/hooks/usePageVisibilitySync.ts",
  "src/app/desktop/lib/planNavigation.ts",
  "src/app/desktop/lib/pendingNavigation.ts",
  "src/app/desktop/contexts/AppRuntimeContext.ts",
  "src/app/desktop/types/appVisibility.ts",
  "src/app/desktop/types/navigationTypes.ts",
  "src/app/desktop/utils/deriveVisibility.ts",
  "src/app/desktop/config/appCatalog.ts",
  "src/app/desktop/config/dockApps.ts",
  "src/app/desktop/lib/appLoaderRegistry.tsx",
  "src/app/desktop/lib/parseDesktopAppTarget.ts",
  "src/app/desktop/types/appTypes.ts",
  "src/app/i18n/index.ts",
  "src/app/desktop/adapters/TerminalAdapter.tsx",
  "src/app/desktop/adapters/GuestbookAdapter.tsx",
  "src/app/desktop/adapters/SettingsAdapter.tsx",
  "src/features/portfolio/apps/about/AboutApp.tsx",
  "src/features/portfolio/apps/contact/ContactApp.tsx",
  "src/features/portfolio/apps/resume/ResumeApp.tsx",
  "src/features/portfolio/apps/projects/portfolio/PortfolioProjectApp.tsx",
  "src/features/portfolio/apps/projects/optigen/OptigenProjectApp.tsx",
  "src/features/portfolio/apps/projects/mcp/McpProjectApp.tsx",
  "src/features/portfolio/apps/projects/voice-gateway/VoiceGatewayProjectApp.tsx",
  "src/features/portfolio/apps/projects/kepco/KepcoProjectApp.tsx",
  "src/features/portfolio/apps/projects/wchms/WchmsProjectApp.tsx",
  "src/features/portfolio/apps/projects/flare/FlareProjectApp.tsx",
]);
await validateFeatureDependencies();
await validateFoundations();
await validateGuestbookComposition();

if (errors.length > 0) {
  process.stderr.write(`${errors.join("\n")}\n`);
  process.exit(1);
}

process.stdout.write("Validated feature boundaries and Desktop architecture.\n");
