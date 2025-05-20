import type { Metadata } from "next";
import "@/styles/globals.css";
import "@mantine/core/styles.css";
import {
  AppShell,
  AppShellHeader,
  AppShellNavbar,
  AppShellMain,
} from "@mantine/core";
import { NavBar } from "@/components/layout/navbar/navbar";
import { Header } from "@/components/layout/header/header";

export const runtime = "edge";

export const metadata: Metadata = {
  title: "project",
  description: "project",
};

type Props = {
  params: { id: string };
  children: Readonly<React.ReactNode>;
};

export default function RootLayout(props: Props) {
  const { id } = props.params;
  return (
    <AppShell
      header={{ height: "60px" }}
      navbar={{
        width: "300px",
        breakpoint: "1200px",
        collapsed: { desktop: false, mobile: true },
      }}
      aside={{
        width: "500px",
        breakpoint: "1000px",
        collapsed: { desktop: false, mobile: true },
      }}
    >
      <AppShellHeader>
        <Header id={id} />
      </AppShellHeader>
      <AppShellNavbar>
        <NavBar id={id} />
      </AppShellNavbar>
      <AppShellMain bg="#f0f0f0">{props.children}</AppShellMain>
    </AppShell>
  );
}
