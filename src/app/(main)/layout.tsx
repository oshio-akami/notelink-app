import type { Metadata } from "next";
import "@/styles/globals.css";
import "@mantine/core/styles.css";
import {
  AppShell,
  AppShellHeader,
  AppShellNavbar,
  AppShellMain,
} from "@mantine/core";
import { NavBar } from "@/components/layout/navbar/Navbar";
import { Header } from "@/components/layout/header/Header";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const runtime = "edge";

export const metadata: Metadata = {
  title: "project",
  description: "project",
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session=await auth();
  if(!session){
    redirect("/login");
  }
  return (
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
  );
}
