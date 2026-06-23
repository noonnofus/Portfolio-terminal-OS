# GUI V2 release validation

> Measured: 2026-06-23, local production build, cold browser context, 1280×720.

## Startup and interaction

| Metric | Legacy `/gui` | GUI V2 `/gui-v2` | Result |
|---|---:|---:|---|
| Browser-transferred startup JavaScript | 262.3 KiB | 223.5 KiB | 14.8% lower |
| Startup transfer (JS/CSS/font/image) | 2206.4 KiB | 230.0 KiB | 89.6% lower |
| Route-specific entry chunks (gzip) | 105.5 KiB | 60.8 KiB | Within 170 KiB gate |
| LCP proxy | — | 104 ms | Pass |
| CLS | — | 0.00006 | Pass |
| Dock-to-window interaction latency | — | 67 ms | Pass |
| Long tasks during startup | — | 0 | Pass |

The measurement uses unique browser resource entries after a cold direct
navigation and waits for About primary content. Route-specific entry size
subtracts chunks shared with the root route; startup transfer uses actual
encoded response body sizes.

The V2 values were captured on the preview route before the isolated entry
switch. The same component graph is now served from `/gui`; `/gui-v2` has been
removed.

## Release verification

- ESLint, TypeScript, Vitest, and production build pass.
- Chromium, Firefox, and WebKit core E2E pass.
- Mobile uses the 8px near-fullscreen contract.
- Tablet hides duplicate shortcuts while preserving Dock access.
- Desktop inactive content is inert and global `Ctrl+F6` switching restores
  focus to the activated window.
- Reduced-motion mode removes transform timing from window minimize.
- Resume print hides shell chrome and unrelated windows.
- Chromium-only stress coverage opens every project window, forces garbage
  collection, closes the project windows, and checks DOM/heap bounds.

Production field INP remains a post-deployment RUM check and cannot be
validated in a local lab.
