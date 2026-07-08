"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";

export type ColorMode = "light" | "dark";

export type ColorModeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: ColorMode;
};

export interface UseColorModeReturn {
  colorMode: ColorMode;
  setColorMode: (colorMode: ColorMode) => void;
  toggleColorMode: () => void;
}

const COLOR_MODE_STORAGE_KEY = "theme";
const COLOR_MODE_EVENT = "color-mode-change";
const DEFAULT_COLOR_MODE: ColorMode = "light";

function getStoredColorMode(): ColorMode | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(COLOR_MODE_STORAGE_KEY);
  return value === "dark" || value === "light" ? value : null;
}

function getCurrentColorMode(): ColorMode {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark")
    ? "dark"
    : "light";
}

function applyColorMode(colorMode: ColorMode) {
  if (typeof document === "undefined") return;

  document.documentElement.classList.toggle("light", colorMode === "light");
  document.documentElement.classList.toggle("dark", colorMode === "dark");
  window.localStorage.setItem(COLOR_MODE_STORAGE_KEY, colorMode);
  window.dispatchEvent(new Event(COLOR_MODE_EVENT));
}

function subscribeColorMode(callback: () => void) {
  window.addEventListener(COLOR_MODE_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(COLOR_MODE_EVENT, callback);
    window.removeEventListener("storage", callback);
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
  const colorMode = React.useSyncExternalStore(
    subscribeColorMode,
    getCurrentColorMode,
    () => DEFAULT_COLOR_MODE,
  );

  const setColorMode = React.useCallback((nextColorMode: ColorMode) => {
    applyColorMode(nextColorMode);
  }, []);

  const toggleColorMode = React.useCallback(() => {
    applyColorMode(getCurrentColorMode() === "dark" ? "light" : "dark");
  }, []);

  return {
    colorMode,
    setColorMode,
    toggleColorMode,
  };
}

export function useColorModeValue<T>(light: T, dark: T) {
  const { colorMode } = useColorMode();
  return colorMode === "dark" ? dark : light;
}

export function ColorModeIcon() {
  const { colorMode } = useColorMode();
  return colorMode === "dark" ? <Moon /> : <Sun />;
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
