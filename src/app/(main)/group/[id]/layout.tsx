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

export default async function RootLayout(props: Props) {
  const { id } = await props.params;
  return (
    <AppShell
      header={{ height: "60px" }}
      navbar={{
        width: "300px",
        breakpoint: "600px",
        collapsed: { desktop: false, mobile: true },
      }}
      aside={{
        width: "500px",
        breakpoint: "1400px",
        collapsed: { desktop: false, mobile: true },
      }}
    >
      <AppShellHeader>
        <Header id={id} />
      </AppShellHeader>
      <AppShellNavbar>
        <NavBar id={id} />
      </AppShellNavbar>
      <AppShellMain bg={"#f8fbff"}>{props.children}</AppShellMain>
    </AppShell>
  );
}
