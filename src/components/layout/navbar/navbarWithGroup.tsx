"use client";

import styles from "./navbar.module.scss";
import {
  IconDashboard,
  IconUsersGroup,
  IconClipboardText,
} from "@tabler/icons-react";
import SidebarMenu from "@/components/navbar/sidebarMenu/sidebarMenu";
import SwitchGroupMenu from "@/components/navbar/switchGroupMenu/switchGroupMenu";
import { useGroup } from "@/libs/context/groupContext/groupContext";

const iconSize = 24;

/**ナビゲーションバーコンポーネント */
export function NavBarWithGroup() {
  const { groupId } = useGroup();
  const homeMenuData = [
    {
      label: "ホーム",
      link: `/home`,
      icon: <IconDashboard size={iconSize} stroke={1.5} />,
    },
  ];
  const groupMenuData = [
    {
      label: "投稿一覧",
      link: `/group/${groupId}/articles`,
      icon: <IconDashboard size={iconSize} stroke={1.5} />,
    },
    {
      label: "記事を投稿する",
      link: `/group/${groupId}/post`,
      icon: <IconClipboardText size={iconSize} stroke={1.5} />,
    },
    {
      label: "メンバー",
      link: `/group/${groupId}/member`,
      icon: <IconUsersGroup size={iconSize} stroke={1.5} />,
    },
  ];
  return (
    <>
      <nav className={styles.navbar}>
        <SidebarMenu title="ホームメニュー" menus={homeMenuData} />
        <SidebarMenu title="グループメニュー" menus={groupMenuData} />
        <SwitchGroupMenu />
      </nav>
    </>
  );
}
