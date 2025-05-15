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

export const runtime = "edge";

export const metadata: Metadata = {
  title: "project",
  description: "project",
};

type Props = {
  params: Promise<{ id: string }>;
  children: Readonly<React.ReactNode>;
};

export default async function RootLayout(props: Props) {
  const { id } = await props.params;
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 250, breakpoint: "100px" }}
      aside={{ width: 400, breakpoint: "sm" }}
      padding={"sm"}
    >
      <AppShellHeader>
        <Header params={props.params} />
      </AppShellHeader>
      <AppShellNavbar withBorder={false}>
        <NavBar id={id} />
      </AppShellNavbar>
      <AppShellMain>{props.children}</AppShellMain>
    </AppShell>
  );
}
