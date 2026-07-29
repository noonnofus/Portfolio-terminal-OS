import type { Metadata } from "next";
import "./globals.css";
import "@xterm/xterm/css/xterm.css";
import ClientProvider from "./ClientProvider";
import { DEFAULT_LANGUAGE } from "@/shared/i18n/language";

export const metadata: Metadata = {
  title: "HyunHo Portfolio",
  description: "This is a Kevin's portfolio website. Thank you for visiting.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={DEFAULT_LANGUAGE} suppressHydrationWarning>
      <body>
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
