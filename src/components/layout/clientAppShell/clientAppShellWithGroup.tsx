"use client";

import {
  AppShell,
  AppShellHeader,
  AppShellNavbar,
  AppShellMain,
} from "@mantine/core";
import { NavBarWithGroup } from "../navbar/navbarWithGroup";
import { HeaderWithGroup } from "@/components/layout/header/headerWithGroup";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

type Props = {
  children: Readonly<React.ReactNode>;
};
export default function ClientAppShellWithGroup({ children }: Props) {
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
        <HeaderWithGroup
          burgerOpened={mobileOpened}
          onClickBurger={toggleMobile}
        />
      </AppShellHeader>
      <AppShellNavbar>
        <NavBarWithGroup />
      </AppShellNavbar>
      <AppShellMain bg={"#f8fbff"}>{children}</AppShellMain>
    </AppShell>
  );
}
