"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import type { ColorModePreference } from "@/lib/preferences/uiPreferences";
import { patchUiPreferencesCookie, readUiPreferencesCookie, subscribeUiPreferences } from "@/lib/preferences/uiPreferences.client";

export type { ColorModePreference } from "@/lib/preferences/uiPreferences";

export type ColorMode = "light" | "dark";

export type ColorModeProviderProps = {
  children: React.ReactNode;
  initialColorMode: ColorModePreference;
};

export interface UseColorModeReturn {
  colorMode: ColorModePreference;
  resolvedColorMode: ColorMode;
  setColorMode: (colorMode: ColorModePreference) => void;
  toggleColorMode: () => void;
}

const ColorModeContext = React.createContext<UseColorModeReturn | null>(null);

function getSystemColorMode(): ColorMode {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function resolveColorMode(colorMode: ColorModePreference): ColorMode {
  return colorMode === "auto" ? getSystemColorMode() : colorMode;
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
  document.documentElement.style.colorScheme = resolvedColorMode;
}

function subscribeSystemColorMode(callback: () => void) {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

export function ColorModeProvider({
  children,
  initialColorMode,
}: ColorModeProviderProps) {
  const [colorMode, setPreference] = React.useState(initialColorMode);
  const systemColorMode = React.useSyncExternalStore<ColorMode>(subscribeSystemColorMode, getSystemColorMode, () => "light");
  const resolvedColorMode = colorMode === "auto" ? systemColorMode : colorMode;
  React.useEffect(() => {
    // Resolve the actual OS value here, including the first auto hydration effect.
    applyColorMode(colorMode);
  }, [colorMode, systemColorMode]);

  React.useEffect(() => subscribeUiPreferences(() => {
    const preferences = readUiPreferencesCookie();
    if (preferences) {
      setPreference(preferences.colorMode);
      applyColorMode(preferences.colorMode);
    }
  }), []);

  const setColorMode = (nextColorMode: ColorModePreference) => {
    setPreference(nextColorMode);
    applyColorMode(nextColorMode);
    patchUiPreferencesCookie({ colorMode: nextColorMode });
  };

  const toggleColorMode = () => {
    setColorMode(resolveColorMode(colorMode) === "dark" ? "light" : "dark");
  };

  return <ColorModeContext.Provider value={{
    colorMode,
    resolvedColorMode,
    setColorMode,
    toggleColorMode,
  }}>{children}</ColorModeContext.Provider>;
}

export function useColorMode(): UseColorModeReturn {
  const value = React.useContext(ColorModeContext);
  if (!value) throw new Error("ColorModeProvider is missing.");
  return value;
}

export function useColorModeValue<T>(light: T, dark: T) {
  const { resolvedColorMode } = useColorMode();
  return resolvedColorMode === "dark" ? dark : light;
}

export function ColorModeIcon() {
  return <><Moon className="ui-theme-image-dark" aria-hidden="true" /><Sun className="ui-theme-image-light" aria-hidden="true" /></>;
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
