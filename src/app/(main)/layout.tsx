import type { Metadata } from "next";
import "@/styles/globals.css";
import "@mantine/core/styles.css";
import {
  MantineProvider,
  mantineHtmlProps,
  ColorSchemeScript,
  AppShell,
  AppShellHeader,
  AppShellNavbar,
  AppShellMain,
} from "@mantine/core";
import { NavBar } from "@/components/layout/navbar/Navbar";
import NextAuthProvider from "@/providers/NextAuth";
import { Header } from "@/components/layout/header/Header";
import React from "react";

export const metadata: Metadata = {
  title: "project",
  description: "project",
};
import { Noto_Sans_JP  } from "next/font/google";

const Font=Noto_Sans_JP ({
  weight:"400",
  subsets:["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return(
  <html lang="en" {...mantineHtmlProps}>
    <head>
      <ColorSchemeScript />
    </head>
    <body className={Font.className}>
      <MantineProvider>
        <NextAuthProvider>
          <AppShell
            header={{ height: 60 }}
            navbar={{ width: 250, breakpoint: "100px" }}
            padding={"sm"}
          >
            <AppShellHeader>
              <Header />
            </AppShellHeader>
            <AppShellNavbar withBorder={false}>
              <NavBar />
            </AppShellNavbar>
            <AppShellMain>{children}</AppShellMain>
          </AppShell>
        </NextAuthProvider>
      </MantineProvider>
    </body>
  </html>
  )
}
