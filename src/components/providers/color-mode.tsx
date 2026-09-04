"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";

export type ColorMode = "light" | "dark";
export type ColorModePreference = ColorMode | "auto";

export type ColorModeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: ColorModePreference;
};

export interface UseColorModeReturn {
  colorMode: ColorModePreference;
  resolvedColorMode: ColorMode;
  setColorMode: (colorMode: ColorModePreference) => void;
  toggleColorMode: () => void;
}

const COLOR_MODE_STORAGE_KEY = "theme";
const COLOR_MODE_EVENT = "color-mode-change";
const DEFAULT_COLOR_MODE: ColorModePreference = "light";
const DEFAULT_COLOR_MODE_SNAPSHOT = "light:light";

function getSystemColorMode(): ColorMode {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function resolveColorMode(colorMode: ColorModePreference): ColorMode {
  return colorMode === "auto" ? getSystemColorMode() : colorMode;
}

function getStoredColorMode(): ColorModePreference | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(COLOR_MODE_STORAGE_KEY);
  return value === "dark" || value === "light" || value === "auto"
    ? value
    : null;
}

function getCurrentColorMode(): ColorModePreference {
  return getStoredColorMode() ?? DEFAULT_COLOR_MODE;
}

function getResolvedColorMode(): ColorMode {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark")
    ? "dark"
    : "light";
}

function getColorModeSnapshot() {
  return `${getCurrentColorMode()}:${getResolvedColorMode()}`;
}

function applyColorMode(colorMode: ColorModePreference) {
  if (typeof document === "undefined") return;

  const resolvedColorMode = resolveColorMode(colorMode);
  document.documentElement.classList.toggle(
    "light",
    resolvedColorMode === "light",
  );
  document.documentElement.classList.toggle(
    "dark",
    resolvedColorMode === "dark",
  );
  window.localStorage.setItem(COLOR_MODE_STORAGE_KEY, colorMode);
  window.dispatchEvent(new Event(COLOR_MODE_EVENT));
}

function subscribeColorMode(callback: () => void) {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handleSystemChange = () => {
    if (getCurrentColorMode() === "auto") {
      applyColorMode("auto");
    }
  };

  window.addEventListener(COLOR_MODE_EVENT, callback);
  window.addEventListener("storage", callback);
  mediaQuery.addEventListener("change", handleSystemChange);

  return () => {
    window.removeEventListener(COLOR_MODE_EVENT, callback);
    window.removeEventListener("storage", callback);
    mediaQuery.removeEventListener("change", handleSystemChange);
  };
}

export function ColorModeProvider({
  children,
  defaultTheme = "light",
}: ColorModeProviderProps) {
  React.useEffect(() => {
    applyColorMode(getStoredColorMode() ?? defaultTheme);
  }, [defaultTheme]);

  return <>{children}</>;
}

export function useColorMode(): UseColorModeReturn {
  const colorModeSnapshot = React.useSyncExternalStore(
    subscribeColorMode,
    getColorModeSnapshot,
    () => DEFAULT_COLOR_MODE_SNAPSHOT,
  );
  const [colorMode, resolvedColorMode] = colorModeSnapshot.split(":") as [
    ColorModePreference,
    ColorMode,
  ];

  const setColorMode = (nextColorMode: ColorModePreference) => {
    applyColorMode(nextColorMode);
  };

  const toggleColorMode = () => {
    applyColorMode(getResolvedColorMode() === "dark" ? "light" : "dark");
  };

  return {
    colorMode,
    resolvedColorMode,
    setColorMode,
    toggleColorMode,
  };
}

export function useColorModeValue<T>(light: T, dark: T) {
  const { resolvedColorMode } = useColorMode();
  return resolvedColorMode === "dark" ? dark : light;
}

export function ColorModeIcon() {
  const { resolvedColorMode } = useColorMode();
  return resolvedColorMode === "dark" ? <Moon /> : <Sun />;
}

export const ColorModeButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(function ColorModeButton(props, ref) {
  const { toggleColorMode } = useColorMode();

  return (
    <button
      onClick={toggleColorMode}
      aria-label="Toggle color mode"
      ref={ref}
      className="rounded-md p-2 transition-colors hover:bg-accent/60"
      {...props}
    >
      <div className="w-5 h-5 flex items-center justify-center">
        <ColorModeIcon />
      </div>
    </button>
  );
});
