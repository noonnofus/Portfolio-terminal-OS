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
- `/desktop` opens a macOS-inspired Desktop workspace with windows, dock apps, desktop files, shareable URLs, authentication, settings, wallpapers, and a guestbook.
- `/en` and `/en/desktop` provide fixed English entry points for search engines and direct sharing.

Live site: [hyunhokim.is-a.dev](https://hyunhokim.is-a.dev/)

## Current features

- Terminal landing page with boot animation, command parsing, language commands, and Desktop navigation.
- Desktop workspace with system bar, dock, desktop shortcuts, draggable windows, minimize/restore, show desktop, and keyboard-friendly directory navigation.
- Typed app contract that keeps app IDs, URL targets, loaders, metadata, and project slugs correlated at compile time.
- Shareable Desktop URLs for desktop, apps, project detail windows, and language state.
- Bilingual portfolio content in Korean and English.
- Project folder with KEPCO Advisor, OptiGen, Portfolio, MCP, Voice Gateway, WCHMS, and Flare case-study apps.
- Shared case-study layouts with bilingual evidence sections and Mermaid or reviewed static architecture diagrams.
- Built-in About, Projects, Resume, Terminal, Contact, Guestbook, and Settings apps.
- GitHub OAuth through Supabase Auth.
- Server-backed guestbook notes with GitHub-authenticated writes, 1,000 character validation, per-account rate limiting, owner/admin permissions, and deleted-account anonymization.
- Guestbook app and notes data loading share one localized loading surface.
- Local Desktop preferences for language, theme, dock auto-hide, and wallpaper.
- Server-backed wallpaper catalog with light/dark wallpaper presets.
- Responsive Next Image delivery for wallpapers and portfolio technology assets.
- Project technology badges use the centralized manifest and reviewed technology PNG assets.
- SEO metadata includes canonical URLs, Korean/English `hreflang` alternates, Open Graph/Twitter cards, robots rules, and a sitemap.
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
| Desktop state | Zustand vanilla store with React Context provider |
| Server state | TanStack Query 5 |
| Auth and data | Supabase SSR, Supabase Auth, Supabase Postgres, GitHub OAuth |
| Terminal | xterm.js, `@xterm/addon-fit` |
| Editor and Markdown | TipTap, `@tiptap/markdown`, `react-markdown`, `remark-gfm`, `rehype-raw` |
| UI libraries | Framer Motion, lucide-react, Mermaid |
| Testing | Vitest, Playwright |
| Deployment target | Vercel |

## Architecture overview

```text
Browser
  ├─ / terminal route
  │   └─ TerminalRouteClient
  │       └─ TerminalApp
  │
  └─ /desktop route
      └─ DesktopClient
          └─ DesktopStoreProvider
              ├─ DesktopNavigationProvider
              └─ DesktopShell / Dock / Window manager
                  └─ Feature apps through Desktop adapters
```

Data flow for authenticated features:

```text
Browser
  → Next.js App Router / Route Handlers / Server Actions
  → Supabase SSR Auth
  → Supabase Postgres
```

The browser never talks to private tables directly. Reads and writes go through the Next.js backend boundary, and public DTOs avoid exposing internal account IDs where they are not needed.

## Desktop app model

The Desktop shell lives in `src/app/desktop`, while product UI and feature logic
live in `src/features/{terminal,portfolio,guestbook,settings}`. Authentication is
owned by `src/features/auth`.

- `appCatalog.ts` contains server-safe app metadata.
- `appLoaderRegistry.tsx` contains client-only dynamic loaders.
- Mapped types keep app IDs, URL targets, params, and component props correlated.
- `DirectorySurface` renders the Desktop and Projects folder trees.
- Desktop adapters inject shell state and commands into features without making
  features import `src/app`.

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
the current Desktop keeps language, theme, Dock auto-hide, and wallpaper selection
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
- Desktop route: <http://localhost:3000/desktop>
- English terminal route: <http://localhost:3000/en>
- English Desktop route: <http://localhost:3000/en/desktop>

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

- `validate:app-structure`: validates feature boundaries and required Desktop architecture files.
- `lint`: runs ESLint.
- `tsc --noEmit`: runs standalone TypeScript validation.
- `test`: runs Vitest unit tests.
- `build`: runs the production Next.js build.
- `test:e2e`: runs Chromium Playwright coverage.
- `test:e2e:release`: runs Chromium, Firefox, and WebKit Playwright coverage.

## Repository map

```text
src/app                     Next.js routes, API routes, layout, providers
src/app/desktop             Desktop shell, catalog, loaders, navigation, windowing, adapters
src/features/auth           Viewer and authentication contracts
src/features/terminal       Terminal UI and command behavior
src/features/portfolio      Portfolio apps, content, and project case studies
src/features/guestbook      Guestbook UI, query logic, and server repository
src/features/settings       Settings UI and wallpaper catalog/query logic
src/components              Shared providers and reviewed UI components
src/lib                     Shared i18n, query, SEO, HTTP, and Supabase foundations
supabase/migrations         Database migrations
supabase/spikes             Database behavior spikes
```

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE).
