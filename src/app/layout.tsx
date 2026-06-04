import type { Metadata } from "next";
import "./globals.css";
import "@xterm/xterm/css/xterm.css";
import ClientProvider from "./ClientProvider";
import localFont from "next/font/local";
import { DEFAULT_LANGUAGE } from "@/shared/lib/i18n/useLanguageStore";

const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

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
    <html lang={DEFAULT_LANGUAGE} className={pretendard.variable} suppressHydrationWarning>
      <body className={pretendard.className}>
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
