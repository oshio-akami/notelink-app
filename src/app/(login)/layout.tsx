import type { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "ログイン - NoteLink",
  description: "NoteLinkのログインページ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
