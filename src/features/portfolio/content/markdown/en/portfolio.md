---
title: Portfolio
stackLabel: Technology stack
problemSolvingLabel: Selected work
summary: A personal portfolio explored through a terminal and an OS-style desktop. I planned, designed, implemented, and tested the product, connecting window and folder interactions with URL navigation and keyboard controls.
projectContext:
  product:
    label: Product
    description: A bilingual portfolio explored through a terminal and OS-style desktop
  users:
    label: Users
    description: Recruiters and engineering interviewers reviewing career evidence and technical decisions
  role:
    label: My scope
    description: Product concept, design, frontend architecture, accessibility, testing, and content model
projectIntro:
  title: Project overview
  description: |-
    I built this Korean/English portfolio so recruiters can review my experience and outcomes, while engineering interviewers can examine implementation decisions. It offers both terminal and desktop navigation. About and Resume use the same experience and project data, and language, wallpaper, and Dock preferences survive a refresh.

    The Desktop owns window management and browser navigation; each feature owns its screens and user flows. Types and structural checks verify app IDs, loaders, URLs, and folder nodes. Playwright covers opening apps, window boundaries, DOM removal after closing, and keyboard app switching.
architecture:
  title: Folder and runtime structure of the OS-style portfolio
  description: The route entry composes the Desktop runtime, the Desktop shell manages windows and navigation, and each feature owns an independent application screen and user flow.
  alt: Portfolio architecture showing the route entry, Desktop shell, navigation, store, app catalog, dynamic loader, directory tree, and Portfolio, Terminal, Guestbook, and Settings features
  caption: Static app metadata, client-only loaders, folder trees, and browser navigation are separated by file responsibility so each new app follows the same runtime rules.
  loading: Loading the architecture diagram.
  error: The architecture diagram could not be displayed.
  scrollLabel: Portfolio folder and runtime architecture diagram. Horizontally scrollable.
  wide: true
stack:
  - Next.js 16
  - TypeScript
  - Zustand
  - i18next
  - Tailwind CSS
  - Supabase
  - TanStack Query
  - Playwright
  - Vitest
  - Vercel
---

<!-- architecture -->

```mermaid
flowchart TB
    route["app/desktop/page.tsx, route entry"] --> client["DesktopClient, composition"]
    client --> shell["DesktopShell, window, Dock, directory"]
    client --> store["DesktopStoreProvider, factory and Context"]
    client --> navigation["DesktopNavigationProvider, browser adapter"]
    navigation --> planner["planNavigation.ts, pure navigation plan"]
    navigation --> history["URL and History API"]
    shell --> catalog["appCatalog.ts, serializable app metadata"]
    catalog --> directory["directoryTree.ts, Desktop and Projects nodes"]
    shell --> renderer["DesktopAppRenderer, typed app props"]
    renderer --> loader["appLoaderRegistry.tsx, client dynamic loader"]
    loader --> portfolio["features/portfolio"]
    loader --> terminal["features/terminal"]
    loader --> guestbook["features/guestbook"]
    loader --> settings["features/settings"]
    store --> shell

    classDef route fill:#ffffff,stroke:#94a3b8,stroke-width:1.5px,color:#334155
    classDef shell fill:#e8f1ff,stroke:#2563eb,stroke-width:3px,color:#111827,font-weight:bold
    classDef contract fill:#f3f4f6,stroke:#6b7280,stroke-width:1.5px,color:#374151
    classDef feature fill:#f0fdf4,stroke:#16a34a,stroke-width:2px,color:#14532d
    class route,client,history route
    class shell,store,navigation shell
    class planner,catalog,directory,renderer,loader contract
    class portfolio,terminal,guestbook,settings feature
```

<!-- /architecture -->

<!-- case: ownership -->

## Separating Desktop responsibilities from app features

### Overview

I separated window and browser navigation from app behavior and used adapters to pass only the state and actions each app needs.

**Dependencies between the runtime and app features** Terminal, Guestbook, and Settings run inside a Desktop that manages windows and the Dock. Direct feature imports of the Desktop store would couple internal app changes to the runtime, so the design needed an explicit dependency boundary.

### Implementation

**Injecting state and actions through adapters** I placed DesktopShell, windows, the Dock, directories, navigation, and the store in src/app/desktop, and kept each application screen and user flow in src/features. For Terminal, Guestbook, and Settings, adapters inject Desktop state as props so features do not import the Desktop store directly.

### Outcomes

**Removing direct Desktop-store dependencies** Terminal, Guestbook, and Settings receive the state and actions they need through adapter props. Features do not import the Desktop store directly, preserving the dependency boundary between the runtime and app behavior.

<!-- case: appContract -->

## Defining app registration and URL navigation contracts

### Overview

I connected Dock entries, loaders, folders, and shared URLs through app IDs and used types and structural checks to detect missing registrations.

**App registration spanning multiple files** App execution depends on metadata, dynamic loaders, folder nodes, and URL handling. Missing registrations could leave execution and shared URLs inconsistent, so those relationships needed checks in code and tests.

### Implementation

**Separating metadata, loading, and navigation** appCatalog.ts holds only serializable metadata that the server can read, while appLoaderRegistry.tsx holds client-only dynamic imports. directoryTree.ts references catalog app IDs. planNavigation.ts calculates state changes and URL effects as a pure function, and DesktopNavigationProvider is the only caller of the History API.

### Outcomes

**Checking registration consistency and navigation behavior** I separated static app metadata, client-only loaders, folder nodes, and browser navigation into files with distinct responsibilities. Types check the relationship between app IDs and props, while structure checks and unit tests verify consistency across the app catalog, loaders, URLs, folder nodes, and localized title keys.

Tests also check that shared URL normalization, user navigation, and back navigation follow the same navigation plan. They cover how popstate events from browser history changes update the Desktop state.
