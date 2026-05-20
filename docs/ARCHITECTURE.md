# System Architecture

This document describes the high-level architecture of the Portfolio-terminal-OS project.

## Overview

The application is a web-based portfolio designed as a simulated Terminal and Desktop OS environment. It provides two main modes of interaction:
1.  **Terminal Mode (`/`)**: A command-line interface using `@xterm/xterm`.
2.  **Desktop Mode (`/gui`)**: A windowed GUI environment managed by Redux and Framer Motion.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **State Management**: Redux Toolkit (for window management and i18n state)
- **UI Components**: Chakra UI v3
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Internationalization**: react-i18next
- **Terminal Engine**: @xterm/xterm

## Core Architectural Components

### 1. Terminal Engine (`src/app/terminal/`)
The terminal is the entry point of the application. It uses `@xterm/xterm` with the `FitAddon` to provide a full-screen terminal emulator.
- **`TerminalPage.tsx`**: The main component that initializes the xterm instance.
- **`handle-input.ts`**: Handles character input and command parsing.
- **`write-text.ts`**: Manages animated text output for the "boot sequence" and command responses.
- **`command.js`**: Contains the logic for various terminal commands.

### 2. Desktop Environment (`src/app/gui/`)
The desktop environment simulates a windowed OS.
- **`DesktopMainView.tsx`**: Orchestrates the rendering of the desktop, switching between `DesktopMainDragArea` (desktop) and `DesktopMainTouchArea` (mobile/touch) based on device detection.
- **`DesktopAppWindow.tsx`**: A core wrapper component that handles window lifecycle (open, focus, close, fullscreen) and movement via Framer Motion's `drag` capabilities.
- **`desktopSlice.ts`**: Manages the global state of opened and focused applications.

### 3. Application System (`src/lib/`)
Apps are defined as pluggable objects, allowing easy addition of new projects or tools.
- **`apps.tsx` / `projectsApps.tsx`**: Definitions of individual apps (title, icon, component).
- **`allApps.tsx`**: Aggregates all app definitions into a single list used by the UI.

### 4. State Management (`src/app/store/`)
- **Desktop Slice**: Tracks `openApps` (array of app names), `activeApp`, `focusApp`, and `isTouchDevice`.
- **Language Slice**: Manages the current language ("ko" or "en") and persists it.

### 5. Internationalization
- Translations are stored in `public/locales/` as JSON files.
- The `I18nWrapper` component ensures that the Redux language state stays in sync with the `react-i18next` instance.

## Security Hardening
The application implements security best practices via `next.config.ts` headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`: Restricts access to camera, microphone, and geolocation.

## Build and Deployment
- The project uses standard Next.js build pipelines.
- ESLint and TypeScript checks are enforced during development (`npm run lint`) but ignored during production builds to ensure deployment speed, assuming CI/CD handles validation.
