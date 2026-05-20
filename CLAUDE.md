# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Next.js 15 portfolio website styled as a terminal/desktop OS. Users land on a full-screen xterm.js terminal emulator (`/`) and can switch to a windowed desktop GUI (`/gui`) via the `gui` command. Fully bilingual (Korean/English).

## Commands

```bash
npm run dev      # Dev server at localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint (next lint)
```

## Architecture

### Routing (App Router — `src/app/`)

- `/` → `TerminalPage` (xterm.js terminal, loaded with `dynamic()` + `ssr: false`)
- `/gui` → `DesktopMainView` (OS-style desktop with draggable windows or touch folder view)

### Provider Stack (`ClientProvider.tsx`)

Redux Provider → I18nextProvider → ChakraProvider → I18nWrapper (syncs Redux language state to i18next)

### State Management (Redux Toolkit — `src/app/store/`)

- **desktopSlice** — window management: `openApps`, `activeApp`, `focusApp`, `isTouchDevice`, `showAppMenu`, `showModal`, `userRole`
- **languageSlice** — i18n: `currentLanguage` ("ko" | "en"), auto-detects browser language

### Terminal System (`src/app/terminal/`)

@xterm/xterm (formerly xterm.js) with FitAddon. Flow: `TerminalPage` → `write-text.ts` (animated typing) → `handle-input.ts` (command parsing). `global-state.ts` holds terminal state. Typing `gui` navigates to `/gui`.

### Desktop App System

Apps are defined as objects (`iconName`, `appName`, `title`, `component`) in `src/lib/apps.tsx` and `src/lib/projectsApps.tsx`, combined via `allApps.tsx`. Redux tracks which apps are open/focused. `DesktopAppWindow` (`src/app/components/desktop/DesktopAppWindow.tsx`) is the standard container for windowed apps, handling dragging, focus, and fullscreen logic via Framer Motion. Mobile renders a touch-friendly folder view. Device detection via `src/lib/isTouchDevice.ts` hook.

### i18n (`src/lib/i18n.ts`)

react-i18next with 11 JSON namespaces per language under `public/locales/{ko,en}/`. Components use `useTranslation(['namespace', 'common'])`. Language switch dispatches to Redux which syncs to i18next via `I18nWrapper`.

### Styling & Security

- **Styling**: Tailwind CSS (primary) + Chakra UI (component library) + component-specific CSS in `src/app/styles/`.
- **Security**: Hardened headers (CSP-lite, Frame Options, etc.) in `next.config.ts`.
- **Path Alias**: `@/*` → `src/*`.

## Key Conventions

- **Window Management**: Always wrap desktop apps in `DesktopAppWindow` for consistent OS behavior.
- **Builds**: ESLint and TypeScript errors are ignored during builds (`next.config.ts`) — they still run via `npm run lint`.
- **Performance**: Chakra UI imports are optimized via `experimental.optimizePackageImports`.
- **AI Hygiene**: `.claude/`, `.gemini/`, and `.serena/` directories are ignored via `.gitignore`.
- **Components**: Use `AppDesktopHeader` for window chrome, `MarkdownRender` for content, `StackIcon` for tech badges.

## Skill routing

When the user's request matches an available skill, ALWAYS invoke it using the Skill
tool as your FIRST action. Do NOT answer directly, do NOT use other tools first.
The skill has specialized workflows that produce better results than ad-hoc answers.

Key routing rules:
- Product ideas, "is this worth building", brainstorming → invoke office-hours
- Bugs, errors, "why is this broken", 500 errors → invoke investigate
- Ship, deploy, push, create PR → invoke ship
- QA, test the site, find bugs → invoke qa
- Code review, check my diff → invoke review
- Update ARCHITECTURE.md → invoke architecture-update
- Update CLAUDE.md or other docs → invoke md-update
- Feature development finished, wrap up, finalize → invoke feature-finalize
- Weekly retro → invoke retro
- Design system, brand → invoke design-consultation
- Visual audit, design polish → invoke design-review
- Architecture review → invoke plan-eng-review
- Save progress, checkpoint, resume → invoke checkpoint
- Code quality, health check → invoke health
