"use client";

import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";

export function Provider(props: ColorModeProviderProps) {
  return (
    <ColorModeProvider
      defaultTheme="light"
      {...props}
    >
      {props.children}
    </ColorModeProvider>
  );
}
