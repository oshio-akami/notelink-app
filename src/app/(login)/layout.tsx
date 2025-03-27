import type { Metadata } from "next";
import "@/styles/globals.css";
import "@mantine/core/styles.css";
import React from "react";
export const metadata: Metadata = {
  title: "project",
  description: "project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return(
    <div>
      {children}
    </div>
  )
}
