"use client";

import React from "react";
import {
  MantineProvider,
  ColorSchemeScript,
  mantineHtmlProps,
} from "@mantine/core";
import { Noto_Sans_JP } from "next/font/google";
import "@/styles/globals.css";
import "@mantine/core/styles.css";
import "@mantine/tiptap/styles.css";

const font = Noto_Sans_JP({
  weight: "400",
  subsets: ["latin"],
});

export default function ProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={font.className} {...mantineHtmlProps}>
      <ColorSchemeScript />
      <MantineProvider>{children}</MantineProvider>
    </div>
  );
}
