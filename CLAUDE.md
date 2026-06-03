# CLAUDE.md

This file provides guidance for agents working in this repository.

## Project Overview

A Next.js 16 portfolio website styled as a terminal/desktop OS. Users land on a full-screen xterm.js terminal emulator (`/`) and can switch to a windowed desktop GUI (`/gui`) via the `startx` command. Fully bilingual (Korean/English).

## Commands

```bash
npm run dev      # Dev server at localhost:3000
npm test         # Vitest unit tests under src/
npx tsc --noEmit --pretty false  # Standalone TypeScript gate
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint (flat config, Next.js 16 baseline)
```

## Verification Order

Run these in order before closing a refactor task:

1. `npm test`
2. `npm run lint`
3. `npx tsc --noEmit --pretty false`
4. `npm run build`

## Architecture

### Routing (App Router — `src/app/`)

- `/` → `TerminalPage` (xterm.js terminal, loaded with `dynamic()` + `ssr: false`)
- `/gui` → `DesktopMainView` (OS-style desktop with draggable windows or touch folder view)

### Provider Stack (`ClientProvider.tsx`)

I18nextProvider → ChakraProvider → I18nWrapper (syncs Zustand language state to i18next)

### State Management (Zustand)

- **Desktop store** — `src/features/Desktop/store/useDesktopStore.ts`
- **Language store** — `src/shared/lib/i18n/useLanguageStore.ts`
- Window state includes `openApps`, `activeApp`, `focusApp`, `isTouchDevice`, `showAppMenu`, `showModal`, `userRole`

### Terminal System (`src/features/Apps/Terminal/`)

`@xterm/xterm` with FitAddon. Main files:

- `TerminalPage.tsx`
- `hooks/useTerminal.ts`
- `lib/commandParser.ts`
- `command.ts`

Typing `startx` navigates to `/gui`.

### Desktop App System

Apps are defined in `src/features/Apps/Config/` and rendered inside the Desktop feature. Zustand tracks which apps are open/focused. `DesktopAppWindow` under `src/features/Desktop/components/` is the standard container for windowed apps, handling dragging, focus, and fullscreen logic via Framer Motion. Mobile renders a touch-friendly folder view. Device detection lives in `src/features/Desktop/hooks/useIsTouchDevice.ts`.

### i18n (`src/shared/lib/i18n.ts`)

react-i18next with JSON namespaces under `public/locales/{ko,en}/`. Components use `useTranslation(['namespace', 'common'])`. Language state is stored in Zustand and synced to i18next via `I18nWrapper`.

### Styling & Security

- **Styling**: Tailwind CSS (primary) + Chakra UI provider + shared CSS files in `src/shared/styles/` and `src/app/globals.css`.
- **Security**: Hardened headers (CSP-lite, Frame Options, etc.) in `next.config.ts`.
- **Path Alias**: `@/*` → `src/*`.

## Key Conventions

- **Window Management**: Always wrap desktop apps in `DesktopAppWindow` for consistent OS behavior.
- **Verification**: A task is not complete until `npm test`, `npm run lint`, `npx tsc --noEmit --pretty false`, and `npm run build` all pass.
- **Performance**: Chakra UI imports are optimized via `experimental.optimizePackageImports`.
- **AI Hygiene**: `.claude/`, `.gemini/`, and `.serena/` directories are ignored via `.gitignore`.
- **Components**: Use `AppDesktopHeader` for window chrome, `MarkdownRender` for content, `StackIcon` for tech badges.
- **Commit Messages**: Write commit messages in Korean using `<branch-type>: <작업 간략 설명>`. Use the branch prefix before `/` as `<branch-type>` when applicable, e.g. `refactor: 아이콘 변경`.
- **PR Rules**: Open PRs as a knowledge base, not just a code approval request. Keep commits atomic, keep one PR scoped to one purpose, self-review before opening, and write the PR title/body in Korean.
- **PR Title Format**: Use `<branch-type>: <작업 간략 설명>`, matching the commit rule. Example: `refactor: 아이콘 변경`.
- **PR Body Format**: Include Context, Summary of Changes, Trade-offs, How to Test, Out of Scope, and Visuals when UI changes are included.
- **Review Etiquette**: Add self-comments for non-obvious trade-offs, avoid meaningless feedback commits, and summarize any synchronous review decisions back in the PR thread.

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
