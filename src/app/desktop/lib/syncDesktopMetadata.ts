"use client";

export function syncDesktopMetadata(): void {
  const { pathname } = window.location;
  if (pathname !== "/desktop" && pathname !== "/en/desktop") return;
  // ponytail: notify the single React owner instead of mutating its DOM tags.
  window.dispatchEvent(new Event("desktop-metadata-change"));
}
