"use client";

import SidebarMenu from "@/components/navbar/sidebarMenu/sidebarMenu";
import styles from "./navbar.module.scss";
import SwitchGroupMenu from "@/components/navbar/switchGroupMenu/switchGroupMenu";
import { IconDashboard } from "@tabler/icons-react";

const iconSize = 24;

const homeMenuData = [
  {
    label: "ホーム",
    link: `/home`,
    icon: <IconDashboard size={iconSize} stroke={1.5} />,
  },
];

/**ナビゲーションバーコンポーネント */
export function NavBar() {
  return (
    <>
      <nav className={styles.navbar}>
        <SidebarMenu title="ホームメニュー" menus={homeMenuData} />
        <SwitchGroupMenu />
      </nav>
    </>
  );
}
