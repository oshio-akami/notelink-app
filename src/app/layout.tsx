import type { Metadata } from "next";
import "@/styles/globals.css";
import "@mantine/core/styles.css";
import {
  MantineProvider,
  mantineHtmlProps,
  ColorSchemeScript,
} from "@mantine/core";
import NextAuthProvider from "@/providers/NextAuth";
import React from "react";

export const runtime = "edge";

export const metadata: Metadata = {
  title: "project",
  description: "project",
};
import { Noto_Sans_JP  } from "next/font/google";

const Font=Noto_Sans_JP ({
  weight:["400","700"],
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
          {children}
        </NextAuthProvider>
      </MantineProvider>
    </body>
  </html>
  )
}
