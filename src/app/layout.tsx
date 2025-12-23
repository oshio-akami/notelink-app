import type { Metadata } from "next";
import "@/styles/globals.scss";
import "@mantine/core/styles.css";
import "@mantine/tiptap/styles.css";
import {
  MantineProvider,
  mantineHtmlProps,
  ColorSchemeScript,
} from "@mantine/core";
import NextAuthProvider from "@/providers/NextAuth";
import React from "react";

export const runtime = "edge";

export const metadata: Metadata = {
  title: "NoteLink",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          <NextAuthProvider>{children}</NextAuthProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
