# GUI apps

This directory implements a static app hierarchy that looks and behaves like a
folder tree. It is not a filesystem: folder `appId` values identify GUI views
used by windows, URLs, history, and the Dock.

Read this file before changing anything below `src/features/apps`.

## Contracts

- `app.config.ts` is server-safe metadata. It must use `defineAppConfig()` so
  `appId` remains correlated with `GuiAppUrlTargetMap[appId]`.
- `app.loader.tsx` is a client-only leaf runtime adapter built with
  `next/dynamic`.
- `DesktopNode` defines static file/folder presentation and parent ownership.
- `folderAppIds` is the single source of truth for `FolderAppId` and
  `LeafAppId`.
- Folder apps have `app.config.ts` and `apps/`, but no component or loader.
- Leaf apps have `app.config.ts`, `app.loader.tsx`, and an app component.
- A folder's direct children live directly below its `apps/` directory.
- Imports are explicit. Runtime scans, glob loaders, and generated registries
  are not allowed.

## Loader preservation

- Keep dynamic imports at module scope with literal paths.
- Project loaders load the matching translation namespace before the app.
- Localized adapters continue passing `language`.
- Terminal keeps `ssr: false`, `useAppRuntime()`, visibility handling, and
  resume signaling.

## Folder rendering

All folders render through `DirectorySurface`; do not add a folder-specific
renderer such as `ProjectsApp`.

`DirectorySurface` owns selection, roving focus, and item positions per surface
instance. Every item uses a stable `key={node.nodeId}`. Its accessible structure
is `grid → row → gridcell → button`, with only the button in the roving tab
order. Keyboard opening, selection clearing, directional navigation, and
non-drag movement must remain available.

## Adding an app

1. Add its ID and params/URL mapping to `appTypes.ts`.
2. Create the leaf directory under its owning folder's `apps/` directory.
3. Add `app.config.ts`, `app.loader.tsx`, and the app component.
4. Register config, loader, and a `DesktopNode`.
5. Run `npm run validate:app-structure` and the full validation suite.

## Adding a folder

1. Add its ID to `folderAppIds`.
2. Create `app.config.ts` and `apps/`; do not create a loader or component.
3. Add a folder node and explicit child resolution.
4. Extend folder/loader contract tests.

## Wallpaper changes

Add the public asset and one entry to
`src/features/gui/appearance/wallpaperCatalog.ts`. Do not add wallpaper IDs to
Settings, persistence, or CSS selectors.

## Validation

```bash
npm run validate:app-structure
npm run lint
npx tsc --noEmit --pretty false
npm test
npm run build
```
