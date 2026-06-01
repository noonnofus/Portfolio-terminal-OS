import type { Metadata } from "next";
import "./globals.css";
import "@xterm/xterm/css/xterm.css";
import ClientProvider from "./ClientProvider";

export const metadata: Metadata = {
  title: "HyunHo Portfolio",
  description: "This is a Kevin's portfolio website. Thank you for visiting.",
  icons: {
    icon: '/images/favicon.png'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`antialiased font-sans`}
        suppressHydrationWarning
      >
        <ClientProvider>
          {children}
        </ClientProvider>
      </body>
    </html>
  );
}
