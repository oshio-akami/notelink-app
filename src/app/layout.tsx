import type { Metadata } from "next";
import "@/styles/globals.css";
import React from "react";

import { Noto_Sans_JP  } from "next/font/google";

const Font=Noto_Sans_JP ({
  weight:"400",
  subsets:["latin"],
});
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
  <html lang="jp" >
    <body className={Font.className}>
          {children}
    </body>
  </html>
  )
}
