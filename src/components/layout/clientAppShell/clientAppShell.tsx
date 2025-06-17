"use client";

import {
  AppShell,
  AppShellHeader,
  AppShellNavbar,
  AppShellMain,
} from "@mantine/core";
import { NavBar } from "@/components/layout/navbar/navbar";
import { Header } from "@/components/layout/header/header";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

type Props = {
  children: Readonly<React.ReactNode>;
};
export default function ClientAppShell({ children }: Props) {
  const [mobileOpened, { toggle: toggleMobile, close }] = useDisclosure(false);
  const pathname = usePathname();

  useEffect(() => {
    close();
  }, [pathname, close]);
  return (
    <AppShell
      header={{ height: "60px" }}
      navbar={{
        width: "300px",
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened },
      }}
      aside={{
        width: "600px",
        breakpoint: "1400px",
        collapsed: { desktop: false, mobile: true },
      }}
    >
      <AppShellHeader>
        <Header burgerOpened={mobileOpened} onClickBurger={toggleMobile} />
      </AppShellHeader>
      <AppShellNavbar>
        <NavBar />
      </AppShellNavbar>
      <AppShellMain bg={"#f8fbff"}>{children}</AppShellMain>
    </AppShell>
  );
}
