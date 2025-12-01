"use client";

import React from "react";
import "@/styles/breakpoints.scss";
import "@/styles/globals.scss";
import "@mantine/core/styles.css";
import {
  MantineProvider,
  ColorSchemeScript,
  mantineHtmlProps,
} from "@mantine/core";

import "@mantine/tiptap/styles.css";

import localFont from "next/font/local";

const notoSansJPFont = localFont({
  src: "/fonts/NotoSansJP.woff2",
});

export default function ProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={notoSansJPFont.className} {...mantineHtmlProps}>
      <ColorSchemeScript />
      <MantineProvider>{children}</MantineProvider>
    </div>
  );
}
