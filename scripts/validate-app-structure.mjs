import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const appsRoot = path.resolve("src/features/apps");
const errors = [];
const appIds = new Map();

async function validateAppDirectory(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const names = entries.map((entry) => entry.name);
  if (!names.includes("app.config.ts")) return;

  const configPath = path.join(directory, "app.config.ts");
  const config = await readFile(configPath, "utf8");
  const match = config.match(/appId:\s*"([^"]+)"/);
  if (match === null) {
    errors.push(`${configPath}: literal appId is required`);
  } else if (appIds.has(match[1])) {
    errors.push(`${configPath}: duplicate appId ${match[1]}`);
  } else {
    appIds.set(match[1], configPath);
  }

  const isFolder = names.includes("apps");
  const hasLoader = names.includes("app.loader.tsx");
  const hasComponent = names.some((name) => /App\.tsx$/.test(name));

  if (isFolder && (hasLoader || hasComponent)) {
    errors.push(`${directory}: folder apps cannot have a loader/component`);
  }
  if (!isFolder && (!hasLoader || !hasComponent)) {
    errors.push(`${directory}: leaf apps require loader and component`);
  }

  if (isFolder) {
    const childRoot = path.join(directory, "apps");
    const children = await readdir(childRoot, { withFileTypes: true });
    for (const child of children) {
      if (!child.isDirectory()) {
        errors.push(`${childRoot}: children must be app directories`);
        continue;
      }
      await validateAppDirectory(path.join(childRoot, child.name));
    }
  }
}

for (const entry of await readdir(appsRoot, { withFileTypes: true })) {
  if (entry.isDirectory()) {
    await validateAppDirectory(path.join(appsRoot, entry.name));
  }
}

if (errors.length > 0) {
  process.stderr.write(`${errors.join("\n")}\n`);
  process.exit(1);
}

process.stdout.write(`Validated ${appIds.size} app directories.\n`);
