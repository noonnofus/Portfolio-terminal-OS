"use client";

import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";

export function AppProvider(props: ColorModeProviderProps) {
  return (
    <ColorModeProvider
      defaultTheme="light"
      {...props}
    >
      {props.children}
    </ColorModeProvider>
  );
}
