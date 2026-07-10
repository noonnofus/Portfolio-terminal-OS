# HyunHo Kim Portfolio

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

![Next JS](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-5-443E38?style=for-the-badge)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-FF4154?style=for-the-badge&logo=react-query&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deploy-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

A bilingual Korean/English portfolio presented as an operating system in the browser.

- `/` opens an xterm-powered terminal entry.
- `/gui` opens a macOS-inspired GUI workspace with windows, dock apps, desktop files, shareable URLs, authentication, settings, wallpapers, and a guestbook.

Live site: [hyunho.vercel.app](https://hyunho.vercel.app/)

## Current features

- Terminal landing page with boot animation, command parsing, language commands, and GUI navigation.
- GUI workspace with system bar, dock, desktop shortcuts, draggable windows, minimize/restore, show desktop, and keyboard-friendly directory navigation.
- Typed app registry that keeps app IDs, URL targets, loaders, metadata, and project slugs correlated at compile time.
- Shareable GUI URLs for desktop, apps, project detail windows, and language state.
- Bilingual portfolio content in Korean and English.
- Project folder with WCHMS, Flare, WeConnect, PageSsence, DiceRoller, Discord Bot, and WebPiano detail apps.
- Built-in About, Projects, Resume, Terminal, Contact, Guestbook, and Settings apps.
- GitHub OAuth through Supabase Auth.
- Server-backed guestbook notes with GitHub-authenticated writes, 1,000 character validation, per-account rate limiting, owner/admin permissions, and deleted-account anonymization.
- Local GUI preferences for language, theme, dock auto-hide, and wallpaper.
- Server-backed wallpaper catalog with light/dark wallpaper presets.
- TanStack Query for client server-state reads, mutations, and invalidation.
- Server Actions for note writes.
- TipTap Markdown editing and Markdown rendering for notes.
- Supabase migrations for accounts, notes, wallpapers, preferences, RLS, and service-role grants.

## Tech stack

| Area | Stack |
| --- | --- |
| Framework | Next.js 16 App Router, React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4, CSS custom properties, local Pretendard font |
| GUI state | Zustand vanilla store with React Context provider |
| Server state | TanStack Query 5 |
| Auth and data | Supabase SSR, Supabase Auth, Supabase Postgres, GitHub OAuth |
| Terminal | xterm.js, `@xterm/addon-fit` |
| Editor and Markdown | TipTap, `@tiptap/markdown`, `react-markdown`, `remark-gfm`, `rehype-raw` |
| UI libraries | Radix UI primitives, Framer Motion, lucide-react |
| Testing | Vitest, Playwright |
| Deployment target | Vercel |

## Architecture overview

```text
Browser
  ├─ / terminal route
  │   └─ TerminalRouteClient
  │       └─ TerminalApp
  │
  └─ /gui route
      └─ Server Component viewer lookup
          └─ GuiEntry
              └─ GuiStoreProvider
                  ├─ GuiShell / Dock / Window manager
                  └─ GUI apps
```

Data flow for authenticated features:

```text
Browser
  → Next.js App Router / Route Handlers / Server Actions
  → Supabase SSR Auth
  → Supabase Postgres
```

The browser never talks to private tables directly. Reads and writes go through the Next.js backend boundary, and public DTOs avoid exposing internal account IDs where they are not needed.

## GUI app model

GUI apps live under `src/features/apps`.

- `app.config.ts` defines server-safe metadata.
- `app.loader.tsx` defines the client runtime loader.
- App IDs, URL targets, params, and loaders are typed through `src/features/gui/registry`.
- Project apps are nested under `src/features/apps/projects/apps`.
- Folder rendering is handled by `DirectorySurface`; project folders are not separate custom renderers.

Current top-level apps:

- About
- Projects
- Resume
- Terminal
- Contact
- Guestbook
- Settings

## Supabase model

Main tables:

- `user_accounts`
- `notes`
- `wallpapers`

The database still has a `user_preferences` table from earlier migrations, but
the current GUI keeps language, theme, Dock auto-hide, and wallpaper selection
in local browser storage.

Notes policy:

- Guests can read notes.
- GitHub-authenticated users can create notes when writes are enabled.
- Owners can edit and delete their own notes.
- Admins can delete notes.
- Account deletion preserves note content but anonymizes the author display as `[DELETED]`.

## Environment variables

Required for Supabase-backed features:

```bash
APP_ORIGIN=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
NOTES_WRITE_ENABLED=true
```

Optional:

```bash
ADMIN_AUTH_USER_ID=
```

Legacy names still supported during migration:

```bash
SUPABASE_URL=
SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Do not commit `.env.local` or any Supabase secret key.

## Local development

```bash
npm install
npm run dev
```

Open:

- Terminal route: <http://localhost:3000/>
- GUI route: <http://localhost:3000/gui>

## Database migrations

Supabase migrations live in `supabase/migrations`.

```bash
supabase migration list
supabase db push
```

Current migrations create the auth-backed app tables, seed wallpapers, enable RLS, and grant the service role access used by the Next.js backend.

## Verification

Run these before treating a refactor as complete:

```bash
npm run validate:app-structure
npm run lint
npx tsc --noEmit --pretty false
npm test
npm run build
```

Extended browser coverage:

```bash
npm run test:e2e
npm run test:e2e:release
```

Command meanings:

- `validate:app-structure`: validates GUI app config, loader, folder, and registry contracts.
- `lint`: runs ESLint.
- `tsc --noEmit`: runs standalone TypeScript validation.
- `test`: runs Vitest unit tests.
- `build`: runs the production Next.js build.
- `test:e2e`: runs Chromium Playwright coverage.
- `test:e2e:release`: runs Chromium, Firefox, and WebKit Playwright coverage.

## Repository map

```text
src/app                     Next.js routes, API routes, layout, providers
src/features/apps           GUI app implementations
src/features/gui            GUI shell, registry, navigation, windowing, styles
src/features/auth           Supabase viewer and auth helpers
src/features/notes          Guestbook client, server actions, repository, schemas
src/features/wallpapers     Wallpaper query and repository code
src/shared                  Shared UI, content, i18n, Supabase clients, utilities
supabase/migrations         Database migrations
supabase/spikes             Database behavior spikes
```

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE).
